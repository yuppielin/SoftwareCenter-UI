#!/bin/bash

# 替换背景色为#178ae3的地方
find ./src -name "*.vue" -type f -exec sed -i '' 's/background:#178ae3/background:rgb(43, 181, 110)/g' {} \;
find ./src -name "*.vue" -type f -exec sed -i '' 's/background: #178ae3/background: rgb(43, 181, 110)/g' {} \;

# 替换线性渐变
find ./src -name "*.vue" -type f -exec sed -i '' 's/#178ae3/rgb(43, 181, 110)/g' {} \;

# 替换边框颜色
find ./src -name "*.vue" -type f -exec sed -i '' 's/border-left: 4px solid #178ae3/border-left: 4px solid rgb(43, 181, 110)/g' {} \;

echo "所有剩余颜色已替换为 rgb(43, 181, 110)" 