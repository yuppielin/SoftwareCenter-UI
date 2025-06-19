<template>
  <div class="dashboard-editor-container">
    <el-row style="display: flex;">
      <div style="width: 25%;margin:0 10px 0 0;">
        <el-card class="topCard topCard-3">
          <el-row :gutter="10" >
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview2.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">仓库总数</span>
                <br />
                <span style="font-size: 40px;line-height: 40px;">{{ deployInfoSummary.repoNum }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div style="width: 25%;margin:0 10px;">
        <el-card class="topCard topCard-4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview3.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">软件总数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ deployInfoSummary.segNum }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div style="width: 25%;margin:0 10px;">
        <el-card class="topCard topCard-5">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview4.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">部署总数</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ deployInfoSummary.installedSegNum }}</span>
              </div>
            </el-col>
            
          </el-row>
        </el-card>
      </div>
      <div style="width: 25%;margin:0 0px 0 10px;">
        <el-card class="topCard topCard-6">
          <el-row :gutter="10">
            <el-col :span="8">
              <div>
                <img src="@/assets/index/adminOverview5.png" width="100" height="100" />
              </div>
            </el-col>
            <el-col :span="16">
              <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                <span style="font-size: 16px;line-height: 40px">部署节点</span>
                <br />
                <span
                  style="font-size: 40px;line-height: 40px;"
                >{{ deployInfoSummary.deviceNum }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-row>
    <el-row :gutter="20" style = "margin-top:20px;">
      <el-col :span="4">
        <el-card>
          <div slot="header"  class="padding">
            <i class="el-icon-s-data" style="color: #40a5e9;;" />
            <span>仓库列表</span>
          </div>
          <el-table  id="repo"  :show-header="false" :data="deptOptions" highlight-current-row ref="noticeTable" @row-click="getDeployInfoByRepoName" style="height:calc(100vh - 190px);overflow-y:auto;">
              <el-table-column show-overflow-tooltip>
                <template slot-scope="{row}">
                  <i class="el-icon-coin"></i>
                  {{row.name}}({{row.address}})
                </template>
              </el-table-column>
          </el-table>
          <el-pagination
            :hide-on-single-page="true"
            @current-change="getLeftList"
            :current-page="repoCurrentPage"
            :page-size="repoPageSize"
            :total="repoTotal"
            background
            layout="prev, next" 
          />
        </el-card>
      </el-col>
      <el-col :span="20">
        <!--部署列表-->
        <el-card>
            <el-row :gutter="10" style="height:30px;line-height:30px;">
              <el-col :span="8">
                <i class="el-icon-s-data" style="color: #40a5e9;;" />
                <span>部署软件列表</span>
              </el-col>
              <el-col :span="16" style="text-align:right">
                  <el-select  
                  v-model="selectNodeValue"
                  placeholder="请选择节点" 
                  filterable 
                  clearable 
                  size="small">
                    <el-option 
                      v-for="option in selectNodeOptions"
                      :key="option.deviceName"
                      :value="option.deviceName"
                      :label="option.deviceName"
                    />
                    <div>
                      <el-pagination
                        :hide-on-single-page="true"
                        :current-page="nodeCurrentPage"
                        :page-size="nodePageSize"
                        :total="nodeTotalPage"
                        @current-change="getSelectNode"
                        background
                        layout="prev, next" />
                    </div>
                  </el-select>
                  <el-input style="width:200px;margin:0 10px;"
                    placeholder="请输入软件名称"
                    clearable
                    v-model="softName"
                    size="small"
                    @keyup.enter.native="searchPosture"
                  />                 
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="searchPosture">搜索</el-button>
              </el-col>
            </el-row>
              <el-table max-height="500px" style="margin-top:10px;overflow-y:auto;"
                size="small"
                :border="false"
                :data="deployDetailInfo"
                :header-cell-style="{background:'#2BB56E',height:'40px'}"
                :tree-props="{children:'children',hasChildren:'hasChildren'}"
                row-key="id"
                highlight-current-row
                address
                class="custome"
              >
                <el-table-column type="index" width = "50" align="center" label="序号"/>
                <el-table-column prop="segName"  align="center" label="软件名称" />
                <el-table-column prop="segVer"   min-width = "30%" align="center" label="软件版本" />
                <el-table-column prop="deviceName"  align="center" label="部署节点" />
                <el-table-column prop="deviceIp"  align="center" label="部署IP" />
                <el-table-column prop="installTime" align="center" min-width = "50%" label="部署时间"/>   
            </el-table>
            <el-pagination
              :hide-on-single-page="true"
              style="margin-right:15px;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              background layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-count="totalPage"
            />  
        </el-card>

        <div style="margin-top:20px;">
          <el-row :gutter="20">
            <el-col :span="8">
                <el-card>
                <div slot="header" class="padding">
                    <i class="el-icon-s-data" style="color: #40a5e9;;" />
                    <span>部署节点（频次）</span>
                </div>
                <el-table :data="showNodeInfoList" max-height="500px" :show-header="false" size="small" style="overflow-y:auto;"> 
                  <el-table-column>
                    <template slot-scope="{row}">
                      <el-row :gutter="10">
                        <el-col :span="18">
                          {{row.deviceName}}
                        </el-col>
                        <el-col :span="6" style="text-align:right;">
                         <span style="color:#006eff">{{row.counts}} </span>次
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                </el-table>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                <div slot="header" class="padding">
                    <i class="el-icon-s-data" style="color: #40a5e9;;" />
                    <span>部署排序</span>
                </div>
                 <el-table
                    size="small"
                    :border="false"
                    :data="deployInstallInfo"
                    :header-cell-style="{background:'#2BB56E',height:'40px'}"
                    :tree-props="{children:'children',hasChildren:'hasChildren'}"
                    row-key="id"
                    highlight-current-row
                    style="overflow-y:auto;"
                    address
                    class="custome"
                    max-height="500px"
                    >
                    <el-table-column type="index" width="80" align="center" label="排名"/>
                    <el-table-column prop="segName" align="center" label="软件名称" />
                    <el-table-column prop="segVer" align="center" label="软件版本" />
                    <el-table-column prop="installedCount" align="center" label="部署次数" />
                </el-table>
                <el-pagination
                  :hide-on-single-page="true"
                  style="margin-right:10px;"
                  @size-change="handleSizeChangeSort"
                  @current-change="handleCurrentChangeSort"
                  :current-page="currentPageSort"
                  :page-size="pageSizeSort"
                  background layout="total, sizes, prev, pager, next, jumper"
                  :total="totalSort"
                  :page-count="totalPageSort"
                />
                </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import * as deployPosture from '@/api/deploy-posture';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import * as Modal from '@/plugins/modal';
import { Message, MessageBox, Notification, Loading } from 'element-ui'
   
export default {
  name: "deployPosture",
  components: {

  },
  data() {
    return {
      
      //四个map
      repoId: null,
      fourDataList:[],

      deployInfoSummary:{
        deviceNum:0,
        installedSegNum:0,
        repoNum:0,
        segNum:0
      },
      
      deployInstallInfo:[],
      deployDetailInfo:[],
      //分页
      repoCurrentPage: 1,
      repoPageSize: 10,
      repoTotal: 0,

      nodeCurrentPage:1,
      nodePageSize: 10,
      nodeTotalPage: 0,

      pageSize: 10,
      totalPage:1,
      currentPage:1,
      total:0,
      tagDetail:false,
      currentPageSort:1,
      pageSizeSort: 10,
      totalPageSort:1,
      totalSort:0,

      nodeName:'',
      searchName:'',
      softName:'',
      selectNodeValue:'',
      selectNodeOptions:[],
      hotTs: [],

      showNodeInfoList:[],
      
      // 左侧部门信息Tree
      deptOptions: [],
      deptTreeProps: {
        label: 'name',
        children: 'children',
        disabled: function(data, node) {
          if(data.children&&data.children.lenght>0) {
            return true;
          }else{
            return false;
          }
        }
      },
    };
  },
  mounted(){

    this.getDeploymentData();
    // this.getSelectNode(1);
    this.dealWithNodeInfo();
    this.getDeployDetailInfo();
    this.getDeployInstallInfo();
    this.getLeftList(1);
  },

  methods:{
    async dealWithNodeInfo() {
      deployPosture.getDeployNodeInfo(1,10).then(response => {
        if (response.code === 200) {
          this.showNodeInfoList = JSON.parse(JSON.stringify(response.data.records))
          this.selectNodeOptions = JSON.parse(JSON.stringify(response.data.records))
        }
      })
      .catch(function(error) {
        console.log(error)
      })
    },
    // 节点数
    getDeploymentData(){
      deployPosture.getDeploymentData().then(response => {
        if(response.code==200){
          this.deployInfoSummary.deviceNum = response.data.deviceNum;
          this.deployInfoSummary.installedSegNum = response.data.installedSegNum;
          this.deployInfoSummary.repoNum = response.data.repoNum;
          this.deployInfoSummary.segNum = response.data.segNum; 
        }
      }).catch(function(error) {
          console.log(error)
      })
    },
    // 部署软件列表
    getDeployDetailInfo(){
      // this.pageSize = 10;
      deployPosture.getDeployDetailInfo(this.nodeName,this.searchName,this.currentPage,this.pageSize).then(response => {
        if(response.code==200){
          this.deployDetailInfo = response.data.segDeviceList;
          this.total = response.data.pageInfo.total;
          this.totalPage = response.data.pageInfo.size;
        }
      }).catch(function(error) {
          console.log(error)
      })
    },
    
    //部署排序
    getDeployInstallInfo(){
      deployPosture.getDeployInstallInfo(this.repoId, this.currentPageSort,this.pageSizeSort).then(response => {
        if(response.code==200){
          this.deployInstallInfo = response.data.records;
          this.totalSort = response.data.total;
          this.totalPageSort = response.data.size;
        }
      }).catch(function(error) {
          console.log(error)
      })
    },

    //左边列表
    getLeftList(val){
      this.repoCurrentPage = val
      deployPosture.getFragmentAddress('','',this.repoCurrentPage,this.repoPageSize).then(response => {
        if(response.code==200){
          this.deptOptions = response.data.list;
          this.repoTotal = response.data.total;
          // this.totalSort = response.data.total;
          // this.totalPageSort = response.data.totalPageSort;
        }
      }).catch(function(error) {
          console.log(error)
      })
    },

    //点击左边刷新全部
    getDeployInfoByRepoName(noticeTable){
      console.log("noticeTable:")
      console.log(noticeTable)
      // this.$modal.loading();

      // 重置
      this.nodeCurrentPage = 1
      this.currentPage = 1;
      this.total = 0;

      this.currentPageSort = 1;
      this.totalSort = 0;

      this.showNodeInfoList = [];
      this.selectNodeOptions = [];
      this.selectNodeValue = '';
      this.deployInstallInfo = [];
      this.deployDetailInfo = [];
      this.deployInfoSummary = {
                                deviceNum:0,
                                installedSegNum:0,
                                repoNum:0,
                                segNum:0
                              };
      
      this.tagDetail = true;
      this.repoId = noticeTable.id;
      deployPosture.getDeployInfoByRepoName(this.repoId).then(response => {

        // this.$modal.loading();

          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            // this.dataForm.companyId = response.data.id
            console.log(response)
            this.fourDataList = response.data
            // 有数据
            
            if(response.data.length > 0){

              console.log("response.data[1]");              
              console.log(response.data[1]);
              console.log(response.data[1].deploy_node_info);
              if(response.data[1].deploy_node_info === null){
                MessageBox.alert("该段库信息为空，请选择其他段库！", "系统提示");

              }else{
                this.fourDataList.forEach(item => {
                  if (item.deploy_info_summary) {
                    
                    if(Object.keys(item.deploy_info_summary).length > 0 ){
                      
                      let infoSummary = item.deploy_info_summary;
                      this.deployInfoSummary.deviceNum = infoSummary.deviceNum;
                      this.deployInfoSummary.installedSegNum = infoSummary.installedSegNum;
                      this.deployInfoSummary.repoNum = infoSummary.repoNum;
                      this.deployInfoSummary.segNum = infoSummary.segNum;
                    
                    }
                    //部署节点
                  }else if(item.deploy_node_info){
                    if(Object.keys(item.deploy_node_info).length > 0 ){
                      this.showNodeInfoList = item.deploy_node_info.records;
                    }
                    //部署排序
                  }else if(item.deploy_install_info){
                    if(Object.keys(item.deploy_install_info).length > 0 ){
                      this.deployInstallInfo = item.deploy_install_info.records;
                      this.totalSort = item.deploy_install_info.total;
                      this.totalPageSort = item.deploy_install_info.size;
                    }
                    //部署软件列表
                  }else if(item.deploy_detail_info){
                    if(Object.keys(item.deploy_detail_info).length > 0 ){
                      this.deployDetailInfo = item.deploy_detail_info.segDeviceList;
                      this.total = item.deploy_detail_info.pageInfo.total;
                      this.totalPage = item.deploy_detail_info.pageInfo.size;
                    }
                  }
                });
                this.getSelectNode(1);
              }
             
            }else{
              
            }
           
          }
        })
        .catch((error) => {
          this.$modal.closeLoading();

          let content = '无对应段库，请选择其他段库!';
          // Message.error(content)
          MessageBox.alert(content, "系统提示", { type: 'error' })
    
          console.log(error)
        })
    },

    //获取节点
    getSelectNode(pageIndex){
      this.nodeCurrentPage = pageIndex
      deployPosture.getDeployNodeByRepoId(this.repoId, pageIndex,this.nodePageSize).then(response => {
          if (response.code === 200) {
            if(response.data&&response.data[0]&&response.data[0].deploy_node_info){
              this.selectNodeOptions = response.data[0].deploy_node_info.records
              this.nodeTotalPage = response.data[0].deploy_node_info.total
            }
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    //获取节点
    getShowNode(){
      deployPosture.getDeployNodeInfo(1,10).then(response => {
          if (response.code === 200) {
            this.showNodeInfoList = response.data.records
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    
    //搜索点击
    searchPosture(){

      this.nodeName = this.selectNodeValue;
      this.searchName = this.softName;
      console.log("this.repoId")
      console.log(this.repoId)
      this.currentPage = 1;
      deployPosture.getDeployDetailInfoByRepoId(this.repoId,this.nodeName,this.searchName,this.currentPage,this.pageSize).then(response => {
          if (response.code === 200) {
            console.log(response)
            this.deployDetailInfo = response.data.segDeviceList;
            this.total = response.data.pageInfo.total;
            this.totalPage = response.data.pageInfo.size;
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      // this.getDeployDetailInfo();

    },
    //分页对应仓库
    pageDetailInfoByRepoId(){
        deployPosture.getDeployDetailInfoByRepoId(this.repoId,this.nodeName,this.searchName,this.currentPage,this.pageSize).then(response => {
          if (response.code === 200) {
            console.log(response)
            this.deployDetailInfo = response.data.segDeviceList;
            this.total = response.data.pageInfo.total;
            this.totalPage = response.data.pageInfo.size;
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },

     // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      if(this.tagDetail == false){
        this.getDeployDetailInfo();
      }else{
        this.pageDetailInfoByRepoId();
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      if(this.tagDetail == false){
        this.getDeployDetailInfo();
      }else{
        this.pageDetailInfoByRepoId();

      }
      
    },  
    
    handleSizeChangeSort(val) {
      this.pageSizeSort = val;
      this.currentPageSort = 1;
      // if(this.tagDetail == false){
        this.getDeployInstallInfo();

      // }
    },

    handleCurrentChangeSort(val) {
      this.currentPageSort = val;
      // if(this.tagDetail == false){
        this.getDeployInstallInfo();

      // }
    },

  },
}



</script>
<style scoped lang="scss">

  .el-divider--vertical{
    display:inline-block;
    width:1px;
    height:520px;
    margin:0 9px;
    vertical-align:middle;
    position:relative;
  }
  .dashboard-editor-container {
  padding: 0px 20px 20px 20px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
::v-deep #repo .el-table__body {
  tr.current-row {
    background: rgba(23, 138, 227, 0.05);
    border-left: 2px solid rgb(23, 138, 227);
    td {
      background: rgba(23, 138, 227, 0.05);
      border-left: 3px solid rgb(23, 138, 227);
    }
  }
  tr{
    cursor: pointer;
  }
}
</style>