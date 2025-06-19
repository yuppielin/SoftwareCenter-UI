<template>
  <div class="app-container">
    <el-form ref="softwareDocForm" label-position="right" label-width="100px" :model="softwareDocForm">
      <el-form-item label="软件名称：" prop="softwareId" :rules="[{required:true,message:'请先选择软件',trigger:'change'}]">
        <el-select
          v-model="softwareDocForm.softwareId"
          size="small"
          filterable
          style="width: 400px"
          @change="handleSoftwareChange()"
          placeholder="请输入软件名称"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name + ' <' + item.identity + '>'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="软件版本："
        prop="softwareVersion"
        :rules="[{required:true,message:'请先选择软件版本号',trigger:'change'}]"
      >
        <el-select
          v-model="softwareDocForm.softwareVersion"
          @change="handleSoftwareVersionChange()"
          size="small"
          style="width: 400px"
        >
          <el-option
            v-for="item in versions"
            :key="item.id"
            :label="item.version"
            :value="item.version"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="研制单位：" prop="devUnit">
        <el-input size="small" :value="softwareDocForm.devUnit" disabled />
      </el-form-item>
      <el-form-item label="软件描述：" prop="description">
        <el-input readonly type="textarea" v-model="softwareDocForm.description" rows="5"></el-input>
<!--        <markdown-editor-->
<!--          ref="markdownEditor"-->
<!--          v-model="softwareDocForm.description"-->
<!--          :options="{hideModeSwitch:true,previewStyle:'tab'}"-->
<!--          height="200px"-->
<!--        />-->
      </el-form-item>
    </el-form>
    <div style="font-size:16px;font-weight:600;color: #fff;margin-top: 10px">已传资料</div>
    <el-table
      :data="docData"
      size="mini"
      :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
      style="margin:10px;"
    >
      <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
      <el-table-column min-width="300px" label="资料名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.name" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="资料类型" prop="category">
        <template slot-scope="scope">
<!--          <el-select v-model="scope.row.category" :disabled="!scope.row.edit">-->
<!--            <el-option-->
<!--              v-for="item in softwareDataTypes"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
          <treeselect
            v-model="scope.row.category"
            style="max-width:400px;"
            :multiple="false"
            :appendToBody="true"
            :options="softwareDataTypes"
            :disable-branch-nodes="false"
            :normalizer="normalizer"
            :disabled="!scope.row.edit"
            :show-count="true"
            placeholder="请选择资料类型"
            @select="selectModuleAdd"></treeselect>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="{row}">
          <div v-if="row.edit">
            <el-button
              size="small"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmEdit(row)"
            >
              确认
            </el-button>
          </div>
          <div  v-else>
            <el-button

              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="softwareDataInfo=row, row.edit=!row.edit"
            >
              编辑
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-upload
      v-if="softwareDocForm.softwareVersion"
      class="upload-demo"
      action="#"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :auto-upload="true"
      :http-request="uploadSoftwareData"
      accept=".doc, .docx, .pdf, .txt, .ppt, .pptx, .xls, .xlsx"
      :show-file-list="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传pdf/office/txt文件，且不超过100M</div>
    </el-upload>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as software from '@/api/software'
import * as category from '@/api/category'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    MarkdownEditor,
    Treeselect
  },
  data() {
    return {
      loading: false,
      value: [],
      list: [],
      fileList: [],
      softwareDocForm: {
        softwareName: '',
        softwareVersion: '',
        devUnit: '',
        description: ''
      },
      options: [],
      versions: [],
      docData: [],
      userInfo: {},
      fileData: '',
      softwareDataTypes: [],
      versionInfo: {},
      software: {},
      softwareDataInfo: {}
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareList()
    this.getSoftwareDataTypeList()
  },
  methods: {
    remoteMethod(query) {
      // if (query !== '') {
      //   this.loading = true;
      //   setTimeout(() => {
      //     this.loading = false;
      //     this.options = this.list.filter(item => {
      //       return item.label.toLowerCase()
      //         .indexOf(query.toLowerCase()) > -1;
      //     });
      //   }, 200);
      // } else {
      //   this.options = [];
      // }
    },
    handleSoftwareChange() {
      const software = this.options.find(item => item.id === this.softwareDocForm.softwareId)
      this.versions = software.versions
      this.softwareDocForm.softwareVersion = this.versions[0].version
      this.softwareDocForm.devUnit = software.devUnit
      this.softwareDocForm.description = software.description
      this.getSoftwareDataList(this.softwareDocForm.softwareId, this.softwareDocForm.softwareVersion)
    },
    handleSoftwareVersionChange() {
      const softwareVersion = this.versions.find(item => item.version === this.softwareDocForm.softwareVersion)
      this.softwareDocForm.description = softwareVersion.description
      this.getSoftwareDataList(this.softwareDocForm.softwareId, this.softwareDocForm.softwareVersion)
    },
    getSoftwareVersionInfo(softwareId, softwareVersion) {
      software.getSoftwareVersionInfo(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          this.versionInfo = response.data
        }
      })
    },
    getSoftwareList() {
      software.getSoftwareListByUser(null, null, this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.options = response.data
        }
      })
    },
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          this.docData = response.data
          this.docData = this.docData.map(v => {
            this.$set(v, 'edit', false)
            v.originalName = v.name
            v.size = v.sizes
            return v
          })
        }
      })
    },
    addSoftwareData(softwareData) {
      const softwareDatas = []
      softwareDatas.push(softwareData)
      this.fileData.append('softwareData', JSON.stringify(softwareDatas))
      this.fileData.append('userId', this.userInfo.userId)
      software.addSoftwareData(this.fileData).then(response => {
        if (response.code === 200) {
          this.$message.success('软件资料添加成功')
          this.getSoftwareDataList(this.softwareDocForm.softwareId, this.softwareDocForm.softwareVersion)
        } else if (response.code === -1) {
          this.$message.error(response.msg)
        } else {
          this.$message.error('软件资料添加失败')
        }
      })
    },
    updateSoftwareData(row) {
      const softwareData = {
        id: row.id,
        category: row.category,
        name: row.name
      }
      software.auditSoftwareDataUpload(softwareData).then(response => {
        if (response.code === 200) {
          this.$message.success('软件资料更新成功')
          this.getSoftwareDataList(this.softwareDocForm.softwareId, this.softwareDocForm.softwareVersion)
        }
      })
    },
    cancelEdit(row) {
      row.name = this.softwareDataInfo.name
      row.category = this.softwareDataInfo.category
      row.edit = false
      this.$message({
        message: '取消编辑成功',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      const reg = /^[^\s]+(\s+[^\s]+)*$/
      if (row.name != null && reg.test(row.name)) {
        row.edit = false
        this.softwareDataInfo = row
        this.updateSoftwareData(row)
      } else {
        this.$message.warning('软件资料名称为空或者不合法')
      }
    },
    getSoftwareDataTypeList() {
      category.getCategoryList(42, null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list
        }
      })
    },
    uploadSoftwareData(file) {
      this.fileData = new FormData()
      this.fileData.append('softwareDataFiles', file.file) // 增加数据
      const versionId = this.versions.find(item => item.version === this.softwareDocForm.softwareVersion).id
      const softwareData = {
        softwareId: this.softwareDocForm.softwareId,
        versionId: versionId,
        name: file.file.name,
        category: this.softwareDataTypes[0].id,
        size: this.formatFileSize(file.file.size),
        status: 0
      }
      this.addSoftwareData(softwareData)
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
    beforeUpload(file) {
      const accessFileType = ['doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isType) {
        this.$message.error('上传文件格式异常!')
      } else if (!isLt100M) {
        this.$message.error('上传资料文件大小不能超过 100MB!')
      }
      return isType && isLt100M
    },
    selectModuleAdd() {
    },
    handleRemove(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeRemove(file) {
      console.log(file)
    },
    handleExceed(file) {

    }
  }
}
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
