<template>
  <el-card class="custome">
    <CloseBack></CloseBack>

    <el-form
      ref="softwareForm"
      name="softwareForm"
      :model="softwareForm"
      label-position="right"
      label-width="120px"
      v-loading="parseLoading || uploadLoading"
      :element-loading-text="parseLoading?'正在解析...':uploadLoading?'提交中...':''"
    >
      <el-form-item
        prop="path"
        label="软件路径:"
        :rules="[{ required: true, message: '请上传软件', trigger: 'change' }]"
      >
        <el-input
          v-model="softwareForm.path"
          size="small"
          readonly
          style="width:calc(100% - 90px );margin-right:8px"
        />
        <!-- <el-upload
          style="display:inline-block;margin-left:10px;"
          class="upload-demo"
          action=""
          ref="uploadSoftware"
          :http-request="uploadSoftwareFile"
          :on-change="handleChangeFile"
          :before-upload="beforeUpload"
          :file-list="softwareFileList"
          :show-file-list="false"
          accept=".tar,.war,.jar,.rpm,.apk"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>-->
        <el-button size="small" type="primary" :disabled="parseLoading" @click="upload">点击上传</el-button>
      </el-form-item>
      <el-form-item
        prop="name"
        label="软件名称:"
        :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur' },{min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件名称不合法', trigger: 'blur'}]"
      >
        <el-input v-model="softwareForm.name" size="small" style="width:100%" />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="md5"
            label="MD5校验码:"
            :rules="[{ required: true, message: '接口标识不能为空', trigger: 'blur' },{min: 0, max: 36, message: '长度在 1 到 36 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '接口标识不合法', trigger: 'blur'}]"
          >
            <el-input class="notClick" v-model="softwareForm.md5" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="version"
            label="软件版本:"
            :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件版本不合法', trigger: 'blur'}]"
          >
            <el-input v-model="softwareForm.version" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="offerUnitId"
            label="提供单位:"
            :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]"
          >
            <treeselect
              v-model="softwareForm.offerUnitId"
              style="max-width:100%"
              :multiple="false"
              :options="offerUnits"
              :appendToBody="true"
              :disable-branch-nodes="true"
              :normalizer="sourceNormalizer"
              :show-count="true"
              placeholder="请选择提供单位"
              @select="selectChange"
            ></treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="devUnit"
            label="研制单位:"
            :rules="[{required:true,message:'请输入研制单位',trigger:'change'},{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '研制单位不合法', trigger: 'blur'}]"
          >
            <el-input v-model="softwareForm.devUnit" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            prop="fragmentType"
            label="软件段类型:"
            :rules="[{required:true,message:'软件类型不能为空',trigger:'blur'}]"
          >
            <el-select
              v-model="softwareForm.fragmentType"
              size="small"
              style="width:100%"
              filterable
              reserve-keyword
            >
              <el-option
                v-for="(item,index) in softwareTypeList"
                :key="index"
                :label="item.name"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="cpu"
            label="CPU架构:"
            :rules="[{required:true,message:'CPU架构不能为空',trigger:'blur'}]"
          >
            <el-select
              v-model="softwareForm.cpu"
              size="small"
              style="width:100%"
              filterable
              reserve-keyword
              multiple
            >
              <el-option
                v-for="(item,index) in fragmentArchList"
                :key="index"
                :label="item.name"
                :value="item.identities"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            prop="service"
            label="软件分类:"
            :rules="[{required:true,message:'选择软件的软件分类',trigger:'blur'}]"
          >
            <!-- <el-cascader v-model="softwareForm.service" :props="categoryProps" style="width:58%" /> -->
            <treeselect
              :limit="2"
              :limitText="count => `及其它${count}项`"
              :show-count="true"
              :normalizer="normalizer"
              v-model="softwareForm.service"
              noResultsText="暂无数据"
              value-consists-of="ALL"
              :options="categoryProps"
              :appendToBody="true"
              z-index="9999"
              placeholder="请选软件分类 "
              clearable
              :multiple="true"
              :style="{ width: '100%'}"
            ></treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="prefix"
            label="软件前缀:"
            :rules="[{required:true,message:'填写软件段前缀',trigger:'blur'}]"
          >
            <el-input v-model="softwareForm.prefix" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="软件Logo:">
            <el-upload
              ref="logoFile"
              class="upload-demo"
              action
              :on-preview="handlePreview"
              :on-remove="handleRemoveLogoFile"
              :on-change="handleLogoFileChange"
              :file-list="logoFileList"
              :http-request="logoFileUpload"
              :show-file-list="false"
              accept=".jpg, .png, .bmp, .PNG, .jpeg"
              :limit="1"
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
              :on-remove="handleRemovePageFile"
              :on-change="handlePageFileChange"
              :http-request="pageFileUpload"
              :show-file-list="false"
              accept=".jpg, .png, .bmp, .PNG, .jpeg"
              :limit="1"
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

      <el-form-item
        prop="description"
        label="软件描述:"
        :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]"
      >
        <!--        <markdown-editor ref="markdownEditor" v-model="softwareForm.description" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />-->
        <el-input
          v-model="softwareForm.description"
          size="small"
          :rows="5"
          type="textarea"
          show-word-limit
          maxlength="200"
        />
      </el-form-item>
      <!--      <el-form-item label="软件Logo:">-->
      <!--        <el-upload-->
      <!--          class="upload-demo"-->
      <!--          action=""-->
      <!--          :on-preview="handlePreview"-->
      <!--          :on-remove="handleRemove"-->
      <!--          :limit="1"-->
      <!--          list-type="picture"-->
      <!--        >-->
      <!--          <el-button size="small" type="primary">点击上传</el-button>-->
      <!--          <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png文件，且不超过20M</div>-->
      <!--        </el-upload>-->
      <!--      </el-form-item>-->
      <el-form-item label="软件资料:">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              style="margin-top:10px;"
              class="upload-demo"
              action
              :auto-upload="true"
              :file-list="fileList"
              :show-file-list="false"
              :on-change="handleDataFileChange"
              :on-remove="handleDataFileRemove"
              :http-request="uploadSoftwareData"
              accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt"
              :limit="5"
              :multiple="true"
              ref="dataFile"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="display:inline-block;margin-left:10px;"
              >只能上传pdf/doc/docx/ppt/pptx/xls/xlsx/txt文件，且不超过100M</div>
            </el-upload>
          </el-col>
          <el-col :span="17">
            <el-table :data="docData" size="mini" style="margin:10px;">
              <el-table-column
                width="80"
                type="index"
                align="center"
                header-align="center"
                label="序号"
              />
              <el-table-column min-width="200px" label="资料名称">
                <template slot-scope="{row}">
                  <template>
                    <el-input v-model="row.name" class="edit-input" size="small" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="资料类型" prop="category">
                <template slot-scope="scope">
                  <!--                  <el-select v-model="scope.row.category">-->
                  <!--                    <el-option-->
                  <!--                      v-for="item in softwareDataTypes"-->
                  <!--                      :key="item.id"-->
                  <!--                      :label="item.name"-->
                  <!--                      :value="item.id"-->
                  <!--                    />-->
                  <!--                  </el-select>-->
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
                    @select="selectModuleAdd"
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
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-link
                    v-if="scope.row.id>0"
                    :href="scope.row.path"
                    type="text"
                    :underline="false"
                    style="font-size:12px;color:#409EFF;margin-right: 20px"
                  >下载</el-link>
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
      <el-form-item prop="attribute" label="应用授权:">
        <el-radio v-model="softwareForm.attribute" :label="1">公开软件</el-radio>
        <el-radio v-model="softwareForm.attribute" :label="2">私有软件</el-radio>
      </el-form-item>
      <el-row :gutter="20" v-if="softwareForm.attribute == 2">
        <el-col :span="12">
          <el-form-item prop="scan" label="可浏览:">
            <el-select
              v-model="softwareForm.scan"
              size="small"
              style="width:400px"
              filterable
              multiple
              reserve-keyword
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realname"
                :value="item.id.toString()"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="download" label="可下载:">
            <el-select
              v-model="softwareForm.download"
              size="small"
              style="width:400px"
              filterable
              multiple
              reserve-keyword
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realname"
                :value="item.id.toString()"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="双杀证明:">
        <el-upload
          action="#"
          list-type="picture"
          :http-request="uploadAntivirusFile"
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-table
          :data="softwareDetailAntivirusList"
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
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-table
          :data="softwareDetailTestList"
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
                @click="handleRemoveTest(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div style="text-align:center;">
        <el-button size="small" type="primary" @click="addSoftware">提交</el-button>
        <el-button size="small" @click="cancleSubmit">取消</el-button>
      </div>
    </el-form>

    <!-- 将上传组件全局注册 -->
    <global-uploader />
  </el-card>
</template>
<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import * as software from "@/api/software";
import * as user from "@/api/user";
import * as category from "@/api/category";
// import * as appConfig from "/public/config";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as application from "@/api/application";

import globaluploader from "@/components/VueSimpleUploader/GlobalUploader";
import Bus from "@/components/VueSimpleUploader/js/bus";
import * as organization from "@/api/organization";
export default {
  components: {
    MarkdownEditor,
    // fragmentdlg,
    Treeselect,
    "global-uploader": globaluploader
  },
  data() {
    return {
      // password:[
      //   {required:true,message:'密码不能为空',trigger:'blur'},
      //   {min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
      // ],
      url: window._gconf.url,
      parseLoading: false,
      uploadLoading: false,
      rejectVisible: false,
      fileList: [],
      logoFileList: [],
      pageFileList: [],
      docList: [],
      detailFileList: [],
      docData: [],
      softwareDetailAntivirusList: [],
      softwareDetailTestList: [],
      softwareFileList: [],
      loading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      fragmentdlgVisible: false,
      relations: [],
      userList: [],
      offerUnits: [],
      softwareDataTypes: [],
      fragmentArchList: [],
      softwareTypeList: [],
      softwareForm: {
        name: "",
        version: "",
        size: "",
        offerUnit: "",
        devUnit: "",
        type: "",
        platform: "",
        content: "",
        paths: "",
        attribute: 1,
        download: [],
        scan: [],
        reject: ""
      },
      fileData: "",
      typeList: [],
      userInfo: {},

      logoKey: 0,
      picKey: 0,
      logoAndPicUrl: appConfig.config.urlFilePrefix,

      categoryProps: []
    };
  },
  async mounted() {
    this.fileData = new FormData();
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

    await this.getSoftwareTypeList();
    await this.getFragmentArchList();
    await this.getFragmentTypeList();
    await this.getSoftwareDataTypeList();
    await this.getOfferUnitList();
    // this.getUserList()
    // this.getSoftwareDataTypeList()
    // this.getAllSoftwareSource()
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });
    // 文件上传成功的回调
    Bus.$on("fileSuccess", list => {
      console.log("文件上传成功!!");
      console.log(list);
      let softwareTypeMap = {};
      this.softwareTypeList.forEach(item => {
        softwareTypeMap[item.name] = item.val;
      });
      Object.assign(this.softwareForm, list[list.length - 1]);
      this.softwareForm.fragmentType = softwareTypeMap[this.softwareForm.type];
    });
  },
  beforeDestroy() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
  },
  methods: {
    getOfferUnitList() {
      organization.getOrganization().then(response => {
        if (response.code === 200) {
          this.offerUnits = JSON.parse(JSON.stringify(response.data));
          // let softwareTypeArray = response.data;
          // this.testDepartmentList = [];
          // if (softwareTypeArray.length > 0) {
          //   softwareTypeArray.forEach(element => {
          //     let item = this.buildTreeOptions(element);
          //     console.log(item);
          //     this.testDepartmentList.push(item);
          //   });
          // }
        }
      });
    },
    selectChange(val) {
      console.log(val, "selectChange");
      this.softwareForm.offerUnit = val.name;
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
    },
    getAllSoftwareSource() {
      user.getAllSoftwareSource(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.offerUnits = response.data;
        }
      });
    },
    getSoftwareTypeList() {
      category.getCategoryList("service").then(response => {
        if (response.code === 200) {
          this.categoryProps = response.data.list;
          console.log(this.categoryProps, "categoryProps");
        }
      });
    },
    getFragmentArchList() {
      category.getCategoryList("fragment_arch", null, null).then(response => {
        // let res = this.handleTree(response.data.list)
        // this.fragmentArchList = res;
        this.fragmentArchList = response.data.list;
      });
    },
    getFragmentTypeList() {
      category.getCategoryList("fragment_type", null, null).then(response => {
        // let res = this.handleTree(response.data.list)
        // this.softwareTypeList = res;
        this.softwareTypeList = response.data.list;
      });
    },
    sourceNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    addSoftware() {
      this.$refs.softwareForm.validate(valid => {
        if (valid) {
          this.uploadLoading = true;
          const softwareData = {
            softwareName: this.softwareForm.name,
            isView: this.softwareForm.scan
              ? this.softwareForm.scan.join(",")
              : null,
            isDownload: this.softwareForm.download
              ? this.softwareForm.download.join(",")
              : null,
            attribute: this.softwareForm.attribute,
            offerUnitId: this.softwareForm.offerUnitId,
            offerUnit: this.softwareForm.offerUnit,
            devUnit: this.softwareForm.devUnit,
            prefix: this.softwareForm.prefix,
            paths: this.softwareForm.path,
            sizes: this.softwareForm.size + "",
            isUpgrade: 0,
            md5: this.softwareForm.md5,
            description: this.softwareForm.description,
            cpu: this.softwareForm.cpu ? this.softwareForm.cpu.join(",") : null,
            categoryIds: this.softwareForm.categoryIds
              ? this.softwareForm.categoryIds.join(",")
              : null,
            fragmentType: this.softwareForm.fragmentType
              ? this.softwareForm.fragmentType.toString()
              : null,
            service: this.softwareForm.service.join(","),
            version: this.softwareForm.version,
            logo: this.softwareForm.logo,
            pic: this.softwareForm.pic,
            softwareDataList: this.docData,
            softwareDetailAntivirusList: this.softwareDetailAntivirusList,
            softwareDetailTestList: this.softwareDetailTestList
          };

          software.addSoftwareVersion(softwareData).then(response => {
            this.uploadLoading = false;
            if (response.code === 200) {
              this.$message.success("软件资源上传成功");
              this.$router.push("/admin/software/management");
            } else {
              this.$message.warning(response.msg);
            }
            // this.$refs.logoFile.clearFiles()
            // this.logoFileList = []
            this.fileData = new FormData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children == null || data[i].children.length === 0) {
          data[i].children = undefined;
        } else if (data[i].children.length > 1) {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    uploadSoftwareFile(file) {
      this.fileData.append("softwareFile", file.file); // 增加数据
      if (!this.uploadLoading) {
        const data = new FormData();
        data.append("file", file.file);
        this.parseSoftware(data);
      }
    },
    handleChangeFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    parseSoftware(data) {
      this.parseLoading = true;
      software.parseSoftware(data).then(response => {
        if (response.code === 200) {
          this.softwareForm = response.data;
          this.softwareForm.attribute = 1;
          this.softwareForm.type =
            this.softwareForm.type === "service"
              ? "serviceSeg"
              : this.softwareForm.type;
          if (this.softwareForm.relations) {
            this.relations = this.softwareForm.relations.split(",");
          }
          this.logoFileList = [];
          if (this.softwareForm.logo) {
            this.logoFileList.push({
              url: this.softwareForm.logo,
              name: this.softwareForm.logo.substring(
                this.softwareForm.logo.lastIndexOf("/") + 1
              )
            });
          }
          this.pageFileList = [];
          if (this.softwareForm.pic) {
            this.pageFileList.push({
              url: this.softwareForm.pic,
              name: this.softwareForm.pic.substring(
                this.softwareForm.pic.lastIndexOf("/") + 1
              )
            });
          }
        } else if (response.code === -1) {
          this.$message.warning(response.msg);
          this.softwareForm.path = response.data;
        } else {
          this.$message.error(response.msg);
        }
        this.parseLoading = false;
      });
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
    selectModuleAdd() {},
    getUserList() {
      user.getUserList().then(response => {
        if (response.code === 200) {
          this.userList = response.data;
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
    pageFileUpload(params) {
      // this.fileData.append('pageFile', file.file)
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.$message.success("封面上传成功");
          let path = response.data.fileName;
          this.softwareForm.pic = path;
          this.picKey = this.picKey + 1;
        }
      });
    },
    detailFileUpload(file) {
      this.fileData.append("softwareDetailFiles", file.file);
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
    handleDetailFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name);
      const accessFileType = ["jpg", "png", "bmp", "jpeg", "pdf"];
      const type = file.name
        .split(".")
        .splice(-1)[0]
        .toLowerCase();
      const isType = accessFileType.includes(type);
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (existFile) {
        this.$message.error("当前文件已存在！");
        fileList.pop();
      } else if (!isType) {
        this.$message.error("上传文件格式异常!");
        fileList.pop();
      } else if (!isLt20M) {
        this.$message.error("上传测试证明文件大小不能超过 20MB!");
        fileList.pop();
      }
      this.detailFileList = fileList;
    },
    handleRemoveLogoFile(file, fileList) {
      if (file.url === this.softwareForm.logo) {
        this.softwareForm.logo = null;
      }
    },
    handleLogoFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name);
      const accessFileType = ["jpg", "png", "bmp", "jpeg"];
      const type = file.name
        .split(".")
        .splice(-1)[0]
        .toLowerCase();
      const isType = accessFileType.includes(type);
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (existFile) {
        this.$message.error("当前文件已存在！");
        fileList.pop();
      } else if (!isType) {
        this.$message.error("上传文件格式异常!");
        fileList.pop();
      } else if (!isLt20M) {
        this.$message.error("上传软件logo文件大小不能超过 20MB!");
        fileList.pop();
      }
    },
    handleRemovePageFile(file, fileList) {
      if (file.url === this.softwareForm.pic) {
        this.softwareForm.pic = null;
      }
    },
    handlePageFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name);
      const accessFileType = ["jpg", "png", "bmp", "jpeg"];
      const type = file.name
        .split(".")
        .splice(-1)[0]
        .toLowerCase();
      const isType = accessFileType.includes(type);
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (existFile) {
        this.$message.error("当前文件已存在！");
        fileList.pop();
      } else if (!isType) {
        this.$message.error("上传文件格式异常!");
        fileList.pop();
      } else if (!isLt10M) {
        this.$message.error("上传软件封面文件大小不能超过 10MB!");
        fileList.pop();
      }
    },
    handleRemoveDetailFile(file) {
      const url = file.url;
      this.detailFileList.forEach((item, index) => {
        if (item.url === url) {
          this.detailFileList.splice(index, 1);
        }
      });
      const that = this;
      this.softwareForm.testProved.forEach((item, index) => {
        if (item === url) {
          that.softwareForm.testProved.splice(index, 1);
        }
      });
    },
    formatFileSize(size) {
      if (size < 1024) {
        return size + "b";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "Kb";
      } else {
        return (size / 1024 / 1024).toFixed(2) + "Mb";
      }
    },
    uploadSoftwareData(params) {
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
        }
      });
    },
    handleDataFileRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleDataFileChange(file, fileList) {
      const accessFileType = [
        "doc",
        "docx",
        "pdf",
        "txt",
        "ppt",
        "pptx",
        "xls",
        "xlsx"
      ];
      const type = file.name
        .split(".")
        .splice(-1)[0]
        .toLowerCase();
      const isType = accessFileType.includes(type);
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isType) {
        this.$message.error("上传文件格式异常!");
        fileList.pop();
      } else if (!isLt100M) {
        this.$message.error("上传资料文件大小不能超过 100MB!");
        fileList.pop();
      }
      if (isType && isLt100M) {
        const existFile = fileList
          .slice(0, fileList.length - 1)
          .find(f => f.name === file.name);
        if (existFile) {
          this.$message.error("当前文件已存在！");
          fileList.pop();
        } else {
          // this.docData.push({
          //   name: file.name,
          //   size: this.formatFileSize(file.size),
          //   category: this.softwareDataTypes[0].id,
          //   softwareId: this.softwareForm.id,
          //   versionId: this.softwareForm.versionId,
          //   utime: file.uid
          // })
        }
      }
      this.fileList = fileList;
    },
    beforeUpload(file) {
      const accessFileType = ["tar", "war", "jar", "rpm", "apk"];
      const type = file.name
        .split(".")
        .splice(-1)[0]
        .toLowerCase();
      const isType = accessFileType.includes(type);
      const isLt2G = file.size / 1024 / 1024 < 20480;
      if (!isType) {
        this.$message.error("上传文件格式异常!");
      } else if (!isLt2G) {
        this.$message.error("上传软件资源大小不能超过 20GB!");
      }
      return isType && isLt2G;
    },
    handleRemoveDoc(index, item) {
      this.docData.splice(index, 1);
      if (!item.id) {
        const that = this;
        this.fileList.forEach((i, index) => {
          if (i.uid === item.utime) {
            that.fileList.splice(index, 1);
          }
        });
      } else {
        this.deleteDataIdList.push(item.id);
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
          this.softwareDetailAntivirusList.push({
            paths: path,
            name: response.data.originalFilename
          });
        }
      });
    },
    handleRemoveAntivirus(index, item) {
      this.softwareDetailAntivirusList.splice(index, 1);
      // const that = this;
      // this.softwareDetailAntivirusList.forEach((i, index) => {
      //   that.softwareDetailAntivirusList.splice(index, 1);
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
          this.softwareDetailTestList.push({
            paths: path,
            name: response.data.originalFilename
          });
        }
      });
    },
    handleRemoveTest(index, item) {
      this.softwareDetailTestList.splice(index, 1);
      // const that = this;
      // this.softwareDetailTestList.forEach((i, index) => {
      //   that.softwareDetailTestList.splice(index, 1);
      // });
    }
  }
};
</script>
<style scoped>
/deep/ .el-table {
  overflow: visible !important;
}
/deep/ .el-table .cell {
  overflow: visible !important;
}

/deep/ .el-table__body-wrapper {
  overflow: visible !important;
}
/deep/ .el-radio {
  color: #606266 !important;
}
.app-main .el-form {
  max-width: 1100px;
  margin: 0 auto;
}
.notClick {
  pointer-events: none;
}
</style>
