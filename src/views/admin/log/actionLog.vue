<template>
  <el-card class="custome custome-height">
    <div style="margin-bottom:10px;width: 100%;display: flex">
      <span style="display: inline-block;width: 10%;">
        <el-input
          class="inline-input"
          v-model="keywordName"
          style="width: 100%"
          placeholder="请输入用户名称"
        ></el-input>
      </span>
      <span style="display: inline-block;width: 10%;margin-left:10px">
        <el-input
          class="inline-input"
          v-model="keywordIp"
          style="width: 100%"
          placeholder="请输入IP"
        ></el-input>
      </span>
      <span>
        <el-select v-model="keywordRoles" placeholder="请选择角色" style="margin-left:10px;width: 150px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span>
        <el-select v-model="keywordType" placeholder="请选择操作方法" style="margin-left:10px;width: 150px">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
      <el-date-picker
        v-model="keywordDate"
        size="small"
        style="margin-left:10px;"
        type="daterange"
        align="right"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"

      />
      <span style="display: inline-block;width: 200px;margin-left: 10px">
        <el-button size="small" type="primary" icon="el-icon-search" @click="operlogList">搜索</el-button>
        <el-button size="small" type="reset" title="重置" @click="resetOperlogList">重置</el-button>
      </span>
    </div>
    <el-table
      :data="operlog"
      size="mini"
      class="custome"
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column label="序号" align="center" header-align="center" width="100" type="index"  />
      <el-table-column label="行为用户" align="center" header-align="center" prop="operName" width="150" show-overflow-tooltip />
      <el-table-column label="行为事件" align="center" header-align="center" prop="title" show-overflow-tooltip />
      <el-table-column label="行为链接" align="center" header-align="center" prop="operUrl" show-overflow-tooltip />
      <el-table-column label="行为时间" align="center" header-align="center" prop="operTime" show-overflow-tooltip >
        <template slot-scope="scope">
              <span>{{ parseTime(scope.row.operTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
      </el-table-column>
      <el-table-column label="IP" align="center" header-align="center" prop="operIp" show-overflow-tooltip />
      <el-table-column label="操作" align="center" header-align="center" width="100">
          <template slot-scope="{row}">
              <el-button size="mini" title="更多" type="primary" circle icon="el-icon-view" @click="showInfo(row)"></el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="totalPage>0"
      :total="total"
      :page-sizes="[10, 15, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @pagination="operlogList" />

    <!-- 查看日志详情 -->
    <el-dialog
      :visible.sync="dialogShowVisible"
      title="日志详情"
      @close="handleClose"
      width="800px"
      >
       <el-form ref="dialogOperlog" :modle="dialogOperlog" label-position="right" label-width="auto" size="mini">
         <el-row>
           <el-col :span="12">
             <el-form-item label="行为用户">
              {{dialogOperlog.operName}}
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="行为IP">
              {{dialogOperlog.operIp}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="行为事件">
              {{dialogOperlog.title}}
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="行为时间">
              {{parseTime(dialogOperlog.operTime, '{y}-{m}-{d} {h}:{i}:{s}')}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="请求链接">
              {{dialogOperlog.operUrl}}
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="请求方式">
              {{dialogOperlog.requestMethod}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="请求方法">
              {{dialogOperlog.method}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="请求参数">
              {{dialogOperlog.operParam}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="返回参数">
              {{dialogOperlog.jsonResult==null?"无返回参数":dialogOperlog.errorMsg}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="错误提示">
              {{dialogOperlog.errorMsg==null?"无错误提示":dialogOperlog.errorMsg}}
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="操作状态">
              {{(dialogOperlog.status==0?"成功":"失败")}}
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="消耗时间">
              {{dialogOperlog.costTime}}ms
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
    </el-dialog>
  </el-card>
</template>
<script>

import axios from 'axios'
import * as log from '@/api/log'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  components: {

  },
  data() {
    return {
      keywordDate:'',
      keywordName:'',
      keywordRoles:'',
      keywordIp:'',
      keywordType:'',
      operlog:[],
      dialogOperlog:[],
      currentPage:1,
      pageNum:1,
      pageSize:10,
      total:0,
      totalPage: 0,
      dialogShowVisible:false,
      options:[
        {
          value:'user',
          label:'普通用户',
        },
        {
          value:'applicationUser',
          label:'业务管理人员',
        },
        {
          value:'SHUser',
          label:'主管部门人员',
        },
        {
          value:'AFUser',
          label:'安防检测人员',
        },
        {
          value:'SYUser',
          label:'试用管理人员',
        },
        {
          value:'XTUser',
          label:'信通局管理人员',
        },
        {
          value:'admin',
          label:'系统管理员',
        },
      ],
      typeOptions:[
      {
        value:'1',
        label:'新增',
      },
      {
        value:'2',
        label:'修改',
      },
      {
        value:'3',
        label:'删除',
      },
      // {
      //   value:'EXPORT',
      //   label:'导出',
      // },
      // {
      //   value:'IMPORT',
      //   label:'导入',
      // },
      // {
      //   value:'DOWNLOAD',
      //   label:'下载',
      // },
      // {
      //   value:'CLEAN',
      //   label:'清空数据',
      // },
      // {
      //   value:'POST',
      //   label:'POST',
      // },
      // {
      //   value:'GET',
      //   label:'GET',
      // },
      // {
      //   value:'PUT',
      //   label:'PUT',
      // },
      {
        value:'0',
        label:'其它',
      },
    ],
    }
  },
  mounted() {
   this.operlogList();
  },
  methods: {
    operlogList(){
      this.operlog = []
      let start = null;
      let end = null;
      if (this.keywordDate) {
        start = this.keywordDate[0];
        end = this.keywordDate[1];
      }
      console.log("5555555555555555555",this.keywordType)
      this.$modal.loading();
      log.operlogList(this.currentPage,this.pageSize,this.keywordName,start,end,this.keywordIp,this.keywordRoles,this.keywordType).then(response=>{
        if(response.code == 200){
          this.operlog = response.data.list
          console.log("6666666666666666666666",this.operlog)
          this.totalPage = response.data.totalPage
          this.total = response.data.total
          this.$modal.closeLoading();
        }else{
          this.$message.error("获取日志信息失败！")
          this.$modal.closeLoading();
        }
      })
    },
    resetOperlogList(){
      this.keywordDate=''
      this.keywordIp=''
      this.keywordName=''
      this.keywordRoles=''
      this.keywordType=''
      this.operlogList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.operlogList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.operlogList()
    },
    showInfo(item){
      this.dialogShowVisible = true
      this.dialogOperlog=item
    },

    handleClose(){
      this.dialogShowVisible = false
    }
  }
}
</script>

<style scoped>
.el-form-item__content {
  display: "-webkit-box"
}
</style>

