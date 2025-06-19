<template>
  <div class="app-container" style="padding:10px 0;overflow: hidden;">
    <div class="chart-wrapper" style="height: 780px;overflow: hidden;">
      <div id="chinaMap" style="width: 100%;height: 780px;padding-top:10px;overflow: hidden;"  ></div>
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
            "uploadNum": 0,
            "downloadNum": 0,
            "color": "yellow"
          },
           {
           "name": "南部",
            "uploadNum": 0,
            "downloadNum": 0,
            "color": "#90ca88"
          },
          {
            "name": "西部",
            "uploadNum": 0,
            "downloadNum": 0,
            "color": "#7ab8e2"
          },
          {
            "name": "北部",
            "uploadNum": 0,
            "downloadNum": 0,
            "color": "#f1bd4c"
          },
          {
            "name": "中部",
            "uploadNum": 0,
            "downloadNum": 0,
            "color": "#c1e2cf"
          },
        ],
        chinaDaquGeo: {
          type: "FeatureCollection",
          features:[]
        },
        mapCharts: '',
        pureChinaJson:null
      }
    },
    methods:{
      async getMapInfo() {
        await analysis.getMapInfo().then(response => {
          if(response.code==200){
            let mapInfo = JSON.parse(JSON.stringify(response.data))
            let getMapArray = [{
              "name": "东部战区",
              "uploadNum": mapInfo.east_upload_num,
              "downloadNum": mapInfo.east_download_num,
              // "color": "#f8f5eb"
              // "color": "#e4ba2b"
              "color": "rgba(255,255,255,0.5)"
            },{
              "name": "南部战区",
              "uploadNum": mapInfo.south_upload_num,
              "downloadNum": mapInfo.south_download_num,
              // "color": "#f1f8f3"
              // "color": "#00f345"
               "color": "rgba(255,255,255,0.5)"
            },{
              "name": "西部战区",
              "uploadNum": mapInfo.west_upload_num,
              "downloadNum": mapInfo.west_download_num,
              // "color": "#fcf1f4"
              // "color": "#f3baca"
               "color": "rgba(255,255,255,0.5)"
            },{
              "name": "北部战区",
              "uploadNum": mapInfo.north_upload_num,
              "downloadNum": mapInfo.north_download_num,
              // "color": "#f5ecf6"
              // "color": "#c992fe"
               "color": "rgba(255,255,255,0.5)"
            },{
              "name": "中部战区",
              "uploadNum": mapInfo.middle_upload_num,
              "downloadNum": mapInfo.middle_download_num,
              // "color": "#edf5fa"
              // "color":"#5dbbf7"
               "color": "rgba(255,255,255,0.5)"
            }]
            this.chinaMapData = JSON.parse(JSON.stringify(getMapArray))
          }
        })
      },
      async drawChinaMap(id){
        await this.getMapInfo()
        const mapDraw = document.getElementById(id);
        this.mapCharts = echarts.init(mapDraw);
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
        customSettings.push({
          name:'南海诸岛',
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "rgba(255,255,255,0.5)",
              color: "rgba(255,255,255,0.5)",
            },
          }
        })
        customSettings.push({
          name:'台湾',
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "rgba(255,255,255,0.5)",
              color: "rgba(255,255,255,0.5)",
            },
          }
        })
        var option = {
          tooltip: {
            formatter:function(params,ticket, callback){
              // return params.seriesName+'<br />'+params.name+'：'+params.value
              // console.log(params, "params")
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
            roam: false,//开启缩放和平移
            zoom: 0.8,//视角缩放比例
            center: [105.5525, 34.3227],
            label: {
              normal: {
                show: true,
                fontSize:'20',
                // fontWeight: '600',
                color: 'rgba(0,0,0,1)'// 大区文本颜色
              },
              // emphasis: {
              //   show: true,
              //   color: '#fff'
              // }
            },
           
            itemStyle: {
              normal:{
                // borderWidth: 0,
                borderColor: 'rgba(255, 255, 255, 0.5)'
              },
              emphasis:{
                areaColor: 'rgba(255, 255, 255, 0.6)',//鼠标选择区域颜色
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                // borderWidth: 0,
                // borderColor: 'rgba(0, 0, 0, 0)',
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

              // type: 'effectScatter',
              // coordinateSystem: 'geo',
              // zlevel: 2,
              // rippleEffect: {
              //   brushType: "stroke"
              // },
              // symbolSize: function(val) {
              //   return 24;
              // },
              
              data:this.chinaMapData
            }
          ]
        };
        // console.log(option,"option")
        // document.getElementById(id).setAttribute("_echarts_instance_",'')
        this.mapCharts.setOption(option);
        window.addEventListener('resize', ()=> {
          // console.log(11111111);
          this.mapCharts.resize();
        })
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
        let chinaInfo = JSON.parse(JSON.stringify(chinaJson))
        // console.log(chinaInfo, "chinaInfo")
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
            name: ['东部战区','南部战区','西部战区','北部战区','中部战区','台湾'],
            cp: [//经纬度可以自己随意定义
              [118.32, 29.50],
              [110.28, 26.13],
              [90.24, 35.54],
              [123.20, 45.32],
              [113.00, 35.08],
            ]
          }
        };
        // this.mergeProvinces(chinaJson, params.names, params.properties);
        this.mergeProvinces(this.pureChinaJson, params.names, params.properties);
      }
    },
    //调用
    async created() {
      this.pureChinaJson = Object.assign({}, chinaJson)
      await this.repRegionStrategy()
      echarts.registerMap('china', this.pureChinaJson)
      // console.log(chinaJson, "chinaJson")
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