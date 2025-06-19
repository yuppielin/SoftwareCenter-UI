<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <i class="el-icon-house" style="color: #2098cc;" />
      <span style="font-size:16px;">数据分析/榜单统计</span>
    </div>
    <el-row :gutter="20" class="bangdan">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" >
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:580px">
             <div style="margin:10px 0;font-size:16px;font-weight:600;">软件下载量Top10（周）</div>
             <el-table :show-header="false" :data="downloadSoftwareNumThisWeek" style="width: 100%;" size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',color:'white',height:'30px'}" :cell-class-name="'softwareDownloadFont'">
              <el-table-column>
                <template slot-scope="scope">
                  <div>
                    <el-row>
                      <el-col :span="12">
                        <span style="font-size: 14px;">{{scope.row.softwareName}}</span>
                      </el-col>
                      <el-col style="text-align: right;" :span="12">
                        <span>{{scope.row.downloadCon}}</span>
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-progress :show-text="false" :percentage="scope.row.percentage" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:580px">
            <div style="margin:10px 0;font-size:16px;font-weight:600;">软件下载量Top10（总）</div>
             <el-table :show-header="false" :data="allDownloadNum" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',color:'white',height:'30px'}" :cell-class-name="'softwareDownloadFont'">
              <el-table-column>
                <template slot-scope="scope">
                  <div>
                    <el-row>
                      <el-col :span="12">
                        <span style="font-size: 14px;">{{scope.row.softwareName}}</span>
                      </el-col>
                      <el-col style="text-align: right;" :span="12">
                        <span>{{scope.row.downloadCon}}</span>
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-progress :show-text="false" :percentage="scope.row.percentage" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bangdan">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" >
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:540px">
             <div style="margin:10px 0;font-size:16px;font-weight:600;">好评软件/软件段TOP10（月）</div>
             <el-table :data="goodSoftwareAndFragmentThisMonth" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息" min-width="200">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.offerUnit }}
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:540px">
            <div style="margin:10px 0;font-size:16px;font-weight:600;">好评软件/软件段TOP10（总）</div>
             <el-table :data="allGoodSoftwareAndFragment" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息" min-width="200">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.offerUnit }}
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bangdan">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" >
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:540px">
             <div style="margin:10px 0;font-size:16px;font-weight:600;">差评软件/软件段TOP10（月）</div>
             <el-table :data="badSoftwareAndFragmentThisMonth" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息" min-width="200">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.offerUnit }}
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
        <div style="background:#fff;padding:16px;margin-bottom: 20px;height:540px">
            <div style="margin:10px 0;font-size:16px;font-weight:600;">差评软件/软件段TOP10（总）</div>
             <el-table :data="allBadSoftwareAndFragment" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息" min-width="200">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.offerUnit }}
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bangdan">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" >
        <div style="background:#fff;padding:16px;height:540px">
             <div style="margin:10px 0;font-size:16px;font-weight:600;">安防检测通过率Top10（总）</div>
             <el-table :data="DetectionPass" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息"  show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.cunit }}
                </template>
              </el-table-column>
              <el-table-column label="通过率"  align="center" width="100">
                <template slot-scope="scope">
                  <div style="display: flex;align-items: center;justify-content: center;">
                    <el-progress :width="20" type="circle" :show-text="false" :percentage="scope.row.pass_probability"></el-progress>
                    {{ scope.row.pass_probability }}%
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}">
        <div style="background:#fff;padding:16px;height:540px">
            <div style="margin:10px 0;font-size:16px;font-weight:600;">安防检测未通过率TOP10（总）</div>
             <el-table :data="DetectionReject" style="width: 100%;"  size="mini" :header-cell-style="{background:'rgba(242, 242, 242, 0.5)',height:'30px'}">
              <el-table-column type="index" width="80" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column label="软件信息" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="上传单位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.cunit }}
                </template>
              </el-table-column>
               <el-table-column label="不通过率"  align="center" width="120">
                <template slot-scope="scope">
                  <div style="display: flex;align-items: center;justify-content: center;">
                    <el-progress :width="20" type="circle" :show-text="false" :percentage="scope.row.unpass_probability"></el-progress>
                    {{ scope.row.unpass_probability }}%
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as analysis from "@/api/analysis"
export default {
  components: {
  },
  data() {
    return {
      updateTime: null,
      downloadSoftwareNumThisWeek: [],
      allDownloadNum: [],
      goodSoftwareAndFragmentThisMonth: [],
      allGoodSoftwareAndFragment: [],
      badSoftwareAndFragmentThisMonth: [],
      allBadSoftwareAndFragment: [],
      DetectionPass: [],
      DetectionReject: [],
      weekDownloadNumber: 1,
      allDownloadNumber: 1
    }
  },
  mounted() {
    this.updateTime = new Date()
    this.listStatisticsPic12()
    this.listStatisticsPic3456()
    this.listStatisticsPic78()
  },
  methods: {
    listStatisticsPic12() {
      analysis.listStatisticsPic12().then(response => {
        if(response.code == 200){
          let listStatisticsList = JSON.parse(JSON.stringify(response.data))
          if(listStatisticsList.length > 0){
            listStatisticsList.forEach(element => {
              if(element.form1){
                this.downloadSoftwareNumThisWeek = JSON.parse(JSON.stringify(element.form1.list))
              }else if(element.form2){
                this.allDownloadNum = JSON.parse(JSON.stringify(element.form2.list))
              }
            });
          }
          if(this.downloadSoftwareNumThisWeek.length>0){
            let weekNum = Math.ceil(this.downloadSoftwareNumThisWeek[0].downloadCon/10)
            this.weekDownloadNum = weekNum*10
            for(let i=0;i<this.downloadSoftwareNumThisWeek.length;i++){
              let num = parseInt(this.downloadSoftwareNumThisWeek[i].downloadCon*100/this.weekDownloadNum)
              this.$set(this.downloadSoftwareNumThisWeek[i],"percentage",num)
            }
          }
          if(this.allDownloadNum.length>0){
            let allNum = Math.ceil(this.allDownloadNum[0].downloadCon/10)
            this.allDownloadNumber = allNum*10
            for(let i=0;i<this.allDownloadNum.length;i++){
              let num = parseInt(this.allDownloadNum[i].downloadCon*100/this.allDownloadNumber)
              this.$set(this.allDownloadNum[i],"percentage",num)
            }
          }
          
        }
      })
      console.log(this.DetectionPass,this.DetectionReject)
    },
    listStatisticsPic3456() {
      analysis.listStatisticsPic3456().then(response => {
        if(response.code == 200){
          let listStatisticsList = JSON.parse(JSON.stringify(response.data))
          if(listStatisticsList.length > 0){
            listStatisticsList.forEach(element => {
              if(element.form3){
                this.goodSoftwareAndFragmentThisMonth = JSON.parse(JSON.stringify(element.form3))
              }else if(element.form4){
                this.allGoodSoftwareAndFragment = JSON.parse(JSON.stringify(element.form4))
              }else if(element.form5){
                this.badSoftwareAndFragmentThisMonth = JSON.parse(JSON.stringify(element.form5))
              }else if(element.form6){
                this.allBadSoftwareAndFragment = JSON.parse(JSON.stringify(element.form6))
              }
            });
          }
        }
      })
    },
    listStatisticsPic78() {
      analysis.listStatisticsPic78().then(response => {
        if(response.code == 200){
          let listStatisticsList = JSON.parse(JSON.stringify(response.data))
          if(listStatisticsList.length > 0){
            listStatisticsList.forEach(element => {
              if(element.form7){
                this.DetectionPass = JSON.parse(JSON.stringify(element.form7.list))
              }else if(element.form8){
                this.DetectionReject = JSON.parse(JSON.stringify(element.form8.list))
              }
            });
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subTitle{
  font-size:14px;
  margin-left: 20px;
  color:rgba(0, 0, 0, 0.45)
}
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;
  margin-top: 20px;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
::v-deep .bangdan{
  .el-table th.is-leaf, .el-table td{
    border: 0px;
  }
}

.softwareDownloadFont .cell .el-row .el-col {
  font-size: 14px !important;
}
::v-deep .el-progress-bar__inner{
  background: linear-gradient(90deg, #ededed 0%, rgb(43, 181, 110) 100%);
}
</style>
