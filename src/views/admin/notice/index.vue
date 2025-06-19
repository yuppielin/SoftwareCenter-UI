<template>
  <el-card class="custome custome-height">
    <el-row style="margin-bottom:10px;">
      <el-col :span="12">
        <el-button size="small" type="primary" @click="addNotice">新增</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-input
          class="inline-input"
          v-model="keyword"
          style="width: 200px"
          placeholder="请输入关键字"
        ></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" style="margin-left:10px;" @click="searchNotice">搜索</el-button>
        <el-button size="small" type="reset" title="重置" @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
    <!-- <div style="margin-bottom:10px;width: 100%;display: flex">
      <span style="display: inline-block;width: 20%;">
        <el-input
          class="inline-input"
          v-model="keyword"
          style="width: 100%"
          placeholder="请输入关键字"
        ></el-input>
      </span>
      <span style="display: inline-block;width: 200px;margin-left: 10px">
        <el-button size="small" type="primary" @click="searchNotice">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" title="重置" @click="handleReset"></el-button>
        <el-button size="small" type="primary" @click="addNotice">新增</el-button>
      </span>
    </div> -->
    <el-table
      :data="reviewData"
      size="mini"
      class="custome"
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="100" type="index" label="序号" />
      <el-table-column label="通知标题" header-align="center" prop="title" show-overflow-tooltip />
      <el-table-column align="center" label="发布时间" prop="releaseDate" show-overflow-tooltip />
      <el-table-column align="center" label="状态" width="200">
        <template slot-scope="{row}">
           <span :style="{'color':row.status==0||row.status==2?'gray':'green'}" v-text="row.status==0?'待发布':row.status==2?'未发布':'已发布'"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" header-align="center" label="是否上线"  width="200">
        <template slot-scope="{row}">
           <el-switch :disabled="row.status==0" active-text="上线" inactive-text="下线" v-model="row.status" :active-value="1" :inactive-value="2" @change="changeStatus(row)"></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column align="center" header-align="center" label="置顶" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.isTop=='1'" :disabled="row.status!=1"  size="small" type="text"  @click="setTop(row)">是</el-button>
          <el-button v-else size="small" :disabled="row.status!=1" type="text"  @click="setTop(row)"> <span style="color:red">否</span></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="上/下线" width="100">
        <template slot-scope="{row}">
            <el-switch size='mini'  @change="changeStatus(row)" :active-value="1" v-model="row.status"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="300">
        <template slot-scope="{row}">
          <el-button size="small" type="text" icon="el-icon-view" @click="showNotice(row)">查看</el-button>
          <!-- <el-button size="small" type="text" icon="el-icon-top" @click="changeStatus(row)" :disabled="row.status==2 ||row.status==0 ">下线</el-button>
          <el-button size="small" type="text" icon="el-icon-down" @click="changeStatus(row)" :disabled="row.status==1||row.status==0">上线</el-button> -->
          <el-button size="small" type="text" icon="el-icon-edit" @click="editNotice(row)" >编辑</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        v-show="totalPage>0"
        :total="total"
        :page-sizes="[10, 50, 100, 200, 300, 400, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :page.sync="currentPage"
        :limit.sync="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @pagination="getList" />

    <!--新增公告界面-->
    <el-dialog
      :title="editTitle"
      width="50%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="50px"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="100px"
        :rules="rules"
        :size="size"
        label-position="right"
      >
        <el-form-item label="公告标题:" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off" maxlength="100" />
        </el-form-item>
        <!-- <el-form-item label="发布人" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off" />
        </el-form-item> -->
        <el-form-item label="公告时间:" prop="releaseDate">
          <el-date-picker
            v-model="dataForm.releaseDate"
            size="small"
            type="datetime"
            align="right"
            format="yyyy-MM-dd  HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="公告日期"
          />
        </el-form-item>
        <el-form-item label="联  系  人:" prop="linkman">
          <el-input v-model="dataForm.linkman" auto-complete="off" maxlength="10" />
        </el-form-item>
        <el-form-item label="联系方式:" prop="contact">
          <el-input v-model="dataForm.linkmantel" auto-complete="off" maxlength="11" />
        </el-form-item>
        <el-form-item
            prop="publishDept"
            label="发布单位:"
            :rules="[{required:true,message:'发布单位不能为空',trigger:'blur'}]"
          >
            <el-select
              v-model="dataForm.publishDept"
              size="small"
              style="width:100%"
              filterable
              reserve-keyword
            >
              <el-option
                v-for="(item,index) in publishDeptList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
         <el-form-item label="可见类型:" prop="showAll">
          <el-radio  v-model="dataForm.showAll" :label="0">部分可见</el-radio>
          <el-radio  v-model="dataForm.showAll" :label="1">全部可见</el-radio>
        </el-form-item>
        <el-form-item v-if="dataForm.showAll==0" label="可见组织" prop="showAll">
          <treeselect
            :model="dataForm.reciever"
            value-consists-of="ALL_WITH_INDETERMINATE"
            :options="orgData"
            :normalizer="normalizer"
            multiple
            filterable
            :limit="2"
            :limitText="count => `及其它${count}项`"
            :show-count="true"
            placeholder="请选择可见组织"
          />
        </el-form-item>
        <el-form-item label="公告内容:" prop="content">
          <el-input v-model="dataForm.content" type="textarea" :rows="8" />
        </el-form-item>
        <el-form-item label="附件上传:">
            <el-upload
              class="upload-demo"
              action=""
              :auto-upload="false"
              :file-list="fileList"
              :show-file-list="true"
              :http-request="uploadNoticeFile"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              accept=".jpg,.png,.bmp,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              ref="noticeFile"
              :limit="1"
            >
          <el-button :size="size" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png/bmp/png/jpeg/pdf/doc/docx/ppt/pptx/xls/xlsx/txt文件，且不超过10M,限1个</div>
        </el-upload>
        <el-row :gutter="20" v-show="dataForm.path!=null&&dataForm.path!=''">
          <el-col :span="20">
            <span style="font-size:#3b5975;font-szie:12px;">{{fileInfo.fileName}}</span>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="delNoticeFile">删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false,getList()">取消</el-button>
        <el-button
          v-if="operation"
          :size="size"
          :loading="editLoading"
          style="margin-left:5px;"
          type="primary"
          @click="createNotice"
        >发布
        </el-button>
        <el-button
          v-else
          :size="size"
          :loading="editLoading"
          style="margin-left:5px;"
          type="primary"
          @click="updateNotice"
        >保存
        </el-button>
      </div>
    </el-dialog>
    <detail :noticeVisibleFlag.sync="dialogShowVisible"  :noticeData="notice"  @close="dialogShowVisible=false" />
  </el-card>
</template>
<script>

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import axios from 'axios'
import qs from 'qs'
import * as user from '@/api/user'
import * as notice from "@/api/notice"
import {getOrganization} from "@/api/organization"
import { deepClone } from '../../../utils'
import * as category from "@/api/category";
export default {
  components: {
    Treeselect,
    detail: () => import("./show.vue")
  },
  data() {
    return {
      userInfo:{},
      orgVisible:false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total:0,
      size:"small",
      notice:{},
      editLoading:false,
      operation:false,
      publishDeptList:[],
      dataForm:{
        id:null,
        title: '',
        reciever: '',
        releaseDate:'',
        showAll: 1,
        linkman: '',
        linkmantel: '',
        publishDept: '',
        content:'',
      },
      orgData: [], // 组织单位数据
      deptOptions:[],
      reviewData:[],
      radio:1,
      keyword:null,
      rules:{
        title:[{required:true,message:'标题不能为空',trigger:'blur'}],
        // username:[{required:true,message:'发布人不能为空',trigger:'blur'}],
        releaseDate:[{required:true,message:'发布时间不能为空',trigger:'change'}],
        linkman:[{required:true,message:'联试人不能为空',trigger:'blur'}],
        linkmantel:[{required:true,message:'联试方式不能为空',trigger:'blur'}],
        showAll:[{required:true,message:'请选择可见方式',trigger:'blur'}],
        reciever:[{required:true,message:'请选择可见组织',trigger:'blur'}],
        content:[{required:true,message:'公告内容不能为空',trigger:'blur'}]
      },
      dialogVisible: false,
      dialogShowVisible: false,
      editTitle: "",
      fileList:[],
      fileData:'',
      fileInfo:{
        fileName:'',
        filePath:''
      }
    }
  },
  mounted() {
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
    this.getOrgList()
    this.getList();
    this.getPublishDeptList();
  },
  methods: {
    searchNotice() {
      this.currentPage = 1
      this.getList()
    },
    getList() {
      notice.getNoticeList(this.userInfo.userId,this.keyword,this.currentPage,this.pageSize).then(response=>{
        if(response.code==200){
          this.reviewData=response.data.list;
          this.totalPage=response.data.totalPage;
          this.total=response.data.total;
        }
      })
    },
    // 发布公告
    addNotice() {
      this.editTitle = '添加公告'
      this.dataForm={}
      this.dataForm.uid=this.userInfo.userId;
      this.dialogVisible = true
      this.operation = true
      this.$refs.noticeFile.clearFiles();
    },
    //创建
    createNotice(){
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if(this.$refs.noticeFile.uploadFiles.length>0){
            this.$refs.noticeFile.submit();
          }else{
            if(this.dataForm.reciever && this.dataForm.reciever.length>0){
                this.dataForm.reciever=this.dataForm.reciever.join(',');
            }
            notice.createNotice(this.dataForm).then(response=>{
                    if(response.code==200){
                      this.$message.success("创建成功！");
                      this.dialogVisible=false;
                      this.keyword=null;
                      this.getList();
                    }else{
                      this.$message.error(response.msg)
                    }
              })
          }
        }
      })
      
    },
    editNotice(item) {
      
      this.dataForm={};
      this.dataForm=JSON.parse(JSON.stringify(item));
      if(item.reciever!=null&&item.reciever!=""){
         this.dataForm.reciever=item.reciever.split(",");
      }else{
        this.dataForm.reciever=[]
      }
      this.dataForm.showAll=item.showAll
      this.operation = false;
      this.editTitle = '编辑公告';
      if(item.path!=null && item.path!=""){
        this.fileInfo=JSON.parse(item.path);
      }
      this.dialogVisible = true;
      this.$refs.noticeFile.clearFiles();
    },
    //更新
    updateNotice(){
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let reciever=this.dataForm.reciever
          if(reciever instanceof Array ){
            this.dataForm.reciever=reciever.join(',');
          }
          if(this.$refs.noticeFile.uploadFiles.length>0){
            this.$refs.noticeFile.submit();
          }else{
            notice.updateNotice(this.dataForm).then(response=>{
                  if(response.code==200){
                    this.$message.success("更新成功！");
                    this.dialogVisible = false
                    this.operation = false
                    this.keyword=''
                    this.getList();
                  }else{
                    this.$message.error(response.msg);
                  }
            })
          }
        }
      })  
      
    },
    showNotice(item) {
      this.notice = JSON.parse(JSON.stringify(item));
      if(item.path!=null){
        // if(item.path.indexOf("}")!=-1){
        //   this.notice.path=JSON.parse(item.path);
        // }
        if(Object.keys(item.path).length>0){
          this.notice.path=JSON.parse(item.path);
        }
      }else{
        this.notice.path={
          fileName:'暂无附件',
          filePath:''
        }
      }
      this.dialogShowVisible = true;
    },
    changeStatus(item){
      notice.changeNoticeStatus(item.id).then(response=>{
        if(response.code==200){
          this.$message.success("状态变更成功！");
          this.keyword=''
          this.getList();
        }
      })
    },
    setTop(item){
      notice.setTop(item.id).then(response=>{
        if(response.code==200){
          this.$message.success("状态变更成功！");
          this.keyword=''
          this.getList();
        }
      })
    },
    changeRadio(visible){
        this.orgVisible = visible ==0 ? 1 : 0;
    },
    // 获取部门导航树
    getDepeTree() {
      user.getSystemSource(true)
        .then(response => {
          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            this.deptOptions = response.data
          } else {
            this.deptOptions = []
          }
        }).then(() => {
          this.$nextTick(() => {
            document.querySelector('.el-tree-node__content').click()
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 获取组织单位列表
    getOrgList() {
       getOrganization().then(response=>{
         if(response.code==200){
           this.orgData=response.data
         }
       })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    handleReset(){
      this.currentPage = 1
      this.keyword=''
      this.getList();
    },
    deleteItem(item){
      this.$confirm("确定删除该公告吗？","提示",{
        type:"warning"
      }).then((e)=>{
        notice.delNotice(item.id).then(response=>{
        if(response.code==200){
          this.$message.success("删除成功！");
          this.keyword=''
          this.getList();
        }else{
          this.$message.error(response.msg);
        }
      })
      })
    },
    //删除通知文件
    delNoticeFile(){
      let id=this.dataForm.id;
      notice.delNoticeFile(id).then(response=>{
        if(response.code==200){
          this.$message.success("删除成功！");
          this.dataForm.path=null;
          this.fileInfo.fileName=""
        }
      })
    },
    //文件上传处理
    uploadNoticeFile(file) {
      // this.fileData.append('noticeFile', file.file) // 增加数据
      if (!this.uploadLoading) {
        const data = new FormData()
        data.append('file', file.file)
        this.uploadNoticeFileA(data)
      }
    },
    beforeUpload(file) {
      const accessFileType = ['jpg','png','bmp','jpeg','pdf','doc','docx','ppt','pptx','xls','xlsx','txt']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt20M = file.size / 1024 < 20480
      if (!isType) {
        this.$message.error('上传文件格式异常!')
      }
      if (!isLt20M) {
        this.$message.error('上传软件资源大小不能超过 20M!')
      }
      return isType && isLt20M
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadNoticeFileA(data){
      notice.uploadNoticeFile(data).then(response=>{
        if(response.code==200){
          let path = JSON.stringify(response.data)
          this.dataForm.path=path;
          let reciever=this.dataForm.reciever
          if(reciever instanceof Array ){
            this.dataForm.reciever=reciever.join(',');
          }
            if(this.operation){
                notice.createNotice(this.dataForm).then(response=>{
                if(response.code==200){
                  this.$message.success("创建成功！");
                  this.dialogVisible=false;
                  this.keyword=null;
                  this.getList();
                }else{
                  this.$message.error(response.msg)
                }
              })
          }else{
            notice.updateNotice(this.dataForm).then(response=>{
              if(response.code==200){
                this.$message.success("更新成功！");
                this.dialogVisible = false
                this.operation = false
                this.keyword=''
                this.getList();
              }else{
                this.$message.error(response.msg);
              }
            })
          }
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getPublishDeptList() {
      category.getCategoryList("notice_publish_dept", null, null).then(response => {
        this.publishDeptList = response.data.list;
      });
    },
  }
}
</script>

<style scoped>

</style>

