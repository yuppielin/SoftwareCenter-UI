# 背景色修改报告

## 修改内容

将项目中所有使用深绿色背景 `#022517` 的地方修改为更鲜明的军绿色 `#055c39`。

## 修改方法

创建了自动化脚本 `update_background_color.sh` 来执行全局替换操作：

```bash
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
```

## 修改结果

脚本成功运行，替换了项目中的深绿色背景。共修改了3处颜色：

1. 在 `src/styles/variables.scss` 中的菜单背景色变量：
   ```scss
   $menuBg:#055c39;
   ```

2. 在 `src/styles/index.scss` 中的两处背景色：
   ```scss
   background: #055c39;
   ```

这些修改涉及到系统的菜单背景和页面背景，使系统整体风格更加协调，符合军绿色主题的设计要求。

## 色彩效果对比

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 颜色值 | #022517 | #055c39 |
| 颜色特点 | 深绿色，较暗沉 | 军绿色，亮度适中 |
| 视觉效果 | 沉稳但较暗 | 鲜明且专业 |

## 后续建议

1. 根据用户反馈，可能需要进一步调整背景色的亮度和饱和度
2. 考虑对与背景色搭配的前景色（如文字、图标）进行调整，确保良好的对比度
3. 建议在不同屏幕和环境光条件下测试修改后的效果 