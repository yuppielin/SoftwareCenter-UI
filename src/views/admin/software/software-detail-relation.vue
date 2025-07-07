<template>
<div>
    <el-dialog
    title="软件谱系关系"
    width="1000px"
    :visible.sync="visible"
    :before-close="beforeClose"
    class="relation-dialog"
    >
      <div class="relation-container">
        <!-- 左侧关系图 -->
        <div class="chart-container">
          <div id="echartMain"></div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="circle-dot normal"></span> 通用软件
            </div>
            <div class="legend-item">
              <span class="circle-dot segment"></span> 软件段
            </div>
            <div class="legend-item">
              <span class="arrow-line"></span> 依赖关系
            </div>
          </div>
        </div>

        <!-- 右侧软件列表 -->
        <div class="software-list">
          <div class="list-header">
            <h4>相关软件列表</h4>
            <div class="action-buttons">
              <el-button v-if="downloadDataList.length>0" type="primary" size="small" @click="batchDownload" :loading="loading" icon="el-icon-download">批量下载</el-button>
              <!-- <el-button
                v-if="selectedItmes.length>0"
                size="small"
                type="warning"
                @click="pushSoft"
                icon="el-icon-upload2"
              >批量推送入段库</el-button> -->
            </div>
          </div>

          <div class="table-container">
            <el-table
              :data="echartData.nodes"
              :row-key="getRowKeys"
              ref="mutipleTable"
              @selection-change="handleItemSelection"
              stripe
              border
              height="430px"
            >
              <el-table-column :selectable="checkBoxSelect" label="下载" type="selection" :reserve-selection="true" width="50"></el-table-column>
              <el-table-column align="center" header-align="center" label="软件名称" prop="name">
                <template slot-scope="{row}">
                  <el-tooltip class="item" effect="dark" :content="row.name" placement="top-start" :disabled="row.name.length <= 10">
                    <div class="software-name-cell">{{row.name}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="软件类型" prop="softwareType" width="100">
                <template slot-scope="{row}">
                  <el-tag size="small" :type="row.softwareType==2 ? 'success' : 'primary'">
                    {{ row.softwareType==2 ? '软件段' : row.softwareType==1 ? '通用软件' : '--' }}
                  </el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" header-align="center" label="操作" width="80">
                <template slot-scope="{row}">
                  <el-button type="text" size="small" @click="viewDetail(row)">查看</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="软件段推送"
      width="500px"
      :visible.sync="dialogSoftVisible"
      :close-on-click-modal="false"
      class="push-dialog"
    >
      <el-form
        ref="dataPushSoftForm"
        :model="dataPushSoftForm"
        label-width="100px"
        size="small"
      >
        <el-form-item label="段库名称" prop="name">
          <el-select
            ref="selectSoft"
            value-key="id"
            v-model="dataPushSoftForm.options"
            style="width:100%"
            placeholder="请选择段库名称"
            clearable
            size="small"
            @change="getSelectNode"
          >
            <el-option
              v-for="option in selectNodeOptions"
              @click.native="pushAddress"
              :key="option.id"
              :value="option"
              :label="option.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="段库地址" prop="address">
          <el-input v-model="dataPushSoftForm.address" placeholder="请输入段库地址" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogSoftVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="pushSoftConfirm()" :loading="pushLoading">确认</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import echarts  from 'echarts'
import * as software from "@/api/software";
import * as deployPosture from '@/api/deploy-posture';

export default {
  name: 'software-relation',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      pushLoading: false,
      myChart: null,
      visible: false,
      echartData:{},
      dialogSoftVisible: false,
      selectNodeOptions: [],
      dataPushSoftForm:{
          id:null,
          name: "",
          address: "",
          softName:"",
          softVersion:"",
          softVersions:[],
          options:[],
      },
      isAll:false,
      downloadDataList:[],
      selectedItmes:[]
    }
  },
   watch: {
    dialogVisible(newVal, oldVal) {
      this.visible = newVal;
      if (newVal) {
        this.$nextTick(() => {
            this.getSoftwareRelation();
        })
      }
    },
  },
  created() {
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSelectNode();
    console.log("datadata", this.data)
  },
  methods: {
    initEcharts() {
        this.myChart = echarts.init(document.getElementById('echartMain'))
        let nodes = this.echartData.nodes;
        let links = this.echartData.links;

        // 为节点添加不同颜色
        if (nodes && nodes.length > 0) {
          nodes.forEach(node => {
            // 根据软件类型设置不同颜色
            if (node.softwareType === 2) { // 软件段
              node.itemStyle = {
                color: '#67C23A'
              };
            } else if (node.softwareType === 1) { // 通用软件
              node.itemStyle = {
                color: '#409EFF'
              };
            } else {
              node.itemStyle = {
                color: '#909399'
              };
            }
          });
        }

        let option = {
            tooltip: {
              trigger: 'item',
              formatter: function(params) {
                if (params.dataType === 'node') {
                  return `<div style="font-weight:bold">${params.name}</div>` +
                         `<div>类型：${params.data.softwareType === 2 ? '软件段' : params.data.softwareType === 1 ? '通用软件' : '其他'}</div>`;
                } else if (params.dataType === 'edge') {
                  return `<div>${params.data.source} → ${params.data.target}</div>` +
                         '<div>依赖关系</div>';
                }
                return '';
              }
            },
            series:[{
                type: 'graph',
                layout: 'force',
                symbolSize: 30,
                symbol:'circle',
                roam: true,
                edgeSymbol: ["none", "arrow"],
                force: {
                    repulsion: 800,
                    edgeLength: 150
                },
                label: {
                    show: true,
                    position: "bottom",
                    distance: 5,
                    fontSize: 14,
                    color: '#333',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: [3, 5],
                    borderRadius: 3
                },
                nodes: nodes,
                links: links,
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0,
                    color: '#666'
                },
                emphasis: {
                  focus: 'adjacency',
                  lineStyle: {
                    width: 4
                  }
                }
            }]
        }
        this.myChart.setOption(option)
        window.addEventListener('resize', this.resizeChart);
    },
    resizeChart() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    getSoftwareRelation() {
        let versionId = this.data.id;
        software.getSoftwareRelation(versionId).then(response => {
          if (response.code === 200) {
            this.echartData = response.data;
            this.$nextTick(() => {
              this.initEcharts();
            });
          }
        });
    },
    beforeClose() {
      window.removeEventListener('resize', this.resizeChart);
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.$emit("closeSoftwareRelation");
    },
    viewDetail(row) {
      this.$message.info(`查看软件：${row.name}`);
      // 在此添加查看详情逻辑
    },
    getSelectNode(){
      let status = 1;
      deployPosture.getFragmentAddress("",status).then(response => {
          if (response.code === 200) {
            this.selectNodeOptions = response.data;
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    pushAddress(){
      this.dataPushSoftForm.id = this.dataPushSoftForm.options.id;
      this.dataPushSoftForm.address = this.dataPushSoftForm.options.address;
      this.dataPushSoftForm.name = this.dataPushSoftForm.options.name;
    },
    pushSoftVersion(){
      console.log("版本option点击");
      console.log(this.dataPushSoftForm.softVersion);
      this.softVersionPushId = this.dataPushSoftForm.softVersion.id;
      this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersion.version;
    },
    handleItemSelection(val){
      this.selectedItmes = val;
      console.log(this.selectedItmes)

      this.downloadDataList = [];
      if (val.length > 0) {
        val.forEach(item => {
          this.downloadDataList.push({
            softwareId: item.softwareId,
            versionId: item.id,
            name: item.fileName,
            size: item.size,
            type: 1,
            uid: this.userInfo.userId,
          });
        });
      }
    },
    selectAll(){
      if(this.isAll){
        this.$refs.mutipleTable.clearSelection();
      }else{
        this.$refs.mutipleTable.toggleAllSelection();
      }
      this.isAll=!this.isAll
    },
    getRowKeys(row){
      return row.id;
    },
    checkBoxSelect(row,index){
      return true;
    },
    pushSoft() {
      this.selectedItmes.map((item,index) => {
        if(item.softwareType != 2) {
          this.$refs.mutipleTable.toggleRowSelection(item, false)
        }
      });
      if(this.selectedItmes.length==0) {
        this.$message.error("没有选择合适的段软件");
        return
      }
      this.dialogSoftVisible = true
      this.pushLoading = false;
    },
    pushSoftConfirm(){
      this.pushLoading = true
      let fragBodyDataList = [];
      this.selectedItmes = JSON.parse(JSON.stringify(this.selectedItmes))
      console.log("批量上传！")
      console.log(this.selectedItmes)

      this.selectedItmes.map((item,index) => {
        fragBodyDataList.push({
          software_id:item.softwareId,
          version_id:item.id
        });
      });

      if(fragBodyDataList == undefined || fragBodyDataList.length<=0){
          this.$message.error('软件段不能为空，请选择软件段上传！');
      }else {
        let fragBodyData = {
            fragmentRepoId:this.dataPushSoftForm.id,
            fragmentList:fragBodyDataList
        }
        console.log("软件段批量fragBodyData");
        console.log(fragBodyData);
        deployPosture.sendFragmentMore(fragBodyData).then(response => {
          this.pushLoading = false;
          this.dialogSoftVisible = false;
          if (response.code === 200) {
              console.log(response)
              this.$message.success('软件段推送成功！');
          }
        }).catch(() => {
              this.pushLoading = false;
        })
      }
    },
    batchDownload() {
      this.loading = true;
      if (this.downloadDataList.length > 0) {
        this.downloadDataList.forEach((item, index) => {
          software.downloadSoftwareFile(
            this.userInfo.userId,
            item.versionId,
            1
          );
          // 下载软件分卷
          if(item.softwareVersionVolumes) {
            item.softwareVersionVolumes.forEach(element => {
                software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
            });
          }
        });
        this.$message.success('已开始下载所选软件');
      } else {
        this.$message.warning("没有选择软件");
      }
      this.loading = false;
    },
  }
}
</script>

<style scoped>
.relation-dialog ::v-deep .el-dialog__body {
  padding: 10px 20px;
}

.relation-container {
  display: flex;
  height: 500px;
  border-radius: 4px;
  overflow: hidden;
}

.chart-container {
  width: 65%;
  height: 100%;
  position: relative;
  border-right: 1px solid #ebeef5;
  padding-right: 10px;
}

#echartMain {
  width: 100%;
  height: 100%;
}

.chart-legend {
  position: absolute;
  right: 20px;
  top: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  color: #606266;
}

.circle-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.circle-dot.normal {
  background-color: #409EFF;
}

.circle-dot.segment {
  background-color: #67C23A;
}

.arrow-line {
  width: 20px;
  height: 2px;
  background-color: #666;
  margin-right: 8px;
  position: relative;
}

.arrow-line:after {
  content: '';
  position: absolute;
  right: -1px;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 6px solid #666;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.software-list {
  width: 35%;
  height: 100%;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.list-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.push-dialog ::v-deep .el-form-item {
  margin-bottom: 20px;
}

::v-deep .el-tag {
  font-weight: normal;
}

::v-deep .el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

::v-deep .el-table__header th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

/* 添加软件名称单元格的样式 */
.software-name-cell {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px 0;
}

/* 修改tooltip样式使其更加美观 */
::v-deep .el-tooltip__popper {
  max-width: 300px;
  word-break: break-word;
  line-height: 1.5;
  padding: 8px 12px;
}
</style>
