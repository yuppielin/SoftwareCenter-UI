<template>
<div>
    <el-dialog
    title="软件关联关系"
    width="900px"
    :visible.sync="visible"
    :before-close="beforeClose"
    >
      <div id="echartMain" style="height:500px;width:500px;float:left;"></div>
      <div style="float:left;width:300px;height:500px;">
        <div style="margin-bottom:10px;">
          <el-button v-if="downloadDataList.length>0"  type="primary" size="mini" @click="batchDownload" :loading="loading">批量下载</el-button>
          <el-button
            v-if="selectedItmes.length>0"
            size="mini"
            type="warning"
            @click="pushSoft "
          >批量推送入段库</el-button>
        </div>
        <div style="overflow-y: auto;height:470px;">
          <el-table  :data="echartData.nodes" :row-key = "getRowKeys" ref="mutipleTable" @selection-change="handleItemSelection">
            <el-table-column  :selectable="checkBoxSelect" label="下载" type="selection" :reserve-selection = "true" width="50"></el-table-column>
            <!-- <el-table-column  :selectable="true" type="selection" :reserve-selection = "true" width="50"></el-table-column> -->
            <el-table-column align="center" header-align="center" label="软件名称" prop="name" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="软件类型" prop="softwareType">
              <template slot-scope="{row}">
                <span v-if="row.softwareType==2">软件段</span>
                <span v-else-if="row.softwareType==3">业务软件</span>
                <span v-else-if="row.softwareType==1">通用软件</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog
        title="软件段推送"
        width="30%"
        :visible.sync="dialogSoftVisible"
        :close-on-click-modal="false"
        >
        <el-form
        ref="dataPushSoftForm"
        :model="dataPushSoftForm"
        label-width="100px"
        size="small"
        style="text-align:left;"
        >
          <el-form-item label="段库名称" prop="name" style = "margin-bottom:20px">
            <el-select  ref = "selectSoft" value-key = "id" v-model="dataPushSoftForm.options" style="width:400px" placeholder="请选择段库名称" clearable size="small" @change="getSelectNode">
                    <el-option
                      v-for = "option in selectNodeOptions"
                      @click.native = "pushAddress"
                      :key = "option.id"
                      :value = "option"
                      :label = "option.name"
                    />
            </el-select>
          </el-form-item>
          <el-form-item label="段库地址" prop="address" style = "margin-bottom:15px">
            <el-input style="width:400px" v-model="dataPushSoftForm.address" placeholder="请输入段库地址 " />
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
            // this.initEcharts();
            this.getSoftwareRelation();
        })
      }

    },
  },
  created() {
    // this.getSoftwareTimeline()

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

        let option = {
            series:[{
                type: 'graph',
                layout: 'force',
                symbolSize: 20,
                symbol:'circle',
                roam:false,
                edgeSymbol: ["none", "arrow"],
                force: {
                    repulsion: 500
                },
                itemStyle: {
                    color: "#a1a1a1"
                },
                label: {
                    show: true,
                    position: "bottom",
                    distance: 5,
                    fotSize: 18,
                    align: "center"
                },
                nodes: nodes,
                links: links,
                linkStyle: {
                    opacity: 0.9,
                    width:2,
                    curveness:0
                }
            }]
        }
        this.myChart.setOption(option)
    },
    getSoftwareRelation() {

        let versionId = this.data.id;
        software.getSoftwareRelation(versionId).then(response => {
          if (response.code === 200) {
            this.echartData = response.data;
            this.initEcharts();
          }
        });
    },
    beforeClose() {
      this.$emit("closeSoftwareRelation");
    },

  //获取节点
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
     //段库option点击 名称点击有bug。
    pushAddress(){
      // this.dataPushSoftForm.id = this.$refs.selectSoft.selectedLabel
      this.dataPushSoftForm.id = this.dataPushSoftForm.options.id;
      this.dataPushSoftForm.address = this.dataPushSoftForm.options.address;
      this.dataPushSoftForm.name = this.dataPushSoftForm.options.name;
    },
    //版本option点击
    pushSoftVersion(){
      console.log("版本option点击");
      console.log(this.dataPushSoftForm.softVersion);
      this.softVersionPushId = this.dataPushSoftForm.softVersion.id;
      this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersion.version;

      // this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersions.version;
      // this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersions.version;
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
    //跨页多选
    getRowKeys(row){
      // console.log("row")
      // console.log(row)
      return row.id;
    },
     //业务软件可选
    checkBoxSelect(row,index){
      // if(row.softwareType == 2){
        return true;
      // }else{
      //   return false;
      // }
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
     //推送
    pushSoftConfirm(){
      this.pushLoading = true
      let fragBodyDataList = [];
      // debugger
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
              // this.$message.error('软件段推送失败！');
              this.pushLoading = false;
        })
      }

      // this.cleanDialog();
      // this.$refs.dataPushSoftForm.resetFields();
      // this.dialogSoftVisible = false;
      // this.$refs.mutipleTable.clearSelection();
      // if(this.isAll == true){
      //   this.isAll = false;
      // }
    },
     batchDownload() {
      this.loading = true;
      if (this.downloadDataList.length > 0) {
        this.downloadDataList.forEach((item, index) => {
          // this.downloadSoftware({id:item.versionId})
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
      } else {
        this.$message.warning("没有选择软件");
      }
      this.loading = false;
      // this.downloadDataList = []
    },
  }

}
</script>

<style scoped >
</style>
