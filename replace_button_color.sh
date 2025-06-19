#!/bin/bash

# 定义目标颜色
TARGET_COLOR="#05994e"

echo "开始修改按钮颜色为 $TARGET_COLOR ..."

# 替换 Element UI 主要按钮颜色 (type="primary")
find ./src -name "*.scss" -o -name "*.css" -type f -exec sed -i '' 's/#409EFF/'$TARGET_COLOR'/g' {} \;
find ./src -name "*.scss" -o -name "*.css" -type f -exec sed -i '' 's/#409eff/'$TARGET_COLOR'/g' {} \;

# 替换 Element UI 按钮 hover 和 active 状态
find ./src -name "*.scss" -o -name "*.css" -type f -exec sed -i '' 's/#66b1ff/'$TARGET_COLOR'/g' {} \;
find ./src -name "*.scss" -o -name "*.css" -type f -exec sed -i '' 's/#3a8ee6/'$TARGET_COLOR'/g' {} \;

# 替换 .vue 文件中的按钮颜色
find ./src -name "*.vue" -type f -exec sed -i '' 's/type="success"/type="primary"/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/background: #2BB56E/background: '$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/background:#2BB56E/background:'$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/background-color: #2BB56E/background-color: '$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/background-color:#2BB56E/background-color:'$TARGET_COLOR'/g' {} \;

# 替换自定义按钮样式中的颜色
find ./src -name "*.vue" -type f -exec sed -i '' 's/color: #2BB56E/color: '$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/color:#2BB56E/color:'$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/border-color: #2BB56E/border-color: '$TARGET_COLOR'/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/border-color:#2BB56E/border-color:'$TARGET_COLOR'/g' {} \;

# 替换 #0C5932 颜色 (常用于深色按钮)
find ./src -name "*.vue" -type f -exec sed -i '' 's/#0C5932/'$TARGET_COLOR'/g' {} \;

# 替换 Element UI 默认主题变量
if [ -f "./src/styles/element-variables.scss" ]; then
  sed -i '' 's/\$--color-primary: #[0-9a-fA-F]\{6\}/\$--color-primary: '$TARGET_COLOR'/' ./src/styles/element-variables.scss
fi

# 替换 downBtn 和 downBtn2 类的背景色
find ./src -name "*.vue" -type f -exec sed -i '' 's/\.downBtn[[:space:]]*{[^}]*background:[^;]*;/\.downBtn { background: '$TARGET_COLOR';/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/\.downBtn2[[:space:]]*{[^}]*background:[^;]*;/\.downBtn2 { background: '$TARGET_COLOR';/g' {} \;

echo "按钮颜色修改完成，所有按钮已更新为 $TARGET_COLOR" 