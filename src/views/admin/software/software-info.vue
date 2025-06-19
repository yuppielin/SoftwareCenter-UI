<template>
  <el-card style="margin-top:20px;">
    <el-form ref="softwareForm" name="softwareForm" :model="softwareForm" label-position="right" label-width="120px" v-loading="parseLoading || uploadLoading" :element-loading-text="parseLoading?'正在解析...':uploadLoading?'提交中...':''">
      <el-form-item prop="name" label="软件名称:" :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur'},{min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }]">
        <el-input v-model="softwareForm.name" size="small" style="width:90%" />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="offerUnitId" label="提供单位:" :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]">
            <treeselect
              v-model="softwareForm.offerUnitId"
              style="max-width:400px;"
              :multiple="false"
              :appendToBody="true"
              :options="offerUnits"
              :disable-branch-nodes="false"
              :normalizer="sourceNormalizer"
              :show-count="true"
              placeholder="请选择提供单位">
            </treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="devUnit" label="研制单位:" :rules="[{required:true,message:'请输入研制单位',trigger:'change'},{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '研制单位不合法', trigger: 'blur'}]">
            <el-input v-model="softwareForm.devUnit" size="small" style="width:400px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="软件封面:">
        <!--        <img v-if="dialogImageUrl" width="50px" height="50px" :src="dialogImageUrl" alt="">-->
        <el-upload
          ref="pageFile"
          :auto-upload="false"
          list-type="picture"
          action="#"
          :file-list="pageFileList"
          :on-remove="handleRemovePageFile"
          :on-change="handlePageFileChange"
          :http-request="pageFileUpload"
          accept=".jpg,.png,.bmp,.PNG,.jpeg"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png/bmp文件，且不超过10M</div>
        </el-upload>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="type" label="软件类型:" :rules="[{required:true,message:'软件类型不能为空',trigger:'blur'}]">
            <el-select
              v-model="softwareForm.type"
              size="small"
              style="width:400px"
              filterable
              reserve-keyword
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
          <el-form-item prop="platform" label="CPU架构:" :rules="[{required:true,message:'CPU架构不能为空',trigger:'blur'}]">
            <el-select
              v-model="softwareForm.platform"
              size="small"
              style="width:400px"
              filterable
              reserve-keyword
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="categoryIds" label="软件分类:" :rules="[{required:true,message:'选择软件的软件分类',trigger:'blur'}]">
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
            <el-cascader v-model="softwareForm.categoryIds" :props="categoryProps" style="width:58%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="软件依赖:">
            <el-button type="primary" size="mini" @click="fragmentdlgVisible=true">添加软件依赖</el-button>
          </el-form-item>

        </el-col>
        <fragmentdlg
          :visible="fragmentdlgVisible"
          :selectedDependency="this.softwareForm.relations"
          @close="fragmentdlgVisible=false"
          @addDependency="addDependencyItem"
        />
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="软件Logo:">
            <el-upload
              ref="logoFile"
              class="upload-demo"
              action=""
              :on-preview="handlePreview"
              :on-remove="handleRemoveLogoFile"
              :on-change="handleLogoFileChange"
              :file-list="logoFileList"
              :http-request="logoFileUpload"
              accept=".jpg,.png,.bmp,.PNG,.jpeg"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传jpg/png/bmp文件，且不超过20M</div>
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
      <el-form-item prop="description" label="软件描述:" :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]">
<!--        <markdown-editor ref="markdownEditor" v-model="softwareForm.description " :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />-->
        <el-input v-model="softwareForm.description" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" />
      </el-form-item>
      <el-form-item label="测试证明:">
        <el-upload
          ref="detailFile"
          action="#"
          list-type="picture-card"
          :file-list="detailFileList"
          :http-request="detailFileUpload"
          :on-change="handleDetailFileChange"
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
<!--              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">-->
<!--                <i class="el-icon-download" />-->
<!--              </span>-->
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemoveDetailFile(file)">
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item prop="version" label="软件版本:" :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' }]">
        <el-input v-model="softwareForm.version" size="small" style="width:80%" />
      </el-form-item>
      <el-form-item prop="path" label="软件路径:" :rules="[{ required: true, message: '请上传软件', trigger: 'change' }]">
        <el-input v-model="softwareForm.path" size="small" readonly style="width:70%" />
        <el-upload
          style="display:inline-block;margin-left:10px;"
          class="upload-demo"
          action=""
          :http-request="uploadSoftwareFile"
          :on-change="handleChangeFile"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="软件资料:">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              style="margin-top:10px;"
              class="upload-demo"
              action=""
              :auto-upload="false"
              :file-list="fileList"
              :show-file-list="false"
              :on-change="handleDataFileChange"
              :on-remove="handleDataFileRemove"
              :http-request="uploadSoftwareData"
              ref="dataFile"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display:inline-block;margin-left:10px;">只能上传pdf/doc/docx/ppt/pptx/xls/xlsx/txt文件，且不超过100M</div>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-table
              :data="docData"
              size="mini"
              :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
              style="margin:10px;"
            >
              <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
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
              <el-table-column align="center" header-align="center" label="资料大小" width="100" prop="size" />
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
              @change="$forceUpdate()"
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
              @change="$forceUpdate()"
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
      <div style="text-align:center;">
        <el-button size="small" style="background:#05994e;color:white" @click="auditSoftwareUpload(1)">通过</el-button>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
        >
          <div style="text-align:center">
            <el-input v-model="softwareForm.reject" type="textarea" :rows="5" style="margin-bottom:10px;" show-word-limit maxlength="50" placeholder="填写驳回原因" />
            <div style="text-align:center;">
              <el-button size="small" type="primary" @click="auditSoftwareUpload(2)">确定</el-button>
            </div>
          </div>
<!--          <el-button slot="reference" size="small" style="background:#05994e;color:white;margin-left: 10px" @click="rejectVisible=true">驳回</el-button>-->
          <el-button slot="reference" size="small" style="background:red;color:white;margin-left: 10px" @click="rejectVisible=true">驳回</el-button>
        </el-popover>
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
import fragmentdlg from './fragment-dependency'
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
      rejectVisible: false,
      parseLoading: false,
      uploadLoading: false,
      softwareForm: {
        property: 1,
        scan: [],
        download: []
      },
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
      logoFileList: [],
      pageFileList: [],
      fileList: [],
      docList: [],
      detailFileList: [],
      deleteDataIdList: [],
      globalUrl: '',
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fragmentdlgVisible: false,
      softwareTypes: [],
      userList: [],
      softwareDataTypes: [],
      fileData: '',
      relations: [],
      dependency: [],
      userInfo: {},
      docData: [],
      disabled: false,
      offerUnits: []
    }
  },
  beforeDestroy() {
    window.localStorage.removeItem('softwareData')
  },
  mounted() {
    this.fileData = new FormData()
    // this.getSoftwareInfo(this.$route.query.version)
    this.globalUrl = appConfig.config.url
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (this.$route.query.version) {
      const softwareDataInfo = JSON.parse(window.localStorage.getItem('softwareData'))
      this.getSoftwareDataList(softwareDataInfo.id, softwareDataInfo.versionId)
      this.softwareForm = softwareDataInfo
      if (softwareDataInfo.categoryIds) {
        this.softwareForm.categoryIds = softwareDataInfo.categoryIds.split(',')
      }
      if (softwareDataInfo.isView) {
        this.softwareForm.scan = softwareDataInfo.isView.split(',')
      }
      if (softwareDataInfo.isDownload) {
        this.softwareForm.download = softwareDataInfo.isDownload.split(',')
      }
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
          this.detailFileList.push({
            url: item,
            name: item.substring(item.lastIndexOf('/') + 1)
          })
        })
      }
    }
    this.getSoftwareTypeList()
    this.getSoftwareDataTypeList()
    this.getUserList()
    this.getAllSoftwareSource()
  },
  methods: {
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
    // getSoftwareInfo() {
    //   software.getSoftwareInfo(this.$route.params.id, 0, this.$route.query.version).then(response => {
    //     if (response.code === 200) {
    //       const softwareData = JSON.parse(JSON.stringify(response.data))
    //       this.softwareForm = response.data
    //
    //     }
    //   })
    // },
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          this.docData = response.data
        }
      })
    },
    auditSoftwareUpload(state) {
      this.$refs.softwareForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // const offerUnitId = this.offerUnits.find(item => item.offerUnitName === this.softwareForm.offerUnit).offerUnitId
          const softwareData = {
            isUpgrade: 0,
            relations: this.relations.toString(),
            identity: this.softwareForm.identity,
            userId: this.userInfo.userId,
            uUser: this.userInfo.realName,
            validateUser: this.userInfo.realName,
            uploadStatus: 5,
            opinion: this.softwareForm.reject,
            status: state,
            isView: this.softwareForm.scan ? this.softwareForm.scan.toString() : null,
            isDownload: this.softwareForm.download ? this.softwareForm.download.toString() : null,
            attribute: this.softwareForm.attribute,
            description: this.softwareForm.description,
            platform: this.softwareForm.platform,
            categoryIds: this.softwareForm.categoryIds.toString(),
            type: this.softwareForm.type,
            offerUnitId: this.softwareForm.offerUnitId,
            devUnit: this.softwareForm.devUnit,
            softwareName: this.softwareForm.name,
            version: this.softwareForm.version,
            softwareId: this.softwareForm.id,
            versionId: this.softwareForm.versionId,
            logo: this.softwareForm.logo,
            pic: this.softwareForm.pic,
            testValidation: this.softwareForm.testProved,
            deleteDataIdListStr: this.deleteDataIdList,
            softwareDataList: this.docData
          }
          this.$refs.detailFile.submit()
          this.$refs.pageFile.submit()
          this.$refs.logoFile.submit()
          this.$refs.dataFile.submit()
          this.fileData.append('softwareDataString', JSON.stringify(this.docData))
          this.fileData.append('updateSoftwareVersionString', JSON.stringify(softwareData))
          software.updateSoftware(this.fileData).then(response => {
            this.uploadLoading = false
            if (response.code === 200) {
              this.$message.success('审核完成')
              this.$router.push('/admin/software/unreviewed')
            } else {
              this.$message.error('审核失败')
            }
            this.fileData.delete('softwareDetailFiles')
            this.fileData.delete('updateSoftwareVersionString')
            this.fileData = new FormData()
          })
        } else {
          console.log('error submit!!')
          return false
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
    getSoftwareTypeList() {
      software.getSoftwareSet(7).then(response => {
        if (response.code === 200) {
          this.softwareTypes = response.data
        }
      })
    },
    pageFileUpload(file) {
      this.fileData.append('pageFile', file.file)
    },
    detailFileUpload(file) {
      this.fileData.append('softwareDetailFiles', file.file)
    },
    logoFileUpload(file) {
      this.fileData.append('logoFile', file.file)
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
    },
    handleRemovePageFile(file, fileList) {
      if (file.url === this.softwareForm.pic) {
        this.softwareForm.pic = null
      }
    },
    handlePageFileChange(file, fileList){
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
      this.dialogImageUrl = file.url
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
    uploadSoftwareData(file) {
      this.fileData.append('softwareDataFiles', file.file)
    },
    handleDataFileRemove(file, fileList) {
      this.fileList = fileList
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
            softwareId: this.softwareForm.id,
            versionId: this.softwareForm.versionId,
            utime: file.uid
          })
        }
      }
      this.fileList = fileList
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
    uploadSoftwareFile(file) {
      this.fileData.append('softwareFile', file.file) // 增加数据
      if (!this.uploadLoading) {
        const data = new FormData()
        data.append('file', file.file)
        this.parseSoftware(data)
      }
    },
    parseSoftware(data) {
      this.parseLoading = true
      software.parseSoftware(data).then(response => {
        if (response.code === 200) {
          const softwareInfo = this.softwareForm
          this.softwareForm = response.data
          this.softwareForm.type = this.softwareForm.type === 'service' ? 'serviceSeg' : this.softwareForm.type
          if (this.softwareForm.relations) {
            this.relations = this.softwareForm.relations.split(',')
          }
          this.softwareForm.attribute = softwareInfo.attribute
          this.softwareForm.scan = softwareInfo.scan
          this.softwareForm.download = softwareInfo.download
          this.logoFileList = []
          if (this.softwareForm.logo) {
            this.logoFileList.push({
              url: this.softwareForm.logo,
              name: this.softwareForm.logo.substring(this.softwareForm.logo.lastIndexOf('/') + 1)
            })
          }
          this.pageFileList = []
          if (this.softwareForm.pic) {
            this.pageFileList.push({
              url: this.softwareForm.pic,
              name: this.softwareForm.pic.substring(this.softwareForm.pic.lastIndexOf('/') + 1)
            })
          }
        } else if (response.code === -1) {
          this.$message.warning(response.msg)
          this.softwareForm.path = response.data
        } else {
          this.$message.error(response.msg)
        }
        this.parseLoading = false
      })
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
