<template>
  <el-card class="custome">
    <el-form ref="softwareDocForm" name="softwareDocForm" label-position="right" label-width="120px">
      <el-form-item label="软件名称：" prop="softwareId">
        <el-select
          v-model="softwareDocForm.softwareId"
          size="small"
          filterable
          style="width: 400px"
          @change="handleSoftwareChange()"
          placeholder="请选择软件"
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
        prop="version"
      >
        <el-select
          v-model="softwareDocForm.versionId"
          @change="handleSoftwareVersionChange()"
          size="small"
          style="width: 400px"
        >
          <el-option
            v-for="item in versions"
            :key="item.id"
            :label="item.version"
            :value="item.id"
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
<!--          disabled-->
<!--          v-model="softwareDocForm.description"-->
<!--          :options="{hideModeSwitch:true,previewStyle:'tab'}"-->
<!--          height="200px"-->
<!--        />-->
      </el-form-item>
      <div style="font-size:16px;font-weight:600;">待审核资料</div>
<!--      软件资料列表-->
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
              :appendToBody="true"
              :options="softwareDataTypes"
              :disable-branch-nodes="false"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择资料类型"
              @select="selectModuleAdd"></treeselect>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{row}">
            <div>
              <el-button

                type="primary"
                size="small"
                icon="el-icon-download"
                @click="downloadSoftwareData(row)"
              >
                下载
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;">
        <el-button size="small" style="background:#05994e;color:white" @click="auditSoftwareData(1)">通过</el-button>
        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
        >
          <div style="text-align:center">
            <el-input v-model="softwareDocForm.reject" type="textarea" :rows="5" style="margin-bottom:10px;" show-word-limit maxlength="50" placeholder="填写驳回原因" />
            <div style="text-align:center;">
              <el-button size="small" type="primary" @click="auditSoftwareData(2)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" size="small" style="background:red;color:white;margin-left: 10px" @click="rejectVisible=true">驳回</el-button>
        </el-popover>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as software from '@/api/software'
import * as category from '@/api/category'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import download from 'download-1.4.7'
export default {
  components: {
    MarkdownEditor,
    Treeselect
  },
  data() {
    return {
      rejectVisible: false,
      softwareDocForm: {
        versionId: ''
      },
      versions: [],
      options: [],
      softwareDataInfo: {}, // 软件资料信息
      docData: [],
      softwareDataTypes: []
    }
  },
  mounted() {
    // 获取用户信息
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // 获取软件资料信息
    this.softwareDataInfo = JSON.parse(this.$route.query.softwareDataInfo)
    this.softwareDataTypes = JSON.parse(this.$route.query.softwareDataTypes)
    // 获取软件列表
    this.getSoftwareList()
    if (this.softwareDataInfo) {
      this.docData.push({
        id: this.softwareDataInfo.id,
        name: this.softwareDataInfo.dataName,
        category: this.softwareDataInfo.category,
        size: this.softwareDataInfo.size
      })
      this.softwareDocForm.softwareId = this.softwareDataInfo.softwareId
      this.softwareDocForm.versionId = this.softwareDataInfo.versionId
      this.softwareDocForm.description = this.softwareDataInfo.description
      // 获取软件资料列表
      this.getSoftwareVerisons(this.softwareDocForm.softwareId)
    }
  },
  methods: {
    /**
     * 下载软件资料
     * @param row 当前行数据
     */
    downloadSoftwareData(row) {
      software.downloadSoftwareData(this.userInfo.userId, row.id).then(response => {
        const blob = new Blob([response])
        download(blob, row.name, row.name.lastIndexOf('.') + 1)
      })
    },
    /**
     * 审核软件资料
     * @param state 软件状态
     */
    auditSoftwareData(state) {
      const reg = /^[^\s]+(\s+[^\s]+)*$/
      if (this.docData[0].name.name != null && reg.test(this.docData[0].name.name)) {
        const data = {
          softwareId: this.softwareDocForm.softwareId,
          versionId: this.softwareDocForm.versionId,
          name: this.docData[0].name,
          category: this.docData[0].category,
          status: state,
          opinion: this.softwareDocForm.reject,
          id: this.softwareDataInfo.id,
          validateUser: this.userInfo.realName
        }
        software.auditSoftwareDataUpload(data).then(response => {
          if (response.code === 200) {
            this.$message.success('审核完成')
            // 跳转到审核列表页面
            this.$router.push('/admin/document/unreviewed')
          }
        })
      } else {
        this.$message.warning('软件资料名称为空或者不合法')
      }
    },
    /**
     * 获取软件版本信息
     * @param softwareId
     * @param softwareVersion
     */
    getSoftwareVersionInfo(softwareId, softwareVersion) {
      software.getSoftwareVersionInfo(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          this.versionInfo = response.data
        }
      })
    },
    /**
     * 获取软件列表
     */
    getSoftwareList() {
      software.getAllSoftwareList().then(response => {
        if (response.code === 200) {
          this.options = response.data
          this.softwareDocForm.devUnit = this.options.find(item => item.id === this.softwareDocForm.softwareId).devUnit
          // this.versions = this.options.find(item => item.id === this.softwareDocForm.softwareId).versions
        }
      })
    },
    /**
     * 获取软件版本列表
     * @param softwareId
     */
    getSoftwareVerisons(softwareId) {
      software.getSoftwareVersionList(softwareId).then(response => {
        if (response.code === 200) {
          this.versions = response.data
          if (this.softwareDocForm.versionId) {
            this.softwareDocForm.versionId = this.versions.find(item => item.currents === 1).id
            this.softwareDocForm.description = this.versions.find(item => item.currents === 1).description
          } else {
            const softwareVersion = this.versions.find(item => item.id === this.softwareDocForm.versionId)
            this.softwareDocForm.versionId = softwareVersion.version
            this.softwareDocForm.description = softwareVersion.description
          }
        }
      })
    },
    // getTypeName(typeId) {
    //   return this.softwareDataTypes.find(item => item.id === typeId).name
    // },
    /**
     * 处理软件改变事件
     */
    handleSoftwareChange() {
      const software = this.options.find(item => item.id === this.softwareDocForm.softwareId)
      this.getSoftwareVerisons(software.id)
      this.softwareDocForm.devUnit = software.devUnit
    },
    /**
     * 处理软件版本改变事件
     */
    handleSoftwareVersionChange() {
      const softwareVersion = this.versions.find(item => item.id === this.softwareDocForm.versionId)
      this.softwareDocForm.versionId = softwareVersion.version
      this.softwareDocForm.description = softwareVersion.description
    },
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
    selectModuleAdd() {
    },
    /**
     * 文件移除调用
     * @param file
     * @param fileList
     */
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    /**
     * 文件预览调用
     * @param file
     */
    handlePreview(file) {
      this.dialogImageUrl = file.url
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
