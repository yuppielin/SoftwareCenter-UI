<template>
  <el-card id="software-item">
    <el-row style="text-align:center">
      <div style="float:left;width: 60px">
        <!-- <img :src="data.logo+'?imgSource'" :onerror="defaultS" width="60px" height="60px" style="margin:10px 0; float:left;margin-right: 10px"> -->
        <img :src="globalUrl+data.logo" :onerror="defaultS" width="60px" height="60px" style="margin:10px 0; float:left;margin-right: 10px">
      </div>
      <div style="float:right;display:inline-block;text-align: left;width: calc( 100% - 70px )">
        <div style="margin-top:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
          <router-link :underline="false" style="font-size:15px;font-weight:bold;" :to="{path:'/index/list/'+data.softwareId,query:{version:selectedVersion}}">{{ data.name }}</router-link>
        </div>
        <!-- <div style="color: grey">
          <{{data.identity}}>
        </div> -->
        <!-- <div style="margin-top:5px;line-height:20px">
          <el-row :gutter="10">
            <el-col :span="12" style="font-size:14px;">
              软件版本：
              <el-select v-model="selectedVersion" size="mini" style="width:80px" @change="handleVersionChange">
                <el-option v-for="(version,index) in data.versions" :key="index" :value="version.id" :label="version.version" />
              </el-select>
            </el-col>
            <el-col :span="12" style="font-size:14px;">
                软件类别：<span style="font-size:14px;">{{ data.category }}</span>
            </el-col>
          </el-row>
        </div> -->
        <div style="margin-top:5px;line-height:20px;font-size:12px;display:flex;align-items:center;white-space:nowrap;">
              <span style="font-size:12px;">版本号：</span>
              <el-select v-model="selectedVersion" size="mini" style="width:auto;min-width:80px;max-width:120px;margin-left:2px;" @change="handleVersionChange">
                <el-option v-for="(version,index) in data.versions" :key="index" :value="version.id" :label="version.version" />
              </el-select>
        </div>
        <div style="margin-top:5px;line-height:20px;font-size:14px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
          <el-tooltip :content="data.category">
            <div style="display: flex;">
            <!-- <el-tag style="font-size:14px;color: rgba(23,138,227,1);height: 25px;line-height: 25px" v-for="(item,index) in data.category.split('，')" :key="index">{{ data.category }}</el-tag> -->
            <span v-if="data.category!='' && data.category!=null" >
              <el-tag :class="index==0?null:'notFirstTag'"  style="border-radius: 10px;font-size:8px;color: #022517;height: 16px;line-height: 16px" v-for="(item,index) in data.category.split(',')" :key="index">{{ item }}</el-tag>
            </span>
            <span v-else>
              <el-tag :class="index==0?null:'notFirstTag'"  style="border-radius: 10px;font-size:8px;color: #022517;height: 16px;line-height: 16px" v-for="(item,index) in showCategoryTypeList" :key="index">{{ item }}</el-tag>
            </span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-row>
    <!-- <div class="software-desc" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:14px;">
      软件描述：<span style="font-size:14px;">{{ data.description }}</span>
    </div> -->
    <el-row :gutter="10" style="text-align:center;margin-top:10px" v-if="data.softwareType!=1">
      <el-col :span="8" style="font-size:12px;">
        <span style="font-size:12px;color:#000000;">{{ data.ctime | parseTime('{y}-{m}-{d}') }}创建</span>
      </el-col>
      <el-col :span="7" style="font-size:12px;">
        <span style="font-size:12px;color:#000000;">{{ data.downloadCon }}次下载</span>
      </el-col>
      <el-col :span="9">
        <el-rate disabled-void-color="gray" v-if="data.scoreStr != 'null' || !data.scoreStr" :value="data.score/2" disabled score-template="{value}" show-score size="mini" text-color="#fff" />
        <el-rate disabled-void-color="gray" v-else v-model="value" disabled :allow-half="true" score-template="{value}" show-score size="mini" text-color="#fff" />
        <!--        <span>{{ data.uname }}</span>-->
      </el-col>
    </el-row>
    <el-row :gutter="10" style="text-align:center;margin-top:10px" v-else>
      <el-col :span="12" style="font-size:12px;">
        <span style="font-size:12px;color:#000000;">{{ data.ctime | parseTime('{y}-{m}-{d}') }}创建</span>
      </el-col>
      <el-col :span="12" style="font-size:12px;">
        <span style="font-size:12px;color:#000000;">{{ data.downloadCon }}次下载</span>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="10" style="text-align:center">
      <el-col :span="12">
        <el-button  v-if="data.permission==1"  icon="el-icon-download" title="软件下载" type="text" round style="color:#0c5f2e" @click="downloadSoftware(data)" />
        <el-button  v-else  icon="el-icon-s-promotion" title="申请下载" type="text" round style="color:#0c5f2e" @click="addSoftwareDownloadApply(data)"></el-button>
      </el-col>
      <el-col :span="12">
        <el-button :disabled="data.permission!=1" icon="el-icon-document-copy" title="资料下载" type="text" round style="color:#0c5f2e" @click="downloadSoftwareData(data)" />
      </el-col>
      <!-- <el-col :span="8">
                <el-button icon="el-icon-star-off" title="软件收藏" type="text" round style="color:#0c5f2e"></el-button>
            </el-col> -->
    </el-row>
  </el-card>
</template>
<script>
import * as software from '@/api/software'
import download from 'download-1.4.7'
import * as category from "@/api/category";
import { parseTime} from "@/utils/common";
// import * as appConfig from '/public/config'
export default {
  props: {
    data: {
      type: Object,
      default: null,
      required: true
    }
  },
  data() {
    return {
      selectedVersion: null,
      userInfo: {},
      imgSource: require('@/assets/index/softwareDefault.png'),
      defaultS: 'this.src="' + require('@/assets/index/softwareDefault.png') + '"',
      globalUrl: '',
      value: 0.0,
      categoryTypeList: [],
      showCategoryTypeList: []
    }
  },
  watch: {
    data() {
      const item = this.data
      // debugger
      if (item.versions.length > 0) {
        for(let i=0;i<item.versions.length;i++){
          if(item.versions[i].currents == 1){
            this.selectedVersion = item.versions[i].id
          }
        }
      }
      // console.log(item,"item")
      let categoryIdsList = item.categoryIds!=null?item.categoryIds.split(","):""
      if(categoryIdsList.length>0){
        this.showCategoryTypeList = []
        categoryIdsList.forEach(Element=> {
          for(let num = 0;num<this.categoryTypeList.length;num++){
            if(parseInt(Element)==this.categoryTypeList[num].id){
              this.showCategoryTypeList.push(this.categoryTypeList.name)
              break
            }
          }
        })
        // console.log(this.showCategoryTypeList, "showCategoryTypeList")
      }
    }
  },
  async created() {
    if(!this.data.category) {
      await this.getSoftwareTypeList()
    }
    
  },
  async mounted() {
    this.globalUrl = appConfig.config.urlFilePrefix
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const item = this.data
    if (item.versions.length > 0) {
      for(let i=0;i<item.versions.length;i++){
        if(item.versions[i].currents == 1){
          this.selectedVersion = item.versions[i].id
        }
      }
    }
    let categoryIdsList = item.categoryIds!=null?item.categoryIds.split(","):""
    // console.log(item,"item",this.categoryTypeList,categoryIdsList)
    if(categoryIdsList.length>0){
      this.showCategoryTypeList = []
      categoryIdsList.forEach(Element=> {
        for(let num = 0;num<this.categoryTypeList.length;num++){
          if(parseInt(Element)==this.categoryTypeList[num].id){
            this.showCategoryTypeList.push(this.categoryTypeList.name)
            break
          }
        }
      })
      // console.log(this.showCategoryTypeList, "showCategoryTypeList")
    }
  },
  methods: {
    getSoftwareTypeList() {
      category.getCategoryList("software_type").then(response => {
        if (response.code === 200) {
          this.categoryTypeList = response.data.list;
          // console.log(this.categoryTypeList, "categoryTypeList")
        }
      });
    },
    /**
     * 下载软件
     */
    downloadSoftware(data) {
      // if (this.data.permission === 0) {
      //   this.$message.error('无下载权限')
      // } else if (this.data.permission === 1) {
      //   this.$confirm('确认提交下载申请' + this.data.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply()
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } else if (this.data.permission === 2) {
      //   software.downloadSoftware(this.userInfo.userId, this.selectedVersion).then(response => {
      //     if (response.code === 200) {
      //       window.location.href = response.data
      //     }
      //   })
      // }
      // console.log(data, 9998);
      software.downloadSoftwareFile(this.userInfo.userId, this.selectedVersion)
      // .then(response => {
      //   const blob = new Blob([response])
      //   download(blob, data.fileName, data.fileName.lastIndexOf('.') + 1)
      // })

      // 下载软件分卷
     
      if(data.softwareVersionVolumes) {
        data.softwareVersionVolumes.forEach(element => {
            software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
        });
        
      }
    },
    /**
     * 下载软件资料
     */
    downloadSoftwareData(item) {
      // 判断软件下载权限
      // if (this.data.permission === 0) {
      //   this.$message.error('无下载权限')
      // } else if (this.data.permission === 1) {
      //   this.$confirm('确认提交下载申请' + this.data.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply()
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } else if (this.data.permission === 2) {
      //   // 有权限则调用下载方法
      //   software.getSoftwareDataListBySoftware(1, this.selectedVersion).then(response => {
      //     if (response.code === 200) {
      //       if (response.data.length > 0) {
      //         const zipFileName = this.data.name + '_资料包'
      //         software.downloadSoftwareDataBatch(this.userInfo.userId, this.selectedVersion).then(response => {
      //           const blob = new Blob([response], { type: 'application/zip' })
      //           const downloadUrl = window.URL.createObjectURL(blob)
      //           // window.location.href = url;
      //           const link = document.createElement('a')
      //           link.href = downloadUrl
      //           link.download = zipFileName
      //           link.click()
      //           URL.revokeObjectURL(downloadUrl)
      //         })
      //       } else {
      //         this.$message.warning('该软件资料未通过审核或者该软件没有资料')
      //       }
      //     }
      //   })
      // }

      this.$router.push({
        path: '/index/software-data/' + item.softwareId,
        query: {
          version: this.selectedVersion
        }
      })
    },
    /**
     * 处理版本改变事件
     * @param version 版本
     */
    handleVersionChange(versionId) {
      // console.log("change version", versionId)
      this.selectedVersion = versionId
      this.data.versions.forEach(i => {
        if (i.id === versionId) {
          this.data.uname = i.uname
          this.data.ctime = i.ctime
          this.data.description = i.description
          this.data.ctime = i.ctime

          // console.log(i,"i.softwareVersionVolumes");
          this.data.softwareVersionVolumes = i.softwareVersionVolumes;
        }
      })
    },
    /**
     * 提交软件下载申请
     */
    // addSoftwareDownloadApply() {
    //   software.downloadSoftwareApply(this.selectedVersion, this.userInfo.userId, this.userInfo.realName).then(response => {
    //     if (response.code === 200) {
    //       this.$message.success('软件资源下载申请已提交')
    //     }
    //   })
    // }
    addSoftwareDownloadApply(item) {
       this.$confirm('确认提交下载申请' + item.name + '吗?', '提示', {
          type: 'warning'
        }).then(() => {
          software.downloadSoftwareApply(this.selectedVersion, this.userInfo.userId, this.userInfo.realName).then(response => {
            if (response.code === 200) {
              this.$message.success('软件资源下载申请已提交')
            }
          })
         }).catch(() => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped lang="scss">
    #software-item{
        margin: 5px 0;
        line-height: 20px;
        ::v-deep .el-card__body{
            // padding: 10px !important;
            padding-bottom: 4px;
        }
        span{
            color:rgb(161, 161, 161)
        }
        ::v-deep .el-select .el-input .el-select__caret {
            color: #C0C4CC;
        }
        ::v-deep .el-input__inner{
          background: rgba(0,0,0,0.05) !important;
        }
        .software-desc{
            line-height: 20px;
            // margin: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            display: -webkit-box;
        }
        .el-divider--horizontal{
            margin: 0;
        }
        //下拉框样式设置
       ::v-deep .el-input--mini .el-input__inner {
            height: 20px;
            line-height: 20px;
            padding-right: 25px;
        }
       ::v-deep .el-input--mini .el-input__icon {
            line-height: 20px;
        }
    }
    #software-item ::v-deep .el-select-dropdown__list {
      max-height: 180px;
      overflow-y: auto;
    }
    
    #software-item ::v-deep .el-select-dropdown__item {
      padding: 0 10px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
</style>
<style scoped>
  ::v-deep .el-select-dropdown__list {
    background-color: #fff;
  }
  ::v-deep .el-rate__icon {
    font-size: 14px;
  }
  .notFirstTag {
    margin-left: 3px;;
  }
</style>
