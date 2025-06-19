<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="我的下载" name="first">
          <DownLoadItem v-for="(item,index) in softwareData" :key="index" :data="item" />
        </el-tab-pane>
        <el-tab-pane label="已申请" name="second">
          <ApplayItem v-for="(item,index) in softwareData" :key="index" :data="item" />
        </el-tab-pane>
        <el-tab-pane label="待审核" name="third">
          <ReviewItem v-for="(item,index) in softwareData" :key="index" :data="item" @getDownloadApplyList="getDownloadApplyList" />
        </el-tab-pane>
      </el-tabs>
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
    </el-card>
  </div>
</template>
<script>
import * as software from '@/api/software'
export default {
  components: {
    DownLoadItem: () => import('./software-download.vue'),
    ApplayItem: () => import('./software-applay.vue'),
    ReviewItem: () => import('./software-review.vue')
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 10,
      activeName: 'first',
      userInfo: {},
      softwareData: [
        {
          name:'qq',
          category:'联勤保障',
          devUnit:'28s',
          description:'软件描述软件描述软件描述软件描述软件描述软件描述',
          version: '1.0',
          ctime: '2023-04-18',
          downloadCon: 10
        },
        {
          name:'飞秋',
          category:'联勤保障',
          devUnit:'28s',
          description:'软件描述软件描述软件描述软件描述软件描述软件描述',
          version: '1.1',
          ctime: '2023-04-18',
          downloadCon: 10
        },
        {
          name:'迅雷',
          category:'联勤保障',
          devUnit:'28s',
          description:'软件描述软件描述软件描述软件描述软件描述软件描述',
          version: '1.1',
          ctime: '2023-04-18',
          downloadCon: 10
        }
      ]
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // this.getDownloadList()
  },
  methods: {
    getDownloadApplyList(status) {
      software.getDownloadSoftwareApplyList(status, this.userInfo.userId, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.total = response.data.total
        } else {
          this.softwareData = []
        }
      })
    },
    getDownloadList() {
      software.getDownloadList(this.userInfo.userId, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.total = response.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      if (this.activeName === 'first') {
        this.getDownloadList()
      } else if (this.activeName === 'second') {
        this.getDownloadApplyList(1)
      } else {
        this.getDownloadApplyList(0)
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.activeName === 'first') {
        this.getDownloadList()
      } else if (this.activeName === 'second') {
        this.getDownloadApplyList(1)
      } else {
        this.getDownloadApplyList(0)
      }
    },
    handleTabClick(tab) {
      return false;
      switch (tab.name) {
        case 'first':
          this.getDownloadList()
          break
        case 'second':
          this.getDownloadApplyList(1)
          break
        case 'third':
          this.getDownloadApplyList(0)
          break
      }
    }
  }
}
</script>
<style scoped>

</style>
