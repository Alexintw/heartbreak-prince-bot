# 心碎小王子

這是一個 Node.js + Express + HTML/CSS/JS 的中文散文回應機器人。使用者可以把社群貼文貼到網站，按下想要的文學口吻按鈕，機器人會以「心碎小王子」的語氣讀懂貼文情緒，再生成一段受文學風格啟發的原創回應。

專案使用 Prompt + 風格資料庫，不使用 fine-tuning。它不是改寫使用者原文，而是回應使用者貼上的話。

## 專案結構

```text
literary-style-bot/
  server/
    index.js
    styleCards.js
    package.json
    .env.example
  client/
    index.html
    style.css
    app.js
  README.md
```

## 八個主風格

- 寒地孤燈｜蕭紅式
- 幽微自省｜廬隱式
- 窗光清雅｜林徽因式
- 冷眼刀鋒｜魯迅式
- 雲月浪漫｜徐志摩式
- 白話實證｜胡適式
- 少年中國｜梁啟超式
- 清水微光｜朱自清式

## 安裝方式

```bash
cd server
npm install
```

## 設定 .env

在 `server/` 目錄建立 `.env`，可從 `.env.example` 複製：

```bash
cp .env.example .env
```

填入你的 OpenAI API key：

```env
OPENAI_API_KEY=your_api_key_here
PORT=5000
```

## 啟動後端

```bash
cd server
npm run dev
```

啟動後 API 預設位於：

```text
http://localhost:5000
```

若本機的 `5000` 埠已被其他服務佔用，請先釋放該埠，或同步調整 `server/.env` 的 `PORT`。前端會優先嘗試 `5000`，並嘗試幾個常見本機備用埠。

## 打開前端

直接用瀏覽器開啟：

```text
client/index.html
```

請先確認後端已啟動。

## API 範例

### GET /api/styles

```bash
curl http://localhost:5000/api/styles
```

回傳 9 張風格卡，包含 8 個主風格與 1 個進階混合風格。

### POST /api/rewrite

```bash
curl -X POST http://localhost:5000/api/rewrite \
  -H "Content-Type: application/json" \
  -d '{
    "styleId": "xiao_hong",
    "secondaryStyleId": "haipai_shiqing",
    "intensity": 3,
    "purpose": "thread",
    "text": "今天下班後走在路上，突然覺得生活很累，但也還有一點希望。"
  }'
```

回傳格式：

```json
{
  "styleId": "xiao_hong",
  "styleName": "蕭紅式",
  "secondaryStyleName": "海派世情式",
  "intensity": 3,
  "purpose": "thread",
  "output": "生成回應結果",
  "ruleCheck": {
    "passed": true,
    "hits": []
  },
  "safetyCheck": "安全等級：通過\n理由：...\n修改建議：..."
}
```

## 安全與著作權提醒

本工具只生成受風格啟發的原創回應文字，不提供任何原作原文，不複製既有作品，也不聲稱生成結果為作者本人作品。

後端包含兩層檢查：

1. 規則式安全檢查：偵測是否出現「某某寫道」「某某原文」「某某本人」「這是某某」等禁止字串。
2. 模型安全檢查：檢查是否直接引用已故作家原文、是否過度近似特定作品、是否聲稱作者本人，以及是否符合受風格啟發的原創文字要求。

即使通過檢查，公開使用前仍建議人工確認，避免和既有作品過度相似。
