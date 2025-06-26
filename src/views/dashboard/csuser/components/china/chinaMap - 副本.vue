<template>
  <div class="app-container" style="padding:10px 0;">
    <div class="chart-wrapper" style="height:calc(100vh - 290px)">
      <div id="chinaMap" style="width: 100%;height:calc(100vh - 290px);padding-top:10px;"></div>
    </div>
  </div>
</template>
<script>
  import  'echarts/map/js/china.js'
  import echarts from 'echarts'
  import * as analysis from "@/api/analysis"
  import chinaJson from 'echarts/map/json/china.json'// 这个是json引用
  // import chinaJson from './china.json'// 这个是json引用
  export default {
    name: 'chinaMap',
    data () {
      return {
        chinaMapData: [
          {
           "name": "东部",
            "uploadNum": 28,
            "downloadNum": 368,
            "color": "yellow"
          },
           {
           "name": "南部",
            "uploadNum": 18,
            "downloadNum": 368,
            "color": "#90ca88"
          },
          {
            "name": "西部",
            "uploadNum": 38,
            "downloadNum": 368,
            "color": "#7ab8e2"
          },
          {
            "name": "北部",
            "uploadNum": 48,
            "downloadNum": 368,
            "color": "#f1bd4c"
          },
          {
            "name": "中部",
            "uploadNum": 58,
            "downloadNum": 368,
            "color": "#c1e2cf"
          },
        ],
        chinaDaquGeo: {
          type: "FeatureCollection",
          features:[]
        }
      }
    },
    methods:{
      async getMapInfo() {
        await analysis.getMapInfo().then(response => {
          if(response.code==200){
            let mapInfo = JSON.parse(JSON.stringify(response.data))
            let getMapArray = [{
              "name": "东部",
              "uploadNum": mapInfo.east_upload_num,
              "downloadNum": mapInfo.east_download_num,
              "color": "#f8f5eb"
            },{
              "name": "南部",
              "uploadNum": mapInfo.south_upload_num,
              "downloadNum": mapInfo.south_download_num,
              "color": "#f1f8f3"
            },{
              "name": "西部",
              "uploadNum": mapInfo.west_upload_num,
              "downloadNum": mapInfo.west_download_num,
              "color": "#fcf1f4"
            },{
              "name": "北部",
              "uploadNum": mapInfo.north_upload_num,
              "downloadNum": mapInfo.north_download_num,
              "color": "#f5ecf6"
            },{
              "name": "中部",
              "uploadNum": mapInfo.middle_upload_num,
              "downloadNum": mapInfo.middle_download_num,
              "color": "#edf5fa"
            },{
              "name": "",
              "uploadNum": 0,
              "downloadNum": 0,
              "color": "#f8f5eb"
            }]
            this.chinaMapData = JSON.parse(JSON.stringify(getMapArray))
          }
        })
      },
      async drawChinaMap(id){
        await this.getMapInfo()
        document.getElementById(id)?.removeAttribute("_echarts_instance_")
        this.mapCharts = echarts.init(document.getElementById(id));
        var customSettings = [];
        this.chinaMapData.forEach(function (item, index) {
            customSettings.push({
                name: item.name,
                itemStyle: {
                    normal: {
                        areaColor: item.color,
                        color: item.color,
                      },
                  }
              })
            })
        this.mapCharts.clear()
         var option = {
          tooltip: {
            formatter:function(params,ticket, callback){
              // return params.seriesName+'<br />'+params.name+'：'+params.value
              console.log(params, "params")
              return params.data.name+'<br />上传次数：'+params.data.uploadNum+'<br />下载次数：'+params.data.downloadNum;
            }//数据格式化
          },
          visualMap: {
            min: 0,
            max: 1500,
            left: 'left',
            top: 'bottom',
            type:"piecewise",
            //text: ['高','低'],//取值范围的文字
            inRange: {
              color: ['#e0ffff', '#006edd']//取值范围的颜色
            },
            show:false//图注
          },
          geo: {
            map: 'china',
            roam: true,//不开启缩放和平移
            zoom: 1.0,//视角缩放比例
            center: [108.5525, 34.3227],
            label: {
              normal: {
                show: true,
                fontSize:'10',
                color: 'rgba(0,0,0,0.7)'// 大区文本颜色
              }
            },
            itemStyle: {
              normal:{
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis:{
                areaColor: '#F3B329',//鼠标选择区域颜色
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                borderColor: 'rgba(0, 0, 0, 0)',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            regions: customSettings   // 设置大区单独的样式。
          },
          series : [
            {
              name: '',
              type: 'map',
              geoIndex: 0,
              data:this.chinaMapData
            }
          ]
        };
        this.mapCharts.setOption(option,true);
        this.mapCharts.on('mouseover', function (params) {// 监听被划过状态
          // console.log(params)
        });
      },
      //划分大区
      mergeProvinces(chinaJson, names, properties) {//合并大区里省份的coordinates
        var features = chinaJson.features;
        var polygons = [];
        var polygons2 = [];//
        for (var i = 0; i < names.length; i++) {
          var polygonsCoordinates = [];
          var polygonsEncodeOffsets = [];//
          for (var z = 0; z < names[i].length; z++) {
            for (var j = 0; j < features.length; j++) {
              if (features[j].properties.name == names[i][z]) {
                if (features[j].geometry.coordinates[0].constructor == String) {//合并coordinates
                  for (var l = 0; l < features[j].geometry.coordinates.length; l++) {
                    polygonsCoordinates.push(features[j].geometry.coordinates[l]);
                  }
 
                } else if (features[j].geometry.coordinates[0].constructor == Array) {
                  for (var k = 0; k < features[j].geometry.coordinates.length; k++) {
                    for (var d = 0; d < features[j].geometry.coordinates[k].length; d++) {
                      polygonsCoordinates.push(features[j].geometry.coordinates[k][d]);
                    }
                  }
                }
                //
                  if (features[j].geometry.encodeOffsets[0].constructor == String) {//合并encodeOffsets
                                    polygonsEncodeOffsets.push(features[j].geometry.encodeOffsets);
                    } else if (features[j].geometry.encodeOffsets[0].constructor == Array) {
                        for (var k = 0; k < features[j].geometry.encodeOffsets.length; k++) {
                            if (features[j].geometry.encodeOffsets[k][0].constructor == Array) {
                              for (var e = 0; e < features[j].geometry.encodeOffsets[k].length; e++) {
                                polygonsEncodeOffsets.push(features[j].geometry.encodeOffsets[k][e]);
                              }
                            } else {
                                polygonsEncodeOffsets.push(features[j].geometry.encodeOffsets[k]);
                            }
                      }
                }
                //
                break;
              }
            }
          }
          polygons.push(polygonsCoordinates);
          polygons2.push(polygonsEncodeOffsets);//
        }
 
        // 构建新的合并区域
        var features = [];
 
        for(var a = 0;a<names.length;a++){
          var feature = {
            id: features.length.toString(),
            //type: "FeatureCollection",
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: polygons[a],
              encodeOffsets: polygons2[a]//
            },
            properties: {
              name: properties.name[a] || "",
              childNum:polygons[a].length
            },
            temStyle: { normal: { areaColor: 'red', label: { show: false } } }
          };
          if(properties.cp[a]) {
            feature.properties.cp = properties.cp[a];
          }
 
          // 将新的合并区域添加到地图中
          features.push(feature);
        }
         chinaJson.features =features;
        // this.chinaDaquGeo.type = "FeatureCollection";
        // this.chinaDaquGeo.features = features;
      },
 
      repRegionStrategy(){
        var params = {
          names: [//把各个大区的省份用二维数组分开
                ['江苏','安徽','江西','浙江','福建','上海'],
                ['广东','广西','海南','香港','澳门','云南','贵州','湖南'],
                ['甘肃','青海','宁夏','新疆','重庆','四川','西藏'],
                ['黑龙江','吉林','辽宁','内蒙古'],
                ["北京","天津","陕西","河北","山西","河南","山东","湖北"],
                ['台湾']
          ],
          properties: {//自定义大区的名字，要和上面的大区省份一一对应
            name: ['东部','南部','西部','北部','中部',''],
            cp: [//经纬度可以自己随意定义
              // [11.24, 37.04],
              // [120.32, 44.50],
              // [121.28, 30.13],
              // [114.20, 30.32],
              // [113.00, 24.08],
            ]
          }
        };
        this.mergeProvinces(chinaJson, params.names, params.properties);
      }
    },
    //调用
    async created() {
      await this.repRegionStrategy()
      echarts.registerMap('china', chinaJson)
      // 注册地图
      // echarts.registerMap('china', this.chinaDaquGeo) // 如果是js引入就不需要这一行了
    },
    mounted(){
      this.$nextTick(function() {
        this.drawChinaMap('chinaMap')
      })
    }
  }
</script>
<style>
 
</style>