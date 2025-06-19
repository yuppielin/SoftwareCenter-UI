<template>
  <el-card  class="custome">
    <el-table
      :data="unReviewData"
      size="mini"
      style="height:calc(100vh - 200px);overflow-y:auto;"
      :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="50" type="index" label="序号" />
      <el-table-column align="center" header-align="center" label="软件名称" prop="name" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="接口标识" prop="identity" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="软件版本" prop="version" />
      <el-table-column align="center" header-align="center" label="研制单位" prop="devUnit" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="提供单位" prop="offerUnit" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="上传者" prop="uname" />
      <el-table-column align="center" header-align="center" label="上传时间" prop="ctime" />
      <el-table-column align="center" header-align="center" label="操作" width="100">
        <template slot-scope="{row}">
          <el-button size="small" style="background:#05994e;color:white" @click="showInfo(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size=pageSize
      layout="total, prev, pager, next, jumper"
      :total=totalPage
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script>
import * as software from '@/api/software'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      unReviewData: [
      ]
    }
  },
  mounted() {
    this.getUnreviewSoftwareList()
  },
  methods: {
    getUnreviewSoftwareList() {
      software.getSoftwareListByStatus(null, 0, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.unReviewData = response.data.list
          this.totalPage = response.data.total
        }
      })
    },
    showInfo(item) {
      this.$router.push({
        path: '/admin/software/unreviewed/' + item.id,
        query: { version: item.version }
      })
      window.localStorage.setItem('softwareData', JSON.stringify(item))
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getUnreviewSoftwareList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUnreviewSoftwareList()
    }
  }
}
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
</style>
