#!/bin/bash

# 脚本用于替换所有软件图片路径
# 将 software.png 替换为 softwareDefault.png

# 设置搜索目录
SEARCH_DIR="src"

# 查找所有包含software.png的文件
echo "正在查找包含software.png的文件..."
FILES=$(grep -l "software\.png" --include="*.vue" --include="*.js" --include="*.ts" -r $SEARCH_DIR)

# 检查是否找到文件
if [ -z "$FILES" ]; then
  echo "未找到包含software.png的文件"
  exit 1
fi

# 遍历文件并替换
echo "开始替换图片路径..."
echo "$FILES" | while read -r file; do
  # 检查文件是否存在
  if [ -f "$file" ]; then
    echo "处理文件: $file"
    # 使用sed命令替换所有匹配项
    sed -i '' 's|@/assets/index/software\.png|@/assets/index/softwareDefault.png|g' "$file"
    sed -i '' 's|"@/assets/index/software\.png"|"@/assets/index/softwareDefault.png"|g' "$file"
    sed -i '' "s|'@/assets/index/software\.png'|'@/assets/index/softwareDefault.png'|g" "$file"
    sed -i '' 's|require("@/assets/index/software\.png")|require("@/assets/index/softwareDefault.png")|g' "$file"
    sed -i '' "s|require('@/assets/index/software\.png')|require('@/assets/index/softwareDefault.png')|g" "$file"
  else
    echo "文件不存在，跳过: $file"
  fi
done

echo "替换完成!" 