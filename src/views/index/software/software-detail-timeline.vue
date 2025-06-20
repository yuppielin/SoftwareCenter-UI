<template>
  <div class="LBDiv time-line-container">
    <!-- Swiper -->
    <div class="swiper-container">
      <div
        class="swiL"
      />
      <div class="swiper-wrapper">
        <!-- 单块开始 -->
        <div v-for="(item, index) in versions.reverse()" :key="index" class="swiper-slide">
          <div class="TimeDiv">
            <div class="TimeDivTitle">
              <div class="TimeDivMain">
                <h2>版本{{item.version}}</h2>
              </div>
              <div class="TimeDivD" />
              <div class="TimeDivD2">
                <img :src="require('@/assets/time_line/t1.png')" width="25" height="25">
                <div class="TimeDivD3" />
              </div>
            </div>
            <div class="TimeBtm">
              <!-- 单块开始 -->
             <table v-for="(vs, ks) in item.softwareDataList" :key="ks" class="TT" cellspacing="0" cellpadding="0">
               <tr>
                 <td class="TT2" />
                 <td>
                   <div class="TT3">
                     <div class="TT3L" />
                     <div class="TT3Div">
                       <p>
                         资料:
<!--                            <el-button type="text" size="mini" class="data_name" @click="downloadSoftwareData(vs)">{{ vs.name }}</el-button>-->
                            <span style="font-size:12px;cursor:pointer;color: #0a5f77" @click="downloadSoftwareData(vs)">{{ vs.name }}</span>
                            <span style="font-size:12px;">&nbsp;({{ formatFileSize(vs.sizes) }})</span>
                             <!-- <el-button size="mini" type="text" v-show="judgeShowSoftwareData(vs.name)" @click="showSoftwareDataDialog(vs)">查看</el-button> -->
                       </p>
                     </div>
                   </div>
                 </td>
               </tr>
             </table>
              <!-- 单块结束 -->
            </div>
          </div>
        </div>
      </div>
      <div
        class="swiR"
      />
    </div>
    <!-- Add Arrows -->
    <div class="swiper-button-next" style="top:55px;height: 30px;" />
    <div class="swiper-button-prev" style="top:55px;height: 30px;" />
    <el-dialog
      title="资料查看"
      :visible.sync="showSoftwareDataVisible"
      :before-close="closeSoftwareDataDialog"
    >
      <div style="text-align: center;">
        <div
          v-if="typeJudge==1"
          ref="preview"
          id="preview"
          class="pdfPriview"
          v-loading="loading"
          element-loading-text="加载中，请耐心等待"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.8)"
          style="height:500px;overflow-y:auto"
        />
        <iframe
          :src="previewUrl"
          v-else-if="typeJudge==2"
          type="application/x-google-chrome-pdf"
          width="100%"
          frameborder="0"
          scrolling="auto"
          height="500px"
        />
        <el-image
          style="width: 400px;height: 100%;"
          v-else-if="typeJudge==3"
          :src="previewUrl"
          fit="cover"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as software from '@/api/software'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import download from 'download-1.4.7'
let docx = require("docx-preview")
window.JSZip = require("jszip")
export default {
  name: 'Timeline',
  components: {},
  props: {
    versions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      imgSource: require('@/assets/index/softwareDefault.png'),
      previewType: ["docx", "doc", "png", "jpg", "pdf", 'mp4'],
      showSoftwareDataVisible:false,
      typeJudge: 0,
      loading: false,
      previewUrl:''
    }
  },
  watch: {},
  created() {
    // this.getSoftwareTimeline()

  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    var swiper = new Swiper('.time-line-container .swiper-container', {
      spaceBetween: 0,
      initialSlide: 0,
      slidesPerView: 3,
      navigation: {
        nextEl: '.time-line-container .swiper-button-next',
        prevEl: '.time-line-container .swiper-button-prev'
      }
    })
  },
  methods: {
      judgeShowSoftwareData(value) {
      let fileType = value.substring(value.lastIndexOf(".") + 1);
      if (this.previewType.indexOf(fileType) === -1) {
        return false;
      } else {
        return true;
      }
    },
    downloadSoftwareData(item) {
      software.downloadSoftwareData(this.userInfo.userId, item.id).then(response => {
        const blob = new Blob([response])
        download(blob, item.name, item.name.lastIndexOf('.') + 1)
      })
    },
    showSoftwareDataDialog(item) {
      let fileType = item.name.substring(item.name.lastIndexOf(".") + 1);
      switch (fileType) {
        case "docx":
          this.loading = true;
          this.showSoftwareDataVisible = true;
          // this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "doc":
          this.showSoftwareDataVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "pdf":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "mp4":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "jpg":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
        case "png":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
      }
    },
    async docPreview(id) {
      software.downloadSoftwareData(this.userInfo.userId, id).then(response => {
        const blob = new Blob([response]);
        docx.renderAsync(blob, this.$refs.preview);
        this.showSoftwareDataVisible = true;
      });
    },
    closeSoftwareDataDialog() {
      this.showSoftwareDataVisible = false;
    },
  }
}
</script>

<style scoped >
.data_name{
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
}
.swiper-container {
  width: 90%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.LBDiv {
  width: 100%;
  min-height: 10px;
  margin: 0px auto;
  height: auto;
  _height: auto;
  overflow: hidden;
  zoom: 1;
  position: relative;
  margin-top: 10px;
  margin-bottom: 30px;
  border: 1px solid #f9f9f9;
}
.TimeDiv {
  width: 100%;
  min-height: 10px;
  margin: 0px auto;
  height: auto;
  _height: auto;
  overflow: hidden;
  zoom: 1;
}
.TimeDivTitle {
  width: 100%;
  height: 60px;
  position: relative;
}
.TimeDivD {
  width: 100%;
  height: 3px;
  background: #4d7bff;
  position: absolute;
  top: 39px;
}
.swiL {
  width: 3px;
  height: 3px;
  position: absolute;
  top: 51px;
  z-index: 999;
  background: url("~@/assets/time_line/t2.jpg") no-repeat top center;
  background-size: 7px 7px;
}
.swiR {
  width: 3px;
  height: 3px;
  position: absolute;
  top: 51px;
  z-index: 999;
  right: 0px;
  background: url("~@/assets/time_line/t3.jpg") no-repeat top center;
  background-size: 7px 7px;
}
.TimeDivD2 {
  width: 25px;
  height: 25px;
  position: absolute;
  left: 20px;
  bottom: -3px;
  position: relative;
}
.TimeDivD2 img {
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;
}
.TimeDivD3 {
  width: 3px;
  height: 20px;
  z-index: 1;
  bottom: -10px;
  left: 49%;
  margin-left: -1px;
  background: #4d7bff;
  position: absolute;
}
.TimeDivMain {
  width: 100%;
  height: 25px;
}
.TimeDivMain h2 {
  line-height: 25px;
  font-weight: normal;
  font-size: 15px;
  color: #4d7bff;
  text-align: left;
  margin-left: 5px;
}
.TimeBtm {
  width: 100%;
  min-height: 10px;
  max-height: 200px;
  margin: 0px auto;
  overflow-y: scroll;
  /* height: auto;
  _height: auto; */
  /* overflow: hidden; */
  zoom: 1;
}
.TimeBtm1 {
  width: 2px;
  background: #4d7bff;
  margin-left: 20px;
}
.TT {
  /* width: 100%; */
  width: calc( 100% - 31px );
  height: 100%;
  margin-left: 31px;
}
.TT2 {
  width: 3px;
  height: 100%;
  background: #4d7bff;
}
.TT3 {
  width: 78%;
  min-height: 35px;
  margin: 0px auto;
  height: auto;
  _height: auto;
  zoom: 1;
  margin-left: 15px;
  position: relative;
}
.TT3L {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2e5fea;
  position: absolute;
  left: -21px;
  top: 20px;
}
.TT3Div {
  width: 100%;
  min-height: 35px;
  margin: 0px auto;
  height: auto;
  _height: auto;
  overflow: hidden;
  zoom: 1;
  border-radius: 8px;
  background: #eff3ff;
  margin-top: 10px;
}
.TT3Div p {
  line-height: 25px;
  color: #5c5c5c;
  font-size: 14px;
  padding: 10px 20px;
  text-align: left;
  margin: 0px;
}
</style>
