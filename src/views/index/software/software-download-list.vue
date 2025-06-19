<template>
  <div class="app-container">
    <el-card class="custome custome-height">
      <div style="margin: 0 10px;">
        <el-row style="text-align:right">
          <el-button size="small" type="primary" icon="el-icon-back" onclick="history.go(-1)">返回</el-button>
        </el-row>
      </div>
      <div style="margin:10px;">
        <el-button type="primary" size="mini" @click="batchDownload" :loading="loading">批量下载</el-button>
        <el-button type="primary" size="mini" @click="batchByDownlader" :loading="loading">添加至下载器</el-button>
        <el-button type="primary" size="mini" @click="uploadDownloadVisible=true">导入下载</el-button>
        <span style="font-size: 12px;">（点此导入制式文件下载所需软件）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="margin-left: 10px;">
            <el-row class="tableHeaderTitle">
              <span style="display: block;margin-left: 20px;">已有软件列表</span>
            </el-row>
            <el-table
              :data="softwareData"
              size="mini"
              @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#2BB56E',height:'30px'}"
            >
              <el-table-column
                width="60"
                type="index"
                align="center"
                header-align="center"
                label="序号"
              />
              <el-table-column
                width="50"
                type="selection"
                align="center"
                header-align="center"
                label="全选"
                :selectable="checkSelectable"
              />
              <el-table-column
                min-width="100px"
                label="软件名称"
                prop="softwareName"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="软件描述" prop="description" width="300px" show-overflow-tooltip />
              <el-table-column align="center" header-align="center" label="软件类型">
                <template slot-scope="{row}">
                  <span v-if="row.softwareType==1">通用软件</span>
                  <div v-else>
                    <span
                      v-text="row.fragmentType==1?'数据库段':row.fragmentType==2?'镜像段':row.fragmentType==3?'客户端段':row.fragmentType==4?'服务段':'数据段'"
                    ></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="软件版本" prop="version"></el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="{row}">
                  <el-button
                    v-if="row.is_download==1"
                    type="primary"
                    size="small"
                    icon="el-icon-download"
                    @click="downloadSoftware(row)"
                  >下载</el-button>
                  <el-button
                  v-if="row.is_download==0"
                    type="info"
                    size="small"
                    @click="addSoftwareDownloadApply(row.version_id)"
                  >申请下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-right: 10px;">
            <el-row class="tableHeaderTitle">
              <span style="display: block;margin-left: 20px;">未有软件列表</span>
            </el-row>
            <el-table
              :data="unExistData"
              size="mini"
              :header-cell-style="{background:'#2BB56E',height:'30px'}"
            >
              <el-table-column
                width="60"
                type="index"
                align="center"
                header-align="center"
                label="序号"
              ></el-table-column>
              <el-table-column
                min-width="100px"
                label="软件名称"
                prop="softwareName"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="软件描述" prop="description" width="300px" show-overflow-tooltip />
              <el-table-column align="center" header-align="center" prop="type" label="软件类型">
                <template slot-scope="{row}">
                  <span v-if="row.softwareType==1">通用软件</span>
                  <div v-else>
                    <span
                      v-text="row.fragmentType==1?'数据库段':row.fragmentType==2?'镜像段':row.fragmentType==3?'客户端段':row.fragmentType==4?'服务段':'数据段'"
                    ></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="软件版本" prop="version"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      width="500px"
      title="导入下载"
      :visible.sync="uploadDownloadVisible"
      :before-close="beforeClose"
    >
      <el-row style="text-align: right;margin-bottom: 10px;">
        <el-button
          @click="downloadTemplateFile"
          icon="el-icon-download"
          size="small"
          type="primary"
        >模板下载</el-button>
      </el-row>
      <el-row style="text-align: center;">
        <el-upload
          :before-upload="handleSoftwareListBeforeUpload"
          :http-request="downloadBySoftwareList"
          action="null"
          :auto-upload="true"
          drag
          ref="softwareUploadFileRef"
          :multiple="false"
        >
          <i class="el-icon-upload" />
          <div>
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div>只能上传xls\xlsx文件</div>
        </el-upload>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import download from "download-1.4.7";
import * as category from "@/api/category";
import * as software from "@/api/software";
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      activeName: "first",
      pageSize: 10,
      currentPage: 1,
      total: 0,
      filter: {
        category: null,
        keyword: null
      },
      loading: false,
      softwareData: [],
      unExistData: [],
      // 组织列表控制
      treeData: [],
      downloadDataList: [],
      type: null, //common or service
      category: null,

      uploadDownloadVisible: false
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.uploadDownloadVisible = true;
  },
  methods: {
    beforeClose() {
      this.uploadDownloadVisible = false;
    },
    downloadTemplateFile() {
      software.downloadListTemplate().then(response => {
        console.log(response, "response");
        const fileName = "导入模板.xlsx";
        const blob = new Blob([response]);
        download(blob, fileName, fileName.lastIndexOf(".") + 1);
      });
    },
    downloadBySoftwareList(params) {
      let file = new FormData();
      file.append("file", params.file);
      software.importDownloadList(file).then(response => {
        if (response.code == 200) {
          this.softwareData = JSON.parse(JSON.stringify(response.data.exist));
          this.unExistData = JSON.parse(JSON.stringify(response.data.un_exist));
          this.uploadDownloadVisible = false;
        }
      });
    },
    handleSoftwareListBeforeUpload(file) {
      let accessList = [".xlsx", ".xls"];
      let fileType = file.name.substring(file.name.lastIndexOf("."));
      if (accessList.indexOf(fileType) == -1) {
        this.$message.error("允许上传文件格式为xlsx和xls");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    batchDownload() {
      this.loading = true;
      if (this.downloadDataList.length > 0) {
        // const zipFileName = '软件资源包'
        // software.downloadSoftwareBatch(this.downloadDataList).then(response => {
        //   const blob = new Blob([response], { type: 'application/zip' })
        //   const downloadUrl = window.URL.createObjectURL(blob)
        //   // window.location.href = url;
        //   const link = document.createElement('a')
        //   link.href = downloadUrl
        //   link.download = zipFileName
        //   link.click()
        //   URL.revokeObjectURL(downloadUrl)
        // })
        // console.log(this.downloadDataList);
        this.downloadDataList.forEach((item, index) => {
          // this.downloadSoftware({id:item.versionId})
          software.downloadSoftwareFile(
            this.userInfo.userId,
            item.versionId,
            1
          );

          // 下载软件分卷
          if(item.softwareVersionVolumes) {
            item.softwareVersionVolumes.forEach(element => {
                software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
            });
          }
        });
      } else {
        this.$message.warning("没有选择软件");
      }
      this.loading = false;
      // this.downloadDataList = []
    },
     batchByDownlader(){
       if (this.downloadDataList.length > 0) {
        let  items = [];
        this.downloadDataList.forEach((item, index) => {
          console.log(item,666);
          let itemObj = {};
           let url = software.downloadSoftwareFileUrl(
                        this.userInfo.userId,
                        item.versionId
                      );
           itemObj = {
                name: item.name,
                url:url,
                // size: item.size
            }
          items.push(itemObj);

          // 下载软件分卷
          if(item.softwareVersionVolumes) {
            item.softwareVersionVolumes.forEach(element => {
                let volumeUrl = software.downloadSoftwareVolumeFileUrl(this.userInfo.userId, element.versionId, element.id)
                itemObj = {
                      name: element.fileName,
                      url:volumeUrl,
                  }
                items.push(itemObj);
            });
          }
        });
        if(items.length==0) {
            this.$message.warning("没有选择软件");
            return false;
        }
        if (this.socket.readyState!=1) {
          alert('下载器未安装或未打开！');
        
          return false;
      }

      var json = {items:items};
      this.socket.send(JSON.stringify(json));

      } else {
        this.$message.warning("没有选择软件");
      }
    },
    handleSelectionChange(val) {
      this.downloadDataList = [];
      if (val.length > 0) {
        val.forEach(item => {
          this.downloadDataList.push({
            softwareId: item.software_id,
            versionId: item.version_id,
            name: item.fileName,
            type: 1,
            uid: this.userInfo.userId,
            softwareVersionVolumes: item.softwareVersionVolumes,
          });
        });
      }
    },
    downloadSoftware(data) {
      // if (data.permission === 0) {
      //   this.$message.error('无下载权限')
      // } else if (data.permission === 1) {
      //   this.$confirm('确认提交下载申请' + data.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply(data.versionId)
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } else if (data.permission === 2) {
      //   software.downloadSoftware(this.userInfo.userId, data.versionId).then(response => {
      //     if (response.code === 200) {
      //       window.location.href = response.data
      //     }
      //   })
      // }
      software.downloadSoftwareFile(this.userInfo.userId, data.version_id);

      // 下载软件分卷
      if(data.softwareVersionVolumes) {
        data.softwareVersionVolumes.forEach(element => {
            software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
        });
        
      }
    },
    addSoftwareDownloadApply(versionId) {
      software
        .downloadSoftwareApply(
          versionId,
          this.userInfo.userId,
          this.userInfo.realName
        )
        .then(response => {
          if (response.code === 200) {
            this.$message.success("下载申请已提交");
          }
        });
    },
    checkSelectable(row, index) {
      if (row.is_download === 1) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.tableHeaderTitle {
  display: flex;
  align-items: center;
  /* justify-content: left; */
  height: 40px;
  background-color: #d0d0d0;
}
::v-deep .el-dialog__header {
  padding: 10px !important;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;;
}
</style>
