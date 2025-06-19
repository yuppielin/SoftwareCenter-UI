#!/bin/bash

# 定义颜色变量
OLD_COLOR="#022517"
NEW_COLOR="#055c39"

echo "开始将背景颜色从 $OLD_COLOR 修改为 $NEW_COLOR ..."

# 在 CSS/SCSS 文件中替换颜色
find ./src -name "*.scss" -o -name "*.css" -type f -exec sed -i '' "s/$OLD_COLOR/$NEW_COLOR/g" {} \;

# 在 Vue 文件中替换颜色（含空格和冒号的不同格式）
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: $OLD_COLOR/background: $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:$OLD_COLOR/background:$NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background-color: $OLD_COLOR/background-color: $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background-color:$OLD_COLOR/background-color:$NEW_COLOR/g" {} \;

# 替换边框颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/border: 1px solid $OLD_COLOR/border: 1px solid $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border:1px solid $OLD_COLOR/border:1px solid $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border-color: $OLD_COLOR/border-color: $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border-color:$OLD_COLOR/border-color:$NEW_COLOR/g" {} \;

# 替换文字颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: $OLD_COLOR/color: $NEW_COLOR/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color:$OLD_COLOR/color:$NEW_COLOR/g" {} \;

# 替换渐变颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/$OLD_COLOR/$NEW_COLOR/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/$OLD_COLOR/$NEW_COLOR/g" {} \;

# 替换变量定义
find ./src -name "*.scss" -type f -exec sed -i '' "s/\$dark-green: $OLD_COLOR/\$dark-green: $NEW_COLOR/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/\$background-dark: $OLD_COLOR/\$background-dark: $NEW_COLOR/g" {} \;

# 在 JS 文件中替换（可能存在于主题配置中）
find ./src -name "*.js" -type f -exec sed -i '' "s/'$OLD_COLOR'/'$NEW_COLOR'/g" {} \;
find ./src -name "*.js" -type f -exec sed -i '' "s/\"$OLD_COLOR\"/\"$NEW_COLOR\"/g" {} \;

echo "颜色替换完成！所有 $OLD_COLOR 已替换为 $NEW_COLOR" 