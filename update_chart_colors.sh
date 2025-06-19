#!/bin/bash

# 图表颜色配置
CHART_COLOR_1="#2bb56e"    # 主绿色
CHART_COLOR_2="#0c5f2e"    # 深绿色
CHART_COLOR_3="#53ca8a"    # 浅绿色
CHART_COLOR_4="#8adfb3"    # 更浅的绿色
CHART_COLOR_5="#1a7d4c"    # 中绿色

# 查找可能包含图表配置的文件并更新颜色
echo "正在更新图表颜色配置..."

# 替换echarts的颜色配置
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: \['#3888fa', '#3b5975', '#25b1db', '#36a3f7', '#40c9c6'\]/color: \['${CHART_COLOR_1}', '${CHART_COLOR_2}', '${CHART_COLOR_3}', '${CHART_COLOR_4}', '${CHART_COLOR_5}'\]/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: \['#3888fa', '#3b5975', '#25b1db'\]/color: \['${CHART_COLOR_1}', '${CHART_COLOR_2}', '${CHART_COLOR_3}'\]/g" {} \;

# 更新饼图颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: \['#3888fa', '#13CE66', '#F7BA2A', '#FF4949', '#8492A6'\]/color: \['${CHART_COLOR_1}', '${CHART_COLOR_2}', '${CHART_COLOR_3}', '${CHART_COLOR_4}', '${CHART_COLOR_5}'\]/g" {} \;

# 更新仪表盘颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/color: \[\[0.3, '#3888fa'\], \[0.7, '#13CE66'\], \[1, '#F7BA2A'\]\]/color: \[\[0.3, '${CHART_COLOR_1}'\], \[0.7, '${CHART_COLOR_2}'\], \[1, '${CHART_COLOR_3}'\]\]/g" {} \;

# 更新卡片组件的背景色
echo "正在更新卡片组件的背景色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #40c9c6/background: ${CHART_COLOR_1}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #36a3f7/background: ${CHART_COLOR_2}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #f4516c/background: ${CHART_COLOR_3}/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/background: #34bfa3/background: ${CHART_COLOR_4}/g" {} \;

# 更新图表中的线条颜色
find ./src -name "*.vue" -type f -exec sed -i '' "s/lineStyle: {color: '#3888fa'/lineStyle: {color: '${CHART_COLOR_1}'/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/lineStyle: {color: '#3b5975'/lineStyle: {color: '${CHART_COLOR_2}'/g" {} \;

# 更新面积图的渐变色
echo "正在更新面积图的渐变色..."
find ./src -name "*.vue" -type f -exec sed -i '' "s/areaStyle: {color: '#3888fa'/areaStyle: {color: '${CHART_COLOR_1}'/g" {} \;
find ./src -name "*.vue" -type f -exec sed -i '' "s/areaStyle: {color: '#3b5975'/areaStyle: {color: '${CHART_COLOR_2}'/g" {} \;

echo "图表颜色更新完成！" 