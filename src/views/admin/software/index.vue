<template>
<div class="app-container">
    <div class="cur-top-admin">
      <img class="icon" src="@/assets/index/softwareManage.png" />
      <span class="title" >软件管理</span>
    </div>
  <el-card style="height:calc(100vh - 140px);overflow-y:auto">
    <div style="margin-bottom:10px;height: 40px;">
      <!-- 服务器信息 -->
      <el-row :gutter="10" v-if="appConfig.serverInfoSwitch===true">
        <el-col :span="6">
          <el-card class="topCard" style="background-color:lightblue">
            <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i> 服务器总存储空间</div>
            <div class="topNum">{{serverInfo.sys.total}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="topCard" style="background-color:lightblue">
            <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i> 服务器可用存储空间</div>
            <div class="topNum">{{serverInfo.sys.free}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="topCard" style="background-color:lightblue">
            <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i> 服务器总内存</div>
            <div class="topNum">{{serverInfo.mem.total}}GB</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="topCard" style="background-color:lightblue">
            <div class="topTitle"><i style="color: orange;" class="el-icon-s-help"></i> 服务器可用内存</div>
            <div class="topNum">{{serverInfo.mem.free}}GB</div>
          </el-card>
        </el-col>
      </el-row>

      <el-col :span="12" style="margin-top:10px">
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="goToSoftwareUpload"
        >软件上传</el-button>
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="goToFragmentUpload"
        >软件段上传</el-button>

        <!-- <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="warning"
          @click="goToBatch"
        >软件段批量上传</el-button> -->
      </el-col>

      <el-col :span="$checkPermission(['admin','XTUser'])?12:24" style="text-align: right;margin-top:10px">
        <el-form :inline="true">
          <!-- <el-form-item>
            <el-select v-model="search.system" filterable clearable placeholder="请选择软件所属系统">
              <el-option
                v-for="(item,index) in sysData"
                :key="index"
                :value="item.id"
                :label="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <treeselect
              :normalizer="normalizer"
              v-model="search.service"
              noResultsText="暂无数据"
              value-consists-of="ALL"
              :options="softwareOptions"
              :appendToBody="true"
              z-index="9999"
              placeholder="请选软件分类 "
              clearable
              :style="{ width: '180px'}"
              @select="selectChange"
            ></treeselect>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              class="inline-input"
              v-model="search.keyword"
              :fetch-suggestions="querySearch"
              style="width: 100%"
              placeholder="请输入软件名称段前缀"
              @select="getSoftwareList"
              @change="getSoftwareList"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="getSoftwareList">搜索</el-button>
            <el-button size="small" type="reset"  @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <el-table :show-header="false"  :data="reviewData" :row-key = "getRowKeys" ref="mutipleTable">
      <el-table-column>
        <template slot-scope="{row}">
        <el-row :gutter="20" style="margin:10px 0;">
          <el-col :span="5" style="display: flex;">
            <el-row>
              <el-col :span="12">
                <img
                  :src="logoAndPicUrl+row.versionData.logo"
                  :onerror="defaultImg"
                  width="60px"
                  height="60px"
                />
              </el-col>
              <el-col :span="12" style="line-height:1.5">
                <div
                  style="cursor: pointer;font-size:16px;font-weight:600;display:inline-block;width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;color:#1e7d34;"
                  @click="showRelation(row.versionData)"
                >{{row.name}}</div>
                <el-select
                  v-model="row.versionId"
                  size="mini"
                  style="display:inline-block;width:100px;"
                  class="version"
                >
                  <el-option
                    v-for="(version,index) in row.versions"
                    :key="index"
                    :value="version.id"
                    :label="version.version"
                    @click.native="getVersionIndex(version, row)"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <!-- <el-col :span="3" style="line-height:2.0">
            <span class="subTitle">段前缀</span>
            <br />
            <span class="subContent">{{row.versionData.prefix?row.versionData.prefix:'-'}}</span>
          </el-col> -->
          <el-col :span="3" style="line-height:2.0">
            <span class="subTitle" style="font-size:14px;font-weight:600;">大小</span>
            <br />
            <span class="subContent">{{formatFileSize(row.versionData.sizes)}}</span>
          </el-col>
          <el-col :span="3" style="line-height:2.0">
            <span class="subTitle" style="font-size:14px;font-weight:600;">研制单位</span>
            <br />
            <span class="subContent">{{row.versionData.source?row.versionData.source:'-'}}</span>
          </el-col>
          <el-col :span="3" style="line-height:2.0">
            <span class="subTitle" style="font-size:14px;font-weight:600;">提供单位</span>
            <br />
            <span class="subContent">{{row.versionData.offerUnit}}</span>
          </el-col>
          <el-col :span="3" style="line-height:2.0">
            <span class="subTitle" style="font-size:14px;font-weight:600;">上传人</span>
            <br />
            <span class="subContent">{{row.versionData.uname}}</span>
          </el-col>
          <el-col :span="3" style="line-height:2.0">
            <span class="subTitle" style="font-size:14px;font-weight:600;">上传时间</span>
            <br />
            <span class="subContent">{{row.versionData.ctime|parseTime('{y}-{m}-{d} {h}:{m}:{s}')}}</span>
          </el-col>
          <el-col :span="4" style="text-align:right;padding:20px;">
            <!-- <el-button v-if ="row.softwareType == 2 && $checkPermission(['admin','XTUser'])" circle size="mini" type="warning" icon="el-icon-folder-add" title="推送" @click="pushSoftware(row)"></el-button> -->
            <el-button circle size="small" type="warning" icon="el-icon-sell" title="升级" @click="upgradeSoftware(row)"></el-button>
            <el-button circle size="small" type="primary" icon="el-icon-edit" title="编辑" @click="editSoftware(row)"></el-button>
            <el-button circle size="small" type="danger" icon="el-icon-close" title="删除" @click="deleteItem(row)"></el-button>
          </el-col>
        </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin:20px;">
      <!-- <el-col :span="12">
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="selectAll"
        >{{isAll==true?'取消全选':'全选'}}</el-button>
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="warning"
          @click="dialogSoftVisible = true,sendFragTagMore = true,isPushOne=false "
        >批量推送入段库</el-button>
      </el-col> -->

      <el-col :span="$checkPermission(['admin','XTUser'])?24:24" style="text-align:right;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[6, 50, 100, 200, 300, 400, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

  </el-card>

   <!-- 软件段推送 -->
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

          <el-form-item label="软件名称" prop="softName" style = "margin-bottom:15px"  v-if="isPushOne">
            <el-input  readonly style="width:400px;" v-model="dataPushSoftForm.softName" placeholder="请输入软件名称" />
          </el-form-item>

          <el-form-item label="软件版本" prop="softVersion"  v-if="isPushOne" >
             <el-select  ref = "selectVersionSoft" value-key = "id" v-model="dataPushSoftForm.softVersion" style="width:400px" placeholder="请选择软件版本" clearable size="small" @change="getSelectVersionNode">
                    <el-option
                      v-for = "option in selectSoftVersionOptions"
                      @click.native = "pushSoftVersion"
                      :key = "option.id"
                      :value = "option"
                      :label = "option.version"
                    />
            </el-select>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogSoftVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="pushSoftConfirm(sendFragTagMore)">确认</el-button>
        </span>
      </el-dialog>

      <SoftwareRelation :dialogVisible="softwareRelationVisible" :data="softwareRelationData" @closeSoftwareRelation="closeSoftwareRelation"></SoftwareRelation>
</div>
</template>
<script>
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as user from "@/api/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SoftwareType from "../category/software-type";
import mixin from "@/styles/mixin.scss";
import dayjs from "dayjs";
import { parseTime } from "@/utils/common";
import { listSoftwareTaskAll } from "@/api/software-task";
import * as deployPosture from '@/api/deploy-posture';
import SoftwareRelation from "./software-detail-relation"
// import * as appConfig from "/public/config";
import qs from 'qs';
export default {
  components: {
    SoftwareType,
    Treeselect,
    mixin,
    SoftwareRelation
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 6,
      totalPage: 0,
      imgSource: require("@/assets/index/softwareDefault.png"),
      defaultImg: 'this.src="' + require("@/assets/index/softwareDefault.png") + '"',
      search: {
        offerUnit: null,
        devUnit: null,
        keyword: null,
        type: null,
        system: null
      },
      offerUnits: [],
      reviewData: [],
      devUnitList: [],
      offerUnitList: [],
      searchRecordList: [],
      userInfo: {},
      dialogSoftVisible:false,
      backupLoading: false,
      selectNodeOptions:[],
      selectSoftVersionOptions:[],
      sendFragTagMore: false,
      pushItem:[],
      // fragBodyData:[],
      dataPushSoftForm:{
          id:1,
          name: "",
          address: "",
          softName:"",
          softVersion:"",
          softVersions:[],
          options:[],

      },
      serverInfo:{
        sys:{},
        mem:{}
      },
      // softwareTopInfo: {
      //   unStart: 10,
      //   unExamine: 10,
      //   unDetection: 10,
      //   unTest: 10,
      //   unPublish: 10,
      //   hasPublish: 10
      // },
      softwareOptions: [],
      sysData: [],
      logoAndPicUrl: appConfig.config.urlFilePrefix,
      selectedItmes:[],
      selectedRowkeys:[],
      isAll:false,
      isPushOne:false,
      softVersionPushId:0,
      appConfig: appConfig.config,
      softwareRelationVisible: false,
      softwareRelationData: {}
    };
  },

  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.getSoftwareList();
    this.getSoftwareTypeList();
    this.getTaskDataList();
    this.getSelectNode();
    if(this.appConfig.serverInfoSwitch===true) {
      this.getServerInfo();
    }

    // this.getSoftwareDevUnitList()
    // this.getSoftwareOfferUnitList()
    // this.getSearchRecord()
    // this.getAllSoftwareSource()
    // this.getSelectNode();
    // localStorage.removeItem('selItem');
    // localStorage.removeItem('selID');

  },
  watch: {
    // selectedRowkeys :{
    //   handler(newValue, oldValue){
    //     let str = JSON.stringify(newValue);
    //     localStorage.setItem('selItem',str);
    //     this.selectedRowkeys = newValue;
    //     if(this.selectedRowkeys.length == 0){
    //       localStorage.removeItem('selItem');
    //       console.log("删除值")
    //     }
    //     console.log("watch")
    //     console.log(this.selectedRowkeys,newValue,oldValue)

    //   }
    // }
  },
  methods: {
    getServerInfo(){
      software.getServerInfo().then(response =>{
        if(response.code == 200){
          this.serverInfo = response.data;
        }else{
          this.$message.error("获取服务器存储、内存信息失败")
        }
        console.log("serverInfo=============",this.serverInfo)
      })
    },
    selectAll(){
      if(this.isAll){
        this.$refs.mutipleTable.clearSelection();
      }else{
        this.$refs.mutipleTable.toggleAllSelection();
      }
      this.isAll=!this.isAll

    },
    //赋值
    handleItemSelection(val){
      // debugger

      // let selectBodyList = []
      // val.forEach(item =>{
      //   selectBodyList.push({
      //           software_id:item.id,
      //           version_id:item.versionData.id
      //   });
      // })
      // if(selectBodyList.length == 0){
      //   return this.$message.warning('无数据可选!')
      // }
      // //获取loacal中的数据
      // var list = localStorage.getItem('selItem') || []
      // if(list.length !== 0){
      //   list = JSON.parse(list);

      // }
      // // if(list.indexOf(...selectBodyList) == -1){
      // //   list.push(...selectBodyList)
      // // }
      // list.push(...selectBodyList)
      // // list.push(this.selectedItmes)
      // list = JSON.stringify(list);
      // localStorage.setItem('selItem',list);
      // var newList = localStorage.getItem('selItem') || []
      // newList = JSON.parse(newList);
      // this.selectedRowkeys = newList;

      this.selectedItmes = val;
      console.log("this.selectedItmes")

      console.log(this.selectedItmes)
    },
    //跨页多选
    getRowKeys(row){
      // console.log("row")
      // console.log(row)
      return row.id;
    },
    pushToRepoDlg(){

    },
    getAllSoftwareSource() {
      user.getAllSoftwareSource(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.offerUnits = response.data;
        }
      });
    },
    sourceNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.name,
        label: node.name,
        children: node.children
      };
    },
    getSoftwareList() {
      software
        .getSoftwareList({
          ...this.search,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(response => {
          if (response.code === 200) {
            // debugger
            this.reviewData = response.data.list;
            this.totalPage = response.data.total;

          }
        });
    },
    // getSoftwareDevUnitList() {
    //   software.getSoftwareDevUnit().then(response => {
    //     if (response.code === 200) {
    //       this.devUnitList = response.data
    //     }
    //   })
    // },
    // getSoftwareOfferUnitList() {
    //   software.getSoftwareOfferUnit().then(response => {
    //     if (response.code === 200) {
    //       this.offerUnitList = response.data
    //     }
    //   })
    // },
    getSoftwareTypeList() {
      category.getCategoryList("service").then(response => {
        if (response.code === 200) {
          //  let res = this.handleTree(response.data.list)
          //   this.softwareOptions = res;
          this.softwareOptions = response.data.list;
        }
      });
    },
    getTaskDataList() {
      listSoftwareTaskAll().then(response => {
        if (response.code == 200) {
          this.sysData = response.data;
        }
      });
    },
    normalizer(node) {
      // console.log(node, 1)
      if (node.children && !node.children.length) {
        delete node.children;
        // console.log(node, 2)
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    selectChange(val) {
      console.log(val);
    },
    getVersionIndex(version, item) {
      item.versionData = version;
      // console.log("哈哈哈哈s")
      // console.log(item)
      // console.log(version)

    },
    // handleVersionChange(item) {

    //   item.versions.forEach(i => {
    //     if (i.version === item.version) {
    //       item.uname = i.uname
    //       item.ctime = i.ctime
    //       item.ifBackup = !!i.backup
    //     }
    //   })
    // },
    formatDate(time) {},
    querySearch(queryString, cb) {
      const restaurants = this.searchRecordList;
      const searchRecords = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      const results = searchRecords.map(item => ({ value: item }));
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    addSearchRecord(keyword) {
      software
        .addSearchRecord(keyword, this.userInfo.userId)
        .then(response => {});
    },
    getSearchRecord() {
      software.getSearchRecord(this.userInfo.userId, 30).then(response => {
        if (response.code === 200) {
          this.searchRecordList = response.data;
        }
      });
    },
    handleReset() {
      (this.search = {
        offerUnit: null,
        devUnit: null,
        keyWord: null,
        type: null
      }),
        this.getSoftwareList();
    },
    goToSoftwareUpload() {
      this.$router.push({ path: "/admin/software/upload" });
    },
    goToFragmentUpload() {
      this.$router.push({ path: "/admin/software/fragmentupload" });
    },
    goToBatch() {
      this.$router.push({ path: "/admin/software/batchupload" });
    },
    // bakSoftware(item) {
    //   this.$confirm('确定备份软件 ' + item.name + ' 的 ' + item.version + ' 版本吗？', '提示', {
    //     type: 'warning'
    //   }).then((e) => {
    //     this.backupLoading = true
    //     software.bakSoftware(item.versionId).then(response => {
    //       if (response.code === 200) {
    //         this.$message.success('备份成功')
    //         this.getSoftwareList()
    //       } else {
    //         this.$message.error('备份失败')
    //       }
    //       this.backupLoading = false
    //     })
    //   })
    // },
    editSoftware(item) {
      if (item.softwareType == 2) {
        this.$router.push(
          //软件段
          {
            path: "/admin/software/fragmentedit",
            query: {
              id: item.id,
              version: item.versionData.id
            }
          }
        );
      } else {
        this.$router.push({
          path: "/admin/software/edit",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      }
    },
    upgradeSoftware(item) {
      debugger
      if (item.softwareType == 2) {
        //软件段
        this.$router.push({
          path: "/admin/software/fragmentUpgrade",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      } else {
        this.$router.push({
          path: "/admin/software/upgrade",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      }
    },
    //批量软件推送
    batchPush(){
      this.getSelectNode();
      this.dialogSoftVisible=true;
      this.isPushOne=false;
    },
    //单个软件推送
    pushSoftware(item){
      this.cleanDialog();
      this.sendFragTagMore = false;
      this.dialogSoftVisible = true;
      this.isPushOne=true;
      this.dataPushSoftForm.softName = item.name
      // this.selectSoftVersionOptions = item.versions
      this.dataPushSoftForm.softVersions = item.versions
      this.pushItem = item;
      this.getSelectNode();
      this.getSelectVersionNode();

    },
     //获取节点
    getSelectNode(){
      let status = 1;
      deployPosture.getFragmentAddress("",status).then(response => {
          if (response.code === 200) {
            // console.log("获取节点response");
            // console.log(response);
            this.selectNodeOptions = response.data;

          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    //获取版本节点
    getSelectVersionNode(){

      this.selectSoftVersionOptions = this.pushItem.versions
      // console.log("版本：=============",this.selectSoftVersionOptions)

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
    //推送
    pushSoftConfirm(sendFragTagMore){

      // this.$refs.dataPushSoftForm.validate( valid =>{
      //   if(valid){

          if(sendFragTagMore === false){
            deployPosture.sendFragmentOne(this.dataPushSoftForm.id,this.pushItem.id,this.softVersionPushId).then(response => {
            if (response.code === 200) {
              // console.log(response)
              this.dialogSoftVisible = false;
              this.$message.success('软件段推送成功！');
            }
            })
            .catch(function(error) {
              this.dialogSoftVisible = false;
              this.$message.error('软件段推送失败！');
              console.log(error)
            })
      //推送多个软件段
          }else{
            // this.selectedItmes = this.selectedRowkeys;
            console.log("批量上传！")
            console.log(this.selectedItmes)

            let fragBodyDataList = [];
            // debugger
            this.selectedItmes = JSON.parse(JSON.stringify(this.selectedItmes))
            console.log("批量上传！")
            console.log(this.selectedItmes)

            this.selectedItmes.map((item,index) => {
              fragBodyDataList.push({
                // software_id:JSON.parse(JSON.stringify(item)).software_id,
                // version_id:JSON.parse(JSON.stringify(item)).version_id
                software_id:item.id,
                version_id:item.versionData.id
              });
            });
            // this.selectedItmes.forEach(element => {
            //   fragBodyDataList.push({
            //     software_id:element.id,
            //     version_id:element.versionData.id
            //   });
            // });
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
                  if (response.code === 200) {
                      console.log(response)
                      this.$message.success('软件段推送成功！');
                  }
              })
                .catch(function(error) {
                    this.$message.error('软件段推送失败！');
                    console.log(error)
                })
              }
          }
          this.cleanDialog();
          this.$refs.dataPushSoftForm.resetFields();
          this.dialogSoftVisible = false;
          this.$refs.mutipleTable.clearSelection();
          if(this.isAll == true){
            this.isAll = false;
          }



    },
    //业务软件可选
    checkBoxSelect(row,index){

      if(row.softwareType == 2){
        return true;

      }else{
        return false;
      }
    },



    //清空表单
    cleanDialog(){
      this.dataPushSoftForm = {};
    //   this.dataPushSoftForm.name = "";
    //   this.dataPushSoftForm.address = "";

    //  this.dataPushSoftForm.softVersion = "";

      // this.$refs['dataPushSoftForm'].resetFields();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getSoftwareList();

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSoftwareList();
      if(this.isAll == true){
        this.isAll = false;
      }
    },
    deleteItem(item) {
      this.$confirm(
        "确定删除软件 " +
          item.name +
          " 的 " +
          item.versionData.version +
          " 版本吗？",
        "提示",
        {
          type: "warning"
        }
      ).then(e => {
        software.deleteSoftwareVersion(item.versionData.id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.getSoftwareList();
          } else {
            this.$message.success("删除失败");
          }
        });
      });
    },
    closeSoftwareRelation() {
      this.softwareRelationVisible = false;
    },
    showRelation(versionData) {
      this.softwareRelationVisible = true;
      this.softwareRelationData = versionData;
    }
  }
};
</script>

<style scoped>
/* .title {
  border-left: 4px #409eff solid;
  line-height: 40px;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  background: #c5d7e9;
  margin-top: 40px;
} */
.subTitle {
  height: 12px;
  line-height: 12px;
  /* border-left: 4px solid #1890ff; */
  margin-left: 50px;
  font-size: 12px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: gray;
}
.subContent {
  height: 12px;
  line-height: 12px;
  /* border-left: 4px solid #1890ff; */
  margin-left: 50px;
  font-size: 12px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.description {
  word-break: break-all;
  font-size: 12px;
  color: rgba(116, 121, 140, 1);
  overflow: hidden;
  margin-top: 10px;
}
el-card {
  border-radius: 4px;
  border: 0px solid #e6ebf5;
}
::v-deep .el-input--small .el-input__inner {
  height: 36px;
  line-height: 36px;
}
::v-deep .el-table {
  /* overflow: visible !important; */
}
::v-deep .el-table .cell {
  /*overflow: visible !important;*/
}

::v-deep .el-table__body-wrapper {
  overflow: visible !important;
}
.version >>> .el-input__inner {
  border: 0px solid white;
  /* background: white !important; */
}
.el-form {
  padding: 0px;
}
.el-form-item {
  margin-bottom: 0;
}
.softwareUpgradeIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareUpgrade.png');
  background-size: cover;
  border: transparent;
}
.softwareEditIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareEdit.png');
  background-size: cover;
  border: transparent;
}
.softwareDeleteIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareDelete.jpg');
  background-size: cover;
  border: transparent;
}
.topTitle {
    color: gray;
    font-size: 14px;
    line-height: 25px;
    height: 25px;
    font-weight: 400;
  }
.topNum {
  font-weight: 700;
  font-style: normal;
  font-size: 30px;
  line-height: 38px;
  margin: 10px 0;
  margin-left: 16px;
}

::v-deep .vue-treeselect{
  top: 3px;
}
::v-deep .vue-treeselect__control {
  height: 32px;
  line-height: 32px;
}

::v-deep .vue-treeselect__placeholder, .vue-treeselect__single-value {
  line-height: 32px;
}
::v-deep .el-input.el-input--medium.el-input--suffix{
  line-height: 32px;
  top:2px;
}

/* 添加绿色系的主题覆盖 */
::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #1e7d34;
}

::v-deep .el-select-dropdown__item.selected {
  color: #1e7d34;
}

::v-deep .el-select .el-input__inner:focus {
  border-color: #1e7d34;
}

::v-deep .el-input__inner:focus {
  border-color: #1e7d34;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #1e7d34;
  border-color: #1e7d34;
}

::v-deep .el-button--primary {
  background-color: #1e7d34;
  border-color: #1e7d34;
}

::v-deep .el-button--primary:hover,
::v-deep .el-button--primary:focus {
  background-color: #2a9d42;
  border-color: #2a9d42;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1e7d34;
}
</style>

