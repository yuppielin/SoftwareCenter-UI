<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="已发布" name="first">
        <ReleaseItem v-for="(item,index) in softwareData" :key="index" :data="item" @getSoftwareList="getSoftwareList" />
      </el-tab-pane>
      <el-tab-pane :label="'待审核 ( '+ auditSoftwareTotal +' )'" name="second">
        <ReviewItem v-for="(item,index) in auditSoftwareData" :key="index" :data="item" @getAuditSoftwareList="getAuditSoftwareList" />
      </el-tab-pane>
      <el-tab-pane label="已驳回" name="third">
        <RejectItem v-for="(item,index) in rejectSoftwareData" :key="index" :data="item" @getRejectSoftwareList="getRejectSoftwareList" />
      </el-tab-pane>
    </el-tabs>
<!--    <div style="position: absolute;bottom: 10px">-->
    <el-pagination
      hide-on-single-page
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
<!--    </div>-->
  </div>
</template>
<script>
import * as software from '@/api/software'
export default {
  components: {
    ReleaseItem: () => import('./software-release-list.vue'),
    ReviewItem: () => import('./software-review-list.vue'),
    RejectItem: () => import('./software-reject-list.vue')
  },
  data() {
    return {
      pageSize: 10,
      total: 0,
      auditSoftwareTotal: 0,
      currentPage: 1,
      activeName: 'first',
      softwareData: [],
      auditSoftwareData: [],
      rejectSoftwareData: [],
      userInfo: {}
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareList()
    this.getAuditSoftwareList()
    // this.getRejectSoftwareList()
  },
  methods: {
    getSoftwareList() {
      software.getSoftwareListByStatus(this.userInfo.userId, 1, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.total = response.data.total
        }
      })
    },
    getAuditSoftwareList() {
      software.getSoftwareListByStatus(this.userInfo.userId, 0, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          if (this.activeName === 'second') {
            this.auditSoftwareData = response.data.list
            this.total = response.data.total
          }
          this.auditSoftwareTotal = response.data.total
        }
      })
    },
    getRejectSoftwareList() {
      software.getSoftwareListByStatus(this.userInfo.userId, 2, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.rejectSoftwareData = response.data.list
          this.total = response.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      if (this.activeName === 'first') {
        this.getSoftwareList()
      } else if (this.activeName === 'second') {
        this.getAuditSoftwareList()
      } else {
        this.getRejectSoftwareList()
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.activeName === 'first') {
        this.getSoftwareList()
      } else if (this.activeName === 'second') {
        this.getAuditSoftwareList()
      } else {
        this.getRejectSoftwareList()
      }
    },
    handleTabClick(item) {
      switch (item.name) {
        case 'first':
          this.getSoftwareList()
          break
        case 'second':
          this.getAuditSoftwareList()
          break
        case 'third':
          this.getRejectSoftwareList()
          break
      }
    }
  }
}
</script>
<style scoped>

</style>
