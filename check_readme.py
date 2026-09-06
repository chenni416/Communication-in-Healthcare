import re

path = r"C:\Users\jennifer\Desktop\Digital Twin\record-follows-person\README.md"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

start = text.find("## 🚀 執行方式")
end = text.find("## 📜 來源說明")
if start != -1 and end != -1:
    print(text[start:end])
else:
    print("Could not find the sections.")

