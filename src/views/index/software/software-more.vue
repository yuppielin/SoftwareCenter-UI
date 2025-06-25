<template>
  <div  id="software-list" style="margin:20px;">
    <el-card style="margin-top:10px;">
      <div slot="header" style="padding:10px">
        <el-row :gutter="20">
          <el-col :span="12">
            <i class="el-icon-menu" style="color:#05994e;font-size:16px;margin-right:5px;line-height:28px"/> {{typeName}} <span v-if="childService!='全部'"> - {{childService}}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-input
              v-model="queryStr"
              placeholder="请输入关键字搜索"
              style="width: 260px;color: #000000;border-radius:20px;box-shadow: 0 2px 6px rgba(0,0,0,0.15);"
              @blur="getSoftwareList"
            >
              <el-button slot="append" icon="el-icon-search" type="mini" @click="getSoftwareList">搜索</el-button>
            </el-input>
            <!-- <el-input v-model="queryStr" @select="getSoftwareList" @change="getSoftwareList" size="mini" style="width:200px;" suffix-icon="el-icon-search" placeholder="请输入关键字" /> -->
            <!-- <el-autocomplete
              class="inline-input"
              v-model="queryStr"
              :fetch-suggestions="querySearch"
              style="width: 260px;"
              placeholder="请输入关键字(名称、版本)"
              @select="getSoftwareList"
              @change="getSoftwareList"
            ></el-autocomplete> -->
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="20">
            <div id="categroy-nav" style="height:30px;line-height:30px;">
              <el-link :underline="false" class="categroy-nav-item" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent=='全部'}]" @click="handleCategoryChange(null)">全部</el-link>
              <el-link v-for="item in typeData" :key="item.id" :underline="false" :class="['categroy-nav-item',{'categroy-nav-curr':isCurrent==item.name}]" @click="handleCategoryChange(item)" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{ item.name }}</el-link>
              <!-- <el-button  v-for="item in typeData" :key="item.id" style="margin:0 5px;background:rgb(48, 65, 86);color:white;" size="mini">{{ item.name }}</el-button>-->
            </div>
<!--            <el-button type="primary" size="mini" style="margin-right:5px;">全部</el-button>-->
<!--            <el-button v-for="item in typeData" :key="item.id" style="margin:0 5px;background:rgb(48, 65, 86);color:white;" size="mini">{{ item.name }}</el-button>-->
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button type="primary" size="mini" @click="downloadMore">批量下载</el-button>
          </el-col>
        </el-row>

      </div>
    </el-card>
    <div style="margin-top:10px;" >
      <el-row :gutter="10">
        <el-col :span="6"  v-for="(item,index) in softwareData" :key="index">
          <Sitem  :data="item"/>
        </el-col>
      </el-row>
      <div v-if="softwareData.length==0" style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')"  style="height:600px"></el-image>
      </div>
    </div>
    <el-pagination
      hide-on-single-page
      style="margin-top:20px;text-align:right;clear:both"
      :current-page.sync="currentPage"
      :page-size= pageSize
      background
      prev-text="上一页"
      next-text="下一页"
      layout="total, prev, pager, next,jumper"
      :total= total
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <div style="position:fixed;top:50%;right:0px;background-color:#2365e8;color:#fff;font-weight:white;padding:3px 5px;cursor: pointer;transform: perspective(0.5em) rotateY(-3deg) translateY(-50%)" @click="dataVisible=true">
      <i class="el-icon-d-arrow-left" ></i>
      <br/>
      业<br/>务<br/>资<br/>料
    </div>
    <el-drawer style="margin-top:70px;margin-bottom:10px;"
      :visible.sync="dataVisible" 
      title="业务资料" 
      direction="rtl" 
      size="30%"
      :modal='false'
      >
        <SoftwareMoreData />
    </el-drawer>
  </div>
</template>
<script>
import Sitem from '../components/software-item.vue'
import SoftwareMoreData from "./software-more-data";
import * as software from '@/api/software'
import * as category from '@/api/category'
export default {
  components: {
    Sitem,
    SoftwareMoreData
  },
  data() {
    return {
      typeData: [],
      softwareData: [],
      currentPage: 1,
      pageSize: 12,
      total: 0,
      queryStr: null,
      userInfo: {},
      isCurrent: '全部',
      currentCategory: {},
      service:null,
      childService:null,
      typeName:null,
      dataVisible:false,
    }
  },
  async mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // this.getSearchRecord()
    this.service=this.$route.query.service
    // this.isCurrent=this.$route.query.childService
    if(this.$route.query.childService != "") {
      this.isCurrent= "全部"
    }
    this.typeName=this.$route.query.title;
    this.childService=this.$route.query.childService;
    await this.getSoftwareTypeData()
    await this.getSoftwareList()
  },
  // watch: {
  //   service: {
  //     deep:true,
  //     handler:()=>{
  //       this.service=this.$route.query.service
  //       this.getSoftwareTypeData()
  //     }
  //   },
  //   isCurrent: {
  //     deep:true,
  //     handler:()=>{
  //       this.childService=this.$route.query.childService
  //       this.getSoftwareList()
  //     }
  //   }
  // },
  methods: {
    handleCategoryChange(item) {
      if (item) {
        this.isCurrent = item.name
      } else {
        this.isCurrent = '全部'
      }
      this.getSoftwareList()
    },
   async getSoftwareList() {
    //  console.log(this.isCurrent,this.typeData,"isCurrent typeData")
      if (this.queryStr) {
        this.addSearchRecord(this.queryStr)
      }
      let categoryId = null
      if(this.service!=null){
          categoryId=this.service
      }
      if (this.isCurrent !== '全部') {
        categoryId = this.typeData.find(item => item.name === this.isCurrent).id
      }
      let type=null;
      if(this.typeName=='通用软件'){
        type="common";
      }else if(this.typeName=='软件模型'){
        type="module";
      }else{
        type="service"
      }
     
     this.$modal.loading();
     await software.getSoftwareListByCategory(this.userInfo.userId, type,categoryId, this.queryStr, 1, 1, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.$modal.closeLoading();

          this.softwareData = response.data.list
          this.total = response.data.total
          // this.getSearchRecord()
        }
      }).catch(err => {
        this.$modal.closeLoading();
        console.log(err)
      })
    },
    querySearch(queryString, cb) {
      const restaurants = this.searchRecordList
      const searchRecords = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      const results = searchRecords.map(item => ({ value: item }))
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    addSearchRecord(keyword) {
      software.addSearchRecord(keyword, this.userInfo.userId).then(response => {
      })
    },
    getSearchRecord() {
      software.getSearchRecord(this.userInfo.userId, 30).then(response => {
        if (response.code === 200) {
          this.searchRecordList = response.data
        }
      })
    },
    // 获取成果类型
    async getSoftwareTypeData() {
      await category.getHotCategoryList(100, this.service).then(response => {
        this.typeData = response.data.list
        console.log(this.typeData, "this.typeData")
      }).catch(err => {
        console.log(err)
      })
      // category.getHotCategoryList(10, 7).then(response => {
      //   this.typeData = response.data.list
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getSoftwareList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSoftwareList()
    },
    downloadMore() {
      let type=null;
      if(this.typeName=='通用软件'){
        type="common";
      }else if(this.typeName=='软件模型'){
        type="module";
      }else{
        type="service"
      }
      let category=null;
      if (this.isCurrent !== '全部') {
        category = this.typeData.find(item => item.name === this.isCurrent).id
      }else{
        category = this.service;
        // if(type=="common"){
        //   category="91"
        // }else{
        //   category="20"
        // }
      }
      this.$router.push({
        path: '/index/software-download-more',
        query:{
          type:type,
          category:category
        }
      })
    }
  }
}
</script>
<style scoped>
 #software-list >>> .el-drawer__header{
    height:60px;
    line-height:60px;
    background: url('~@/assets/index/header.png'), #2365e8;
    background-size: cover;
    background-blend-mode: multiply;
    color: white;
    padding: 0 10px;
    margin-bottom: 15px;
  }
  .categroy-nav-item{
    /* width: 95px; */
    padding: 0px 10px;
    float: left;
    color:#000;
    /* background-color: #035678; */
    margin-left: 10px;
    margin-bottom: 5px;
  }
  .categroy-nav-item:hover{
    background:#05994e;
    color: white;
    border-radius: 4px;
  }
  .categroy-nav-curr{
    background: #05994e;
    color: white;
    border-radius: 4px;
  }

  /* 深度选择器使用 /deep/ 代替旧的 >>> */
  /deep/ :focus {
    outline: 0;
  }
  
  /deep/ .el-input--medium .el-input__inner {
    height: 28px;
    line-height: 28px;
  }

  /deep/ .el-input__inner {
    border-radius: 20px;
    border: solid 1px #2bb56e;
    color: #000000;
    padding-left: 35px;
    height: 36px;
    font-size: 14px;
    transition: all 0.3s;
    background-color: #f9f9f9;
  }
  
  /deep/ .el-input__inner:focus {
    border: solid 1px #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  /deep/ .el-input__prefix {
    left: 10px;
    color: #2bb56e;
  }
  
  /deep/ .el-input-group__append {
    background-color: #05994e;
    border-color: #05994e;
    color: white;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  
  /deep/ .el-input-group__append:hover {
    background-color: #05994e;
    border-color: #05994e;
  }
</style>
