import re

path = r"C:\Users\jennifer\Desktop\Digital Twin\record-follows-person\README.md"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update Video URL
text = re.sub(r"https://www\.youtube\.com/watch\?v=[-a-zA-Z0-9_]+", "https://youtu.be/HCd0F0ZbmpI", text)
text = text.replace("[觀看 OMNI-TWIN 系統實機展演]", "[觀看 OMNI-TWIN 作品 Demo 影片]")

# 2. Database Details
db_text = "系統採用前後端分離設計。前端 Next.js 確保優良使用者體驗，並透過 Python FastAPI 介接強大的 AI Agent 引擎。\n**資料庫與狀態管理：** 本專案為達成本地端隱私與可重現性，使用輕量級本地端 JSON File System (儲存健康數據與時間軸事件) 以及 SQLite (管理 LangGraph AI 代理的對話狀態) 作為雙核心資料庫解決方案。"
text = re.sub(r"系統採用前後端分離設計.*?AI Agent 引擎。", lambda m: db_text, text, flags=re.DOTALL)

# 3. Soften Tone
text = text.replace("業界級的", "精心設計的")
text = text.replace("極致的", "良好的")
text = text.replace("消弭溝通落差", "減少溝通落差")
text = text.replace("完美展示", "清楚展示")
text = text.replace("強大的 AI Agent 引擎", "AI Agent 智慧引擎")
text = text.replace("確保開源社群與評審能夠 Clone 後 100% 重現專案", "為了讓大家能輕鬆在本地端重現與體驗專案")
text = text.replace("本專案為達成本地端隱私與可重現性", "為兼顧隱私與便利性")
text = text.replace("消弭跨專業通報的資訊失真", "大幅降低跨專業通報時的溝通誤差")
text = text.replace("徹底消弭", "有效減少")
text = text.replace("極簡", "簡明")
text = text.replace("零距離", "更順暢")
text = text.replace("火力展示", "功能展示")
text = text.replace("完美呈現", "完整呈現")

# 4. Re-write the "How to Run" Section to remove Playwright and add pnpm
new_how_to_run = """## 🚀 執行方式 (How to Run)

本專案經過嚴格打包，具備極高的可重現性 (Reproducibility)。請依照以下步驟啟動專案：

### 1. 環境需求準備
* Node.js (v18+)
* Python (v3.10+)
* [uv](https://github.com/astral-sh/uv) (極速 Python 套件管理器)

### 2. 本機端啟動教學

打開終端機，首先 clone 專案並安裝前端依賴：
```bash
git clone https://github.com/chenni416/Communication-in-Healthcare.git
cd Communication-in-Healthcare/apps/web
npm install
```

**步驟 A：啟動後端 API (FastAPI + LangGraph)**
請開啟第一個終端機視窗：
```bash
cd apps/api
# 使用 uv 啟動 FastAPI 伺服器
uv run uvicorn main:app --reload --port 8000
```

**步驟 B：啟動前端介面 (Next.js)**
請打開第二個終端機視窗，我們提供多種前端啟動方式：

標準啟動方式：
```bash
cd apps/web
pnpm dev
```

特定環境快速啟動（若直接在本機特定目錄下測試）：
```powershell
Set-Location "c:\\Users\\jennifer\\Desktop\\Digital Twin\\record-follows-person\\apps\\web"
corepack.cmd pnpm dev
```
🌟 網站將會運行於：`http://localhost:3000`

---

## 📜 來源說明"""

text = re.sub(r"## 🚀 執行方式 \(How to Run\).*?## 📜 來源說明", lambda m: new_how_to_run, text, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Done")

