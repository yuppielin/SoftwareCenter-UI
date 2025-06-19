# 军绿色主题转换报告

## 项目背景

为适应特定用户需求，需要将软件中心的UI主题从原有绿色系(#2BB56E)转换为军绿色(#05994e)，使界面风格更符合军事系统的整体设计规范。

## 转换目标

- 将所有按钮颜色从原有的 #2BB56E, #0C5932 等颜色统一修改为新的军绿色 #05994e
- 保持界面风格的一致性和专业性
- 确保颜色变更不影响功能使用和用户体验
- 为后续定制化需求打下基础

## 转换方法

创建了专用脚本 `replace_button_color.sh` 来执行批量替换操作：

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
```

## 转换过程

1. **颜色分析**：分析了原有系统中使用的所有按钮相关颜色
2. **脚本编写**：编写了自动替换脚本，针对不同文件类型和样式定义方式
3. **批量替换**：执行脚本进行全局替换
4. **结果验证**：对替换结果进行了视觉检查和功能测试

## 转换结果

本次转换成功将系统按钮颜色从原有颜色统一修改为军绿色 #05994e，包括：

- Element UI 默认主题色
- 自定义按钮的背景色
- 按钮文字和边框颜色
- 特殊类名的按钮样式

## 效果评估

- **视觉一致性**：系统整体风格更加符合军事系统的设计规范
- **用户体验**：保持了原有的交互逻辑，同时视觉上更加凝练和专业
- **可维护性**：通过脚本化方式进行颜色替换，便于未来进行维护和进一步优化

## 后续建议

1. 可以考虑进一步对其他UI元素（如图表、进度条等）进行军绿色主题适配
2. 建立完整的军绿色主题变量系统，便于后续维护和扩展
3. 考虑为系统添加主题切换功能，支持在标准绿色和军绿色之间进行切换 