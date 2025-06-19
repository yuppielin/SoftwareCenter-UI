<template>
  <el-card class="custome">

    <el-form ref="softwareForm" name="softwareForm" :model="softwareForm" label-position="right" label-width="120px" v-loading="parseLoading || uploadLoading" :element-loading-text="parseLoading?'正在解析...':uploadLoading?'提交中...':''">
      <el-form-item v-show="isUpdate" label="已有版本:">
        <el-tag v-for="(item, index) in softwareForm.versions" :key="item.id" type="primary" size="mini" style="margin: 0 10px;">{{ item.version }}</el-tag>
      </el-form-item>
      <el-form-item prop="path" label="软件路径:" :rules="[{ required: true, message: '请上传软件', trigger: 'change' }]">
        <el-input v-model="softwareForm.path" size="small" readonly style="width:calc(100% - 90px );margin-right:8px" />
        <el-button  icon="el-icon-download" size="small" type="primary" @click="downloadSoftware(softwareForm.fileName,softwareForm.paths)">下载</el-button>
      </el-form-item>
      <el-form-item prop="name" label="软件名称:" :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur' },{min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件名称不合法', trigger: 'blur'}]">
        <el-input v-model="softwareForm.name" size="small"  />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="md5" label="MD5:">
            <el-input class="notClick" v-model="softwareForm.md5" size="small"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="version" label="软件版本:" :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件版本不合法', trigger: 'blur'}]">
            <el-input v-model="softwareForm.version" size="small"  />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="offerUnit" label="提供单位:" :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]">
            <!-- <treeselect
              v-model="softwareForm.offerUnitId"
              style="max-width:400px;"
              :multiple="false"
              :appendToBody="true"
              :options="offerUnits"
              :disable-branch-nodes="false"
              :normalizer="sourceNormalizer"
              :show-count="true"
              placeholder="请选择提供单位">
            </treeselect> -->
            <el-input v-model="softwareForm.offerUnit" size="small"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="devUnit" label="研制单位:" :rules="[{required:true,message:'请输入研制单位',trigger:'change'},{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '研制单位不合法', trigger: 'blur'}]">
            <el-input v-model="softwareForm.devUnit" size="small"  />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="软件Logo:">
            <el-upload
              ref="logoFile"
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemoveLogoFile"
              :on-change="handleLogoFileChange"
              :show-file-list="false"
              :http-request="logoFileUpload"
              accept=".jpg,.png,.bmp,.PNG,.jpeg"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png/bmp文件，且不超过20M</div>
            </el-upload>
            <el-image
              :key="logoKey"
              style="width: 80px;height: 80px;"
              v-show="softwareForm.logo!=null"
              :src="logoAndPicUrl+softwareForm.logo"
              fit="fill" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="软件封面:">
            <el-upload
              ref="pageFile"
              :auto-upload="true"
              list-type="picture"
              action="#"
              :show-file-list="false"
              :on-remove="handleRemovePageFile"
              :on-change="handlePageFileChange"
              :http-request="pageFileUpload"
              accept=".jpg,.png,.bmp,.PNG,.jpeg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png/bmp文件，且不超过10M</div>
            </el-upload>
            <el-image
              style="width: 80px;height: 80px;"
              :key="picKey"
              v-show="softwareForm.pic!=null"
              :src="logoAndPicUrl+softwareForm.pic"
              fit="cover" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="fragmentType" label="软件段类型:" :rules="[{required:true,message:'软件类型不能为空',trigger:'blur'}]">
            <el-select
              v-model="softwareForm.fragmentType"
              size="small"
              filterable
              reserve-keyword
            >
               <el-option v-for="(item,index) in softwareTypeList" :key="index" :label="item.name" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cpu" label="CPU架构:" :rules="[{required:true,message:'CPU架构不能为空',trigger:'blur'}]">
            <el-select
              v-model="softwareForm.cpu"
              size="small"
              filterable
              reserve-keyword
              multiple
            >
              <el-option v-for="(item,index) in fragmentArchList" :key="index" :label="item.name" :value="item.identities"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item prop="service" label="软件分类:" :rules="[{required:true,message:'选择软件的软件分类',trigger:'blur'}]">
            <!-- <el-cascader v-model="softwareForm.service" :props="categoryProps" style="width:58%" /> -->
            <treeselect
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
              :flat="true"
              :limit="2"
              :limitText="count => `及其它${count}项`"
              :show-count="true"
              :style="{ width: '100%'}"
            ></treeselect>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item prop="type" label="软件依赖:">
            <el-button type="primary" size="mini" @click="fragmentdlgVisible=true">添加软件依赖</el-button>
          </el-form-item>

        </el-col>
        <fragmentdlg
          :visible="fragmentdlgVisible"
          :selectedDependency="this.relations"
          @close="fragmentdlgVisible=false"
          @addDependency="addDependencyItem"
        /> -->
      </el-row>
      
      <!-- <el-form-item label="测试证明:">
        <el-upload
          ref="detailFile"
          action="#"
          list-type="picture-card"
          :file-list="detailFileList"
          :http-request="detailFileUpload"
          :on-change="handleDetailFileChange"
          accept=".jpg,.png,.bmp,.PNG,.jpeg"
          :auto-upload="false"
          :limit="3"
        >
          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in" />
              </span> -->
              <!--              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">-->
              <!--                <i class="el-icon-download" />-->
              <!--              </span>-->
              <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemoveDetailFile(file)">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item> -->
      <el-form-item prop="description" label="软件描述:" :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]">
<!--        <markdown-editor ref="markdownEditor" v-model="softwareForm.description" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" disabled />-->
        <el-input v-model="softwareForm.description" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" readonly />
      </el-form-item>
      <el-form-item prop="upgradeDescription" label="升级描述:" :rules="[{required:true,message:'软件升级描述不能为空',trigger:'blur'}]" v-if="isUpdate">
<!--        <markdown-editor ref="markdownEditor" v-model="softwareForm.upgradeDescription" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />-->
        <el-input v-model="softwareForm.upgradeDescription" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" />
      </el-form-item>
      <el-form-item label="软件资料:">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              style="margin-top:10px;"
              class="upload-demo"
              action=""
              :auto-upload="true"
              :file-list="fileList"
              :show-file-list="false"
              :on-change="handleDataFileChange"
              :on-remove="handleDataFileRemove"
              :http-request="uploadSoftwareData"
              :before-upload="beforeDataUpload"
              :accept="dataBeforeUploadCheck"
              ref="dataFile"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传{{dataBeforeUploadCheck}}文件，且不超过100M</div>
            </el-upload>
          </el-col>
          <el-col :span="17">
            <el-table
              :data="docData"
              size="mini"
              :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
              style="margin:10px;"
            >
              <el-table-column width="80" type="index" align="center" header-align="center" label="序号" />
              <el-table-column min-width="200px" label="资料名称" show-overflow-tooltip>
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
                    style="max-width:400px;"
                    :multiple="false"
                    :appendToBody="true"
                    :options="softwareDataTypes"
                    :disable-branch-nodes="false"
                    :normalizer="normalizer"
                    :show-count="true"
                    placeholder="请选择资料类型"
                    @select="selectModuleAdd"></treeselect>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="资料大小" width="100" prop="size">
                <template slot-scope="scope">
                  <span v-text="showSizes(parseInt(scope.row.sizes))"></span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    @click="downloadSoftwareData(scope.row)"
                    type="text"
                    v-if="scope.row.id"
                    :underline="false"
                    style="font-size:12px;color:#409EFF;margin-right: 20px"
                  >下载</el-button>
                  <el-button
                    type="text"
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
      <el-row :gutter="20" v-if="softwareForm.attribute == 2">
        <el-col :span="12">
          <el-form-item prop="scan" label="可浏览:">
            <!-- <el-select
              v-model="softwareForm.scan"
              size="small"
              style="width:400px"
              filterable
              multiple
              reserve-
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realname"
                :value="item.id.toString()"
              />
            </el-select> -->
            <treeselect
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :show-count="true"
                size="small"
                :normalizer="normalizer"
                v-model="softwareForm.scan"
                :multiple="true"
                :options="testDepartmentList"
                placeholder="请选择可浏览单位"
              ></treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="download" label="可下载:">
            <!-- <el-select
              v-model="softwareForm.download"
              size="small"
              style="width:400px"
              filterable
              multiple
              reserve-keyword
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realname"
                :value="item.id.toString()"
              />
            </el-select> -->
            <treeselect
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :show-count="true"
                size="small"
                :normalizer="normalizer"
                v-model="softwareForm.download"
                :multiple="true"
                :options="testDepartmentList"
                placeholder="请选择可下载单位"
              ></treeselect>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align:center;">
        <el-button v-if="isUpdate" size="small" type="primary" @click="upgradeSoftware">升级</el-button>
        <el-button v-else size="small" type="primary" @click="updateSoftware">提交</el-button>
        <el-button size="small" type="info" @click="cancelSubmit">取消</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as software from '@/api/software'
import * as user from '@/api/user'
import * as category from '@/api/category'
// import * as appConfig from '/public/config'
import * as organization from "@/api/organization";
// import fragmentdlg from './fragment-dependency'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import download from 'download-1.4.7'
import { config } from '@vue/test-utils'
import * as application from "@/api/application"
export default {
  components: {
    MarkdownEditor,
    // fragmentdlg,
    Treeselect
  },
  data() {
    return {
      isUpdate: false,
      parseLoading: false,
      uploadLoading: false,
      typeList: [],
      softwareForm: {
        property: 1,
        scan: [],
        download: [],
        name: ''
      },
      categoryProps: [],
      logoFileList: [],
      pageFileList: [],
      fileList: [],
      docList: [],
      detailFileList: [],
      deleteDataIdList: [],
      softwareFileList: [],
      globalUrl: '',
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fragmentdlgVisible: false,
      userList: [],
      softwareDataTypes: [],
      fileData: '',
      relations: [],
      dependency: [],
      userInfo: {},
      docData: [],
      disabled: false,
      offerUnits: [],
      fragmentArchList:[],
      softwareTypeList: [],
      testDepartmentList: [],

      logoKey: 0,
      picKey: 0,
      logoAndPicUrl: appConfig.config.urlFilePrefix,
      dataBeforeUploadCheck: appConfig.config.softwareDataUploadCheckType,
      proveUploadCheckType: appConfig.config.proveUploadCheckType,
    }
  },
  created() {
    if (this.$route.query.isUpdate) {
      this.$route.meta.title = '软件升级'
    } else {
      this.$route.meta.title = '软件编辑'
    }
  },
  async mounted() {
    await this.getSoftwareTypeList()
    await this.getFragmentArchList()
    await this.getFragmentTypeList()
    await this.getSoftwareDataTypeList()
    await this.getDeptTree()
    this.isUpdate = this.$route.query.isUpdate
    // var id = this.$route.query.id
    this.fileData = new FormData()
    // this.getSoftwareInfo(this.$route.query.version)
    this.globalUrl = appConfig.config.url
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (this.$route.query.id) {
      this.getSoftwareInfo(this.$route.query.id, this.$route.query.version)
    }
    // this.getUserList()
    // this.getAllSoftwareSource()
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
    downloadSoftware(name, path) {
      if(name==null||name==undefined||name.trim()==""||path==null||path==undefined||path.trim()==""){
        return this.$message.error("文件未上传，请上传文件后再下载")
      }else{
        let fileType = path.substring(path.lastIndexOf("."))
        let nameType = name.substring(name.lastIndexOf("."))
        let filename = name
        if(fileType !== nameType){
          filename = filename + fileType
        }
        let url = appConfig.config.url + "/appstore" + path
        this.$download.downloadSoftwareByUrlAndEditName(url, filename)
      }
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
    showSizes(val) {
      if(val === 0)
        return "0B"
      var k = 1024
      var sizes = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"],
      i = Math.floor(Math.log(val) / Math.log(k))
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i]
    },
    getSoftwareTypeList() {
      category.getCategoryList("service").then(response => {
        if (response.code === 200) {
          this.categoryProps = response.data.list;
          console.log(this.categoryProps, "categoryProps")
        }
      });
    },
    getAllSoftwareSource() {
      user.getAllSoftwareSource(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.offerUnits = response.data
        }
      })
    },
    sourceNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          console.log("docData",response.data)
          // this.docData = response.data
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
          })
        }
      })
    },
    upgradeSoftware() {
      this.$refs.softwareForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // const offerUnitName = this.offerUnits.find(item => item.offerUnitId === this.softwareForm.offerUnit).offerUnitName
          const softwareData = {
            name: this.softwareForm.name,
            type: this.softwareForm.type,
            categoryIds: this.softwareForm.categoryIds.toString(),
            offerUnitId: this.softwareForm.offerUnitId,
            devUnit: this.softwareForm.devUnit,
            uid: this.userInfo.userId,
            relations: this.relations ? this.relations.toString() : null,
            status: 0,
            isDel: 0,
            platform: this.softwareForm.platform,
            identity: this.softwareForm.identity,
            isView: this.softwareForm.scan ? this.softwareForm.scan.toString() : null,
            isDownload: this.softwareForm.download ? this.softwareForm.download.toString() : null,
            attribute: this.softwareForm.attribute
          }
          const softwareVersionData = {
            path: this.softwareForm.path,
            uid: this.userInfo.userId,
            // uName: this.userInfo.realName,
            current: 1,
            description: this.softwareForm.description,
            upgradeDescription: this.softwareForm.upgradeDescription,
            uploadStatus: 5,
            status: 0,
            isUpgrade: 1,
            isdel: 0,
            // cUser: this.userInfo.realName,
            // uUser: this.userInfo.realName,
            version: this.softwareForm.version
          }
          this.$refs.uploadSoftware.submit()
          this.$refs.logoFile.submit()
          this.$refs.pageFile.submit()
          this.$refs.detailFile.submit()
          this.$refs.dataFile.submit()
          this.fileData.append('softwareData', JSON.stringify(softwareData))
          this.fileData.append('softwareDataStr', JSON.stringify(this.docData))
          this.fileData.append('userId', this.userInfo.userId)
          this.fileData.append('softwareVersionData', JSON.stringify(softwareVersionData))
          software.addSoftware(this.fileData).then(response => {
            this.uploadLoading = false
            if (response.code === 200) {
              this.$message.success('软件升级成功')
              this.$router.push('/admin/software/management')
            } else {
              this.$message.warning(response.msg)
            }
            // this.$refs.logoFile.clearFiles()
            // this.logoFileList = []
            this.fileData = new FormData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateSoftware() {
      this.$refs.softwareForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // const offerUnitId = this.offerUnits.find(item => item.offerUnitName === this.softwareForm.offerUnit).offerUnitId
          // console.log("this.softwareForm", this.softwareForm);
          const softwareData = {
            isUpgrade: 0,
            // relations: this.relations ? this.relations.toString() : null,
            // identity: this.softwareForm.identity,
            md5: this.softwareForm.md5,
            // userId: this.userInfo.userId,
            // uUser: this.userInfo.realName,
            // validateUser: this.userInfo.realName,
            // uploadStatus: 5,
            // opinion: this.softwareForm.reject,
            isView: this.softwareForm.scan ? this.softwareForm.scan.join(',') : null,
            isDownload: this.softwareForm.download ? this.softwareForm.download.join(',') : null,
            attribute: this.softwareForm.attribute,
            description: this.softwareForm.description,
            // platform: this.softwareForm.platform,
            cpu: this.softwareForm.cpu ? this.softwareForm.cpu.join(',') : null,
            categoryIds: this.softwareForm.categoryIds? this.softwareForm.categoryIds.join(',') : null,
            fragmentType: this.softwareForm.fragmentType? this.softwareForm.fragmentType.toString() : null,
            // type: this.softwareForm.type,
            service: this.softwareForm.service.join(','),
            offerUnitId: this.softwareForm.offerUnitId,
            devUnit: this.softwareForm.devUnit,
            softwareName: this.softwareForm.name,
            version: this.softwareForm.version,
            softwareId: this.softwareForm.id,
            versionId: this.softwareForm.versionId,
            logo: this.softwareForm.logo,
            pic: this.softwareForm.pic,
            testValidation: this.softwareForm.testProved,
            // deleteDataIdListStr: this.deleteDataIdList,
            softwareDataList: this.docData
          }
          //this.$refs.detailFile.submit()
          //this.$refs.pageFile.submit()
          //this.$refs.logoFile.submit()
          //this.$refs.dataFile.submit()
          // this.fileData.append('softwareDataString', this.docData)
          // this.fileData.append('updateSoftwareVersionString', softwareData)
          console.log(softwareData);
          software.updateSoftware(softwareData).then(response => {
            this.uploadLoading = false
            if (response.code === 200) {
              this.$message.success('更新成功')
              this.$router.push('/admin/software/management')
            }
            // this.fileData.delete('softwareDetailFiles')
            // this.fileData.delete('updateSoftwareVersionString')
            // this.fileData = new FormData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getFragmentArchList() {
        category.getCategoryList("fragment_arch", null, null).then(response => {
            // let res = this.handleTree(response.data.list)
            // this.fragmentArchList = res;
            this.fragmentArchList = response.data.list
        });
    },
    getFragmentTypeList() {
        category.getCategoryList("fragment_type", null, null).then(response => {
            // let res = this.handleTree(response.data.list)
            // this.softwareTypeList = res;
            this.softwareTypeList = response.data.list
        });
    },
    getSoftwareInfo(softwareId, softwareVersion) {
      software.getSoftwareInfo(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          const softwareDataInfo = response.data
          console.log(softwareDataInfo, "softwareDataInfo")
          this.softwareForm = softwareDataInfo
          if (this.isUpdate) {
            this.softwareForm.version = ''
            this.softwareForm.path = ''
          } else {
            this.getSoftwareDataList(softwareDataInfo.id, softwareDataInfo.versionId)
          }
          if (softwareDataInfo.categoryIds) {
            this.softwareForm.categoryIds = softwareDataInfo.categoryIds.split(',')
          }
          if (softwareDataInfo.isView) {
            this.softwareForm.scan = softwareDataInfo.isView.split(',')
          }
          if (softwareDataInfo.isDownload) {
            this.softwareForm.download = softwareDataInfo.isDownload.split(',')
          }
          if (softwareDataInfo.relations) {
            this.relations = softwareDataInfo.relations.split(',')
          }
          if (softwareDataInfo.cpu) {
            this.softwareForm.cpu = softwareDataInfo.cpu.split(',')
          }
          if (softwareDataInfo.service) {
            let service = softwareDataInfo.service.split(',')
            this.softwareForm.service = []
            for(let num=0;num<service.length;num++){
              this.softwareForm.service.push(parseInt(service[num]))
            }
          }
          // if (softwareDataInfo.logo) {
          //   this.logoFileList.push({
          //     url: window._gconf.urlFilePrefix + softwareDataInfo.logo,
          //     name: softwareDataInfo.logo.substring(softwareDataInfo.logo.lastIndexOf('/') + 1)
          //   })
          // }
          // if (softwareDataInfo.pic) {
          //   this.pageFileList.push({
          //     url: window._gconf.urlFilePrefix + softwareDataInfo.pic,
          //     name: softwareDataInfo.pic.substring(softwareDataInfo.pic.lastIndexOf('/') + 1)
          //   })
          // }
          if (softwareDataInfo.testProved) {
            softwareDataInfo.testProved.forEach(item => {
              this.detailFileList.push({
                url: item,
                name: item.substring(item.lastIndexOf('/') + 1)
              })
            })
          }
        }
      })
    },
    addDependencyItem(item) {
      this.dependency.push(item)
      this.dependency = this.dependency.filter(item => item.isSelected)
      this.relations = this.dependency.map(item => item.identity)
    },
    getUserList() {
      user.getUserList().then(response => {
        if (response.code === 200) {
          this.userList = response.data
        }
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    getSoftwareDataTypeList() {
      category.getCategoryList("data_type", null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list
        }
      })
    },
    selectModuleAdd() {},
    downloadSoftwareData(row) {
      software.downloadSoftwareData(this.userInfo.userId, row.id).then(response => {
        const blob = new Blob([response])
        download(blob, row.name, row.name.lastIndexOf('.') + 1)
      })
    },
    pageFileUpload(params) {
      // this.fileData.append('pageFile', file.file)
      console.log("application",params)
      let file = params.file
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.$message.success('封面上传成功')
          let path = response.data.fileName
          this.softwareForm.pic = path;
          this.picKey = this.picKey + 1
          console.log(this.softwareForm.pic, "this.softwareForm.pic")
        }
      });
    },
    detailFileUpload(file) {
      this.fileData.append('softwareDetailFiles', file.file)
    },
    logoFileUpload(params) {
      // this.fileData.append('logoFile', file.file)
      let file = params.file
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.$message.success('logo上传成功')
          let path = response.data.fileName
          this.softwareForm.logo = path;
          this.logoKey = this.logoKey + 1
          console.log(this.softwareForm.logo, "this.softwareForm.logo")
        }
      });
    },
    handleDetailFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name)
      const accessFileType = ['jpg', 'png', 'bmp', 'jpeg', 'pdf']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt20M = file.size / 1024 / 1024 < 20
      if (existFile) {
        this.$message.error('当前文件已存在！')
        fileList.pop()
      } else if (!isType) {
        this.$message.error('上传文件格式异常!')
        fileList.pop()
      } else if (!isLt20M) {
        this.$message.error('上传测试证明文件大小不能超过 20MB!')
        fileList.pop()
      }
      this.detailFileList = fileList
    },
    // eslint-disable-next-line no-dupe-keys
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.options = this.list.filter(item => {
    //         return item.label.toLowerCase()
    //           .indexOf(query.toLowerCase()) > -1
    //       })
    //     }, 200)
    //   } else {
    //     this.options = []
    //   }
    // },
    handleRemoveLogoFile(file, fileList) {
      if (file.url === this.softwareForm.logo) {
        this.softwareForm.logo = null
      }
    },
    handleLogoFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name)
      const accessFileType = ['jpg', 'png', 'bmp', 'jpeg']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt20M = file.size / 1024 / 1024 < 20
      if (existFile) {
        this.$message.error('当前文件已存在！')
        fileList.pop()
      } else if (!isType) {
        this.$message.error('上传文件格式异常!')
        fileList.pop()
      } else if (!isLt20M) {
        this.$message.error('上传软件logo文件大小不能超过 20MB!')
        fileList.pop()
      }
      // this.logoFileList = fileList
    },
    handleRemovePageFile(file, fileList) {
      if (file.url === this.globalUrl + this.softwareForm.pic) {
        this.softwareForm.pic = null
      }
    },
    handlePageFileChange(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name)
      const accessFileType = ['jpg', 'png', 'bmp', 'jpeg']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt10M = file.size / 1024 / 1024 < 10
      if (existFile) {
        this.$message.error('当前文件已存在！')
        fileList.pop()
      } else if (!isType) {
        this.$message.error('上传文件格式异常!')
        fileList.pop()
      } else if (!isLt10M) {
        this.$message.error('上传软件封面文件大小不能超过 10MB!')
        fileList.pop()
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      // this.dialogImageUrl = file.url
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveDetailFile(file) {
      const url = file.url
      this.detailFileList.forEach((item, index) => {
        if (item.url === url) {
          this.detailFileList.splice(index, 1)
        }
      })
      const that = this
      this.softwareForm.testProved.forEach((item, index) => {
        if (item === url) {
          that.softwareForm.testProved.splice(index, 1)
        }
      })
    },
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'b'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'Kb'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'Mb'
      }
    },
    handleDownload(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeDataUpload(file) {
      let fileSize = file.size / 1024 / 1024
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const acceptType = this.dataBeforeUploadCheck.split(",");
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
    uploadSoftwareData(params) {
      // this.fileData.append('softwareDataFiles', file.file)
      console.log("application",params)
      let file = params.file
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
           this.docData.push({
            name: file.name,
            paths:response.data.fileName,
            sizes: file.size+"",
            category: this.softwareDataTypes[0].id,
            softwareId: this.softwareForm.id,
            versionId: this.softwareForm.versionId,
            // utime: file.uid
          })
        }
      });
    },
    handleDataFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleDataFileChange(file, fileList) {
      const accessFileType = ['doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isType) {
        this.$message.error('上传文件格式异常!')
        fileList.pop()
      } else if (!isLt100M) {
        this.$message.error('上传资料文件大小不能超过 100MB!')
        fileList.pop()
      }
      if (isType && isLt100M) {
        const existFile = fileList
          .slice(0, fileList.length - 1)
          .find(f => f.name === file.name)
        if (existFile) {
          this.$message.error('当前文件已存在！')
          fileList.pop()
        } else {
          // this.docData.push({
          //   name: file.name,
          //   size: file.size+"",
          //   category: this.softwareDataTypes[0].id,
          //   softwareId: this.softwareForm.id,
          //   versionId: this.softwareForm.versionId,
          //   utime: file.uid
          // })
          // console.log(this.docData, "this.docData")
        }
      }
      // this.fileList = fileList
    },
    handleRemoveDoc(index, item) {
      this.docData.splice(index, 1)
      if (!item.id) {
        const that = this
        this.fileList.forEach((i, index) => {
          if (i.uid === item.utime) {
            that.fileList.splice(index, 1)
          }
        })
      } else {
        this.deleteDataIdList.push(item.id)
      }
    },
    handleDownloadDoc(index, row) {
    },
    handleChangeFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    beforeUpload(file) {
      const accessFileType = ['tar', 'war', 'jar', 'rpm', 'apk']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt2G = file.size / 1024 / 1024 < 20480
      if (!isType) {
        this.$message.error('上传文件格式异常!')
      } else if (!isLt2G) {
        this.$message.error('上传软件资源大小不能超过 20GB!')
      }
      return isType && isLt2G
    },
    cancelSubmit() {
      history.go(-1)
    }
  }
}
</script>
<style scoped>
  /deep/ .el-table {
    overflow: visible !important;
  }
  /deep/ .el-table .cell {
    /*overflow: visible !important;*/
  }

  /deep/ .el-table__body-wrapper {
    overflow: visible !important;
  }
  .notClick {
    pointer-events: none;
  }
  .app-main .el-form {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
