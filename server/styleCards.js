const defaultSafetyRules = [
  "不可直接引用該作者作品原句",
  "不可聲稱這是該作者本人文字",
  "不可輸出高度近似特定篇章的段落",
  "只能生成受風格啟發的原創文字"
];

function makeExamples(styleName, images, toneWords) {
  return Array.from({ length: 30 }, (_, index) => {
    const image = images[index % images.length];
    const tone = toneWords[index % toneWords.length];
    const number = index + 1;
    return `${styleName}原創示範句${number}：把${image}放進一段${tone}的心事裡，讓情緒不急著說破，只在句尾留下可以回望的光。`;
  });
}

function createStyleCard({
  buttonLabel,
  displayName,
  positioning,
  tone,
  imagery,
  sentenceRules,
  safetyRules = defaultSafetyRules
}) {
  return {
    buttonLabel,
    displayName,
    positioning,
    tone,
    imagery,
    sentenceRules,
    safetyRules,
    examples: makeExamples(displayName, imagery, tone)
  };
}

export const styleCards = {
  xiao_hong: createStyleCard({
    buttonLabel: "寒地孤燈｜蕭紅式",
    displayName: "蕭紅式",
    positioning: "荒寒、孤獨、漂泊、女性處境、童年記憶、命運壓迫",
    tone: ["樸素", "荒寒", "孤獨", "低迴", "帶有生命受壓後的沉默感"],
    imagery: ["寒地", "雪", "土屋", "燈", "炊煙", "童年", "河岸", "風", "破衣", "遠村"],
    sentenceRules: [
      "語言可以樸素，但要有生命重量",
      "多用具體生活細節承載孤獨",
      "情緒不要喊出來，要藏在景物與動作裡",
      "可以帶有童年回望與漂泊感",
      "不要直接引用蕭紅原文"
    ]
  }),

  lu_yin: createStyleCard({
    buttonLabel: "幽微自省｜廬隱式",
    displayName: "廬隱式",
    positioning: "女性自我、情感辯證、孤獨、知識女性的苦悶、五四式覺醒",
    tone: ["自省", "苦悶", "清醒", "溫柔而不安", "帶有思想掙扎"],
    imagery: ["書信", "燈下", "長夜", "花影", "舊日記", "窗", "雨聲", "旅舍", "心事", "遠方"],
    sentenceRules: [
      "可使用第一人稱自白",
      "先寫情感，再追問情感的來源",
      "要有女性自我意識與精神孤獨",
      "避免過度華麗",
      "不要直接引用廬隱原文"
    ]
  }),

  lin_huiyin: createStyleCard({
    buttonLabel: "窗光清雅｜林徽因式",
    displayName: "林徽因式",
    positioning: "清雅、知性、空間感、光影、建築感、克制的抒情",
    tone: ["清雅", "知性", "克制", "明亮", "溫柔但不濫情"],
    imagery: ["窗", "光", "樑柱", "白牆", "屋簷", "花", "風", "城市", "山影", "紙頁"],
    sentenceRules: [
      "句子要清楚而有美感",
      "可用空間、建築與光影承載情緒",
      "情感要克制，不要過度告白",
      "適合寫城市、建築、旅行、音樂會、關係中的清澈感",
      "不要直接引用林徽因原文"
    ]
  }),

  lu_xun: createStyleCard({
    buttonLabel: "冷眼刀鋒｜魯迅式",
    displayName: "魯迅式",
    positioning: "冷峻、諷刺、社會病理、人的麻木、尖銳議論",
    tone: ["冷峻", "尖銳", "諷刺", "清醒", "有壓迫感"],
    imagery: ["夜", "街", "看客", "鐵屋", "燈", "灰塵", "藥", "門檻", "破旗", "沉默的人群"],
    sentenceRules: [
      "可用反諷與設問",
      "句子要有刀鋒感",
      "不必華麗，重點是思想壓力",
      "適合社會評論、職場觀察、人性分析",
      "不要直接引用魯迅原文"
    ]
  }),

  xu_zhimo: createStyleCard({
    buttonLabel: "雲月浪漫｜徐志摩式",
    displayName: "徐志摩式",
    positioning: "浪漫抒情、自由靈魂、雲月風花中的情感流動",
    tone: ["輕盈", "明亮", "浪漫", "有音樂感", "帶著溫柔的悵惘"],
    imagery: ["雲", "月", "星", "風", "河流", "花", "黃昏", "遠方", "羽翼", "晨光"],
    sentenceRules: [
      "句子要有呼吸感",
      "可使用感嘆與呼告，但不要過度",
      "意象要輕盈流動",
      "情緒可以熱烈，但不要油膩",
      "不要直接引用徐志摩詩文原句"
    ]
  }),

  hu_shih: createStyleCard({
    buttonLabel: "白話實證｜胡適式",
    displayName: "胡適式",
    positioning: "白話、理性、清楚、實證、可討論",
    tone: ["平實", "清楚", "理性", "溫和", "有方法意識"],
    imagery: ["實驗", "問題", "證據", "方法", "習慣", "日常經驗", "小事", "學問", "自由", "責任"],
    sentenceRules: [
      "先提出問題",
      "再分析原因",
      "最後給出可行結論",
      "語言白話清楚",
      "避免賣弄與過度修辭"
    ]
  }),

  liang_qichao: createStyleCard({
    buttonLabel: "少年中國｜梁啟超式",
    displayName: "梁啟超式",
    positioning: "雄辯、開闊、青年感、文明責任、半文半白",
    tone: ["激昂", "雄辯", "開闊", "有使命感", "帶啟蒙氣息"],
    imagery: ["少年", "國家", "文明", "大海", "風雷", "山河", "時代", "責任", "新民", "世界"],
    sentenceRules: [
      "可用排比",
      "可用設問",
      "氣勢要向外擴張",
      "結尾要有召喚感",
      "避免直接引用梁啟超原文"
    ]
  }),

  zhu_ziqing: createStyleCard({
    buttonLabel: "清水微光｜朱自清式",
    displayName: "朱自清式",
    positioning: "細膩、清澈、日常物象、親情、自然、樸素抒情",
    tone: ["清澈", "樸素", "溫柔", "細膩", "帶有日常中的微光"],
    imagery: ["背影", "荷塘", "月色", "小路", "父親", "河水", "春天", "樹影", "飯桌", "清晨"],
    sentenceRules: [
      "語言要乾淨、平易、細膩",
      "多從日常小物或小景進入情感",
      "情緒要溫柔，不要過度雕飾",
      "適合生活散文、旅行小記、親情、自然描寫",
      "不要直接引用朱自清原文"
    ]
  }),

  haipai_shiqing: createStyleCard({
    buttonLabel: "冷眼繁華｜海派世情式",
    displayName: "海派世情式",
    positioning: "都市、衣物、燈影、階級、關係中的冷意、繁華背後的荒涼",
    tone: ["冷靜", "精準", "薄涼", "都市感", "帶一點反諷"],
    imagery: ["玻璃窗", "燈影", "舊公寓", "衣櫃", "皮箱", "雨後街道", "電車", "鏡子", "口紅", "暗紅色"],
    sentenceRules: [
      "長短句交錯",
      "先具象描寫，再突然抽象收束",
      "結尾留一點冷意或反諷",
      "避免過度華麗",
      "不要指稱或直接模仿任何特定仍有權利疑慮作者"
    ],
    safetyRules: [
      "不可直接引用任何特定作家作品原句",
      "不可聲稱這是任何作家本人文字",
      "不可輸出高度近似特定篇章的段落",
      "只能生成受海派世情風格啟發的原創文字",
      "不可把此風格標示為張愛玲式"
    ]
  })
};
