<template>
  <div class="app-container">
    <el-steps :active="step - 1" simple>
      <el-step title="基本信息" icon="el-icon-edit" />
      <el-step title="资料上传" icon="el-icon-upload" />
      <el-step title="权限设置" icon="el-icon-picture" />
      <el-step title="待审核" icon="el-icon-picture" />
    </el-steps>
    <el-form
      v-show="step===1"
      ref="baseForm"
      name="baseForm"
      :model="baseForm"
      @submit.prevent
      label-position="right"
      label-width="150px"
      style="margin-top:10px;"
      v-loading="parseLoading || uploadLoading"
      :element-loading-text="parseLoading?'正在解析...':uploadLoading?'提交中...':''"
    >
      <el-form-item prop="path" label="软件路径:" :rules="[{ required: true, message: '请上传软件', trigger: 'change' }]">
        <el-input v-model="baseForm.path" size="small" style="width:80%" readonly />
        <el-upload
          ref="uploadSoftware"
          style="display:inline-block; "
          class="upload-demo"
          action=""
          :http-request="uploadSoftwareFile"
          :before-upload="beforeUpload"
          :on-change="handleChangeFile"
          :file-list="softwareFileList"
          :show-file-list="false"
          accept=".tar,.war,.jar,.rpm,.apk"
        >
          <el-button size="small" type="primary" style="display:inline-block;margin-left:10px;">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="name" label="软件名称:" :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur' },{min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件名称不合法', trigger: 'blur'}]">
        <el-input v-model="baseForm.name" size="small" style="width:80%" />
      </el-form-item>
      <el-form-item prop="version" label="软件版本:" :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '软件版本不合法', trigger: 'blur'}]">
        <el-input v-model="baseForm.version" size="small" style="width:80%" />
      </el-form-item>
      <el-form-item prop="identity" label="接口标识:" :rules="[{ required: true, message: '接口标识不能为空', trigger: 'blur' },{min: 0, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '接口标识不合法', trigger: 'blur'}]">
        <el-input v-model="baseForm.identity" size="small" style="width:80%" />
      </el-form-item>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item prop="type" label="软件类型:" :rules="[{required:true,message:'软件类型不能为空',trigger:'change'}]">
            <el-select
              v-model="baseForm.type"
              size="small"
              style="max-width:400px"
              filterable
              reserve-keyword
              value=""
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.label"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="platform" label="CPU架构:" :rules="[{required:true,message:'软件架构不能为空',trigger:'change'}]">
            <el-select
              v-model="baseForm.platform"
              size="small"
              style="max-width:400px"
              filterable
              reserve-keyword
              value=""
            >
              <el-option label="飞腾" value="飞腾" />
              <el-option label="龙芯" value="龙芯" />
              <el-option label="申威" value="申威" />
              <el-option label="x86" value="x86" />
              <el-option label="arm64" value="arm64" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item prop="categoryIds" label="软件分类:" :rules="[{required:true,message:'选择软件的软件分类',trigger:'change'}]">
            <!--            <el-select-->
            <!--              v-model="baseForm.categoryIds"-->
            <!--              size="small"-->
            <!--              style="max-width:400px"-->
            <!--              filterable-->
            <!--              multiple-->
            <!--              reserve-keyword-->
            <!--            >-->
            <!--              <el-option label="航天" value="1" />-->
            <!--              <el-option label="测绘" value="2" />-->
            <!--              <el-option label="数据" value="3" />-->
            <!--              <el-option label="态势" value="4" />-->
            <!--            </el-select>-->
            <!--            <el-cascader-->
            <!--              v-model="baseForm.categoryIds"-->
            <!--              :options="categoryOptions"-->
            <!--              :props="{ expandTrigger: 'hover' }"-->
            <!--              @change="handleCategoryChange"></el-cascader>-->
            <el-cascader v-model="baseForm.categoryIds" style="width: 58%" :props="categoryProps" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="软件依赖:">
            <el-button type="primary" size="mini" @click="fragmentdlgVisible=true">添加软件依赖</el-button>
          </el-form-item>

        </el-col>
        <fragmentdlg
          :visible="fragmentdlgVisible"
          :selectedDependency="this.relations"
          @close="fragmentdlgVisible=false"
          @addDependency="addDependencyItem"
        />
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="软件Logo:">
            <el-upload
              action=""
              show-file-list
              multiple
              ref="logoFile"
              :file-list="logoFileList"
              :on-preview="handlePreview"
              list-type="picture"
              :http-request="uploadSoftwareLogoFile"
              :on-change="handleLogoFileChange"
              :on-remove="handleLogoFileRemove"
              :on-exceed="handleLogoFileExceed"
              accept=".jpg,.png,.bmp,.PNG,.jpeg"
              :limit="1"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <ul v-if="dependency.length>0" style="margin-left:100px;font-size:12px;max-height:80px;overflow:auto;color: #ffffff">
            <li v-for="(item,index) in dependency" :key="index">
              "软件名称"->{{ item.name }}({{ item.version }})
            </li>
          </ul>
        </el-col>
      </el-row>

      <el-form-item label="软件封面:">
<!--        <img v-if="pageDialogImageUrl" width="50px" height="50px" :src="pageDialogImageUrl" alt="">-->
        <el-upload
          action=""
          show-file-list
          multiple
          ref="pageFile"
          :file-list="pageFileList"
          :on-preview="handlePreview"
          list-type="picture"
          :http-request="uploadSoftwarePageFile"
          :on-change="handlePageFileChange"
          :on-remove="handlePageFileRemove"
          :on-exceed="handlePageFileExceed"
          accept=".jpg,.png,.bmp,.PNG,.jpeg"
          :limit="1"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp文件，且不超过10M</div>
        </el-upload>
      </el-form-item>
      <el-form-item prop="description" label="软件描述:" :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]">
<!--        <markdown-editor-->
<!--          ref="markdownEditor"-->
<!--          v-model="baseForm.description"-->
<!--          height="200px"-->
<!--        />-->
<!--        <div v-html="html"></div>-->
        <el-input v-model="baseForm.description" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="devUnit" label="研制单位:" :rules="[{required:true,message:'请输入研制单位',trigger:'change'},{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '研制单位不合法', trigger: 'blur'}]">
            <el-input v-model="baseForm.devUnit" size="small" style="width:400px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="offerUnitId" label="提供单位:" :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]">
<!--            <el-select-->
<!--              v-model="baseForm.offerUnit"-->
<!--              size="small"-->
<!--              style="width:400px"-->
<!--              :remote-method="remoteMethod"-->
<!--              :loading="loading"-->
<!--              filterable-->
<!--              remote-->
<!--              reserve-keyword-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in offerUnits"-->
<!--                :key="item.offerUnitId"-->
<!--                :label="item.offerUnitName"-->
<!--                :value="item.offerUnitId"-->
<!--              />-->
<!--            </el-select>-->
            <treeselect
              v-model="baseForm.offerUnitId"
              style="max-width:400px;"
              :multiple="false"
              :options="offerUnits"
              :appendToBody="true"
              :disable-branch-nodes="false"
              :normalizer="sourceNormalizer"
              :show-count="true"
              placeholder="请选择提供单位"
              @select="selectModuleAdd"></treeselect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="测试证明:">
<!--        <el-upload-->
<!--          action="#"-->
<!--          list-type="picture-card"-->
<!--          :file-list="softwareDetailFileList"-->
<!--          multiple-->
<!--          ref="uploadDetailFile"-->
<!--          :on-change="handleDetailFileChange"-->
<!--          :http-request="uploadSoftwareDetailFile"-->
<!--        >-->
        <el-upload
          action=""
          show-file-list
          multiple
          ref="detailFile"
          :file-list="softwareDetailFileList"
          list-type="picture-card"
          :http-request="uploadSoftwareDetailFile"
          :on-change="handleDetailFileChange"
          :on-exceed="handleDetailFileExceed"
          :limit="3"
          accept=".jpg,.png,.bmp,.PNG,.jpeg"
          :auto-upload="false"
        >
          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in" />
              </span>
<!--              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDetailFileDownload(file)">-->
<!--                <i class="el-icon-download" />-->
<!--              </span>-->
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDetailFileRemove(file)">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-card v-show="step==2" style="margin-top:10px;">
      <div style="font-size:14px;font-weight:600;">资料上传</div>
      <el-upload
        style="margin-top:10px;"
        class="upload-demo"
        action=""
        :file-list="fileList"
        :show-file-list="false"
        ref="dataFile"
        :on-change="handleDataFileChange"
        :on-remove="handleDataFileRemove"
        :http-request="uploadSoftwareData"
        accept=".doc, .docx, .pdf, .txt, .ppt, .pptx, .xls, .xlsx"
        :auto-upload="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传pdf/doc/docx/ppt/pptx/xls/xlsx/txt文件，且不超过100M</div>
      </el-upload>
<!--      <div style="font-size:16px;font-weight:600;">已传附件</div>-->
      <el-table
        :data="docData"
        size="mini"
        :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
        style="margin:10px;"
      >
        <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
        <el-table-column min-width="300px" label="资料名称">
          <template slot-scope="{row}">
            <template>
              <el-input v-model="row.name" class="edit-input" size="small" />
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="资料类型" prop="category">
          <template slot-scope="scope">
<!--            <el-select v-model="scope.row.category">-->
<!--              <el-option-->
<!--                v-for="item in softwareDataTypes"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
            <treeselect
              v-model="scope.row.category"
              style="max-width:400px;"
              :multiple="false"
              :options="softwareDataTypes"
              :appendToBody="true"
              :disable-branch-nodes="false"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择资料类型"
              @select="selectModuleAdd"></treeselect>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-remove"
                @click="handleRemoveDoc(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-form
      v-show="step==3"
      ref="authForm"
      name="authForm"
      :model="authForm"
      label-position="right"
      label-width="100px"
      style="margin-top:10px;"
    >
      <el-form-item prop="attribute" label="应用授权:">
        <el-radio v-model="authForm.attribute" :label=1>公开</el-radio>
        <el-radio v-model="authForm.attribute" :label=2>私有</el-radio>
      </el-form-item>
      <el-form-item prop="scan" label="可浏览:" v-if="authForm.attribute == 2">
        <el-select
          v-model="authForm.scan"
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
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="download" label="可下载:" v-if="authForm.attribute == 2">
        <el-select
          v-model="authForm.download"
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
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-card v-show="step==4" style="text-align:center;margin-top:10px;">
      <i class="el-icon-check" style="color:green;font-size:40px;" />
      <div>软件已提交，请等待审核！</div>
    </el-card>
    <div style="text-align:center">
      <el-button
        v-if="step>1 & step!=4"
        size="small"
        style="background:#05994e;color:white;margin-top:10px"
        @click="perv"
      >上一步
      </el-button>
      <el-button
        v-if="step<4"
        size="small"
        style="background:#05994e;color:white;margin-top:10px"
        @click="next"
      >下一步
      </el-button>
    </div>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import fragmentdlg from './fragment-dependency'
import * as software from '@/api/software'
import * as user from '@/api/user'
import * as category from '@/api/category'
// import * as appConfig from '/public/config'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import download from 'download-1.4.7'

export default {
  components: {
    MarkdownEditor,
    fragmentdlg,
    Treeselect
  },
  data() {
    return {
      parseLoading: false,
      uploadLoading: false,
      step: 1,
      loading: false,
      fragmentdlgVisible: false,
      dependency: [],
      options: [],
      value: [],
      list: [],
      pageDialogImageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      softwareFileList: [],
      isAddSoftware: true,
      isAddSoftwareData: true,
      typeList: [
        {
          id: 1,
          name: 'serviceSeg',
          label: '服务端'
        },
        {
          id: 2,
          name: 'applicationSeg',
          label: '应用端'
        },
        {
          id: 3,
          name: 'mobileSeg',
          label: '移动端'
        }
      ],
      baseForm: {
        name: '',
        offerUnit: null,
        devUnit: '',
        type: '',
        platform: '',
        description: '',
        path: '',
        testProved: []
      },
      offerUnits: [],
      softwareForm: {
        version: '',
        path: ''
      },
      authForm: {
        attribute: 1,
        scan: [],
        download: []
      },
      userInfo: {},
      fileData: '',
      softwareDatafileData: '',
      relations: null,
      softwareTypes: [],
      categoryProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          level + 1
          category.getCategoryList(node.value, null, null).then(response => {
            const data = response.data.list
            for (var i = 0; i < data.length; i++) {
              if (data[i].children == null || data[i].children.length === 0) {
                data[i].children = undefined
              }
            }
            const nodes = data.map(item => {
              return {
                label: item.name,
                value: item.id.toString(),
                leaf: level >= 1
              }
            })
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          })
        }
      },
      docData: [],
      deleteDataIdList: [],
      softwareDataTypes: [],
      softwareInfo: {},
      userList: [],
      softwareDetailFileList: [],
      globalUrl: '',
      pageFileList: [],
      logoFileList: [],
      html: ''
    }
  },
  mounted() {
    this.globalUrl = appConfig.config.url
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (this.$route.query.step != null) {
      const softwareDataInfo = JSON.parse(window.localStorage.getItem('softwareData'))
      this.step = this.$route.query.step - 1
      this.getSoftwareDataList(softwareDataInfo.id, softwareDataInfo.version)
      this.isAddSoftware = false
      this.isAddSoftwareData = false
      this.baseForm = softwareDataInfo
      this.baseForm.categoryIds = this.baseForm.categoryIds.split(',')
      if (softwareDataInfo.isView) {
        this.softwareForm.scan = softwareDataInfo.isView.split(',')
      }
      if (softwareDataInfo.isDownload) {
        this.softwareForm.download = softwareDataInfo.isDownload.split(',')
      }
      this.softwareDetailFileList = []
      const that = this
      if (softwareDataInfo.relations) {
        this.relations = softwareDataInfo.relations.split(',')
      }
      if (softwareDataInfo.logo) {
        this.logoFileList.push({
          url: softwareDataInfo.logo,
          name: softwareDataInfo.logo.substring(softwareDataInfo.logo.lastIndexOf('/') + 1)
        })
      }
      if (softwareDataInfo.pic) {
        this.pageFileList.push({
          url: softwareDataInfo.pic,
          name: softwareDataInfo.pic.substring(softwareDataInfo.pic.lastIndexOf('/') + 1)
        })
      }
      if (softwareDataInfo.testProved) {
        softwareDataInfo.testProved.forEach(item => {
          this.softwareDetailFileList.push({
            url: item,
            name: item.substring(item.lastIndexOf('/') + 1)
          })
        })
      }
    }
    this.getSoftwareClassify()
    this.fileData = new FormData()
    this.softwareDatafileData = new FormData()
    this.getSoftwareTypeList()
    this.getSoftwareDataTypeList()
    this.getUserList()
    this.getAllSoftwareSource()
  },
  beforeDestroy() {
    window.localStorage.removeItem('softwareData')
  },
  methods: {
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
    },
    getAllSoftwareSource() {
      user.getAllSoftwareSource(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.offerUnits = response.data
        }
      })
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
    handleCategoryChange() {
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
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          const dataList = response.data
          this.docData = dataList
        }
      })
    },
    getSoftwareTypeList() {
      software.getSoftwareSet(7).then(response => {
        if (response.code === 200) {
          this.softwareTypes = response.data
        }
      })
    },
    addSoftware() {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // const offerUnitName = this.offerUnits.find(item => item.offerUnitId === this.baseForm.offerUnit).offerUnitName
          const softwareData = {
            name: this.baseForm.name,
            type: this.baseForm.type,
            categoryIds: this.baseForm.categoryIds.toString(),
            offerUnitId: this.baseForm.offerUnitId,
            devUnit: this.baseForm.devUnit,
            uid: this.userInfo.userId,
            relations: this.relations ? this.relations.toString() : null,
            status: 0,
            isDel: 0,
            platform: this.baseForm.platform,
            identity: this.baseForm.identity,
            attribute: 1
          }
          const softwareVersionData = {
            path: this.baseForm.path,
            uid: this.userInfo.userId,
            // uName: this.userInfo.realName,
            current: 0,
            description: this.baseForm.description,
            uploadStatus: 3,
            status: 0,
            isUpgrade: 0,
            isdel: 0,
            // cUser: this.userInfo.realName,
            // uUser: this.userInfo.realName,
            version: this.baseForm.version
          }
          this.$refs.uploadSoftware.submit()
          this.$refs.logoFile.submit()
          this.$refs.pageFile.submit()
          this.$refs.detailFile.submit()
          this.fileData.append('softwareData', JSON.stringify(softwareData))
          this.fileData.append('userId', this.userInfo.userId)
          this.fileData.append('softwareVersionData', JSON.stringify(softwareVersionData))
          software.addSoftware(this.fileData).then(response => {
            this.uploadLoading = false
            if (response.code === 200) {
              this.step = 2
              this.softwareInfo = response.data
              this.baseForm.id = this.softwareInfo.id
              this.baseForm.versionId = this.softwareInfo.versionId
              this.$message.success('软件资源上传成功')
              this.isAddSoftware = false
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
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // const offerUnitId = this.offerUnits.find(item => item.offerUnitName === this.baseForm.offerUnit).offerUnitId
          const softwareData = {
            isUpgrade: 0,
            relations: this.relations ? this.relations.toString() : null,
            identity: this.baseForm.identity,
            uid: this.userInfo.userId,
            validateUser: this.userInfo.realName,
            description: this.baseForm.description,
            platform: this.baseForm.platform,
            categoryIds: this.baseForm.categoryIds.toString(),
            type: this.baseForm.type,
            offerUnitId: this.baseForm.offerUnitId,
            devUnit: this.baseForm.devUnit,
            softwareName: this.baseForm.name,
            version: this.baseForm.version,
            softwareId: this.baseForm.id,
            versionId: this.baseForm.versionId,
            logo: this.baseForm.logo,
            pic: this.baseForm.pic,
            testValidation: this.baseForm.testProved
          }
          this.$refs.uploadSoftware.submit()
          this.$refs.logoFile.submit()
          this.$refs.pageFile.submit()
          this.$refs.detailFile.submit()
          this.fileData.append('softwareDataString', null)
          this.fileData.append('updateSoftwareVersionString', JSON.stringify(softwareData))
          software.updateSoftware(this.fileData).then(response => {
            this.uploadLoading = false
            if (response.code === 200) {
              this.$message.success('软件资源更新成功')
              this.step = 2
            }
            this.fileData = new FormData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    parseSoftware(data) {
      this.parseLoading = true
      software.parseSoftware(data).then(response => {
        if (response.code === 200) {
          const softwareInfo = this.baseForm
          this.baseForm = response.data
          if (this.baseForm.relations) {
            this.relations = this.baseForm.relations.split(',')
          }
          this.baseForm.attribute = softwareInfo.attribute
          this.baseForm.scan = softwareInfo.scan
          this.baseForm.download = softwareInfo.download
          this.baseForm.type = this.baseForm.type === 'service' ? 'serviceSeg' : this.baseForm.type
          this.logoFileList = []
          if (this.baseForm.logo) {
            this.logoFileList.push({
              url: this.baseForm.logo,
              name: this.baseForm.logo.substring(this.baseForm.logo.lastIndexOf('/') + 1)
            })
          }
          this.pageFileList = []
          if (this.baseForm.pic) {
            this.pageFileList.push({
              url: this.baseForm.pic,
              name: this.baseForm.pic.substring(this.baseForm.pic.lastIndexOf('/') + 1)
            })
          }
        } else if (response.code === -1) {
          this.$message.warning(response.msg)
          this.baseForm.path = response.data
        } else {
          this.$message.error(response.msg)
        }
        this.parseLoading = false
      })
    },
    getSoftwareClassify() {
      software.getSoftwareType().then(response => {
        this.categoryOptions = response.data
      })
    },
    // 上传文件
    uploadSoftwareFile(file) {
      this.fileData.append('softwareFile', file.file) // 增加数据
      if (!this.uploadLoading) {
        const data = new FormData()
        data.append('file', file.file)
        this.parseSoftware(data)
      }
    },
    handleChangeFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    addSoftwareData() {
      this.$refs.dataFile.submit()
      this.softwareDatafileData.append('softwareData', JSON.stringify(this.docData))
      this.softwareDatafileData.append('userId', this.userInfo.userId)
      software.addSoftwareData(this.softwareDatafileData).then(response => {
        if (response.code === 200) {
          this.$message.success('软件资料添加成功')
          this.step = 3
          this.isAddSoftwareData = false
        }
        this.softwareDatafileData.delete('softwareDataFiles')
        this.softwareDatafileData.delete('softwareData')
        this.softwareDatafileData.delete('userId')
      })
    },
    updateSoftwareData() {
      this.$refs.dataFile.submit()
      this.softwareDatafileData.append('softwareDataStr', JSON.stringify(this.docData))
      this.softwareDatafileData.append('userId', this.userInfo.userId)
      this.softwareDatafileData.append('softwareVersionId', this.baseForm.versionId)
      this.softwareDatafileData.append('deleteDataIdListStr', this.deleteDataIdList.toString())
      software.updateSoftwareData(this.softwareDatafileData).then(response => {
        if (response.code === 200) {
          this.$message.success('软件资料更新成功')
          this.step = 3
          this.isAddSoftwareData = false
          this.deleteDataIdList = []
        }
        this.softwareDatafileData = new FormData()
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
    getSoftwareDataTypeList() {
      category.getCategoryList(42, null, null).then(response => {
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
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'b'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'Kb'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'Mb'
      }
    },
    handleDetailFileRemove(file) {
      const url = file.url
      this.softwareDetailFileList.forEach((item, index) => {
        if (item.url === url) {
          this.softwareDetailFileList.splice(index, 1)
        }
      })
      if (this.baseForm.testProved.length > 0) {
        const that = this
        this.baseForm.testProved.forEach((item, index) => {
          if (item === file.url) {
            that.baseForm.testProved.splice(index, 1)
          }
        })
      }
    },
    handlePreview(file) {
      this.pageDialogImageUrl = file.url
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDetailFileDownload(file) {
      const a = document.createElement('a')
      a.href = file.url
      a.download = file.name
      a.click()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    next() {
      if (this.step === 1) {
        if (this.isAddSoftware) {
          // this.step = 2
          this.addSoftware()
        } else {
          this.updateSoftware()
        }
      } else if (this.step === 2) {
        if (this.isAddSoftwareData) {
          this.addSoftwareData()
        } else {
          this.updateSoftwareData()
        }
      } else if (this.step === 3) {
        this.updateSoftwareRights()
      } else {
        const flag = this.step + 1
        if (flag <= 5) {
          this.step++
        }
      }
    },
    perv() {
      this.step--
      // const flag = this.step - 1
      // if (flag >= 1) {
      //   this.step--
      // }
    },
    addDependencyItem(item) {
      this.dependency.push(item)
      this.dependency = this.dependency.filter(item => item.isSelected)
      this.relations = this.dependency.map(item => item.identity)
    },
    updateSoftwareRights() {
      const data = new FormData()
      const permission = {
        softwareId: this.baseForm.id,
        versionId: this.baseForm.versionId,
        attribute: this.authForm.attribute,
        isView: this.authForm.scan.toString(),
        isDownload: this.authForm.download.toString(),
        uid: this.userInfo.userId,
        uploadStatus: 5
      }
      data.append('updateSoftwareVersionString', JSON.stringify(permission))
      software.updateSoftwareRight(data).then(response => {
        if (response.code === 200) {
          this.$message.success('软件权限设置成功')
          this.step = 4
        }
      })
    },
    getUserList() {
      user.getUserList().then(response => {
        if (response.code === 200) {
          this.userList = response.data
        }
      })
    },
    // 上传logo文件
    uploadSoftwareLogoFile(file) {
      this.fileData.append('logoFile', file.file) // 增加数据
    },
    // 移除文件
    handleLogoFileRemove(file, fileList) {
      this.logoFileList = fileList
      this.baseForm.logo = null
    },
    // 选取文件超出个数
    handleLogoFileExceed(file, fileList) {
      this.$message.warning(
        '文件上传限制为1个文件，本次选择了' + fileList.length + '个文件'
      )
    },
    // 监控文件上传列表
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
      this.logoFileList = fileList
    },
    // 上传page文件
    uploadSoftwarePageFile(file) {
      this.fileData.append('pageFile', file.file) // 增加数据
    },
    // 移除文件
    handlePageFileRemove(file, fileList) {
      this.pageFileList = fileList
      this.baseForm.pic = null
    },
    // 选取文件超出个数
    handlePageFileExceed(file, fileList) {
      this.$message.warning(
        '文件上传限制为1个文件，本次选择了' + fileList.length + '个文件'
      )
    },
    // 监控文件上传列表
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
      this.pageFileList = fileList
    },
    // 上传detail文件
    uploadSoftwareDetailFile(file, fileList) {
      this.fileData.append('softwareDetailFiles', file.file) // 增加数据
    },
    handleDetailFileExceed(file, fileList) {
      this.$message.warning(
        '文件上传限制为5个文件，本次选择了' + fileList.length + '个文件'
      )
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
      this.softwareDetailFileList = fileList
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
    uploadSoftwareData(file) {
      this.softwareDatafileData.append('softwareDataFiles', file.file)
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
          this.docData.push({
            name: file.name,
            size: this.formatFileSize(file.size),
            category: this.softwareDataTypes[0].id,
            softwareId: this.softwareInfo.id,
            versionId: this.softwareInfo.versionId,
            utime: file.uid
          })
        }
      }
      this.fileList = fileList
    }
  }
}
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
</style>
