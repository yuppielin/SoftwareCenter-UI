<template>
  <el-card class="custome">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button size="small" style="background:#05994e;color:white" @click="showInfo(row)">已审核</el-button>
        <el-button size="small" style="background:gray;color:white" @click="showInfo(row)">未审核</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-input v-model="search" size="small" suffix-icon="el-icon-search" style="width:300px" placeholder="关键字" />
      </el-col>
    </el-row>
<!--    待审核软件资料列表-->
    <el-table
      :data="unReviewData"
      size="mini"
      style="height:calc(100vh - 225px);overflow-y:auto;margin-top:10px;"
      :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="50" type="index" label="序号" />
      <el-table-column align="center" header-align="center" label="资料名称" prop="name" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="软件名称" width="200">
        <template slot-scope="{row}">
          <span>{{ row.softwareName }}</span>
          ( <span style="color:green">{{ row.version }}</span> )
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="研制单位" prop="devUnit" />
      <el-table-column align="center" header-align="center" label="提供单位" prop="applyUnit" />
      <el-table-column align="center" header-align="center" label="申请人" prop="uploader" />
      <el-table-column align="center" header-align="center" label="申请时间" prop="uploadDate" />
      <el-table-column align="center" header-align="center" label="状态" prop="status">
        <template slot-scope="{row}">
          <span v-if="row.status==1" style="color:green;">通过</span>
          <span v-else style="color:red;">驳回</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button size="mini" style="background:#05994e;color:white" @click="showInfo(row)">查看</el-button>
          <el-button size="mini" style="background:red;color:white" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分页-->
    <el-pagination
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size="100"
      layout="total, prev, pager, next, jumper"
      :total="400"
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
      search: '',
      softwareDataTypes: [],
      unReviewData: [],
      reviewData: []
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareDataList(0)
    this.getSoftwareDataTypeList()
  },
  methods: {
    /**
     * 获取软件资料列表
     * @param status 状态
     */
    getSoftwareDataList(status) {
      software.getSoftwareDataListByUser(this.userInfo.userId, status).then(response => {
        if (response.code === 200) {
          this.unReviewData = response.data
        }
      })
    },
    /**
     * 获取软件资料类型列表
     */
    getSoftwareDataTypeList() {
      software.getSoftwareSet(42).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data
        }
      })
    },
    /**
     * 展示信息
     * @param item
     */
    showInfo(item) {
      this.$router.push({
        path: '/admin/software/unreviewed/' + item.id
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    deleteItem(item) {
      this.$confirm('确定删除该成果吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        console.log(e)
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
</style>
