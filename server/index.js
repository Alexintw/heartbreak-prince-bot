import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { styleCards } from "./styleCards.js";

dotenv.config();

const app = express();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const purposeInstructions = {
  love_letter: {
    label: "情書",
    instruction: "語氣要真誠、溫柔、有情感，但避免過度油膩或浮誇。建議 200 到 450 字。"
  },
  reading_note: {
    label: "讀書心得",
    instruction: "要保留思辨感，說明這段文字帶來的理解、反省或觀點轉折。建議 250 到 500 字。"
  },
  concert_reflection: {
    label: "音樂會心得",
    instruction: "要有聲音、空間、身體感與情緒層次，適合描述古典音樂或現場感。建議 250 到 550 字。"
  },
  career_article: {
    label: "職涯文章",
    instruction: "要有清楚問題意識、個人經驗、方法與結論，適合 LinkedIn、Thread 或長文。建議 350 到 700 字。"
  }
};

const intensityInstructions = {
  1: "只保留很淡的風格影子。語言仍以使用者原本語氣為主。",
  2: "加入輕度風格化。可使用少量該風格的意象與句法。",
  3: "明顯風格化。語氣、節奏、意象都要能辨識出該風格方向。",
  4: "濃厚風格化。可以更強烈使用該風格的節奏、修辭與世界觀，但仍必須原創。",
  5: "極濃風格化。風格辨識度要高，但必須特別避免引用、貼近、改寫任何原作者既有句子。"
};

const blockedSafetyPhrases = [
  "蕭紅寫道",
  "廬隱寫道",
  "林徽因寫道",
  "魯迅寫道",
  "徐志摩寫道",
  "胡適寫道",
  "梁啟超寫道",
  "朱自清寫道",
  "張愛玲寫道",
  "蕭紅原文",
  "廬隱原文",
  "林徽因原文",
  "魯迅原文",
  "徐志摩原文",
  "胡適原文",
  "梁啟超原文",
  "朱自清原文",
  "張愛玲原文",
  "蕭紅本人",
  "廬隱本人",
  "林徽因本人",
  "魯迅本人",
  "徐志摩本人",
  "胡適本人",
  "梁啟超本人",
  "朱自清本人",
  "張愛玲本人",
  "這是蕭紅",
  "這是廬隱",
  "這是林徽因",
  "這是魯迅",
  "這是徐志摩",
  "這是胡適",
  "這是梁啟超",
  "這是朱自清",
  "這是張愛玲",
  "張愛玲式",
  "模仿張愛玲",
  "重現張愛玲"
];

function normalizeIntensity(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 3;
  }

  return Math.min(5, Math.max(1, Math.round(numericValue)));
}

function hasUsableOpenAIKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  return Boolean(
    apiKey &&
      apiKey !== "your_api_key_here" &&
      /^[\x20-\x7E]+$/.test(apiKey)
  );
}

function buildStyleDescription(styleCard) {
  return `
風格名稱：${styleCard.displayName}
風格定位：${styleCard.positioning}

語氣：
${styleCard.tone.join("、")}

常用意象：
${styleCard.imagery.join("、")}

句法規則：
${styleCard.sentenceRules.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}

安全規則：
${styleCard.safetyRules.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}

原創示範句：
${styleCard.examples.map((example, index) => `${index + 1}. ${example}`).join("\n")}
`;
}

function buildStylePrompt({
  primaryStyleCard,
  secondaryStyleCard,
  intensity,
  purpose,
  userText
}) {
  const selectedPurpose = purposeInstructions[purpose];
  const intensityText = intensityInstructions[intensity];

  const secondaryBlock = secondaryStyleCard
    ? `
混合風格設定：
1. 主風格佔 60%。
2. 混合風格佔 40%。
3. 主風格決定整體語氣與結尾。
4. 混合風格補充句法、思考方式或部分意象。
5. 不要在輸出中提到 60%、40% 或作者名字。
`
    : `
混合風格設定：
不混合。請只使用主風格方向。
`;

  const secondaryStyleDescription = secondaryStyleCard
    ? `
【混合風格資料】
${buildStyleDescription(secondaryStyleCard)}
`
    : "";

  return `
你是一個名叫「心碎小王子」的中文散文回應機器人。

你的任務：
使用者會貼上一段社群貼文。
你要先讀懂貼文裡的情緒、處境、矛盾與沒有說出口的部分，再以散文大師的口吻回應他。
你不是改寫貼文，也不是替貼文換句話說。
你要像一個懂得失落、孤獨、戀愛、生活疲憊與自我整理的人，寫出一段能回到對方心裡的原創回應。

你不是角色扮演。
你不是任何作家本人。
你不能聲稱輸出文字是任何作家寫的。
你只能生成「受文學風格啟發的原創文字」。
示範句只供風格理解，不可照抄、改寫或挪用。
不要稱呼自己是 AI。
不要分析你的寫作策略。
不要說「你這段文字可以改成」。

【用途】
${selectedPurpose.label}

【用途要求】
${selectedPurpose.instruction}

【語氣強度】
${intensity} / 5

【強度要求】
${intensityText}

${secondaryBlock}

【主風格資料】
${buildStyleDescription(primaryStyleCard)}

${secondaryStyleDescription}

【共同安全限制】
1. 不可直接引用任何已故作家的原文。
2. 不可輸出高度近似既有作品的段落。
3. 不可把使用者貼文改成像某篇名作的變體。
4. 不可使用過度標誌性的原作名句、句型或段落結構。
5. 不可聲稱「這是某某作家會寫的」。
6. 必須回應使用者貼文的核心情緒與處境。
7. 必須輸出繁體中文。
8. 請直接輸出回應內容，不要解釋。

【使用者貼文】
${userText}
`;
}

async function runSafetyCheck({
  generatedText,
  primaryStyleCard,
  secondaryStyleCard
}) {
  const styleNames = secondaryStyleCard
    ? `${primaryStyleCard.displayName}、${secondaryStyleCard.displayName}`
    : primaryStyleCard.displayName;
  const includesHaipaiStyle = styleNames.includes("海派世情式");
  const haipaiCheck = includesHaipaiStyle
    ? "6. 若檢查對象包含「海派世情式」，是否誤標示為「張愛玲式」、是否出現模仿或重現張愛玲的說法？"
    : "";

  const safetyPrompt = `
你是一個文學風格回應結果的安全檢查器。

請檢查以下生成文字是否符合規則：

檢查對象風格：
${styleNames}

請判斷：
1. 是否直接引用已故作家的原文？
2. 是否過度近似特定已知作品？
3. 是否聲稱自己是某位作家本人？
4. 是否符合「受風格啟發的原創文字」？
5. 是否有需要降低相似度的地方？
${haipaiCheck}

請用繁體中文輸出，格式如下：

安全等級：通過 / 需注意 / 不通過
理由：
修改建議：

生成文字：
${generatedText}
`;

  const response = await client.responses.create({
    model: "gpt-5.5",
    input: safetyPrompt
  });

  return response.output_text;
}

export function ruleBasedSafetyCheck(text) {
  const hits = blockedSafetyPhrases.filter((phrase) => text.includes(phrase));

  return {
    passed: hits.length === 0,
    hits
  };
}

app.get("/api/styles", (req, res) => {
  const styles = Object.entries(styleCards).map(([id, card]) => ({
    id,
    buttonLabel: card.buttonLabel,
    displayName: card.displayName,
    positioning: card.positioning
  }));

  res.json({ styles });
});

app.post("/api/rewrite", async (req, res) => {
  try {
    const {
      styleId,
      secondaryStyleId,
      intensity = 3,
      purpose = "thread",
      text
    } = req.body;

    if (!styleId || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        error: "styleId and text are required."
      });
    }

    const primaryStyleCard = styleCards[styleId];

    if (!primaryStyleCard) {
      return res.status(404).json({
        error: "Primary style not found."
      });
    }

    if (!purposeInstructions[purpose]) {
      return res.status(400).json({
        error: "Unsupported purpose."
      });
    }

    if (!hasUsableOpenAIKey()) {
      return res.status(500).json({
        error: "OpenAI API key is missing or invalid. Please update server/.env."
      });
    }

    let secondaryStyleCard = null;

    if (secondaryStyleId && secondaryStyleId !== styleId) {
      secondaryStyleCard = styleCards[secondaryStyleId];

      if (!secondaryStyleCard) {
        return res.status(404).json({
          error: "Secondary style not found."
        });
      }
    }

    const safeIntensity = normalizeIntensity(intensity);

    const prompt = buildStylePrompt({
      primaryStyleCard,
      secondaryStyleCard,
      intensity: safeIntensity,
      purpose,
      userText: text.trim()
    });

    const rewriteResponse = await client.responses.create({
      model: "gpt-5.5",
      input: prompt
    });

    const generatedText = (rewriteResponse.output_text || "").trim();
    const ruleCheck = ruleBasedSafetyCheck(generatedText);
    const safetyCheck = await runSafetyCheck({
      generatedText,
      primaryStyleCard,
      secondaryStyleCard
    });

    res.json({
      styleId,
      styleName: primaryStyleCard.displayName,
      secondaryStyleName: secondaryStyleCard?.displayName || null,
      intensity: safeIntensity,
      purpose,
      output: generatedText,
      ruleCheck,
      safetyCheck
    });
  } catch (error) {
    console.error(error);

    if (error?.code === "insufficient_quota" || error?.status === 429) {
      return res.status(429).json({
        error: "OpenAI API quota exceeded. Please check your OpenAI billing or project quota."
      });
    }

    if (error?.status === 401) {
      return res.status(401).json({
        error: "OpenAI API key was rejected. Please check server/.env."
      });
    }

    res.status(500).json({
      error: "Rewrite failed."
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Literary style bot server running on port ${PORT}`);
});
