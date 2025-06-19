#!/bin/bash

# 颜色定义
GREEN_PRIMARY="#2bb56e"       # 主绿色
GREEN_LIGHT="#53ca8a"         # 浅绿色
GREEN_DARK="#0c5f2e"          # 深绿色

echo "正在更新图标和特定组件的颜色..."

# 更新图标颜色
echo "更新图标颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/style=\"color:rgb(155,162,171)/style=\"color:${GREEN_DARK}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/style=\"color: rgb(155,162,171)/style=\"color: ${GREEN_DARK}/g" {} \;

# 更新标题图标颜色
echo "更新标题图标颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/<i class=\"el-icon-menu\" style=\"color:rgb(43, 181, 110)/<i class=\"el-icon-menu\" style=\"color:${GREEN_PRIMARY}/g" {} \;

# 更新进度条、评分等组件颜色
echo "更新进度条、评分等组件颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/:color=\"'#409EFF'\"/:color=\"'${GREEN_PRIMARY}'\"/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/:color=\"'#178ae3'\"/:color=\"'${GREEN_PRIMARY}'\"/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/:stroke-color=\"'#409EFF'\"/:stroke-color=\"'${GREEN_PRIMARY}'\"/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/:stroke-color=\"'#178ae3'\"/:stroke-color=\"'${GREEN_PRIMARY}'\"/g" {} \;

# 更新卡片标题栏颜色
echo "更新卡片标题栏颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/background-color: #eef1f6/background-color: ${GREEN_LIGHT}10/g" {} \;

# 更新特定标签颜色
echo "更新特定标签颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/type=\"primary\"/type=\"success\"/g" {} \;

# 更新SVG图标颜色
echo "更新SVG图标颜色..."
find ./src -name "*.svg" -type f -exec sed -i '' "s/fill=\"#409EFF\"/fill=\"${GREEN_PRIMARY}\"/g" {} \;
find ./src -name "*.svg" -type f -exec sed -i '' "s/fill=\"#178ae3\"/fill=\"${GREEN_PRIMARY}\"/g" {} \;
find ./src -name "*.svg" -type f -exec sed -i '' "s/stroke=\"#409EFF\"/stroke=\"${GREEN_PRIMARY}\"/g" {} \;
find ./src -name "*.svg" -type f -exec sed -i '' "s/stroke=\"#178ae3\"/stroke=\"${GREEN_PRIMARY}\"/g" {} \;

echo "图标和特定组件颜色更新完成！" 