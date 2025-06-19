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
        <el-button size="small" type="primary" icon="el-icon-search" @click="operlogLoginList">搜索</el-button>
        <el-button size="small" type="reset" title="重置" @click="resetOperlogLoginList">重置</el-button>
      </span>
    </div>
    <el-table
      :data="operlog"
      size="mini"
      class="custome"
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column label="序号" align="center" header-align="center" width="100" type="index"  />
      <el-table-column label="登录用户" align="center" header-align="center" prop="userName" show-overflow-tooltip />
      <el-table-column label="登录时间" align="center" header-align="center" prop="loginTime" show-overflow-tooltip >
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="IP" align="center" header-align="center" prop="ipaddr" show-overflow-tooltip />
      <el-table-column label="登录信息" align="center" header-align="center" prop="msg" show-overflow-tooltip />
      <el-table-column label="登录状态" align="center" header-align="center" prop="status" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?"成功":"失败" }}</span>
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
      />

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
      operlog:[],
      dialogOperlog:[],
      currentPage:1,
      pageNum:1,
      pageSize:10,
      total:0,
      totalPage: 0,
      dialogShowVisible:false,
    }
  },
  mounted() {
   this.operlogLoginList();
  },
  methods: {
    operlogLoginList(){
      this.operlog = []
      let start = null;
      let end = null;
      if (this.keywordDate) {
        start = this.keywordDate[0];
        end = this.keywordDate[1];
      }
      this.$modal.loading();
      log.operlogLoginList(this.currentPage,this.pageSize,this.keywordName,start,end).then(response=>{
        if(response.code == 200){
          this.operlog = response.data.list
          this.totalPage = response.data.totalPage
          this.total = response.data.total
          this.$modal.closeLoading();
        }else{
          this.$message.error("获取日志信息失败！")
          this.$modal.closeLoading();
        }
      })
    },
    resetOperlogLoginList(){
      this.keywordName=''
      this.keywordDate=''
      this.operlogLoginList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.operlogLoginList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.operlogLoginList()
    },
    
  }
}
</script>

<style scoped>

</style>