<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <i class="el-icon-s-promotion" style="color: #2098cc;" />
      <span style="font-size:16px;">申请审核/权限申请</span>
    </div>
    <el-card class="custome custome-height" style="position:relative">
      <el-tabs  v-model="activeTab" @tab-click="changeTab">
        <el-tab-pane name="review" label="已通过" ></el-tab-pane>
        <el-tab-pane name="unreview" label="未审核" ></el-tab-pane>
        <el-tab-pane name="reject" label="已驳回" ></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20" style="height: 40px;margin-bottom: 10px;position: absolute;top: 19px;right: 10px;">
        <!-- <el-col :span="12">
          <el-button
            size="small"
            style="color:white"
            :style="{background: this.state === -1?'rgb(12, 95, 46)':'gray'}"
            @click="getReviewDownloadApplyList"
          >已审核
          </el-button>
          <el-button
            size="small"
            style="color:white"
            :style="{background: this.state === 0?'rgb(12, 95, 46)':'gray'}"
            @click="getUnreviewDownloadApplyList"
          >未审核
          </el-button>
        </el-col> -->
        
        <el-col :span="24" style="text-align:right;">
          <el-button   type="primary" size="mini" style="text-align:left;" @click="chooseAll()" v-if="activeTab=='unreview'">全选</el-button>
          <el-button type="primary" size="mini" style="text-align:left;" @click="downloadSoftwareApplyAuditMore(1)" v-if="activeTab=='unreview'">批量通过</el-button>
          <el-button type="primary" size="mini" style="text-align:left;margin-right:6px" @click="downloadSoftwareApplyAuditMore(2)"  v-if="activeTab=='unreview'" >批量驳回</el-button>
          <el-input v-model="search" size="small" style="width:300px" placeholder="请输入软件名称" />
          <el-button type="primary" size="small"  icon="el-icon-search" style="margin-left: 10px;margin-right: 10px;" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
      <!-- <el-table
        :data="softwareData"
        size="mini"
      >
        <el-table-column align="center" header-align="center" width="55" type="index" label="序号" />
        <el-table-column align="center" header-align="center" label="软件名称" prop="softwareName" show-overflow-tooltip /> -->
        <!-- <el-table-column align="center" header-align="center" label="软件版本" prop="version" />
        <el-table-column align="center" header-align="center" label="研制单位" prop="source" show-overflow-tooltip />
        <el-table-column align="center" header-align="center" label="提供单位" prop="offerUnit" show-overflow-tooltip />
        <el-table-column align="center" header-align="center" label="申请人" prop="uname"/>
        <el-table-column align="center" header-align="center" label="申请时间" prop="ctime"> 
          <template slot-scope="{row}">
            <span>{{ parseTime(row.ctime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column v-if="status === 1" align="center" header-align="center" label="状态" prop="applyStatus">
          <template slot-scope="{row}">
            <span v-if="row.applyStatus === 1" style="color:green;">通过</span>
            <span v-else style="color:red;">驳回</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column align="center" header-align="center" label="操作" width="240">
          <template slot-scope="{row}">
            <el-button v-if="row.status==0" size="small" type="text" icon="el-icon-view" @click="showInfo(row)">查看审核</el-button>
            <el-button size="small" type="text" icon="el-icon-delete" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <el-card v-for="(item,index) in softwareData" :key="index" style="margin:8px 0;">
        <el-checkbox v-if="activeTab=='unreview'"  :value="selectionList" :label="item.id" @change="choose(item)">{{""}}</el-checkbox>
        <!-- <el-checkbox v-if="mutipleselect" v-model="selectionList" :label="item.id" @change="choose(item)">{{""}}</el-checkbox> -->
        <el-row :gutter="20">
            <el-col :span="24">
              <el-row>
               
                <el-col :span="2" style="text-align:center;">
                  <img :src="logoAndPicUrl+item.logo+'?imgSource'" :onerror="defaultImg" width="60px" height="60px">
                </el-col>
                <el-col :span="22">
                  <el-row>
                    <el-col :span="12">
                      <div style="font-size:16px;font-weight:600;display:inline-block;width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{item.softwareName}}</div>
                      <el-tag size="mini" style="margin-left:10px;">{{item.version}}</el-tag>
                    </el-col>
                    <el-col :span="12" style="text-align:right;">
                      <el-button v-if="item.status==0" size="mini" type="primary" circle icon="el-icon-s-check" @click="showInfo(item)"></el-button>
                      <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteItem(item)"></el-button>
                    </el-col>
                  </el-row>
                    <el-row :gutter="10" style="margin-top:5px;">
                      <el-col :span="4">
                        <span class="subTitle" style="margin-left:0">研制单位：{{item.source?item.source:'-'}}</span>
                      </el-col>
                      <el-col :span="4">
                        <span class="subTitle">提供单位：{{item.offerUnit}}</span>
                      </el-col>
                      <el-col :span="4">
                        <span class="subTitle">申请人员：{{item.uname}}</span>
                      </el-col>
                      <el-col :span="4">
                        <span class="subTitle">申请时间：{{item.ctime|parseTime('{y}-{m}-{d} {h}:{m}:{s}')}}</span>
                      </el-col>
                    </el-row>
                </el-col>
              </el-row>
            </el-col>
        </el-row>
      </el-card>
      <el-pagination
        background
        style="margin-top:15px;"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script>
import * as software from '@/api/software'
// import * as appConfig from "/public/config";

export default {
  data() {
    return {
      show:'',
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      software: {},
      selectionList:[],
      selectionListApply:[],
      checkstatus:false,
      applyList:[],
      activeTab: "review",
      search: '',
      softwareData: [],
      userInfo: {},
      status: 1,
      imgSource: require('@/assets/index/softwareDefault.png'),
      defaultImg: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getDownloadApplyList()
   
  },
  methods: {
    
    
    changeTab() {
      this.softwareData = [];
      if(this.activeTab == "review"){
        this.getReviewDownloadApplyList()
        this.show=1
      }else if(this.activeTab == "reject"){
        this.getRjectDownloadApplyList();
        this.show=0
      }else{
        this.getUnreviewDownloadApplyList()
        this.show=0
      }
    },
    getUnreviewDownloadApplyList() {
      this.status = 0
      this.getDownloadApplyList()
    },
    getReviewDownloadApplyList() {
      this.status = 1
      this.getDownloadApplyList()
    },
    getRjectDownloadApplyList() {
      this.status = 2
      this.getDownloadApplyList()
    },
    getDownloadApplyList() {
      this.$modal.loading();
      software.getDownloadSoftwareApplyList({status:this.status, ...this.page, keyword:this.search}).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.page.total = response.data.total
        }
        this.$modal.closeLoading();
      })
    },
    showInfo(item) {
      this.$router.push({
        path: '/admin/software/applyreview/',
        query: { id: item.id }
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getDownloadApplyList()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getDownloadApplyList()
    },
    deleteItem(item) {
      this.$confirm('确定删除该软件？', '提示', {}).then((e) => {
        software.deleteDownloadSoftwareApply(item.id).then(response => {
        if (response.code === 200) {
            this.page.pageNum = 1;
            this.getDownloadApplyList()
          }
        })
      })
    },
    indexOf(val,ids){
      for(let i =0 ;i<ids.length;i++){
        if(ids[i] === val){
          return i;
        }else{
          return -1;
        }
      }
    },
    chooseAll(){
      software.getDownloadSoftwareApplyList({status:0, ...this.page, keyword:this.search}).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.softwareData.forEach(element => {
          this.selectionList.push(element.id);
          });
          console.log("11111=======",this.selectionList)
        }
      })
    },
   
    choose(item){
      let index = this.indexOf(item.id,this.selectionList);
      if(this.selectionList.length>0&&index>-1){
        this.selectionList.splice(index,1);
      }else{
        // let data = {
        //   id : item.id,
        //   status : 1
        // }
        this.selectionList.push(item.id);
      }
      // this.$emit(this.selectionList)
      console.log("this.selectionList======",this.selectionList)
      
    },
    async downloadSoftwareApplyAuditMore(state) {
      if (this.selectionList.length > 0) {
        for (let item=0;item<this.selectionList.length;item++){
          console.log(item)
           let response = await software.getDownloadSoftwareApplyData(this.selectionList[item])
           if (response.code === 200) {
             console.log(response)
              this.software = response.data
              console.log(this.software)
              let data = {
                id: this.software.applyId,
                status: state,
                opinion: this.software.opinion
              }
              this.selectionListApply.push(data)
            }
        }



        // await this.selectionList.forEach(async (item, index) => {
        //   let response = await software.getDownloadSoftwareApplyData(item)
        //    if (response.code === 200) {
        //      console.log(response)
        //       this.software = response.data
        //       console.log(this.software)

        //       let data = {
        //         id: this.software.applyId,
        //         status: state,
        //         opinion: this.software.opinion
        //       }
        //       this.selectionListApply.push(data)
        //     }



          // .then(response => {
          //   if (response.code === 200) {
          //     this.software = response.data
          //     console.log(this.software)

          //     let data = {
          //       id: this.software.applyId,
          //       status: state,
          //       opinion: this.software.opinion
          //     }
          //     this.selectionListApply.push(data)
          //   }
          // })
        // });
      } else {
        this.$message.warning("没有选择项");
      }
      // debugger
      console.log("this.selectionListApply=========",this.selectionListApply)
      software.auditMore(this.selectionListApply).then(response => {
        if(response.code === 200){
          // debugger
          console.log("this.selectionListApply=========",this.selectionListApply)
          let msg = state ==1 ? '审核通过' : '驳回成功'
          this.$message.success(msg)
          this.getUnreviewDownloadApplyList()
          // this.$router.push('/admin/review/apply')
        }else{
          this.$message.warning("批量审核失败");
        }
      })
    },
    handleSearch() {
      this.page.pageNum = 1;
      this.getDownloadApplyList()
    }
  }
}
</script>

<style scoped>
  el-card {
    border-radius: 4px;
    border: 0px solid #e6ebf5;

  }
   .title{
    border-left: 4px #409eff solid;
    line-height: 40px;
    height: 40px;
    padding-left: 10px;
    font-size: 16px;
    background: #c5d7e9;
 }
  .subTitle{
    height: 12px;
    line-height: 12px;
    border-left: 4px solid #1890ff;
    margin-left: 50px;
    font-size:12px;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
