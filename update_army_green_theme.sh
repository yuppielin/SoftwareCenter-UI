#!/bin/bash

# 颜色定义 - 陆军绿色系统
BACKGROUND_COLOR="#022517"
BUTTON_COLOR="#0C5932"
TEXT_COLOR="#2BB56E"

echo "正在更新为陆军绿色主题系统..."

# 更新基础样式变量
echo "更新基础样式变量..."
sed -i '' "s/\$green: #30B08F;/\$green: ${TEXT_COLOR};/g" ./src/styles/variables.scss
sed -i '' "s/\$panGreen: #30B08F;/\$panGreen: ${TEXT_COLOR};/g" ./src/styles/variables.scss

# 更新Element UI主题变量
echo "更新Element UI主题变量..."
sed -i '' "s/\$--color-primary:rgba(43,181,110,1);/\$--color-primary:rgba(43,181,110,1);/g" ./src/styles/element-variables.scss
sed -i '' "s/\/\/ \$--color-primary: rgb(12, 95, 46);/\$--color-primary: ${BUTTON_COLOR};/g" ./src/styles/element-variables.scss

# 替换按钮颜色
echo "替换按钮颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:rgb(43, 181, 110)/background:${BUTTON_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: rgb(43, 181, 110)/background: ${BUTTON_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:#2bb56e/background:${BUTTON_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #2bb56e/background: ${BUTTON_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:#0c5f2e/background:${BUTTON_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #0c5f2e/background: ${BUTTON_COLOR}/g" {} \;

# 替换文本颜色
echo "替换文本颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/color:rgb(43, 181, 110)/color:${TEXT_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: rgb(43, 181, 110)/color: ${TEXT_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color:#2bb56e/color:${TEXT_COLOR}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: #2bb56e/color: ${TEXT_COLOR}/g" {} \;

# 替换表格头部样式
echo "替换表格头部样式..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/:header-cell-style=\"{background:'rgb(43, 181, 110)'/:header-cell-style=\"{background:'${TEXT_COLOR}'/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/:header-cell-style=\"{background:'#2bb56e'/:header-cell-style=\"{background:'${TEXT_COLOR}'/g" {} \;

# 替换背景颜色
echo "替换背景颜色..."
# 修改主背景色
find ./src -name "*.scss" -type f -exec sed -i '' "s/background: #f0f2f5/background: ${BACKGROUND_COLOR}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/background:#f0f2f5/background:${BACKGROUND_COLOR}/g" {} \;
# 暗色调背景替换
find ./src -name "*.scss" -type f -exec sed -i '' "s/background: #304156/background: ${BACKGROUND_COLOR}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/background:#304156/background:${BACKGROUND_COLOR}/g" {} \;

# 替换CSS样式文件中的颜色
echo "替换CSS样式文件中的颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgb(43, 181, 110)/${TEXT_COLOR}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/#2bb56e/${TEXT_COLOR}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgba(43,181,110,1)/rgba(43,181,110,1)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/#0c5f2e/${BUTTON_COLOR}/g" {} \;

# 更新菜单样式
echo "更新菜单样式..."
# 替换菜单悬停颜色
sed -i '' "s/\$menuHover:#006eff;/\$menuHover:${BUTTON_COLOR};/g" ./src/styles/variables.scss
sed -i '' "s/\$subMenuBg:#006eff;/\$subMenuBg:${BUTTON_COLOR};/g" ./src/styles/variables.scss

# 调整文本与背景的对比度
echo "调整文本与背景的对比度..."
# 当背景为深色时，文本颜色应该足够亮
find ./src -name "*.scss" -type f -exec sed -i '' "s/color: #333/color: #fff/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/color:#333/color:#fff/g" {} \;

# 处理悬停和激活状态
echo "处理悬停和激活状态..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/&:hover { background: #e8f7ef/\&:hover { background: rgba(43,181,110,0.2)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/&.is-active { color: #2bb56e/\&.is-active { color: ${TEXT_COLOR}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/&.is-active { background-color: #2bb56e/\&.is-active { background-color: ${BUTTON_COLOR}/g" {} \;

echo "更新完成! 系统已修改为陆军绿色主题." 