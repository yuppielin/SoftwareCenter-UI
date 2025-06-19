<template>
<div class="app-container">
    <div class="cur-top-admin">
        <img class="icon"  src="@/assets/index/demandManage.png" />
        <span class="title" >需求管理</span>
    </div>
  <el-card>
    <!--需求导入对话框--->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" title="需求导入" width="30%" @dragDialog="handleDrag">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="primary" size="small" @click="importDemand">确定</el-button>
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="text" style="color:blue;margin-right:10px;" @click="downloadDemandTemplate">需求模板下载</el-button>
        </el-col>
      </el-row>
      <el-upload
        ref="demandDataUpload"
        :show-file-list="true"
        class="upload-demo"
        style="margin-top:5px;text-align:center;"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        accept=".xls,.xlsx,.cvs"
        :before-upload="beforeUploadDemand"
        :auto-upload="false"
        :on-remove="removeUploadDemand"
        :on-change="filehandleChange"
        :http-request="
          (file) => {
            return uploadFile(file)
          }"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls、xlsx、cvs文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="getDemandQuery">
      <el-tab-pane name="first" label="新增需求">
        <div style="margin-bottom:10px;">
          <el-row :gutter="10">
            <el-col :span="12" style="text-align:left">
              <!-- <el-button v-show="userType=='admin'||userType=='XTUser'" size="small" style="color:white;" icon="el-icon-edit-outline" type="warning" @click="demandCF">需求拆分</el-button>
              <el-button v-show="userType=='admin'||userType=='XTUser'" size="small" style="color:white;" icon="el-icon-edit-outline" type="warning" @click="demandZB">需求整编</el-button> -->
              <el-button size="small" type="primary" icon="el-icon-upload2" style="background: rgba(23,138,227,1);border:0;height:32px" @click="dialogVisible=true" :style="{'margin-left':userType=='admin'||userType=='XTUser'?'':0}">需求导入</el-button>
              <el-button :loading="loadingExport" size="small" type="primary" icon="el-icon-download" style="background: rgba(23,138,227,1);border:0;height:32px" @click="exportDemand">需求导出</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right">
              <el-select
                v-model="search.status"
                size="small"
                style="width:200px;"
                placeholder="需求状态"
                filterable
                remote
                reserve-keyword
              >
                <el-option label="已解决" value="2" />
                <el-option label="处理中" value="1" />
                <el-option label="未解决" value="0" />
              </el-select>
              <el-input v-model="search.keyword" size="small"  style="width:200px;margin-left:10px;" placeholder="关键字" />
              <el-button icon="el-icon-search" size="small" type="primary" style="margin-left:10px;background:rgba(23,138,227,1);border:0;height:32px" @click="searchDemand">查询</el-button>
              <el-button size="small" type="reset" @click="resetSearch">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="demandData" size="mini" stripe :header-cell-style="{background:'#2BB56E',height:'30px'}" style="height:calc(100vh - 310px);overflow-y: auto;">
          <el-table-column width="55" type="index" align="center" label="序号" />
          <el-table-column label="需求标题" header-align="center" prop="title" show-overflow-tooltip />
          <el-table-column label="软件名称" header-align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span style="color:rgb(8, 151, 151)">
                {{ row.softwareName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="软件版本" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ row.softwareVersion }}
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="提报人" prop="realname" />
          <el-table-column align="center" show-overflow-tooltip label="提报单位" prop="company" />
          <el-table-column align="center" show-overflow-tooltip label="提报时间" prop="ctime">
            <template  slot-scope="{row}">
              {{ row.ctime | parseTime('{y}-{m}-{d}') }}
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="状态" width="100">
            <template slot-scope="{row}">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div class="table-data-status-green" v-if="row.status==2" >已解决</div>
                <div class="table-data-status-yellow" v-else-if="row.status==1" >解决中</div>
                <div class="table-data-status-grey" v-else >未解决</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template slot-scope="{row}">
              <el-button icon="el-icon-view" size="mini" title="查看" @click="showInfo(row)" type="primary" circle></el-button>
              <el-button icon="el-icon-close" size="mini" title="删除" @click="deleteDemand(row)" type="danger" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top:15px;"
          :current-page="currentPage"
          :page-sizes="[13, 50, 100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <!-- style="height:calc(100vh - 280px);overflow-y:auto;" -->
      <!-- <el-tab-pane name="second" label="已整编需求" :to="{name:'alreadyZb'}">
        <div style="margin-bottom:10px;">
          <el-row :gutter="10">
            <el-col :span="12" style="text-align:left">
              <el-button v-show="userType=='admin'||userType=='XTUser'" size="small" style="color:white;" icon="el-icon-edit-outline" type="warning" @click="demandCF">需求拆分</el-button>
              <el-button v-show="userType=='admin'||userType=='XTUser'" size="small" style="color:white;" icon="el-icon-edit-outline" type="warning" @click="demandZB">需求整编</el-button>
              <el-button size="small" type="primary" icon="el-icon-upload2" style="background: rgba(23,138,227,1);border:0;height:32px" @click="dialogVisible=true" :style="{'margin-left':userType=='admin'||userType=='XTUser'?'':0}">需求导入</el-button>
              <el-button :loading="loadingExport" size="small" type="primary" icon="el-icon-download" style="background: rgba(23,138,227,1);border:0;height:32px" @click="exportDemand">需求导出</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right">
              <el-select
                v-model="search.status"
                size="small"
                style="width:200px;"
                placeholder="需求状态"
                filterable
                remote
                reserve-keyword
              >
                <el-option label="已解决" value="2" />
                <el-option label="处理中" value="1" />
                <el-option label="未解决" value="0" />
              </el-select>
              <el-input v-model="search.keyword" size="small" style="width:200px;margin-left:10px;" placeholder="关键字" />
              <el-button size="small" type="primary" icon="el-icon-search" style="margin-left:10px;background:rgba(23,138,227,1);border:0;height:32px" @click="searchDemand">搜索</el-button>
              <el-button size="small" type="reset" @click="resetSearch">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="demandData" size="mini" :header-cell-style="{background:'#2BB56E',height:'30px'}" style="height:calc(100vh - 310px);">
          <el-table-column align="center" width="55" type="index" label="序号" />
          <el-table-column label="需求标题" header-align="center" prop="title" show-overflow-tooltip />
          <el-table-column label="软件名称" header-align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span style="color:rgb(8, 151, 151)">
                {{ row.softwareName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="软件版本" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ row.softwareVersion }}
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="原始需求" prop="originalDemand" />
          <el-table-column align="center" show-overflow-tooltip label="需求单位" prop="company">
            <template slot-scope="scope">
              <span v-if="scope.row.company!=null&&scope.row.company!=''">{{scope.row.company}}</span>
              <span v-else>{{returnDevUnit(scope.row.companyId)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="处理单位" prop="dealUnitName">
            <template slot-scope="scope">
              <span v-if="scope.row.dealUnitName!=null&&scope.row.dealUnitName!=''">{{scope.row.dealUnitName}}</span>
              <span v-else>{{returnDevUnit(scope.row.dealUnitId)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="提报人" prop="realname" />
          <el-table-column align="center" show-overflow-tooltip label="提报时间" prop="ctime">
            <template  slot-scope="{row}">
              {{ row.ctime | parseTime('{y}-{m}-{d}') }}
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="状态" width="100">
            <template slot-scope="{row}">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div class="table-data-status-green" v-if="row.status==2" >已解决</div>
                <div class="table-data-status-yellow" v-else-if="row.status==1" >解决中</div>
                <div class="table-data-status-grey" v-else >未解决</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template slot-scope="{row}">
              <el-button icon="el-icon-view" size="mini" title="查看" @click="showInfo(row)" type="primary" circle></el-button>
              <el-button icon="el-icon-close" size="mini" title="删除" @click="deleteDemand(row)" type="danger" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top:15px;"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane> -->
    </el-tabs>

  </el-card>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
import * as demand from '@/api/demand'
import * as ts from '@/api/ts'
import axios from 'axios'
import { Col } from 'element-ui'
import download from 'download-1.4.7'
import  * as devunit from "@/api/devunit"
export default {
  directives: { elDragDialog },
  data() {
    return {
      // 获取需求
      uid: '',
      keyword: '',
      status: '',
      zbStatus: '',
      softwareList: [],
      fileData: '',
      userInfo: {},

      activeName: 'first',
      currentPage: 1,
      pageSize: 13,
      pageTotal: 0,
      dialogVisible: false,
      search: {
        keyword: '',
        status: ''
      },
      demandForm: {
        softwareId: '',
        title: '',
        versionId: '',
        description: '',
        category: '',
        uid: '',
        zbIds: ''
      },
      demandData: [],
      userType: null,

      loadingExport: false,
      deletePic: require('@/assets/picture/delete.jpg'),
      devUnit: [],
      judgeFileList: []
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getDevUnit()
    this.getDemandQuery()
    this.userType = localStorage.getItem('userType')
  },
  methods: {
    filehandleChange(file, fileList){
      const newListLength = new Set(fileList.map(item=>item.name)).size
      const listLength = fileList.length
      if(listLength > newListLength){
        fileList.splice(-1, 1)
        this.$message.warning("该文件已上传。")
        return false
      }
    },
    removeUploadDemand(file, fileList){
      // let num = this.judgeFileList.lastIndexOf(file)
      // this.judgeFileList.splice(num, 1)
      for(let num=0; num<fileList.length; num++){
        if(fileList[num] == file){
          fileList.splice(num, 1)
          break
        }
      }
    },
    beforeUploadDemand(file) {
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const acceptType = ["xls", "xlsx", "cvs"];
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      }else{
        return true
      }
      // if(this.judgeFileList.length == 0){
      //   this.judgeFileList.push(file)
      //   return true
      // }else{
      //   for(let num = 0;num<this.judgeFileList.length;num++){
      //     if(file.name === this.judgeFileList[num].name){
      //       this.$message.warning("该文件已上传。")
      //       return Promise.reject(false)
      //     }
      //   }
      //   this.judgeFileList.push(file)
      //   return true
      // }
    },
    //获取单位
    getDevUnit(){
      devunit.getUnit("",1,100).then(response=>{
        if(response.code==200){
          this.devUnit=response.data.list;
          console.log(this.devUnit,"this.devUnit")
        }
      })
    },
    returnDevUnit(item) {
      let num = Number(item)
      console.log(this.devUnit,"returnDevUnit",num,item)
      for(let i=0;i<this.devUnit.length;i++){
        if(num == this.devUnit[i].id){
          return this.devUnit[i].name
        }
      }
    },
    downloadDemandTemplate() {
      demand.downloadTemplate().then(response => {
        console.log(response, 'response')
        const fileName = 'demandTemplate.xlsx'
        const blob = new Blob([response])
        download(blob, fileName, fileName.lastIndexOf('.') + 1)
      })
    },
    // 需求导出
    exportDemand() {
      let userId = null
      // if (localStorage.getItem('userType') !== 'admin') {
        userId = this.userInfo.userId
      // }
      let zbStatus = 0
      if (this.activeName == 'second') {
        zbStatus = 1
      }
      this.loadingExport = true
      demand.exportDemand(userId, this.search.keyword, this.search.status, zbStatus).then(response => {
        // axios.get(demand.exportDemand(),{responseType: 'arraybuffer'}).then(response => {
        console.log(response, 'response')
        const fileName = '需求表.xlsx'
        const blob = new Blob([response])
        download(blob, fileName, fileName.lastIndexOf('.') + 1)
        this.loadingExport = false
      })
      // axios.get(demand.exportDemand(),{responseType: 'blob'}).then(response => {
      //     console.log(response, "export response")
      //     const fileName = "exportFile.xlsx"
      //     var downloadUrl = null
      //     const binaryData = []
      //     binaryData.push(response.data)
      //     downloadUrl = window.URL.createObjectURL(new Blob(binaryData),{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      //     const a = document.createElement('a')
      //     a.download = decodeURI(escape(fileName))
      //     a.href = downloadUrl
      //     a.click()
      //     a.remove()
      // }).catch(function(error) {
      //     console.log(error)
      // })
    },
    // 检索需求
    searchDemand() {
      this.currentPage = 1
      this.getDemandList(this.currentPage)
    },
    getDemandList(currentPage) {
      this.demandData = [];

      let tabStatus = 0
      let userId = null
      if (this.activeName == 'second') {
        tabStatus = 1
      }
      if (localStorage.getItem('userType') == 'admin') {
        demand.getDemandQuery(userId, this.search.keyword, this.search.status, currentPage, this.pageSize, tabStatus).then(response => {
          const demandList = JSON.parse(JSON.stringify(response.data.list))
          this.demandData = []
          for (let i = 0; i < demandList.length; i++) {
            const item = demandList[i]
            if (item.zbIds != null) {
              item.zbIds = item.zbIds.split(',')
            }
            this.demandData.push(item)
          }
          console.log(this.demandData, 'this.demandData')
          this.pageTotal = response.data.total
        })
      } else if (localStorage.getItem('userType') == 'XTUser') {
        // demand.queryBySoftwareList(this.search.keyword, this.search.status, currentPage, this.pageSize, tabStatus).then(response => {
        //   const demandList = JSON.parse(JSON.stringify(response.data.list))
        //   this.demandData = []
        //   for (let i = 0; i < demandList.length; i++) {
        //     const item = demandList[i]
        //     if (item.zbIds != null) {
        //       item.zbIds = item.zbIds.split(',')
        //     }
        //     this.demandData.push(item)
        //   }
        //   console.log(this.demandData, 'this.demandData')
        //   this.pageTotal = response.data.total
        // })
        demand.getDemandQuery(userId, this.search.keyword, this.search.status, currentPage, this.pageSize, tabStatus).then(response => {
          const demandList = JSON.parse(JSON.stringify(response.data.list))
          this.demandData = []
          for (let i = 0; i < demandList.length; i++) {
            const item = demandList[i]
            if (item.zbIds != null) {
              item.zbIds = item.zbIds.split(',')
            }
            this.demandData.push(item)
          }
          console.log(this.demandData, 'this.demandData')
          this.pageTotal = response.data.total
        })
      } else {
        console.log('aaa')
        userId = this.userInfo.userId
        demand.queryBySoftwareUid(userId, this.search.keyword, this.search.status, currentPage, this.pageSize, tabStatus).then(response => {
          const demandList = JSON.parse(JSON.stringify(response.data.list))
          this.demandData = []
          for (let i = 0; i < demandList.length; i++) {
            const item = demandList[i]
            if (item.zbIds != null) {
              item.zbIds = item.zbIds.split(',')
            }
            console.log(this.demandData, 'this.demandData')
            this.demandData.push(item)
          }
          this.pageTotal = response.data.total
        })
      }
    },
    // 重置检索
    resetSearch() {
      this.search.keyword = ''
      this.search.status = ''
      this.currentPage = 1
      this.getDemandList(this.currentPage)
    },
    // 获取需求提报列表
    getDemandQuery() {
      this.currentPage = 1
      this.resetSearch()
    },
    // 删除需求
    deleteDemand(item) {
      this.$confirm('确定删除该需求吗？', '提示', {
        type: 'warning'
      }).then(async(e) => {
        await demand.deleteDemand(item.id)
        await this.getDemandList(this.currentPage)
        this.$message.success('删除成功')
      })
    },
    // 导入需求
    importDemand() {
      this.fileData = new FormData()
      this.$refs.demandDataUpload.submit()
      demand.importDemand(this.fileData).then(response => {
        if (response.code == 200) {
          this.dialogVisible = false
          this.$message.success('添加成功')
          this.getDemandList(this.currentPage)
          this.$refs.demandDataUpload.clearFiles()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取所有软件
    getAllSoftware() {
      ts.getAllSoftware().then(response => {
        if (response.code === 200) {
          this.softwareList = response.data
        }
      })
    },
    // 新增需求
    addDemand() {
      demand.addDemand(this.demandForm).then(response => {
        if (response == 200) {

        }
      })
    },
    uploadFile(param) {
      this.fileData.append('file', param.file)
    },

    showInfo(item) {
      this.$router.push({
        path: '/admin/demand/' + item.id + '/info',
        query: {
          demandId: item.id
        }
      })
      // this.$router.push({
      //     path:'/admin/demand/'+item.id + '/info'
      // })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getDemandList(this.currentPage)
      console.log(`每页最多显示 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDemandList(this.currentPage)
      console.log(`当前页: ${val}`)
    },
    handleDrag() {
      this.$refs.select.blur()
    },
    demandZB() {
      this.$router.push({
        path: '/admin/demand/zb'
      })
    },
    demandCF() {
      this.$router.push({
        path: '/admin/demand/cf'
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .app-container{
       ::v-deep .el-card__body {
            padding: 10px;
            line-height: 30px;
        }
        .el-upload-dragger{
            width: 100%;
        }
    }
    .upload-demo{
        .el-upload-dragger{
            width: 100%;
        }
        .el-upload{
            width: 100%;
        }
    }
</style>
