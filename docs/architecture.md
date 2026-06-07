# Architecture

心碎小王子採用五層架構，讓前端入口、後端 API、產品邏輯、資料層與 OpenAI 能力彼此分離。這樣之後要把 HTML 前端換成 Next.js、React、LINE Bot 或完整 Web chat UI，都不需要重寫核心生成邏輯。

```text
Frontend
  Next.js / React / LINE Bot / Web chat UI
        ↓
Backend API
  Node.js Express / FastAPI
        ↓
Product Logic Layer
  intent router / permission / RAG / tool calling / cost control
        ↓
Data Layer
  PostgreSQL / MongoDB / Redis / Vector Store
        ↓
OpenAI API
  Responses API / Embeddings / Structured Outputs / Function Calling
```

## Current Mapping

```text
client/
  index.html              Web chat UI MVP
  style.css
  app.js

server/
  index.js                Backend API entrypoint
  api/
    reflectionRoutes.js   HTTP routes
  product/
    reflectionPipeline.js Core product workflow
    intentRouter.js       Intent routing
    permission.js         Request validation and permissions
    rag.js                RAG retrieval entrypoint
    toolCalling.js        Tool planning entrypoint
    costControl.js        Input and call budget control
  data/
    postgres.js           PostgreSQL adapter placeholder
    mongo.js              MongoDB adapter placeholder
    redis.js              Redis adapter placeholder
    vectorStore.js        Vector store adapter placeholder
  openai/
    client.js             OpenAI client factory
    responses.js          Responses API wrapper
    embeddings.js         Embeddings wrapper
    structuredOutputs.js  Structured Outputs schema placeholder
    functionCalling.js    Function Calling definitions placeholder
  styleCards.js           Literary style database
```

## Request Flow

1. 使用者在前端貼上個人 reflection，並選擇文學口吻。
2. 前端呼叫 `POST /api/rewrite`。
3. `server/api/reflectionRoutes.js` 驗證 HTTP request，交給 Product Logic Layer。
4. `permission.js` 檢查必要欄位與 style 權限。
5. `costControl.js` 控制輸入長度與模型呼叫成本。
6. `intentRouter.js` 將輸入歸類為 `personal_reflection`。
7. `rag.js` 預留未來個人記憶、日記資料或知識庫檢索。
8. `toolCalling.js` 預留未來工具呼叫。
9. `reflectionPipeline.js` 組 prompt，呼叫 OpenAI Responses API 生成回應。
10. 生成後再跑規則式安全檢查與模型安全檢查。
11. API 回傳 output、ruleCheck、safetyCheck 與 meta。

## Future Frontend Options

現有 MVP 前端是 `client/` 裡的原生 HTML/CSS/JS。未來可以增加：

- `apps/web-next/`：Next.js 版本
- `apps/web-react/`：React SPA 版本
- `apps/line-bot/`：LINE Bot webhook 入口
- `apps/web-chat/`：完整聊天介面

這些前端都只需要呼叫同一組 Backend API。

## Future Data Layer Options

目前資料層是 adapter placeholder，不會強迫啟動資料庫。未來可以逐步接上：

- PostgreSQL：使用者、權限、付款方案、使用紀錄
- MongoDB：長篇 reflection、草稿、非結構化紀錄
- Redis：rate limit、session、短期快取
- Vector Store：個人記憶、RAG、風格範例檢索

## Future OpenAI Capabilities

目前正式使用 Responses API。其他能力已保留模組位置：

- Embeddings：建立個人記憶或風格資料向量
- Structured Outputs：讓模型回傳固定 JSON schema
- Function Calling：讓模型呼叫查詢、儲存、檢索或分析工具

## Safety Boundary

心碎小王子只生成受文學風格啟發的原創 reflection 回應，不引用、不複製、不聲稱為任何作家本人作品。