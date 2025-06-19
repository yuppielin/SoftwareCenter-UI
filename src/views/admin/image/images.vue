<template>
  <div class="app-container">
    <div class="cur-top-admin">
      <img class="icon" src="@/assets/index/softwareManage.png" />
      <span class="title">容器镜像管理</span>
    </div>
    <el-card class="custome custome-height">
      <!--镜像添加、搜索栏-->
      <el-row style="width: 100%">
        <el-col :span="8" style="border: 1px solid transparent">
          <el-button
            @click="openAddSoftwareDataDialog"
            size="small"
            type="primary"
            style="background: rgba(23, 138, 227, 1); border: 0; height: 32px"
            >添加容器镜像
          </el-button>
          <el-button
            @click="batchDownload"
            size="small"
            type="primary"
            style="background: rgba(23, 138, 227, 1); border: 0; height: 32px"
            :disabled="selectedImagesList.length == 0"
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
                placeholder="请输入容器镜像名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="getImagesList"
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
      <!--镜像列表展示界面-->
      <el-table
        :data="imageData"
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
          label="镜像名称"
          align="center"
          header-align="center"
          prop="name"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tag"
          align="center"
          header-align="center"
          prop="tag"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属软件"
          align="center"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="color: rgb(8, 151, 151)">{{ row.softwareName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="软件版本"
          width="100px"
          show-overflow-tooltip
          align="center"
          header-align="center"
        >
          <template slot-scope="{ row }">{{ row.versionName }}</template>
        </el-table-column>

        <el-table-column
          label="所属架构"
          align="center"
          header-align="center"
          prop="architecture"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span style="margin-left: 10px">{{ row.architecture }}</span>
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
        >
          <template slot-scope="{ row }">{{ row.cname }}</template>
        </el-table-column>
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
              @click="showConfigFiles(row)"
            ></el-button>
            <el-button
              size="mini"
              title="下载"
              type="primary"
              circle
              icon="el-icon-download"
              @click="downloadFileByNameAndPath(row.name, row.path, row.tag)"
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
        v-if="imageData.length != 0"
        style="margin-top: 15px"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div v-if="imageData.length == 0" style="text-align: center">
        <el-image
          :src="require('@/assets/index/nodata.png')"
          style="height: 600px"
        ></el-image>
      </div>

      <!--添加容器镜像的Dialog-->
      <el-dialog
        id="addDataForSoftware"
        title="添加容器镜像"
        :visible.sync="addSoftwareImageForm.visible"
        :close-on-click-modal="false"
        width="850px"
      >
        <el-form
          ref="addSoftwareImageForm"
          :model="addSoftwareImageForm"
          label-position="right"
          label-width="105px"
          style="width: 800px; margin: 10px auto"
        >
          <el-form-item
            prop="name"
            label="镜像名称:"
            :rules="[
              { required: true, message: '镜像名称不能为空', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="addSoftwareImageForm.name"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="Tag"
            label="镜像Tag:"
            :rules="[
              { required: true, message: 'Tag不能为空', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="addSoftwareImageForm.Tag"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item
            prop="path"
            label="镜像路径:"
            :rules="[
              { required: true, message: '请上传镜像容器', trigger: 'change' },
            ]"
          >
            <el-input
              v-model="addSoftwareImageForm.path"
              size="small"
              readonly
              style="width: calc(100% - 90px); margin-right: 8px"
            />
            <el-button size="small" type="primary" @click="upload"
              >点击上传</el-button
            >
          </el-form-item>

          <el-form-item
            label="所属软件："
            prop="softwareId"
            :rules="[
              { required: true, message: '所属软件不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="addSoftwareImageForm.softwareId"
              filterable
              @change="changeSelectSoftware"
              ref="software"
              @blur="closeOptions('software')"
            >
              <el-option
                v-for="(item, index) in softwareList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="软件版本："
            prop="versionId"
            :rules="[
              { required: true, message: '软件版本不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 400px"
              v-model="addSoftwareImageForm.versionId"
              filterable
              ref="version"
              @blur="closeOptions('version')"
            >
              <el-option
                v-for="(item, index) in softwareVersionList"
                :key="index"
                :label="item.version"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="architecture"
            label="CPU架构:"
            :rules="[
              { required: true, message: 'CPU架构不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="addSoftwareImageForm.architecture"
              size="small"
              style="width: 400px"
              filterable
              reserve-keyword
              multiple
            >
              <el-option
                v-for="(item, index) in fragmentArchList"
                :key="index"
                :label="item.name"
                :value="item.identities"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="配置文件：">
            <el-upload
              action="#"
              :multiple="true"
              :auto-upload="true"
              :show-file-list="false"
              :before-upload="beforeUploadSoftwareData"
              :http-request="uploadImageConfigFiles"
              :accept="dataBeforeUploadCheck"
            >
              <el-button
                slot="trigger"
                icon="el-icon-upload"
                type="primary"
                size="small"
                >上传镜像的配置文件
              </el-button>
              <div slot="tip" class="el-upload__tip" style="display: flex">
                <div
                  style="
                    font-size: 12px;
                    height: 30px;
                    line-height: 30px;
                    min-width: 60px;
                  "
                >
                  支持格式：
                </div>
                <div style="font-size: 12px; height: 30px; line-height: 30px">
                  {{ dataBeforeUploadCheck }}
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-table
          :data="addSoftwareImageForm.uploadList"
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
          <el-button size="small" @click="addSoftwareImageForm.visible = false"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="makeSureUploadImage"
            >确定
          </el-button>
        </el-row>
      </el-dialog>

      <!--编辑容器镜像的Dialog-->
      <el-dialog
        title="编辑容器镜像"
        :visible.sync="visibleEditDlg"
        :close-on-click-modal="false"
        width="750px"
      >
        <el-form
          ref="editSoftwareImageForm"
          :model="editSoftwareImageForm"
          label-position="right"
          label-width="105px"
          style="width: 700px; margin: 10px auto"
        >
          <el-form-item
            prop="name"
            label="镜像名称:"
            :rules="[
              { required: true, message: '镜像名称不能为空', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="editSoftwareImageForm.name"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="tag"
            label="镜像Tag:"
            :rules="[
              { required: true, message: '镜像Tag不能为空', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="editSoftwareImageForm.tag"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item
            prop="path"
            label="镜像路径:"
            :rules="[
              { required: true, message: '请上传镜像容器', trigger: 'change' },
            ]"
          >
            <el-input
              v-model="editSoftwareImageForm.path"
              size="small"
              readonly
              style="width: calc(100% - 90px); margin-right: 8px"
            />
            <el-button size="small" type="primary" @click="upload"
              >点击上传</el-button
            >
          </el-form-item>

          <el-form-item
            label="所属软件："
            prop="softwareId"
            :rules="[
              { required: true, message: '所属软件不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 500px"
              v-model="editSoftwareImageForm.softwareId"
              filterable
              @change="changeSelectEditSoftware"
              ref="software"
              @blur="closeOptions('software')"
            >
              <el-option
                v-for="(item, index) in softwareList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="软件版本："
            prop="versionId"
            :rules="[
              { required: true, message: '软件版本不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              style="width: 500px"
              v-model="editSoftwareImageForm.versionId"
              filterable
              ref="version"
              @blur="closeOptions('version')"
            >
              <el-option
                v-for="(item, index) in editSoftwareVersionList"
                :key="index"
                :label="item.version"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="architecture"
            label="CPU架构:"
            :rules="[
              { required: true, message: 'CPU架构不能为空', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="editSoftwareImageForm.architecture"
              size="small"
              style="width: 500px"
              filterable
              reserve-keyword
              multiple
            >
              <el-option
                v-for="(item, index) in fragmentArchList"
                :key="index"
                :label="item.name"
                :value="item.identities"
              />
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      visibleEditDlg: false,
      keyword: "",
      imageData: [],
      userInfo: {},
      softwareList: [],
      softwareVersionList: [],
      editSoftwareVersionList: [],
      addSoftwareImageForm: {
        visible: false,
        name: null,
        Tag: null,
        path: null,
        fileName: null,
        size: null,
        softwareId: null,
        versionId: null,
        architecture: null,
        uploadList: [],
      },
      editSoftwareImageForm: {
        name: null,
        Tag: null,
        path: null,
        fileName: null,
        size: null,
        softwareId: null,
        versionId: null,
        architecture: null,
      },
      dataBeforeUploadCheck: ".jpg,.jpeg,.png,.doc,.docx,.html,.txt,.pdf",
      loading: false,
      selectedImagesList: [],
      userType: null,
      fragmentArchList: [],
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
    //获取容器镜像列表
    this.getImagesList();
    // 获取软件列表
    this.getSoftwareList();
    // 获取CPU架构类型列表
    this.getFragmentArchList();
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });
    // 文件上传成功的回调
    Bus.$on("fileSuccess", (list) => {
      console.log("文件上传成功!!");
      let fileData = list[list.length - 1];
      debugger;
      if (this.visibleEditDlg) {
        this.editSoftwareImageForm.path = fileData.path;
        this.editSoftwareImageForm.size = fileData.size;
      }
      if (this.addSoftwareImageForm.visible) {
        this.addSoftwareImageForm.fileName = fileData.fileName;
        this.addSoftwareImageForm.path = fileData.path;
        this.addSoftwareImageForm.size = fileData.size;
      }
    });
  },

  beforeDestroy() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
  },

  methods: {
    /**
     * 获取软件列表
     */
    getSoftwareList() {
      software.getAllSoftware().then((response) => {
        if (response.code === 200) {
          this.softwareList = response.data;
        }
      });
    },

    /**
     * 获取软件版本列表
     */
    getSoftwareVersionById() {
      software
        .getSoftwareVersion(this.addSoftwareImageForm.softwareId)
        .then((response) => {
          if (response.code === 200) {
            this.softwareVersionList = response.data;
          }
        });
    },

    deleteUploadFile(index) {
      this.addSoftwareImageForm.uploadList.splice(index, 1);
    },

    changeSelectSoftware() {
      this.addSoftwareImageForm.versionId = null;
      this.getSoftwareVersionById();
    },

    changeSelectEditSoftware() {
      this.editSoftwareImageForm.versionId = null;
      software
        .getSoftwareVersion(this.editSoftwareImageForm.softwareId)
        .then((response) => {
          if (response.code === 200) {
            this.editSoftwareVersionList = response.data;
          }
        });
    },

    openAddSoftwareDataDialog() {
      this.addSoftwareImageForm = {
        visible: true,
        name: null,
        Tag: null,
        path: null,
        fileName: null,
        size: null,
        softwareId: null,
        versionId: null,
        architecture: null,
        uploadList: [],
      };
    },

    /**
     * 上传镜像-确认方法
     */
    makeSureUploadImage() {
      this.$refs["addSoftwareImageForm"].validate((valid) => {
        if (valid) {
          const imageData = {
            imageName: this.addSoftwareImageForm.name,
            tag: this.addSoftwareImageForm.Tag,
            path: this.addSoftwareImageForm.path,
            // fileName: this.addSoftwareImageForm.fileName,
            size: this.addSoftwareImageForm.size,
            softwareId: this.addSoftwareImageForm.softwareId,
            softwareVersionId: this.addSoftwareImageForm.versionId,
            architecture: this.addSoftwareImageForm.architecture
              ? this.addSoftwareImageForm.architecture.join(",")
              : null,
            configFiles: JSON.parse(
              JSON.stringify(this.addSoftwareImageForm.uploadList)
            ),
          };

          image.addImages(imageData).then((response) => {
            if (response.code === 200) {
              this.$message.success("容器镜像上传成功。");
              this.addSoftwareImageForm.visible = false;
              //获取容器镜像列表
              this.getImagesList();
              // 获取软件列表
              this.getSoftwareList();
              // 获取CPU架构类型列表
              this.getFragmentArchList();
            } else {
              this.$message.error("容器镜像上传失败，请进行检查。");
            }
          });
        }
      });
    },

    /**
     * 编辑容器镜像
     */
    editUploadImage() {
      this.$refs["editSoftwareImageForm"].validate((valid) => {
        if (valid) {
          const imageData = {
            id: this.editSoftwareImageForm.id,
            imageName: this.editSoftwareImageForm.name,
            tag: this.editSoftwareImageForm.tag,
            path: this.editSoftwareImageForm.path,
            softwareId: this.editSoftwareImageForm.softwareId,
            softwareVersionId: this.editSoftwareImageForm.versionId,
            architecture: this.editSoftwareImageForm.architecture
              ? this.editSoftwareImageForm.architecture.join(",")
              : null,
            size: this.editSoftwareImageForm.size,
          };

          image.updateImages(imageData).then((response) => {
            if (response.code === 200) {
              this.$message.success("容器镜像修改成功。");
              this.visibleEditDlg = false;
              //获取容器镜像列表
              this.getImagesList();
            } else {
              this.$message.error("修改容器镜像失败，请进行检查!");
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

    // 获取CPU架构类型列表
    getFragmentArchList() {
      category.getCategoryList("fragment_arch", null, null).then((response) => {
        this.fragmentArchList = response.data.list;
      });
    },

    //上传容器镜像文件
    upload() {
      // 打开文件选择框
      Bus.$emit("openUploader", {
        // 给服务端的额外参数
        params: {
          // page: 'home'
        },
        options: {
          target: config.url + "/appstore/upload/fileUpload",
          accept: [".zip", ".tar"],
          singleFile: true,
        },
      });
    },

    getImagesList() {
      image
        .queryImagesList(this.keyword, this.currentPage, this.pageSize)
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
        image.deleteImages(item.id).then((response) => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.getImagesList();
          } else {
            this.$message.error(response.msg);
          }
        });
      });
    },

    showConfigFiles(item) {
      console.log("showConfigFiles", item);
      this.$router.push({
        path: "/admin/image/configs/",
        query: item,
      });
    },

    changeSelectedData(val) {
      this.selectedImagesList = val;
    },

    beforeUploadSoftwareData(file) {
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

    uploadImageConfigFiles(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then((response) => {
        if (response.code === 200) {
          this.addSoftwareImageForm.uploadList.push({
            filePath: response.data.fileName,
            fileName: response.data.originalFilename,
            size: file.size,
          });
        }
      });
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
      (this.keyword = ""), this.getImagesList();
    },

    downloadFileByNameAndPath(name, path, tag) {
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
          filename = filename + "_" + tag + fileType;
        }
        let url = config.urlFilePrefix + path;
        this.$download.downloadSoftwareByUrlAndEditName(url, filename);
      }
    },

    batchDownload() {
      this.$confirm("确定下载选中的镜像文件吗？", "提示", {
        type: "warning",
      }).then((e) => {
        for (let i = 0; i < this.selectedImagesList.length; i++) {
          let name = this.selectedImagesList[i].name;
          let path = this.selectedImagesList[i].path;
          let tag = this.selectedImagesList[i].tag;
          this.downloadFileByNameAndPath(name, path, tag);
        }
        this.getImagesList();
      });
    },

    handleEdit(row) {
      this.visibleEditDlg = true;
      this.editSoftwareImageForm = row;
      this.editSoftwareImageForm.architecture = row.architecture
        ? row.architecture.split(",")
        : null;
      software
        .getSoftwareVersion(this.editSoftwareImageForm.softwareId)
        .then((response) => {
          if (response.code === 200) {
            this.editSoftwareVersionList = response.data;
          }
        });
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