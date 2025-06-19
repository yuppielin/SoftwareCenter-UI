<template>
  <div style="margin:60px 20px 20px 20px;">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <img height="265" width="100%" :src="logoAndPicUrl+themeData.picPath" :onerror="defaultS">
        </el-col>
        <el-col :span="12">
          <div>
            <span style="font-size:20px;font-weight:600;margin-right:5px;">{{ themeData.name }}</span>
            <i class="el-icon-s-operation" />
            <span style="font-size:18px;color:gray;margin-left:5px;">{{ softwareData.length }}个软件</span>
          </div>
          <div class="theme-desc">
            {{ themeData.description }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div style="margin:0 -10px;">
      <Sitem v-for="(item,index) in softwareData" :key="index" :data="item" style="width:32%;margin:10px;float:left;" />
    </div>
  </div>
</template>
<script>
import * as software from '@/api/software'
import * as special from '@/api/special'
// import * as appConfig from '/public/config'

import Sitem from '../components/software-item.vue'
export default {
  components: {
    Sitem
  },
  data() {
    return {
      softwareData: [],
      pageNum: null,
      pageSize: null,
      themeData: {},
      totalPage: 0,
      globalUrl: '',
      userInfo: {},
      defaultS: 'this.src="' + require('@/assets/index/theme.png') + '"',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSpecialInfo(parseInt(this.$route.params.id))
    this.getSoftwareListBySpecial()
    this.globalUrl = appConfig.config.url
    // this.getSoftwareList(themeId)
  },
  mounted() {
  },
  methods: {
    // 获取成果清单
    getSoftwareListBySpecial() {
      software.getSoftwareListBySpecial(parseInt(this.$route.params.id), this.userInfo.userId, null, this.pageNum, this.pageSize).then(response => {
        this.softwareData = response.data
        this.totalPage = response.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    getSpecialInfo(id) {
      special.getSpecialInfo(id).then(response => {
        if (response.code === 200) {
          this.themeData = response.data
        }
      })
    }
  }
}
</script>
<style>
    .theme-desc{
        line-height:20px;
        font-size:18px;
        margin-top:20px;
        color:#a1a1a1;
        line-height: 20px;
        margin: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 7;
        display: -webkit-box;
    }
</style>
