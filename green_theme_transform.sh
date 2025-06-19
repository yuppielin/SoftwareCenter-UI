#!/bin/bash

# 替换按钮和背景颜色
echo "正在替换按钮和背景颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:rgb(8, 151, 151)/background:rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: rgb(8, 151, 151)/background: rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:rgb(23, 138, 227)/background:rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: rgb(23, 138, 227)/background: rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:#178ae3/background:#2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #178ae3/background: #2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:#3888fa/background:#2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #3888fa/background: #2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background:#3b5975/background:#0c5f2e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #3b5975/background: #0c5f2e/g" {} \;

# 替换表格头部样式
echo "正在替换表格头部样式..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/:header-cell-style=\"{background:'rgb(8, 151, 151)'/:header-cell-style=\"{background:'rgb(43, 181, 110)'/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/:header-cell-style=\"{background:'#3888fa'/:header-cell-style=\"{background:'#2bb56e'/g" {} \;

# 替换文本颜色
echo "正在替换文本颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/color:rgb(23, 138, 227)/color:rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: rgb(23, 138, 227)/color: rgb(43, 181, 110)/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color:#178ae3/color:#2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: #178ae3/color: #2bb56e/g" {} \;

# 替换边框颜色
echo "正在替换边框颜色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/border-color: #178ae3/border-color: #2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border-color:#178ae3/border-color:#2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border-left: 4px solid #178ae3/border-left: 4px solid #2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border: 1px solid #178ae3/border: 1px solid #2bb56e/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/border:1px solid #178ae3/border:1px solid #2bb56e/g" {} \;

# 替换CSS样式文件中的颜色
echo "正在替换CSS样式文件中的颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgb(23, 138, 227)/rgb(43, 181, 110)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/#178ae3/#2bb56e/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgba(23,138,227,1)/rgba(43,181,110,1)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgba(23, 138, 227, 1)/rgba(43, 181, 110, 1)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/rgba(23,138,227,0.1)/rgba(43,181,110,0.1)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/#3b5975/#0c5f2e/g" {} \;

# 替换Element UI主题变量
echo "正在更新Element UI主题颜色..."
sed -i '' "s/\$--color-primary:rgba(23,138,227,1);/\$--color-primary:rgba(43,181,110,1);/g" ./src/styles/element-variables.scss

echo "颜色替换完成，系统已从蓝色系统一修改为绿色系！" 