import os

path = r"C:\Users\jennifer\Desktop\Digital Twin\record-follows-person\README.md"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip_next = False
for line in lines:
    if "demo.spec.ts" in line and "評審專用" in line:
        continue
    if "特定環境快速啟動" in line:
        skip_next = True
        continue
    
    if skip_next:
        if line.startswith("```powershell"):
            continue
        elif "Set-Location" in line:
            continue
        elif "corepack.cmd pnpm dev" in line:
            continue
        elif line.startswith("```") and "```powershell" not in line:
            # End of the block
            skip_next = False
            continue
        else:
            continue
    
    new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Cleanup complete.")
