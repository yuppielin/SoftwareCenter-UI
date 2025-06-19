<template>
  <div class="app-container">
    <div class="cur-top-admin">
      <img class="icon" src="@/assets/index/softwareManage.png" />
      <span class="title">配置文件管理</span>
    </div>
    <el-card class="custome custome-height">
      <!--配置文件添加、搜索栏-->
      <el-row style="width: 100%">
        <el-col :span="8" style="border: 1px solid transparent">
          <el-button
            @click="openAddSoftwareDataDialog"
            size="small"
            type="primary"
            style="background: rgba(23, 138, 227, 1); border: 0; height: 32px"
            >添加配置文件
          </el-button>
          <el-button
            @click="batchDownload"
            size="small"
            type="primary"
            style="background: rgba(23, 138, 227, 1); border: 0; height: 32px"
            :disabled="selectedConfigFileList.length == 0"
            >批量下载
          </el-button>
        </el-col>
        <el-col :span="16" style="text-align: right">
          <el-form id="documentIndex" :inline="true">
            <el-form-item>
              <el-input
                size="medium"
                v-model="keyword"
                icon="el-icon-search"
                style="width: 200px"
                placeholder="请输入配置文件名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="getImageConfigFilesList"
                style="
                  margin-left: 10px;
                  background: rgba(23, 138, 227, 1);
                  border: 0;
                  height: 32px;
                "
                icon="el-icon-search"
                >搜索
              </el-button>
              <el-button size="small" @click="resetSearch" type="reset"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--配置文件列表展示界面-->
      <el-table
        :data="configFilesData"
        size="mini"
        stripe
        :header-cell-style="{ background: 'rgb(8, 151, 151)', height: '30px' }"
        @selection-change="changeSelectedData"
      >
      <el-table-column
          :reserve-selection="true"
          align="center"
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column width="80" type="index" align="center" label="序号" />
        <el-table-column
          label="文件名称"
          align="center"
          header-align="center"
          prop="fileName"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件类型"
          align="center"
          header-align="center"
          prop="type"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所属镜像"
          align="center"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="color: rgb(8, 151, 151)">{{
              row.imageName + ":" + row.tag
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="应用环境"
          align="center"
          header-align="center"
          prop="env"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.env }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          header-align="center"
          width="150px"
          label="大小"
          prop="size"
        >
          <template slot-scope="{ row }">
            <span v-text="showSizes(row.size)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          show-overflow-tooltip
          label="上传时间"
          prop="ctime"
          width="150px"
        >
          <template slot-scope="{ row }">{{
            row.ctime | parseTime("{y}-{m}-{d}")
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          show-overflow-tooltip
          label="上传人"
          prop="cname"
          width="120px"
        />

        <el-table-column
          align="center"
          header-align="center"
          label="操作"
          width="250"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              title="编辑"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(row)"
              circle
              style="margin-left: 0px"
            ></el-button>
            <el-button
              size="mini"
              title="查看配置文件"
              icon="el-icon-search"
              type="primary"
              circle
              @click="showConfigFileDialog(row)"
            ></el-button>
            <el-button
              size="mini"
              title="下载"
              type="primary"
              circle
              icon="el-icon-download"
              @click="downloadFileByNameAndPath(row.fileName, row.filePath)"
            ></el-button>
            <el-button
              size="mini"
              title="删除"
              type="danger"
              circle
              icon="el-icon-close"
              @click="deleteItem(row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        v-if="configFilesData.length != 0"
        style="margin-top: 15px"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div v-if="configFilesData.length == 0" style="text-align: center">
        <el-image
          :src="require('@/assets/index/nodata.png')"
          style="height: 800px"
        ></el-image>
      </div>

      <!--添加配置文件的Dialog-->
      <el-dialog
        id="addDataForSoftware"
        title="添加镜像配置文件"
        :visible.sync="addImageConfigForm.visible"
        :close-on-click-modal="false"
        width="850px"
      >
        <el-form
          ref="addImageConfigForm"
          :model="addImageConfigForm"
          label-position="right"
          label-width="105px"
          style="width: 800px; margin: 10px auto"
        >
          <el-form-item
            label="所属镜像："
            prop="imageId"
            :rules="[
              { required: true, message: '所属镜像不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="addImageConfigForm.imageId"
              filterable
              ref="software"
              clearable
            >
              <el-option
                v-for="(item, index) in imageData"
                :key="index"
                :label="item.name + ':' + item.tag"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="配置文件：">
            <el-upload
              action="#"
              :multiple="true"
              :auto-upload="true"
              :show-file-list="false"
              :before-upload="beforeUploadConfigFile"
              :http-request="uploadSoftwareData"
              :accept="dataBeforeUploadCheck"
            >
              <el-button
                slot="trigger"
                icon="el-icon-upload"
                type="primary"
                size="small"
                >上传配置文件
              </el-button>
              <div slot="tip" class="el-upload__tip" style="display: flex">
                <div
                  style="
                    font-size: 12px;
                    height: 60px;
                    line-height: 30px;
                    min-width: 60px;
                  "
                >
                  支持格式：
                </div>
                <div style="font-size: 12px; height: 60px; line-height: 30px">
                  {{ dataBeforeUploadCheck }}
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-table
          :data="addImageConfigForm.uploadList"
          style="width: 800px; margin: 10px auto"
          max-height="300px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60px"
          ></el-table-column>
          <el-table-column
            label="文件名称"
            prop="fileName"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.fileName"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="文件类型"
            prop="type"
            align="center"
            width="200px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.type"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="应用环境"
            prop="env"
            width="200px"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.env" placeholder="请选择" clearable>
                <el-option
                  v-for="item in envOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="140px">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete"
                title="删除"
                size="small"
                type="danger"
                @click="deleteUploadFile(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="text-align: center">
          <el-button size="small" @click="addImageConfigForm.visible = false"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="makeSureUploadConfigFile"
            >确定
          </el-button>
        </el-row>
      </el-dialog>

      <!--编辑配置文件的Dialog-->
      <el-dialog
        title="编辑配置文件"
        :visible.sync="visibleEditDlg"
        :close-on-click-modal="false"
        width="650px"
      >
        <el-form
          ref="editImageConfigForm"
          :model="editImageConfigForm"
          label-position="right"
          label-width="105px"
          style="width: 600px; margin: 10px auto"
        >
          <el-form-item label="文件名称">
            <el-input
              v-model="editImageConfigForm.fileName"
              size="small"
              style="width: 400px"
              readonly="readonly"
            />
          </el-form-item>

          <el-form-item prop="path" label="文件路径:">
            <el-input
              v-model="editImageConfigForm.filePath"
              size="small"
              readonly
              style="width: calc(100% - 90px); margin-right: 8px"
            />
            <el-button size="small" type="primary" @click="upload"
              >点击上传</el-button
            >
          </el-form-item>

          <el-form-item
            label="文件类型："
            prop="type"
            :rules="[
              { required: true, message: '文件类型不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="editImageConfigForm.type"
              filterable
              ref="software"
              clearable
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="应用环境"
            prop="env"
            :rules="[
              { required: true, message: '应用环境不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="editImageConfigForm.env"
              filterable
              ref="software"
              clearable
            >
              <el-option
                v-for="item in envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="所属镜像："
            prop="imageId"
            :rules="[
              { required: true, message: '所属镜像不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="editImageConfigForm.imageId"
              filterable
              ref="software"
              clearable
            >
              <el-option
                v-for="(item, index) in imageData"
                :key="index"
                :label="item.name + ':' + item.tag"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-row style="text-align: center">
          <el-button size="small" @click="visibleEditDlg = false"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="editUploadImage"
            >确定
          </el-button>
        </el-row>
      </el-dialog>
 <!--查看文件的Dialog-->
      <el-dialog
      title="文件查看"
      :visible.sync="showConfigFileVisible"
      :before-close="closeConfigFileDialog"
      v-if="showConfigFileVisible"
    >
      <div style="text-align: center;">
        <div
          v-if="typeJudge==1"
          ref="preview"
          id="preview"
          class="pdfPriview"
          v-loading="loading"
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
      <!-- 将上传组件全局注册 -->
      <global-uploader />
    </el-card>
  </div>
</template>
<script>
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as application from "@/api/application";
import * as image from "@/api/image";
import download from "download-1.4.7";
import Bus from "@/components/VueSimpleUploader/js/bus";
import globaluploader from "@/components/VueSimpleUploader/GlobalUploader";

let docx = require("docx-preview");
window.JSZip = require("jszip");

export default {
  components: {
    "global-uploader": globaluploader,
  },
  data() {
    return {
      typeData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      visibleEditDlg: false,

      keyword: "",
      imageIdParam:"",
      docForm: {
        name: "",
        size: "",
        type: "",
        softwareName: "",
        softwareVersion: "",
      },
      imageData: [],
      configFilesData: [],
      userInfo: {},

      softwareList: [],
      softwareVersionList: [],

      updateDocumentList: [],

      examineVisible: false,
      examineData: null,

      addSoftwareData: false,
      addImageConfigForm: {
        visible: false,
        imageId: null,
        uploadList: [],
      },
      editImageConfigForm: {
        fileName: null,
        filePath: null,
        size: null,
        imageId: null,
        type: null,
        env: null,
      },
      dataBeforeUploadCheck: '.jpg,.jpeg,.png,.doc,.docx,.html,.txt,.pdf',
      showConfigFileVisible: false,
      showSoftwareData: {
        type: null,
      },

      previewType: ["docx", "doc", "png", "jpg", "pdf", "mp4"],
      typeJudge: 0,
      loading: false,
      selectedConfigFileList: [],
      dataBatchVisible: false,
      userType: null,
      typeOptions: [
        {
          value: "基本配置类",
          label: "基本配置类",
        },
        {
          value: "镜像构建类",
          label: "镜像构建类",
        },
        {
          value: "运行环境类",
          label: "运行环境类",
        },
        {
          value: "其他类型",
          label: "其他类型",
        },
      ],
      envOptions: [
        {
          value: "dev",
          label: "dev",
        },
        {
          value: "prod",
          label: "prod",
        },
        {
          value: "test",
          label: "test",
        },
      ],
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.userType = localStorage.getItem("userType");
    //获取配置文件列表
    this.getImageConfigFilesList();
    //获取容器镜像列表
    this.getImagesList();
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });
    // 文件上传成功的回调
    Bus.$on("fileSuccess", (list) => {
      console.log("文件上传成功!!");
      let fileData = list[list.length - 1];
      this.editImageConfigForm.fileName = fileData.fileName;
      this.editImageConfigForm.filePath = fileData.path;
      this.editImageConfigForm.size = fileData.size;
    });
  },
  beforeDestroy() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
  },

  methods: {
    //获取配置文件列表
    getImageConfigFilesList() {
      image
        .getConfigFileList(this.keyword,this.$route.query.id, this.currentPage, this.pageSize)
        .then((response) => {
          if (response.code === 200) {
            this.configFilesData = response.data.records;
            this.total = response.data.total;
          }
        });
    },

    deleteUploadFile(index) {
      this.addImageConfigForm.uploadList.splice(index, 1);
    },

    openAddSoftwareDataDialog() {
      this.addImageConfigForm = {
        visible: true,
        imageId: null,
        uploadList: [],
      };
    },

    /**
     * 上传镜像配置文件-确认方法
     */
    makeSureUploadConfigFile() {
      this.$refs["addImageConfigForm"].validate((valid) => {
        if (valid) {
          const configFileData = {
            imageId: this.addImageConfigForm.imageId,
            configFiles: JSON.parse(
              JSON.stringify(this.addImageConfigForm.uploadList)
            ),
          };
          image.addConfigFiles(configFileData).then((response) => {
            if (response.code === 200) {
              this.$message.success("镜像配置文件上传成功。");
              this.addImageConfigForm.visible = false;
              //获取配置文件列表
              this.getImageConfigFilesList();
              //获取容器镜像列表
              this.getImagesList();
            } else {
              this.$message.error("镜像配置文件上传失败，请进行检查。");
            }
          });
        }
      });
    },

    /**
     * 编辑镜像配置文件
     */
    editUploadImage() {
      this.$refs["editImageConfigForm"].validate((valid) => {
        if (valid) {
          const configFileData = {
            id:this.editImageConfigForm.id,
            imageId: this.editImageConfigForm.imageId,
            fileName: this.editImageConfigForm.fileName,
            filePath: this.editImageConfigForm.filePath,
            size: this.editImageConfigForm.size,
            type: this.editImageConfigForm.type,
            env: this.editImageConfigForm.env,
          };
          
          image.updateConfigFile(configFileData).then((response) => {
            if (response.code === 200) {
              this.$message.success("配置文件修改成功。");
              this.visibleEditDlg = false;
              //获取配置文件列表
              this.getImageConfigFilesList();
              //获取容器镜像列表
              this.getImagesList();
            } else {
              this.$message.error("修改镜像配置文件失败，请进行检查。");
            }
          });
        }
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getImagesList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getImagesList();
    },

    getImagesList() {
      image
        .queryImagesList('',this.currentPage, this.pageSize)
        .then((response) => {
          if (response.code === 200) {
            this.imageData = response.data.records;
            this.total = response.data.total;
          }
        });
    },

    deleteItem(item) {
      this.$confirm("确定删除该镜像文件 " + item.name + " 吗？", "提示", {
        type: "warning",
      }).then((e) => {
        image.deleteConfigFiles(item.id).then((response) => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.getImageConfigFilesList();
          } else {
            this.$message.error(response.msg);
          }
        });
      });
    },

    //上传容器镜像配置文件
    upload() {
      // 打开文件选择框
      Bus.$emit("openUploader", {
        // 给服务端的额外参数
        params: {
          // page: 'home'
        },
        options: {
          target: config.url + "/appstore/upload/fileUpload",
          accept: [".jpg",".jpeg",".png",".html",".txt", ".pdf","doc","docx"],
          singleFile: true,
        },
      });
    },

    getDocumentKey(row) {
      return row.id;
    },

    changeSelectedData(val) {
      this.selectedConfigFileList = val;
    },

    beforeUploadConfigFile(file) {
      let fileSize = file.size / 1024 / 1024;
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const acceptType = this.dataBeforeUploadCheck.split(",");
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else if (fileSize > 100) {
        this.$message.error("该文件大小不符合当前允许上传大小!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },


    uploadSoftwareData(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then((response) => {
        if (response.code === 200) {
          this.addImageConfigForm.uploadList.push({
            filePath: response.data.fileName,
            fileName: response.data.originalFilename,
            size: file.size,
          });
        }
      });
    },


    async showConfigFileDialog(item) {
      debugger
      let isExist = await this.$download.isExistFile(item.filePath, item.fileName);
      if (isExist === false) {
        return false;
      }

      let fileType = item.fileName.substring(item.fileName.lastIndexOf(".") + 1);
      switch (fileType) {
        case "docx":
          this.showConfigFileVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "doc":
          this.showConfigFileVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "pdf":
          this.showConfigFileVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.filePath;
          this.typeJudge = 2;
          break;
        case "mp4":
          this.showConfigFileVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.filePath;
          this.typeJudge = 2;
          break;
        case "jpg":
          this.showConfigFileVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.filePath;
          this.typeJudge = 3;
          break;
        case "png":
          this.showConfigFileVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.filePath;
          this.typeJudge = 3;
          break;
      }
    },

    async docPreview(id) {
      image
        .downloadConfigFile(id)
        .then((response) => {
          docx.renderAsync(response, this.$refs.preview);
          this.showConfigFileVisible = true;
        });
    },

    closeConfigFileDialog() {
      this.showConfigFileVisible = false;
    },

    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },

    
    /**
     * 重置搜索
     */
    resetSearch() {
      this.currentPage = 1;
      (this.keyword = ""), this.getImageConfigFilesList();
    },

    
    downloadFileByNameAndPath(name, path) {
      if (
        name == null ||
        name == undefined ||
        name.trim() == "" ||
        path == null ||
        path == undefined ||
        path.trim() == ""
      ) {
        return this.$message.error("文件未上传，请上传文件后再下载");
      } else {
        let fileType = path.substring(path.lastIndexOf("."));
        let nameType = name.substring(name.lastIndexOf("."));
        let filename = name;
        if (fileType !== nameType) {
          filename = filename + fileType;
        }
        let url = config.urlFilePrefix + path;
        this.$download.downloadSoftwareByUrlAndEditName(url, filename);
      }
    },

    batchDownload() {
      this.$confirm("确定下载选中的配置文件吗？", "提示", {
        type: "warning",
      }).then((e) => {
        for (let i = 0; i < this.selectedConfigFileList.length; i++) {
          debugger
          let name = this.selectedConfigFileList[i].fileName;
          let path = this.selectedConfigFileList[i].filePath;
         
          this.downloadFileByNameAndPath(name, path);
        }
        this.getImageConfigFilesList();
      });
    },

    handleEdit(row) {
      this.visibleEditDlg = true;
      this.editImageConfigForm = JSON.parse(JSON.stringify(row));
    },

  },
};
</script>
<style lang='scss' scoped>
.title {
  font-size: 12px;
  display: inline-block;
  width: 260px;
  border-left: 4px #409eff solid;
  height: 15px;
  line-height: 15px;
  padding-left: 5px;
}

el-card {
  border-radius: 4px;
  border: 0px solid #e6ebf5;
}

#docFormId .el-form-item {
  margin-bottom: 10px;
}

#documentIndex .el-form-item {
  margin-bottom: 0;
}

#addDataForSoftware .el-dialog {
  margin-top: 10vh;
}

.el-button.is-disabled {
  color: white;
  background: #c8c9cc;
  border-color: #c8c9cc;
}

::v-deep .tree-select-medium {
  height: 36px;
  line-height: 36px;
  top: 2px;
}
</style>