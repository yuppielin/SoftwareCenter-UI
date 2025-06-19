<!--<template>-->
<!--  <el-dialog :visible.sync="dialogVisible" width="800px" append-to-body @close="dialogClose">-->
<!--    <div slot="title">-->
<!--      <span style="padding-right: 10px;">{{title}}</span>-->
<!--    </div>-->
<!--    <el-card style="padding-top:0">-->
<!--      <h2 class="title">{{ noticeData.title }}</h2>-->
<!--      <p class="about">-->
<!--        <center>-->
<!--          <span>发布时间：{{ noticeData.releaseDate }}</span>&nbsp;-->
<!--          <span>发布人：{{ noticeData.cname }}</span>&nbsp;&nbsp;-->
<!--        </center>-->

<!--        <center class="right">-->
<!--          <span>联系人：{{ noticeData.linkman}}</span>&nbsp;&nbsp;-->
<!--          <span>联系方式：{{ noticeData.linkmantel}}</span>&nbsp;&nbsp;-->
<!--          &lt;!&ndash; <span>共有2访问</span> &ndash;&gt;-->
<!--        </center>-->
<!--      </p>-->
<!--      &lt;!&ndash; <el-divider></el-divider> &ndash;&gt;-->
<!--      <div class="content">-->
<!--        {{ noticeData.content }}-->
<!--      </div>-->
<!--      <el-divider />-->
<!--      <div v-if="noticeData.path!=null" class="fujian">-->
<!--        附件：-->
<!--        <el-button style="color:#3b5975" type="text" @click="download"> {{ pathInfo.fileName }}</el-button>-->
<!--      </div>-->
<!--    </el-card>-->

<!--    <div slot="footer" class="dialog-footer">-->
<!--      <el-button size="small" type="info" @click="dialogClose">关 闭</el-button>-->
<!--    </div>-->
<!--  </el-dialog>-->
<!--</template>-->

<!--<script>-->
<!--import * as notice from '@/api/notice'-->
<!--import * as appConfig from "/public/config";-->
<!--export default {-->
<!--  props: {-->
<!--    data: {-->
<!--      type: Object,-->
<!--      // eslint-disable-next-line vue/require-valid-default-prop-->
<!--      default: null-->
<!--    },-->
<!--    noticeVisibleFlag: {-->
<!--      default: false-->
<!--    },-->
<!--    title: {-->
<!--      type: String,-->
<!--      default: null-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      dialogVisible: false,-->
<!--      noticeData: {},-->
<!--      pathInfo: {-->
<!--        fileName: '',-->
<!--        filePath: ''-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    data() {-->
<!--      this.noticeData = this.data-->
<!--      this.pathInfo = JSON.parse(this.noticeData.path)-->
<!--    }-->
<!--    noticeData(newValue, oldValue) {-->
<!--      if (newValue.id !== oldValue.id) {-->
<!--        return newValue-->
<!--      }-->
<!--      // newValue.title = notice.content-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--  },-->
<!--  methods: {-->
<!--    dialogClose() {-->
<!--      this.$emit('update:noticeVisibleFlag', false)-->
<!--      this.$emit('clearData', false)-->
<!--    },-->
<!--    download() {-->
<!--      // notice.downNoticeFile(this.noticeData.id).then(response => {-->
<!--      //   if (response.code === 200) {-->
<!--      //     window.location.href = response.data-->
<!--      //   }-->
<!--      // })-->
<!--      let url = appConfig.config.urlFilePrefix+'/'+ this.pathInfo.filePath-->
<!--      const a = document.createElement('a')-->
<!--      fetch(url).then(res => res.blob()).then(blob => {-->
<!--        a.href = URL.createObjectURL(blob)-->
<!--        a.download=this.pathInfo.fileName-->
<!--        document.body.appendChild(a)-->
<!--        a.click()-->

<!--        window.URL.revokeObjectURL(a.href)-->
<!--        document.body.removeChild(a)-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.title {-->
<!--  text-align: center;-->
<!--  // border-top: 3px solid #087cd6;-->
<!--  padding-top: 30px;-->
<!--  // line-height: 160%;-->
<!--  font-size: 28px;-->
<!--  margin: 0;-->
<!--}-->
<!--// .source{-->
<!--//   margin: 0 24px;-->
<!--//   border-bottom: 1px dashed #ededed;-->
<!--//   padding-bottom: 10px;-->
<!--//   overflow: hidden;-->
<!--//   clear: both;-->
<!--//   font-size: 1.4rem;-->
<!--// }-->
<!--.about {-->
<!--  font-size: 12px;-->
<!--  text-align: center;-->
<!--  line-height: 20px;-->
<!--  margin-top: 20px;-->
<!--  padding-bottom: 10px;-->
<!--  border-bottom: 1px dashed #ededed;-->
<!--  overflow: hidden;-->
<!--  span {-->
<!--    font-size: 14px;-->
<!--    margin-right: 6px;-->
<!--  }-->
<!--  center {-->
<!--    text-align: left;-->
<!--    float: left;-->
<!--  }-->
<!--  .right {-->
<!--    text-align: right;-->
<!--    float: right;-->
<!--  }-->
<!--}-->
<!--.content {-->
<!--  min-height: 300px;-->
<!--  p {-->
<!--    line-height: 30px;-->
<!--    word-break: break-all;-->
<!--    margin: 0;-->
<!--    text-indent: 2em;-->
<!--    text-align: justify;-->
<!--    font-family: 宋体;-->
<!--    font-size: 14px;-->
<!--    padding: 15px 0 0;-->
<!--  }-->
<!--}-->
<!--.fujian {-->
<!--  //   border-top: 1px dashed #bbb;-->
<!--  margin-top: 20px;-->
<!--  padding: 9px 0px;-->
<!--}-->
<!--.el-card {-->
<!--  border-top: 3px solid #087cd6;-->
<!--}-->
<!--.el-card__body {-->
<!--  padding-top: 0px;-->
<!--}-->
<!--</style>-->
