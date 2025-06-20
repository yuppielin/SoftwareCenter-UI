<template>
  <div id="application" style="margin:60px 20px;height: calc(100vh - 120px);">
    <el-row :gutter="10">
      <el-col :span="5">
        <img :src="appData.logo?logoAndPicUrl+appData.logo:defaultS" width="60px" height="60px" :onerror="defaultS">
      </el-col>
      <el-col :span="14" style="line-height:20px;">
        <div class="title" style="color: #fff">{{ appData.name }}</div>
        <div class="content">{{ appData.devUnit }}</div>
        <div style="margin:0 -5px;">
          <el-tag v-for="(item,index) in tag" :key="index" size="mini" type="primary" style="margin:0 5px;">{{ item }}</el-tag>
        </div>
      </el-col>
      <el-col :span="5" style="height:60px;line-height:60px;">
        <el-button size="mini" style="background: #2b2f3a;color:white;">下载</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="text-align:center;margin-top:10px;">
      <el-col :span="7">
        <div class="bigText" style="color: white">{{ appData.scoreStr == 'null' || appData.scoreStr == null ? '0.0' : appData.scoreStr }} <i class="el-icon-star" /></div>
        <div class="smallText">{{ questionList.length }} 条评价</div>
      </el-col>
      <el-col :span="1"><el-divider direction="vertical" /></el-col>
      <el-col :span="8">
        <div class="bigText" style="color: white">{{ appData.downloadCon }}<i class="el-icon-star" /></div>
        <div class="smallText">下载次数</div>
      </el-col>
      <el-col :span="1"><el-divider direction="vertical" /></el-col>
      <el-col :span="7">
        <div class="bigText" style="color: white">{{ appData.size }}<i class="el-icon-star" /></div>
        <div class="smallText">大小</div>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" style="margin-top:10px;" @tab-click="handleClick">
      <el-tab-pane label="详情" name="first">
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="border: solid 1px lightgray;border-radius: 4px;">
              <img :src="appData.pic?logoAndPicUrl+appData.pic:defaultS" width="100%" height="200px" :onerror="defaultS">
            </div>
          </el-col>
          <el-col :span="12">
            <el-row>
              <div style="border: solid 1px lightgray;border-radius: 4px;">
                <img :src="appData.pic?logoAndPicUrl+appData.pic:defaultS" width="100%" height="200px" :onerror="defaultS">
              </div>
            </el-row>
          </el-col>
        </el-row>
        <div style="line-height:20px;margin-top:5px;">
          <el-card title="应用描述">
            <el-row :gutter="20" style="margin-top:10px;">
              <el-col :span="12">
                <span class="bigText">应用版本: </span>
                <span class="smallText">{{ appData.version }}</span>
              </el-col>
              <el-col :span="12">
                <span class="bigText">创建时间: </span>
                <span class="smallText">{{ appData.ctime }}</span>
              </el-col>
            </el-row>
            <div class="smallText">{{ appData.description }}</div>
          </el-card>
        </div>
      </el-tab-pane>
<!--      <el-tab-pane label="评论(213)" name="second">-->
<!--        <el-button icon="el-icon-chat-line-square" style="float:right;" type="text" @click="commentVisible=true" />-->
<!--        <comment v-for="(item,index) in [1,2,2,3]" :key="index" />-->
<!--        <div v-show="commentVisible" style="position:fixed;bottom: 10px;width: calc(100vw - 40px);">-->
<!--          <el-input size="mini" placeholder="评论">-->
<!--            <el-button slot="suffix" type="text" icon="el-icon-position" />-->
<!--          </el-input>-->
<!--        </div>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import * as mobile from '@/api/mobile'
// import * as appConfig from "/public/config";
export default {
  components: {
    comment: () => import('./comment-item.vue')
  },
  data() {
    return {
      appData: {
        name: '资源服务软件',
        logo: require('@/assets/imgs/1.png'),
        devUnit: '果奇技术有限公司',
        tag: ['工具类', '办公类'],
        version: ['1.0', '2.0', '3.0'],
        description: '软件成果描述',
        createTime: '2022-03-25',
        downloadNumber: 10,
        pic: require('@/assets/index/softwareDefault.png')
      },
      activeName: 'first',
      questionList: [],
      commentVisible: false,
      defaultS: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      tag: [],
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  mounted() {
    this.getSoftwareDetail(this.$route.params.id, this.$route.query.version)
  },
  methods: {
    downloadSoftware(item) {
      mobile.downloadSoftware(this.userInfo.userId, item.versionId).then(response => {
        if (response.code === 200) {
          window.location.href = response.data
        }
      })
    },
    getSoftwareDetail(id, version) {
      mobile.getSoftwareInfo(id, version).then(response => {
        this.appData = response.data
        if (this.appData.category) {
          this.tag = this.appData.category.split(',')
        }
        // this.getSoftwareDataList(this.data.id, this.data.version)
        // this.getSoftwareQuestion()
      })
    },
    // getSoftwareQuestion() {
    //   question.getSoftwareQuestionList(this.data.versionId, this.userInfo.userId).then(response => {
    //     if (response.code === 200) {
    //       this.questionList = response.data
    //     }
    //   })
    // },
    handleClick(tab) {

    }
  }
}
</script>
<style scoped>
.title{
    font-size: 14px;
    font-weight: 600;
}
.content{
    font-size: 10px;
    color: gray;
}
.bigText{
    font-size: 10px;
    line-height: 15px;
}
.smallText{
    font-size:8px;
    color:gray;
}
#application >>> .el-card__body{
    padding: 10px;
}
</style>
