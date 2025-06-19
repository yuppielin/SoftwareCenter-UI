<template>
  <div class="app-container">
    <el-form ref="softwareDocForm" label-position="right" label-width="100px" :model="softwareDocForm">
      <el-form-item label="表单名称：" prop="title">
        <el-input size="small"  style="max-width: 800px" :value="softwareDocForm.title"  show-word-limit  maxlength="50" />
      </el-form-item>
      <el-form-item
        label="类型："
        prop="softwareVersion"
        :rules="[{required:true,message:'请先选择类型',trigger:'change'}]"
      >
        <el-select
          v-model="softwareDocForm.softwareVersion"
          @change="handleSoftwareVersionChange()"
          size="small"
        >
          <el-option
            v-for="item in versions"
            :key="item.id"
            :label="item.version"
            :value="item.version"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="软件名称：" prop="softwareId" :rules="[{required:true,message:'请先选择软件',trigger:'change'}]">
        <el-select
          v-model="softwareDocForm.softwareId"
          size="small"
          filterable
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
          
        >
          <el-option
            v-for="item in versions"
            :key="item.id"
            :label="item.version"
            :value="item.version"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表单描述：" prop="title">
        <el-input type="textarea" style="max-width:800px" :autosize="{ minRows:10}"  :value="softwareDocForm.title" show-word-limit maxlength="300" />
      </el-form-item>
      <div style="text-align:center;">
        <el-button size="small" class="my-btn-color"  @click="updateSoftware">提交</el-button>
        <el-button size="small"  @click="cancleSubmit">取消</el-button>
      </div>
    </el-form>
    
    
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
    
    cancleSubmit() {
      this.$router.push({
        path: '/index/technical/index',
      })
    },
    
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
