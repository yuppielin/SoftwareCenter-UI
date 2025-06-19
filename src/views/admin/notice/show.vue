<template>
  <el-dialog :visible.sync="dialogVisible" width="800px" @close='dialogClose' title="查看通知" >
    <el-card style="padding-top:0">
      <h2 class="title">{{noticeInfo.title}}</h2>
      <p class="about">
        <center>
          <span>发布时间：{{noticeInfo.releaseDate}}</span>&nbsp;&nbsp;&nbsp;
          <!-- <span>发 布 人：{{noticeInfo.cname}}</span>&nbsp;&nbsp; -->
          <span>发布单位：{{noticeInfo.cname}}</span>&nbsp;&nbsp;
        </center>
      </p>
      <div class="content">
         {{noticeInfo.content}}
      </div>
      <el-divider></el-divider>
      <div class="fujian">
        <div class="left">
          <span style="display:inline-block;min-width:150px">联 系 人：{{noticeInfo.linkman=="" || noticeInfo.linkman==null ? "--": noticeInfo.linkman}}</span>&nbsp;&nbsp;
          <span>联系方式：{{noticeInfo.linkmantel=="" || noticeInfo.linkmantel==null ? "--": noticeInfo.linkmantel}}</span>&nbsp;&nbsp;
        </div>
        附件：
        <el-button  @click="downloadItem(noticeInfo)" style="color:#3b5975" type="text"> {{noticeInfo.path.fileName}}</el-button>
      </div> 
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="info" @click="dialogClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as notice from "@/api/notice"
// import * as appConfig from "/public/config";
import { config } from '@vue/test-utils';
import { blob } from 'jszip/lib/support';
export default {
  props: {
    noticeData: {
      type: Object,
      default: {}
    },
    noticeVisibleFlag: {
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      noticeInfo: {
        path: {
          fileName: ""
        }
      }
    };
  },
  methods: {
    dialogClose() {
      this.$emit('close', false)
    },
    download(){
      notice.downNoticeFile(this.noticeData.id).then(response => {
          if (response.code === 200) {
              window.location.href = response.data
              // window.open(response.data)
          }
      })
    },
    downloadItem(item) {
      // let url = appConfig.config.urlFilePrefix+'/'+ item.path.filePath
      // const a = document.createElement('a')
      // fetch(url).then(res => res.blob()).then(blob => {
      //   a.href = URL.createObjectURL(blob)
      //   a.download=item.path.fileName
      //   document.body.appendChild(a)
      //   a.click()

      //   window.URL.revokeObjectURL(a.href)
      //   document.body.removeChild(a)
      // })
      this.$download.dowanlodByPath(item.path.filePath, item.path.fileName)
    },
  },
  watch: {
    noticeVisibleFlag() {
      this.dialogVisible = this.noticeVisibleFlag
    },
    noticeData(newVal, oldVal) {
      if(newVal) {
        this.noticeInfo = JSON.parse(JSON.stringify(newVal))
      }
    }
  }
};
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  // border-top: 3px solid #087cd6;
  padding-top: 30px;
  // line-height: 160%;
  font-size: 28px;
  margin: 0;
}
// .source{
//   margin: 0 24px;
//   border-bottom: 1px dashed #ededed;
//   padding-bottom: 10px;
//   overflow: hidden;
//   clear: both;
//   font-size: 1.4rem;
// }
.about {
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ededed;
  overflow: hidden;
  span {
    font-size: 14px;
    margin-right: 6px;
  }
  center {
    // text-align: left;
    // float: left;
  }
  .right {
    text-align: right;
    float: right;
  }
}
.content {
  min-height: 300px;
  p {
    line-height: 30px;
    word-break: break-all;
    margin: 0;
    text-indent: 2em;
    text-align: justify;
    font-family: 宋体;
    font-size: 14px;
    padding: 15px 0 0;
  }
}
.fujian {
  //   border-top: 1px dashed #bbb;
  margin-top: 20px;
  padding: 9px 0px;
  font-size: 14px;
   .left {
    text-align: left;
    // float: left;
    overflow: hidden;
  }
  span {
    font-size: 14px;
  }
}
.el-card {
  border-top: 3px solid #087cd6;
}
.el-card__body {
  padding-top: 0px;
}
::v-deep .el-button{
  span{
    font-size: 14px;
  }
}
</style>