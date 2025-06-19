<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true" style="text-align:left">
      <el-form-item label="">
         <el-input v-model="search" size="small"   placeholder="用户名称/真实姓名" @blur="getReviewUserList(0)" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchRole">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="userData"
      size="mini"
      style="margin-top:10px;"
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="55" type="index" label="序号" />
      <el-table-column align="center" header-align="center" label="用户名称" prop="username" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="真实姓名" prop="realname" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="所属组织" prop="runit" />
      <el-table-column align="center" header-align="center" label="军官证号" prop="officerNum" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="联试方式" prop="tel" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="注册时间" prop="ctime">
        <template slot-scope="{row}">
          {{ parseTime(row.ctime, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column v-if="state === -1" align="center" header-align="center" label="状态" prop="status">
        <template slot-scope="{row}">
          <span v-if="row.applyStatus === 1" style="color:green;">通过</span>
          <span v-else style="color:orange;">待审核</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="240">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="showInfo(row)" icon="el-icon-s-check" circle></el-button>
          <el-button size="mini" @click="deleteItem(row)" type="danger" icon="el-icon-delete" circle ></el-button>
        </template>
      </el-table-column>
    </el-table>
     <div style="margin:10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20]"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
    </div>
  </el-card>
</template>
<script>
import {getReviewUser,deleteUser} from '@/api/user'

export default {
  data() {
    return {
      currentPage: 1,
      pageNum:1,
      pageSize: 10,
      total: 0,
      totalPage:1,
      search: '',
      userData: [],
      userInfo: {},
      state: -1
    }
  },
  created(){
     this.getReviewUserList(0)
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.$nextTick(()=>{
      this.getReviewUserList(0,this.search)
    })
    
  },
  methods: {
    searchRole() {},
    getReviewUserList(val) {
       getReviewUser(val,this.search,this.currentPage,this.pageSize).then(response=>{
         if(response.code==200){
           this.userData=response.data.list;
           this.total=response.data.total;
           this.totalPage=response.data.totalPage;
         }
       })
    },
   
    getDownloadApplyList() {
       
    },
    showInfo(item) {
      this.$router.push({
        path: '/admin/system/user-info-review',
        // query: { user: JSON.stringify(item) }
        query: {user: item.id}
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getReviewUserList(0)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getReviewUserList(0)
    },
    deleteItem(item) {
      this.$confirm('确定删除该用户申请信息吗？', '提示', {}).then((e) => {
        deleteUser(item.id).then(response=>{
          if(response.code==200){
           
            this.getReviewUserList(0)
            this.$message.success("删除成功！")
          }else{
            this.$message.success("删除失败！原因： "+response.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  el-card {
    border-radius: 4px;
    border: 0px solid #e6ebf5;

  }
  .el-form-item{margin-bottom: 0px;}
</style>
