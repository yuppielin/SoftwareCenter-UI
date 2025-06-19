# 项目蓝色系转绿色系改造报告

## 一、改造概述

为满足陆军相关系统绿色配色的需求，我们对RJZX-UI项目进行了全面的颜色系统改造，将原有的蓝色系主题转换为绿色系主题。改造过程中充分考虑了色彩的协调性和美观性，确保整体视觉效果符合陆军绿色配色要求。

## 二、主要颜色体系

### 1. 主要绿色系颜色定义

| 颜色名称 | 色值 | 用途 |
|---------|------|-----|
| 主绿色 | rgb(43, 181, 110) / #2bb56e | 主要按钮、激活状态等 |
| 深绿色 | rgb(12, 95, 46) / #0c5f2e | 强调色、悬停状态 |
| 浅绿色 | rgb(83, 202, 138) / #53ca8a | 辅助色、次要元素 |
| 超浅绿色 | rgba(43, 181, 110, 0.1) / #e8f7ef | 背景色、hover效果 |
| 中绿色 | rgb(26, 125, 76) / #1a7d4c | 图表、数据可视化 |

### 2. 颜色协调原则

- 采用同一色系的不同深浅变化，保持整体风格统一
- 主绿色明亮清新，符合现代UI设计审美
- 深浅绿色搭配，增强视觉层次感
- 与陆军绿色系相协调，体现军队特色

## 三、改造内容

### 1. 基础组件改造

- **按钮类组件**：将各类按钮背景色从蓝色系(#178ae3, rgb(23, 138, 227))改为绿色系(#2bb56e, rgb(43, 181, 110))
- **表格组件**：表头背景色从蓝色系改为绿色系
- **导航组件**：导航栏、菜单项激活状态等颜色从蓝色系改为绿色系
- **表单组件**：输入框focus状态、单选框、复选框等交互状态颜色更新

### 2. Element UI主题改造

- 修改Element UI主题色变量($--color-primary)，统一基础组件样式
- 处理组件激活状态、悬停状态等交互效果颜色

### 3. 图表颜色改造

- 更新各类图表(折线图、柱状图、饼图等)的颜色配置
- 优化图表配色方案，采用绿色系渐变色，提升数据可视化效果

### 4. 细节优化

- 处理图标、边框、阴影等细节元素颜色
- 调整hover效果、focus状态等交互细节
- 确保颜色搭配协调，避免视觉冲突

## 四、技术实现

通过编写多个脚本文件进行批量处理：

1. `green_theme_transform.sh`：基础颜色替换，处理主要组件
2. `update_chart_colors.sh`：图表颜色更新，优化数据可视化
3. `fine_tune_green_theme.sh`：细节调整，优化交互效果
4. `update_icons_and_components.sh`：处理图标和特殊组件

## 五、改造效果

项目整体视觉效果从蓝色系统一转换为绿色系，界面清新明快，符合陆军绿色配色要求。系统各个组件颜色协调统一，提升了用户体验。

## 六、注意事项

1. 由于项目规模较大，个别特殊组件可能需要手动调整
2. 建议在不同分辨率和设备上进行测试，确保视觉效果一致
3. 后续新增组件时，注意遵循绿色主题规范，保持风格统一

# 按钮颜色修改报告

## 修改内容

本次修改将项目中所有按钮的颜色从原有颜色（主要是 #2BB56E 和 #0C5932）统一修改为新的标准色 `#05994e`。

## 修改范围

1. Element UI 主题按钮颜色（type="primary"）
2. 自定义按钮背景色
3. 按钮文字颜色
4. 按钮边框颜色
5. 特殊类名按钮（如 downBtn 和 downBtn2）

## 修改方法

创建了一个 Shell 脚本 `replace_button_color.sh`，通过以下步骤进行修改：

1. 定义目标颜色为 `#05994e`
2. 替换 Element UI 默认主题色（#409EFF, #66b1ff, #3a8ee6）
3. 替换 Vue 文件中的按钮颜色（#2BB56E, #0C5932 等）
4. 替换按钮相关的边框和文字颜色
5. 替换特定 CSS 类的按钮样式

## 脚本实现

```bash
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

## 修改结果

通过执行上述脚本，成功将项目中所有按钮颜色统一修改为 `#05994e`，包括：

1. Element UI 的 primary 类型按钮
2. 自定义按钮样式
3. 特殊命名的按钮类（downBtn, downBtn2）
4. 按钮相关的文字和边框颜色

此次修改保持了界面风格的一致性，同时将按钮颜色统一为新的标准绿色 `#05994e`。

## 注意事项

1. 此脚本主要针对项目中预定义的几种颜色值进行替换，如果有特殊情况的按钮颜色未被替换，可能需要手动调整
2. 为避免误替换，脚本只替换确定的颜色值模式，如果有动态生成的颜色值可能未被替换
3. 建议在替换后进行全面测试，确保所有按钮样式正常显示 