<template>
  <el-card class="custome custome-height">
    <CloseBack></CloseBack>

    <el-form
      name="softwareForm"
      ref="softwareForm"
      :model="softwareForm"
      label-position="right"
      label-width="120px"
    >
      <el-form-item
        prop="name"
        label="软件名称:"
        :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur' }]"
      >
        <el-input disabled="" v-model="softwareForm.name" size="small" style="width:100%"></el-input>
      </el-form-item>
       <el-form-item
        prop="path"
        label="软件路径:"
        :rules="[{ required: true, message: '请上传软件', trigger: 'blur' }]"
      >
        <el-input class="notClick" v-model="softwareForm.path" size="small" style="width:calc(100% - 90px );margin-right:8px"></el-input>
        <el-button size="small" type="primary"  @click="upload">点击上传</el-button>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="md5"
            label="MD5校验码:"
            :rules="[{ required: true, message: '接口标识不能为空', trigger: 'blur' }]"
          >
            <el-input class="notClick" v-model="softwareForm.md5" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="version"
            label="软件版本:"
            :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="softwareForm.version" size="small" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-form-item label="软件分卷：" >
            <el-row style="margin-bottom:6px">
                <el-col :span="12">
                    <span style="font-size:12px;color:#909399;">没有分卷可不上传</span>
                </el-col>
                <el-col :span="12" style="text-align:right;">
                    <el-button icon="el-icon-upload" style="margin-left: 10px;" size="mini" type="primary" @click="uploadSoftwareVolums">软件分卷上传</el-button>
                </el-col>
            </el-row>
            <el-table
                :header-show="false"
                :data="softwareForm.softwareVersionVolumes"
                size="mini"
                :header-cell-style="{height:'30px', padding:'0'}"
                :cell-style="{height:'30px', padding:'0'}"
                >
                <el-table-column label="分卷文件名称" prop="fileName" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scopedSplit">
                        <el-button
                        type="text"
                        @click="deleteSoftwareFileSplit(softwareForm, scopedSplit.$index)"
                    ><span style="color: red;font-size: 15px;">删除</span></el-button>
                    </template>
                </el-table-column>
                </el-table>
        </el-form-item>
      </el-row> -->

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="versionOfferUnitId"
            label="提供单位:"
            :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]"
          >
            <treeselect
              v-model="softwareForm.versionOfferUnitId"
              style="max-width:100%"
              :multiple="false"
              :options="testDepartmentList"
              :appendToBody="true"
              :disable-branch-nodes="true"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择提供单位"
              @select="selectChange"
            ></treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item
            prop="devUnit"
            label="研制单位:"
          >
            <span v-text="softwareForm.devUnit" />
          </el-form-item> -->
           <el-form-item
            prop="devUnit"
            label="研制单位:"
            :rules="[{required:true,message:'请选择研制单位',trigger:'change'}]"
          >
            <el-input v-model="softwareForm.devUnit" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="软件Logo:">
            <el-upload
              ref="logoFile"
              class="upload-demo"
              action
              :file-list="logoFileList"
              :http-request="logoFileUpload"
              :show-file-list="false"
              accept=".jpg, .png, .bmp, .PNG, .jpeg"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="display:inline-block;margin-left:10px;"
              >只能上传jpg/png/bmp文件，且不超过20M</div>
            </el-upload>
            <el-image
              style="width:80px;height:80px;"
              :key="logoKey"
              v-if="softwareForm.logo!=null&&softwareForm.logo!=''&&softwareForm.logo!=undefined"
              :src="logoAndPicUrl+softwareForm.logo"
            ></el-image>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="软件封面:">
            <el-upload
              ref="pageFile"
              :auto-upload="true"
              list-type="picture"
              action="#"
              :file-list="pageFileList"
              :http-request="pageFileUpload"
              :show-file-list="false"
              accept=".jpg, .png, .bmp, .PNG, .jpeg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="display:inline-block;margin-left:10px;"
              >只能上传jpg/png/bmp文件，且不超过10M</div>
            </el-upload>
            <el-image
              style="width:80px;height:80px;"
              :key="picKey"
              v-if="softwareForm.pic!=null&&softwareForm.pic!=''&&softwareForm.pic!=undefined"
              :src="logoAndPicUrl+softwareForm.pic"
            ></el-image>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            v-if="softwareForm.softwareType==3"
            prop="service"
            label="软件分类:"
            :rules="[{required:true,message:'软件分类不能为空',trigger:'blur'}]"
          >
            <span v-text="selectDictLabels(softwareServiceList, softwareForm.service, 'id', 'name')" />
          </el-form-item>

          <el-form-item
            v-if="softwareForm.softwareType==1"
            prop="categoryIds"
            label="软件分类:"
          >
           <span  v-text="selectDictLabels(softwareTypeList, softwareForm.categoryIds, 'id', 'name')" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item
        prop="description"
        label="软件描述:"
      >
        <span v-text="softwareForm.description"></span>
      </el-form-item>
     <el-form-item
        prop="upgradeDescription"
        label="升级描述:"
        :rules="[{required:true,message:'软件升级描述不能为空',trigger:'blur'}]"
      >
        <el-input type="textarea" v-model="softwareForm.upgradeDescription" rows="4" show-word-limit  maxlength="200" style="width:100%"></el-input>
      </el-form-item>


      <el-form-item label="软件资料:">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              class="upload-demo"
              action
              :on-change="handleDataFileChange"
              :on-remove="handleRemove"
              :http-request="uploadSoftwareData"
              :before-upload="beforeDataUpload"
              :show-file-list="false"
              multiple
              :on-exceed="handleExceed"
              :file-list="fileList"
              :accept="dataBeforeUploadCheck"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="display:inline-block;margin-left:10px;word-break: break-all;"
              >只能上传{{dataBeforeUploadCheck}}文件，且不超过{{ appConfig.fileLimitSize.data }}M</div>
            </el-upload>
          </el-col>
          <el-col :span="17">
            <el-table
              :data="docData"
              size="mini"
              style="margin:10px;"
            >
              <el-table-column
                width="80"
                type="index"
                align="center"
                header-align="center"
                label="序号"
              />
              <el-table-column min-width="120px" label="资料名称">
                <template slot-scope="{row}">
                  <template>
                    <el-input v-model="row.name" class="edit-input" size="small" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="资料类型" prop="category">
                <template slot-scope="scope">
                  <treeselect
                    v-model="scope.row.category"
                    style="max-width:100%"
                    :multiple="false"
                    :appendToBody="true"
                    :options="softwareDataTypes"
                    :disable-branch-nodes="false"
                    :normalizer="normalizer"
                    :show-count="true"
                    placeholder="请选择资料类型"
                  ></treeselect>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                label="资料大小"
                width="100"
                prop="size"
              >
                <template slot-scope="scope">
                  <span v-text="showSizes(parseInt(scope.row.sizes))"></span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="100">
                <template slot-scope="scope">
                  <el-link
                    v-if="scope.row.id>0"
                    type="text"
                    :underline="false"
                    style="font-size:12px;color:#409EFF;margin-right: 20px"
                  > <span style="font-size:12px;">下载</span> </el-link>
                  <el-button
                    type="text"
                    size="small"
                    style="color:red;"
                    @click="handleRemoveDoc(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

      </el-form-item>
      <!-- <el-form-item prop="attribute" label="应用授权:">
        <el-radio v-model="softwareForm.attribute" :label="1">公开软件</el-radio>
        <el-radio v-model="softwareForm.attribute" :label="2">私有软件</el-radio>
      </el-form-item> -->
      <el-row :gutter="20" v-if="softwareForm.softwareType!=1">
        <el-col :span="12">
          <el-form-item
            prop="scan"
            label="可浏览:"
          >
             <span  v-text="selectDictLabels(testDepartmentList, softwareForm.scan, 'id', 'name')" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="download"
            label="可下载:"
          >
            <span  v-text="selectDictLabels(testDepartmentList, softwareForm.download, 'id', 'name')" />

          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="双杀证明:">
        <el-upload
          action="#"
          list-type="picture"
          :http-request="uploadAntivirusFile"
          :before-upload="beforeProveUpload"
          :accept="proveUploadCheckType"
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-button size="small" type="primary">点击上传</el-button>

          <div
            slot="tip"
            class="el-upload__tip"
            style="display:inline-block;margin-left:10px;"
          >只能上传.jpg, .png, .bmp, .jpeg, .pdf文件</div>
        </el-upload>
        <el-table
          :data="softwareForm.softwareDetailAntivirusList"
          :show-header="false"
          style="margin:10px;"
          size="mini"
        >
          <el-table-column width="80" type="index" align="center" header-align="center" label="序号" />
          <el-table-column min-width="200px" label show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-input v-model="row.name" class="edit-input" size="small" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:red;"
                @click="handleRemoveAntivirus(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="测试证明:">
        <el-upload
          action="#"
          list-type="picture"
          :http-request="uploadTestFile"
          :before-upload="beforeProveUpload"
          :accept="proveUploadCheckType"
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-button size="small" type="primary">点击上传</el-button>

          <div
            slot="tip"
            class="el-upload__tip"
            style="display:inline-block;margin-left:10px;"
          >只能上传.jpg, .png, .bmp, .jpeg, .pdf文件</div>
        </el-upload>
        <el-table
          :data="softwareForm.softwareDetailTestList"
          :show-header="false"
          style="margin:10px;"
          size="mini"
        >
          <el-table-column width="80" type="index" align="center" header-align="center" label="序号" />
          <el-table-column min-width="200px" label show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-input v-model="row.name" class="edit-input" size="small" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:red;"
                @click="handleRemoveTest(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
      <div style="text-align:center;">
        <el-button size="small" type="primary" @click="addSoftware">提交</el-button>
        <el-button size="small" @click="cancleSubmit">取消</el-button>
      </div>
    </el-form>
    <global-uploader />
  </el-card>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import * as application from "@/api/application";
import * as software from "@/api/software";
// import * as appConfig from "/public/config";
import * as organization from "@/api/organization";
import * as category from "@/api/category";
import globaluploader from "@/components/VueSimpleUploader/GlobalUploader";
import Bus from "@/components/VueSimpleUploader/js/bus";
export default {
  components: {
    Treeselect,
    "global-uploader": globaluploader
  },
  data() {
    return {
      rejectVisible: false,
      fileList: [],
      loading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      softwareForm: {
        name: "",
        version: "",
        size: "",
        versionOfferUnitId: null,
        versionOfferUnit: "",
        devUnit: "",
        type: "",
        cpu: [],
        description: "",
        paths: "",
        isView: "",
        isDownload: "",
        service: [],
        categoryIds:[],
        pic: "",
        logo: "",
        softwareDetailAntivirusList: [], // 杀毒证明
        softwareDetailTestList: [] // 测试证明
      },
      softwareTypeList: [],
      softwareDataTypes: [],
      testDepartmentList: [],
      softwareServiceList: [],
      softwareTypeList: [],
      logoFileList: [],
      docData: [],
      originalNameList: [],
      pageFileList: [],
      logoKey: 0,
      picKey: 0,

      appConfig: appConfig.config,
      logoAndPicUrl: appConfig.config.urlFilePrefix,
      dataBeforeUploadCheck: appConfig.config.softwareDataUploadCheckType,
      proveUploadCheckType: appConfig.config.proveUploadCheckType,
      softwareId: null,
      versionId: null,

      isUploadVolums: false,
    };
  },
  async mounted() {
    await this.getSoftwareTypeList();
    await this.getSoftwareServiceList();

    await this.getSoftwareDataTypeList();
    await this.getDeptTree();

    if (this.$route.query.id) {
      this.softwareId = this.$route.query.id;
      this.versionId = this.$route.query.version;
      this.getSoftwareInfo(this.$route.query.id, this.$route.query.version)
    }
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });
    // 文件上传成功的回调
    Bus.$on("fileSuccess", list => {
      console.log("文件上传成功!!");
      let file = list[list.length - 1];

      // 上传分卷文件
      if(this.isUploadVolums===true) {
          if(!this.softwareForm.softwareVersionVolumes) {
              this.$set(this.softwareForm, "softwareVersionVolumes", [])
          }
          this.softwareForm.softwareVersionVolumes.push(
              {
                  fileName: file.fileName,
                  paths: file.path,
                  sizes: file.size,
                  md5: file.md5
              }
          )
          return false;
      }

      delete file.name;
      delete file.description;
      // Object.assign(this.softwareForm, file);
      this.softwareForm = {...this.softwareForm, ...file}
    });
  },
  beforeDestroy() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
  },
  methods: {
    beforeProveUpload(file) {
      let fileSize = file.size / 1024 / 1024
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const acceptType = this.proveUploadCheckType.split(",");
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else if(fileSize > 100) {
        this.$message.error("该文件大小不符合当前允许上传大小!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    handleRemoveDoc(fileIndex, item) {
      let originalName = null
      this.docData.splice(fileIndex, 1);
      const that = this;
      if(this.originalNameList.length>0){
        originalName = this.originalNameList[fileIndex]
      }
      this.fileList.forEach((i, index) => {
        if (i.name === originalName) {
          that.fileList.splice(index, 1);
          this.originalNameList.splice(fileIndex, 1)
        }
      });
      // if (!item.id) {
      //   const that = this;
      //   this.fileList.forEach((i, index) => {
      //     if (i.uid === item.utime) {
      //       that.fileList.splice(index, 1);
      //     }
      //   });
      // } else {
      //   this.deleteDataIdList.push(item.id);
      // }
    },
    getSoftwareInfo(softwareId, softwareVersion) {
      software.getSoftwareInfo(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          const softwareDataInfo = response.data
          this.softwareForm = {...this.softwareForm, ...softwareDataInfo}
          this.softwareForm.version = ''
          this.softwareForm.path = ''
          this.softwareForm.md5 = ''
          this.softwareForm.softwareVersionVolumes = [];
          // if (this.isUpdate) {
          //   this.softwareForm.version = ''
          //   this.softwareForm.path = ''
          // } else {
          //   this.getSoftwareDataList(softwareDataInfo.id, softwareDataInfo.version)
          //   this.getSoftwareDetailTypeList(softwareDataInfo.versionId);
          // }
          if (softwareDataInfo.categoryIds) {
            this.softwareForm.categoryIds = softwareDataInfo.categoryIds.split(',')
          }
          if (softwareDataInfo.isView) {
            this.softwareForm.scan = softwareDataInfo.isView.split(',')
          }
          if (softwareDataInfo.isDownload) {
            this.softwareForm.download = softwareDataInfo.isDownload.split(',')
          }
          // if (softwareDataInfo.relations) {
          //   this.relations = softwareDataInfo.relations.split(',')
          // }
          // if (softwareDataInfo.cpu) {
          //   this.softwareForm.cpu = softwareDataInfo.cpu.split(',')
          // }
          // if (softwareDataInfo.service) {
          //   let service = softwareDataInfo.service.split(',')
          //   this.softwareForm.service = []
          //   for(let num=0;num<service.length;num++){
          //     this.softwareForm.service.push(parseInt(service[num]))
          //   }
          // }
          this.softwareForm.logo = softwareDataInfo.logo;
          this.softwareForm.pic = softwareDataInfo.pic;
          // if (softwareDataInfo.testProved) {
          //   softwareDataInfo.testProved.forEach(item => {
          //     this.detailFileList.push({
          //       url: item,
          //       name: item.substring(item.lastIndexOf('/') + 1)
          //     })
          //   })
          // }
        }
      })
    },
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          this.docData = []
          response.data.forEach(item => {
            this.docData.push({
              id: item.id,
              name: item.name,
              paths: item.paths,
              sizes: item.sizes,
              category: item.category,
              softwareId: item.softwareId,
              versionId: item.versionId,
              utime: item.utime
            })
            this.originalNameList.push(item.name)
          })
        }
      })
    },
    getSoftwareDetailTypeList(softwareVersion) {
      software.getSoftwareDetailTypeList(softwareVersion).then(response => {
        if (response.code === 200) {
          if(response.data[1]){
            this.softwareForm.softwareDetailAntivirusList = response.data[1]
          }
          if(response.data[3]){
            this.softwareForm.softwareDetailTestList = response.data[3]
          }
        }
      })
    },
    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
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
          singleFile: true
        }
      });
      // 是否上传软件分卷
      this.isUploadVolums = false;
    },

    uploadSoftwareVolums() {
        // 打开文件选择框
        Bus.$emit("openUploader", {
            // 给服务端的额外参数
            params: {
            // page: 'home'
            },
            options: {
                target: appConfig.config.url + "/appstore/upload/fileUpload",
                accept: [".z*"],
                singleFile: false
            }
        });
        // 是否上传软件分卷
        this.isUploadVolums = true;
    },
    deleteSoftwareFileSplit(item, index) {
        item.softwareVersionVolumes.splice(index, 1)
    },

    selectChange(val) {
      console.log(val, "selectChange");
      this.softwareForm.versionOfferUnit = val.name;
    },
    addSoftware() {
      this.$refs.softwareForm.validate(valid => {
        if (valid) {
          this.uploadLoading = true;
          const softwareData = {
            // softwareName: this.softwareForm.name,
            // isView: this.softwareForm.scan
            //   ? this.softwareForm.scan.join(",")
            //   : null,
            // isDownload: this.softwareForm.download
            //   ? this.softwareForm.download.join(",")
            //   : null,
            // attribute: this.softwareForm.attribute,
            offerUnitId: this.softwareForm.versionOfferUnitId,
            offerUnit: this.softwareForm.versionOfferUnit,
            devUnit: this.softwareForm.devUnit,
            fileName: this.softwareForm.fileName,
            paths: this.softwareForm.path,
            sizes: this.softwareForm.size + "",
            isUpgrade: 1,
            md5: this.softwareForm.md5,
            description: this.softwareForm.description,
            upgradeDescription: this.softwareForm.upgradeDescription,
            // softwareType: this.softwareForm.softwareType,
            // cpu: this.softwareForm.cpu ? this.softwareForm.cpu.join(",") : null,
            // categoryIds: this.softwareForm.categoryIds
            //   ? this.softwareForm.categoryIds.join(",")
            //   : null,
            // service: this.softwareForm.service.join(","),
            version: this.softwareForm.version,
            logo: this.softwareForm.logo,
            pic: this.softwareForm.pic,
            softwareDataList: this.docData,
            softwareDetailAntivirusList: this.softwareForm.softwareDetailAntivirusList,
            softwareDetailTestList: this.softwareForm.softwareDetailTestList,
            softwareVersionVolumes: this.softwareForm.softwareVersionVolumes,
          };

          if(this.softwareId!=null && this.versionId!=null) {
              softwareData.versionId = this.versionId;
              softwareData.softwareId = this.softwareId;
              software.upgradeSoftwareVersion(softwareData).then(response => {
                this.uploadLoading = false;
                if (response.code === 200) {
                  this.$message.success("软件升级成功");
                  this.$router.push("/admin/software/management");
                } else {
                  this.$message.warning(response.msg);
                }
              });
          }else{
            this.$message.warning("参数错误");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDataFileChange(file, fileList) {
      this.fileList = fileList;
    },
    beforeDataUpload(file) {
      let fileSize = file.size / 1024 / 1024
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const acceptType = this.dataBeforeUploadCheck.split(",");

      const existFile = this.fileList
          .slice(0, this.fileList.length - 1)
          .find(f => f.name === file.name);

      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else if(fileSize > window._gconf.fileLimitSize.data) {
        this.$message.error("该文件大小不符合当前允许上传大小!");
        return Promise.reject(false);
      } else if(existFile){
        this.$message.error(file.name+"文件已存在！");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    uploadSoftwareData(params) {
      console.log("aaaa")
      // this.fileData.append('softwareDataFiles', file.file)
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.docData.push({
            name: file.name,
            paths: response.data.fileName,
            sizes: file.size + "",
            category: this.softwareDataTypes[0].id
          });
          this.originalNameList.push(file.name)
          this.$message.success("软件资料上传成功");
        }
      });
    },
    logoFileUpload(params) {
      // this.fileData.append('logoFile', file.file)
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.$message.success("logo上传成功");
          let path = response.data.fileName;
          this.softwareForm.logo = path;
          this.logoKey = this.logoKey + 1;
        }
      });
    },
    pageFileUpload(params) {
      // this.fileData.append('pageFile', file.file)
      console.log("application", params);
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.$message.success("封面上传成功");
          let path = response.data.fileName;
          this.softwareForm.pic = path;
          this.picKey = this.picKey + 1;
          console.log(this.softwareForm.pic, "this.softwareForm.pic");
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    cancleSubmit() {
      history.go(-1);
    },
    uploadAntivirusFile(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          // this.$message.success('封面上传成功')
          let path = response.data.fileName;
          this.softwareForm.softwareDetailAntivirusList.push({
            paths: path,
            name: response.data.originalFilename
          });
        }
      });
    },
    handleRemoveAntivirus(index, item) {
      this.softwareForm.softwareDetailAntivirusList.splice(index, 1);
      // const that = this;
      // this.softwareForm.softwareDetailAntivirusList.forEach((i, index) => {
      //   that.softwareForm.softwareDetailAntivirusList.splice(index, 1);
      // });
    },
    uploadTestFile(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          // this.$message.success('封面上传成功')
          let path = response.data.fileName;
          this.softwareForm.softwareDetailTestList.push({
            paths: path,
            name: response.data.originalFilename
          });
        }
      });
    },
    handleRemoveTest(index, item) {
      this.softwareForm.softwareDetailTestList.splice(index, 1);
      // const that = this;
      // this.softwareForm.softwareDetailTestList.forEach((i, index) => {
      //   that.softwareForm.softwareDetailTestList.splice(index, 1);
      // });
    },

    // 获取部门导航树
    getDeptTree() {
      organization
        .getOrganization()
        .then(response => {
          if (response.code === 200) {
            let softwareTypeArray = response.data;
            this.testDepartmentList = [];
            if (softwareTypeArray.length > 0) {
              softwareTypeArray.forEach(element => {
                let item = this.buildTreeOptions(element);
                this.testDepartmentList.push(item);
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      };
      if (item.children.length > 0) {
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      return node;
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },

    getSoftwareDataTypeList() {
      category.getCategoryList("data_type", null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list;
        }
      });
    },
    getSoftwareServiceList() {
      category.getCategoryList("service").then(response => {
        if (response.code === 200) {
          this.softwareServiceList = response.data.list;
        }
      });
    },
    getSoftwareTypeList() {
      category.getCategoryList("software_type").then(response => {
        if (response.code === 200) {
          this.softwareTypeList = response.data.list;
        }
      });
    }
  }
};
</script>
<style scoped>
.app-main .el-form {
  max-width: 1100px;
  margin: 0 auto;
}
.notClick {
  pointer-events: none;
}
.el-form-item__content span{font-size: 14px;display: inline-block;margin-top: 2px;}
.el-image{margin-top: 10px;}
</style>
