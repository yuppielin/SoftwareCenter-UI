<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12">
        <div style="display: flex;align-items: center;height: 40px;">
          <img style="height:20px;width:20px;" src="@/assets/index/tsQuestion.png">
          <span style="font-size:16px;font-weight:bold;margin-left:10px;">数字签名验证</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div
          style="display: flex;align-items: center;height: 40px;justify-content: right;justify-content: flex-end;"
        >
          <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
        </div>
      </el-col>
    </el-row>
    <el-card style="height:calc(100vh - 180px);overflow-y:auto;padding:0 200px;">
      <el-form id="suggest" ref="tsForm" name="tsForm" :model="tsForm" label-position="top">

        <el-form-item label="软件上传">

          <el-upload
            ref="upload"
            :auto-upload="false"
            action="#"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :http-request="uploadFile"
            :show-file-list="false"
          >
            <el-input :value="fileName" size="small" style="width:700px;margin-right: 5px;" placeholder="文件名" readonly="" />
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <el-progress v-if="progressFlag" :percentage="loadProgress"></el-progress> -->

        </el-form-item>
        <el-form-item label="数字签名上传">
          <el-upload
            ref="uploadDocu"
            :auto-upload="false"
            action="#"
            :file-list="fileListDocu"
            :on-change="handleChangeDocu"
            :on-remove="handleRemoveDocu"
            :http-request="uploadFileDocu"
            :show-file-list="false"
          >
            <el-input :value="fileNameDocu" size="small" style="width:700px;margin-right: 5px;" placeholder="文件名" readonly="" />
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="验证结果">
          <el-progress style="width:820px" v-if="progressFlag" :percentage="loadProgress" />
          <el-button v-if="validateRes===true" type="text">验证通过</el-button>
          <el-button v-else-if="validateRes===false" type="text" style="color:red">验证失败</el-button>
          <el-button v-else type="text" disabled>暂无结果</el-button>
        </el-form-item>

        <el-form-item >
          <div style="text-align:center;width:820px">
            <el-button size="small" type="primary" @click="replyConfirm">提交验证</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import * as software from '@/api/software'

export default {
  components: {

  },
  data() {
    return {
      tsForm: {

      },
      fileList: [],
      fileName: '',
      fileData: new FormData(),

      fileListDocu: [],
      fileNameDocu: '',

      loadProgress: 0,
      progressFlag: false,

      validateRes: null
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  },
  methods: {
    handleChange(file, fileList) {
      // console.log(fileList);
      this.validateRes = null
      this.loadProgress = 0
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.fileName = file.name
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadFile(file) {
      this.fileData.set('file', file.file)
    },

    handleChangeDocu(file, fileList) {
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name)
      const accessFileType = ['zip', 'signed']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt20M = file.size / 1024 / 1024 < 20
      if (existFile) {
        this.$message.error('当前文件已存在！')
        fileList.pop()
        return
      } else if (!isType) {
        // this.$message.error('上传文件格式异常!')
        // fileList.pop()
        // return
      } else if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        fileList.pop()
        return
      }
      
      this.validateRes = null
      this.loadProgress = 0
      if (fileList.length > 0) {
        this.fileListDocu = [fileList[fileList.length - 1]]
      }
      this.fileNameDocu = file.name
    },
    handleRemoveDocu(file, fileList) {
      this.fileListDocu = fileList
    },
    uploadFileDocu(file) {
      this.fileData.set('signedFile', file.file)
    },
    replyConfirm() {
      if (!this.fileList.length > 0) {
        this.$message.error('请上传软件')
        return
      }
      if (!this.fileListDocu.length > 0) {
        this.$message.error('请上传数字签名')
        return
      }
      this.$refs.upload.submit() // 提交调用uploadFile函数
      this.$refs.uploadDocu.submit() // 提交调用uploadFile函数
      // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.$refs.tsForm.validate(valid => {
        if (valid) {
          this.$modal.loading()
          software.docusignValidate(this.fileData, (process) => {
            this.progressFlag = true
            this.loadProgress = parseInt((process.loaded / process.total).toFixed(2) * 100)
          }).then(response => {
            this.$modal.closeLoading()
            if (response.code === 200) {
              this.validateRes = response.data
              if (response.data === true) {
                this.$message.success('验证成功')
              } else {
                this.$message.error('验证失败')
              }
            } else {
              this.validateRes = false
              this.$message.error(response.msg)
            }
          }).catch(() => {
            this.validateRes = false
            this.$modal.closeLoading()
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep #suggest .el-input__inner {
    color: #282829;
    font-size: 12px;
    border-color: lightgray !important;
}
::v-deep #suggest .el-textarea__inner {
    border-color: lightgray !important;
}
</style>
