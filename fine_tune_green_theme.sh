#!/bin/bash

# 颜色定义
GREEN_PRIMARY="#2bb56e"
GREEN_ULTRA_LIGHT="#e8f7ef"

echo "正在优化绿色主题细节..."

# 处理悬停状态的背景色
echo "更新悬停状态的背景色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/&:hover {.*background:.*rgba(0, 0, 0, .025)/\&:hover { background: ${GREEN_ULTRA_LIGHT}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/&:hover {.*background-color:.*rgba(0, 0, 0, .025)/\&:hover { background-color: ${GREEN_ULTRA_LIGHT}/g" {} \;

# 处理菜单激活状态
echo "更新菜单激活状态..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/&.is-active {.*color: #409EFF/\&.is-active { color: ${GREEN_PRIMARY}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/&.is-active {.*background-color: #409EFF/\&.is-active { background-color: ${GREEN_PRIMARY}/g" {} \;

# 处理标签页样式
echo "更新标签页样式..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/.el-tabs__item.is-active {.*color: #409EFF/.el-tabs__item.is-active { color: ${GREEN_PRIMARY}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/.el-tabs__active-bar {.*background-color: #409EFF/.el-tabs__active-bar { background-color: ${GREEN_PRIMARY}/g" {} \;

# 处理边框颜色
echo "更新边框颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/border-color: #409EFF/border-color: ${GREEN_PRIMARY}/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/border: 1px solid #409EFF/border: 1px solid ${GREEN_PRIMARY}/g" {} \;

# 处理阴影效果
echo "更新阴影效果..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/box-shadow: 0 0 0 2px rgba(64,158,255,.5)/box-shadow: 0 0 0 2px rgba(43,181,110,.5)/g" {} \;
find ./src -name "*.scss" -type f -exec sed -i '' "s/box-shadow: 0 0 0 2px rgba(23,138,227,.5)/box-shadow: 0 0 0 2px rgba(43,181,110,.5)/g" {} \;

# 处理进度条颜色
echo "更新进度条颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/background-color: #409EFF/background-color: ${GREEN_PRIMARY}/g" {} \;

# 处理分页组件激活颜色
echo "更新分页组件激活颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/.el-pager li.active {.*background-color: #409EFF/.el-pager li.active { background-color: ${GREEN_PRIMARY}/g" {} \;

# 处理开关组件颜色
echo "更新开关组件颜色..."
find ./src -name "*.scss" -type f -exec sed -i '' "s/.el-switch.is-checked .el-switch__core {.*background-color: #409EFF/.el-switch.is-checked .el-switch__core { background-color: ${GREEN_PRIMARY}/g" {} \;

echo "绿色主题细节优化完成！" 