import json
import re

path = r"C:\Users\jennifer\Desktop\Digital Twin\record-follows-person\README.md"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update Video URL
text = text.replace("https://www.youtube.com/watch?v=-Dod9eJw8xI", "https://youtu.be/HCd0F0ZbmpI")
text = text.replace("[觀看 OMNI-TWIN 系統實機展演]", "[觀看 OMNI-TWIN 作品 Demo 影片]")

# 2. Add pnpm dev to execution steps
old_step_b = "corepack.cmd pnpm dev"
new_step_b = "pnpm dev  # (若環境未安裝 pnpm，也可使用 corepack.cmd pnpm dev)"
text = text.replace(old_step_b, new_step_b)

# 3. Soften tone (remove rigid terms)
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

with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("README updated successfully.")

