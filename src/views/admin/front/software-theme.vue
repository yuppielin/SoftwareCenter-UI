<template>
  <el-card style="margin:90px 20px 20px 20px;">
    <div style="margin-bottom:10px;">
      <el-button size="small" style="background:#05994e;color:white;" @click="handleAdd">添加专题</el-button>
      <el-input v-model="search.keyword" size="small" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字" @keyup.enter.native="getSpecialList" />
      <el-button size="small" style="background:#05994e;color:white;margin-left:10px" @click="getSpecialList">搜索</el-button>
      <el-button size="small" style="background:gray;color:white" @click="resetQuery">重置</el-button>
    </div>
    <!--添加分类---->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :title="title" width="40%" @dragDialog="handleDrag">
      <el-form ref="unitForm" name="unitForm" :model="unitForm" label-position="right" label-width="100px" :rules="rules">
        <el-form-item label="专题名称：" prop="name" :rules="[{ required: true, message: '专题名称不能为空', trigger: 'blur' },{min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '专题名称不合法', trigger: 'blur'}]">
          <el-input v-model="unitForm.name" size="small" />
        </el-form-item>
        <el-form-item label="专题封面：" prop="realName">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList2"
            :http-request="pageFileUpload"
            :on-change="handleLogoFileChange"
            limit="1"
            ref="pageFile"
            accept=".jpg,.png"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="专题描述：" prop="description">
          <el-input v-model="unitForm.description" size="small" :rows="3" type="textarea" show-word-limit maxlength="200" />
        </el-form-item>
        <!-- <el-form-item label="专题软件：" prop="realName">
                    <el-input size="small" v-model="unitForm.tag" style="width:400px;"></el-input>
                </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button size="small" style="background:#05994e;color:white;" @click="addSpecial('unitForm')">确定</el-button>
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="typeData"
      size="mini"
      style="height:calc(100vh - 238px);overflow-y:auto;"
      :tree-props="{children:'children',hasChildren:'hasChildren'}"
      row-key="id"
      :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="50" type="index" label="序号" />
      <el-table-column align="left" header-align="left" label="专题名称" prop="name" width="200" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="专题描述" prop="description" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="专题软件" width="200">
        <template slot-scope="scope">
          <el-popover ref="popover" placement="left" trigger="click" width="400">
            <div style="background:#0a76a4;font-weight:600;text-align:center;color:white;padding:10px;">
              专题软件列表
            </div>
            <el-table size="mini" :show-header="false" :data="softwareData" style="max-height:500px;overflow-y:auto;">
              <el-table-column type="index" width="50" />
              <el-table-column prop="name" width="100" show-overflow-tooltip>
<!--                <template slot-scope="scoped">-->
<!--                  <el-row :gutter="10">-->
<!--                    <el-col :span="8">{{ scoped.row.name }}</el-col>-->
<!--                    <el-col :span="6">{{ scoped.row.version }}</el-col>-->
<!--                    <el-col :span="6">{{ scoped.row.description }}</el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <el-button size="mini" type="text">移除</el-button>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </template>-->
              </el-table-column>
              <el-table-column prop="version" width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" show-overflow-tooltip></el-table-column>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="deleteSpecialSoftware(scope.$index,scope.row)"><i style="color: red" class="el-icon-delete"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference" icon="el-icon-s-order" type="text" title="软件清单" @click="showSoftwareList(scope.row)" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="260">
        <template slot-scope="{row}">
          <el-button size="mini" style="background:orange;color:white" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="row.name!='admin'" size="mini" style="background:red;color:white" @click="deleteSpecial(row)">删除</el-button>
          <el-button v-if="row.name!='admin'" size="mini" style="background:green;color:white" @click="dlgVisible=true, specialInfo=row">添加软件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <softwareList :visible="dlgVisible" :specialInfo="specialInfo" @close="handleCloseDlg" />
    <el-pagination
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size=pageSize
      layout="total, prev, pager, next, jumper"
      :total=total
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import softwareList from './software-theme-list'
import * as special from '@/api/special'
// import * as appConfig from '/public/config'
export default {
  directives: { elDragDialog },
  components: {
    softwareList
  },
  data() {
    return {
      dlgVisible: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      title: '添加专题',
      dialogVisible: false,
      specialInfo: {},
      unitForm: {
        name: '',
        tag: '',
        chager: '',
        phone: '',
        email: '',
        address: '',
        description: ''
      },
      search: {
        keyword: null
      },
      typeData: [],
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '分类标识不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '分类描述不能为空', trigger: 'blur' }
        ]
      },
      softwareData: [],
      fileList2: [
        { name: 'theme.png', url: require('@/assets/index/theme.png') }
      ],
      fileData: '',
      userInfo: {},
      gloablUrl: ''
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.globalUrl = appConfig.config.url
    this.getSpecialList()
  },
  methods: {
    getSpecialList() {
      special.getSpecialList(this.search.keyword, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list
          this.total = response.data.total
        }
      })
    },
    deleteSpecial(item) {
      this.$confirm('确定删除该专题吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        special.deleteSpecial(item.id).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            this.getSpecialList()
          }
        })
      })
    },
    addSpecial(unitForm) {
      this.$refs[unitForm].validate((valid) => {
        if (valid) {
          this.fileData = new FormData()
          this.$refs.pageFile.submit()
          const data = {
            name: this.unitForm.name,
            description: this.unitForm.description,
            uUser: this.userInfo.realName
          }
          if (this.title === '编辑专题') {
            data.id = this.unitForm.id
            this.fileData.append('specialStr', JSON.stringify(data))
            special.updateSpecial(this.fileData).then(response => {
              if (response.code === 200) {
                this.dialogVisible = false
                this.$message.success('更新成功')
                this.getSpecialList()
                this.$refs.pageFile.clearFiles()
              }
            })
          } else {
            data.cUser = this.userInfo.realName
            this.fileData.append('specialStr', JSON.stringify(data))
            special.addSpecial(this.fileData).then(response => {
              if (response.code === 200) {
                this.dialogVisible = false
                this.$message.success('添加成功')
                this.getSpecialList()
                this.$refs.pageFile.clearFiles()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteSpecialSoftware(index, item) {
      this.$confirm('确定移除该软件吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        special.deleteSpecialSoftware(this.specialInfo.id, item.id).then(response => {
          if (response.code === 200) {
            this.$message.success('移除成功')
            this.softwareData.splice(index, 1)
          }
        })
      })
    },
    handleEdit(item) {
      this.dialogVisible = true
      this.title = '编辑专题'
      this.unitForm = item
      if (item.picPath != null) {
        this.fileList2 = []
        this.fileList2.push({
          url: item.picPath,
          name: item.picPath.substring(item.picPath.lastIndexOf('/') + 1)
        })
      }
    },
    handleAdd() {
      this.dialogVisible = true
      this.unitForm = {}
      this.fileList2 = [
        { name: 'theme.png', url: require('@/assets/index/theme.png') }
      ]
    },
    handleCloseDlg() {
      this.dlgVisible = false
      this.getSpecialList()
    },
    resetQuery() {
      this.search.keyword = null
    },
    pageFileUpload(file) {
      this.fileData.append('file', file.file)
    },
    handleLogoFileChange(file, fileList) {
      const accessFileType = ['jpg', 'png', 'jpeg']
      const type = file.name.split('.').splice(-1)[0].toLowerCase()
      const isType = accessFileType.includes(type)
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isType) {
        this.$message.error('上传文件格式异常!')
        fileList.pop()
      } else if (!isLt10M) {
        this.$message.error('上传专题封面文件大小不能超过 10MB!')
        fileList.pop()
      }
    },
    editUserInfo(item) {
      this.$router.push({
        path: '/admin/system/unit/' + item.id + '/edit'
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getSpecialList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSpecialList()
    },
    deleteItem(item) {
      this.$confirm('确定删除该成果吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        console.log(e)
      })
    },
    handleDrag() {

    },
    showSoftwareList(item) {
      this.specialInfo = item
      this.softwareData = item.softwareVos
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
</style>
