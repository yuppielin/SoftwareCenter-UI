<template>
  <div style="margin-top:60px;">
    <div>
      <el-row>
        <el-col :span="10">
          <div style="font-size: 14px;font-weight:600;padding:10px 15px;color: #ffffff">数据软件</div>
        </el-col>
        <el-col :span="14">
          <el-input v-model="keyword" size="mini" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" @input="getSoftwareListBySpecial" placeholder="关键字" />
        </el-col>
      </el-row>
    </div>
    <div v-for="(item,index) in appData" :key="index" style="margin:5px 0;padding:5px 10px;">
      <el-row>
        <el-col :span="20" @click.native="goToDetail(item)">
          <img width="50px" height="50px" :src="item.logo?logoAndPicUrl+item.logo:defaultS" style="float:left" :onerror="defaultS">
          <div style="float:left;margin-left:10px;line-height: 1.5;">
            <div style="font-size:10px;font-weight: 600;color: #ffffff">{{ item.name }}</div>
            <div style="font-size:4px;color: gray;">{{ item.description }}</div>
            <div style="font-size:4px;color: gray;">
              <i class="el-icon-download" />
              <span>{{ item.downloadCon }}</span>
              <el-divider direction="vertical" />
              <span>{{ item.size }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" style="background:black;color:white;" @click="downloadSoftware(item)">下载</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as mobile from '@/api/mobile'
// import * as appConfig from "/public/config";
export default {
  data() {
    return {
      appData: [],
      keyword: '',
      userInfo: {},
      defaultS: 'this.src="' + require('@/assets/index/software.png') + '"',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareListBySpecial()
  },
  methods: {
    getSoftwareListBySpecial() {
      mobile.getSoftwareListBySpecial(parseInt(this.$route.params.id), this.userInfo.userId, this.keyword, null, null).then(response => {
        this.appData = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    downloadSoftware(item) {
      mobile.downloadSoftware(this.userInfo.userId, item.versionId).then(response => {
        if (response.code === 200) {
          window.location.href = response.data
        }
      })
    },
    goToDetail(item) {
      this.$router.push({
        path: '/m/app/list/' + item.id,
        query: { version: item.version }
      })
    }
  }
}
</script>
<style scoped>

</style>
