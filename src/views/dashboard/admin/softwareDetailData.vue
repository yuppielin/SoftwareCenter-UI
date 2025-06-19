<template>
  <el-card class="custome custome-height">
    <div slot="header" class="padding">
      <el-row>
        <el-col :span="12">
          <span>资料下载</span>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button  size="mini" onclick="history.go(-1)" icon="el-icon-back">返回</el-button>
        </el-col>
      </el-row>
    </div>
     <el-dialog
      title="资料查看"
      :visible.sync="showSoftwareDataVisible"
      :before-close="closeSoftwareDataDialog"
    >
      <div style="text-align: center;">
        <div
          v-if="typeJudge==1"
          ref="preview"
          id="preview"
          class="pdfPriview"
          v-loading="loading"
          element-loading-text="加载中，请耐心等待" 
          element-loading-spinner="el-icon-loading" 
          element-loading-background="rgba(0,0,0,0.8)"
          style="height:500px;overflow-y:auto"
        />
        <iframe
          :src="previewUrl"
          v-else-if="typeJudge==2"
          type="application/x-google-chrome-pdf"
          width="100%"
          frameborder="0"
          scrolling="auto"
          height="500px"
        />
        <el-image
          style="width: 400px;height: 100%;"
          v-else-if="typeJudge==3"
          :src="previewUrl"
          fit="cover"
        />
      </div>
    </el-dialog>
    <el-table :data="getList" size="mini">
      <el-table-column width="60" align="center" header-align="center" label="序号" type="index" />
      <el-table-column align="center" header-align="center" label="资料名称" prop="name" show-overflow-tooltip/>
      <el-table-column align="center" header-align="center"  label="资料类型"  prop="category">
        <template slot-scope="scope">
          <treeselect
            v-model="scope.row.category"
            :multiple="false"
            :options="softwareDataTypes"
            :disable-branch-nodes="false"
            :append-to-body="true"
            :normalizer="normalizer"
            disabled
            :show-count="true"
            placeholder="请选择资料类型"
            @select="selectModuleAdd"
          ></treeselect>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="资料大小" prop="sizes">
        <template slot-scope="scope">
          {{formatFileSize(scope.row.sizes)}}
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" v-show="judgeShowSoftwareData(scope.row.name)" @click="showSoftwareDataDialog(scope.row)">查看</el-button>
          <el-button size="mini" type="primary"  @click="downloadSoftwareData(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </el-card>
</template>
<script>
import * as software from '@/api/software'
import * as category from '@/api/category'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import download from 'download-1.4.7'
let docx = require("docx-preview")
window.JSZip = require("jszip")
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      userInfo: {},
      softwareDataTypes: [],
      getList: [],
      previewType: ["docx", "doc", "png", "jpg", "pdf", "mp4"],
      showSoftwareDataVisible:false,
      typeJudge: 0,
      loading: false,
      softwareId:'',
      versionId:'',
      permission:0
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
     this.softwareId = this.$route.params.id;
    this.versionId = this.$route.query.version;
    this.getSoftwareDataTypeList()
    this.getSoftwareDataList(this.$route.params.id, this.$route.query.version)

    this.getSoftwarePermission();
  },
  methods: {
      judgeShowSoftwareData(value) {
      let fileType = value.substring(value.lastIndexOf(".") + 1);
      if (this.previewType.indexOf(fileType) === -1) {
        return false;
      } else {
        return true;
      }
    },
    showSoftwareDataDialog(item) {
      // debugger
      let fileType = item.name.substring(item.name.lastIndexOf(".") + 1);
      switch (fileType) {
        case "docx":
          this.loading = true;
          this.showSoftwareDataVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "doc":
          this.showSoftwareDataVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "pdf":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "mp4":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "jpg":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
        case "png":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
      }
    },
    async docPreview(id) {
      console.log("docPreview");
      software.downloadSoftwareData(this.userInfo.userId, id).then(response => {
        const blob = new Blob([response]);
        docx.renderAsync(blob, this.$refs.preview);
        this.showSoftwareDataVisible = true;
      });
    },
    closeSoftwareDataDialog() {
      this.showSoftwareDataVisible = false;
    },
    downloadSoftwareData(row) {
      software.downloadSoftwareData(this.userInfo.userId, row.id).then(response => {
        const blob = new Blob([response])
        download(blob, row.name, row.name.lastIndexOf('.') + 1)
      })
    },
    getSoftwarePermission() {
      software.getSoftwarePermission(this.softwareId, this.versionId).then(response => {
        this.permission = response.data;
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
    selectModuleAdd() {
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
      category.getCategoryList('data_type').then(response => {
        if (response.code === 200) {
          // debugger
          this.softwareDataTypes = response.data.list
        }
      })
    },
    getSoftwareDataList(softwareId, softwareVersion) {
      software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
        if (response.code === 200) {
          // debugger
          this.getList = response.data
          this.getList = this.getList.map(v => {
            this.$set(v, 'edit', false)
            v.originalName = v.name
            return v
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
