<template>
  <el-card class="custome custome-height">
      <el-form :inline="true">
        <el-col :span="12">
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload" @click="importOrganizationVisible=true">导入</el-button>
            <el-button size="mini" type="warning" icon="el-icon-refresh" @click="syncOrganization">接口同步</el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" @click="exportOrganizationFunction">导出</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-form-item label="单位名称">
            <el-input
              v-model="deptName"
              placeholder="请输入单位名称"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchDept">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
     
      <el-table
        size="small"
        :data="deptTreeData"
        :header-cell-style="{background:'#2BB56E',height:'40px'}"
        :tree-props="{children:'children',hasChildren:'hasChildren'}"
        row-key="id"
        :default-expand-all="false"
        :expand-row-keys="expandRowKeysList"
        highlight-current-row
        style="width: 100%;"
        class="custome"
      >
        <!-- <el-table-column type="index" width="80" align="center" label="序号"></el-table-column> -->
        <el-table-column prop="name" width="250" label="组织名称" show-overflow-tooltip header-align="center" />
<!--        <el-table-column prop="deptCode" width="100" label="组织编码" show-overflow-tooltip>-->
<!--          <template slot-scope="scoped">-->
<!--            <span style="color:rgb(8, 151, 151)">#{{ scoped.row.deptCode }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="simpleName" label="简称" align="center" />
        <el-table-column prop="code" align="center" label="内码" />
        <el-table-column prop="type" align="center" label="兵种/领域"  > 
          <template slot-scope="{row}" >
            {{getLYorJZName(row)}}
          </template>
        </el-table-column>
        <el-table-column prop="deptCode" align="center" width="150" label="部门编码(唯一标识)"  />
        <el-table-column prop="sorts" align="center" width="80" label="排序"  > 
          <template slot-scope="{row}" >
            <el-input size='mini' v-model="row.sorts"  @change="updateSorts(row)"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="组织简介" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="txt-content">{{ scope.row.description }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="chager" width="200" label="负责人" /> -->
        <!-- <el-table-column prop="creator" align="center" label="创建人" width="200"></el-table-column> -->
        <el-table-column prop="ctime" align="center" label="创建时间" width="200" >
           <template slot-scope="{row}">
            {{parseTime(row.ctime, '{y}-{m}-{d} {h}:{i}')}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="text-align:right;margin:10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20]"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="deptTotal"
        /> 
    </div> -->
    <!-- 新增修改界面 -->
    <el-dialog
      :title="deptOpation ? '新增' : '修改'"
      width="30%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="单位名称 " />
        </el-form-item>
        <el-form-item label="单位简称" prop="simpleName">
          <el-input v-model="dataForm.simpleName" placeholder="单位简称 " />
        </el-form-item>
        <el-form-item label="单位编码" prop="deptCode">
          <el-input v-model="dataForm.deptCode" placeholder="单位编码 " />
        </el-form-item>
        <el-form-item label="上级单位" prop="parentId">
          <treeselect
            id="treeselect"
            v-model="dataForm.parentId"
            :options="organizationTree"
            :normalizer="normalizerDept"
            :show-count="true"
            placeholder="选择上级单位"
            :defaultExpandLevel="2"
            @select="changeParent"
          />
        </el-form-item>
        <el-form-item prop="bigDept" label="所属大单位">
          <treeselect
            v-model="dataForm.bigDept"
            :normalizer="normalizer"
            noResultsText="暂无数据"
            :multiple="false"
            value-consists-of="ALL_WITH_INDETERMINATE"
            sort-value-by="INDEX"
            :limit="2"
            :limitText="count => `及其它${count}项`"
            :options="serviceList"
            :show-count="true"
            :appendToBody="true"
            z-index="9999"
            placeholder="请选软件分类 "
            clearable
          ></treeselect>
        </el-form-item>
        <el-form-item label="所属方向" prop="area">
          <el-select v-model="dataForm.area" style="width:100%">
            <el-option label="东部战区" value="东部战区"></el-option>
            <el-option label="西部战区" value="西部战区"></el-option>
            <el-option label="南部战区" value="南部战区"></el-option>
            <el-option label="北部战区" value="北部战区"></el-option>
            <el-option label="中部战区" value="中部战区"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="0" @change="chooseArmy">其他</el-radio>
            <el-radio :label="1" @change="chooseArmy">兵种</el-radio>
            <el-radio :label="2" @change="chooseArmy">领域</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :rules="[{required:armyVisible,message:'请选择'+armyType,trigger:'change'}]" v-if="armyVisible" :label="armyType" prop="typeDetailId">
          <treeselect
            v-model="dataForm.typeDetailId"
            :options="deptOptions"
            :disable-branch-nodes="true"
            :normalizer="normalizer"
            :show-count="true"
            :placeholder="'请选择'+armyType"
            :appendToBody="true"
            z-index="9999"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input type="number" v-model="dataForm.sorts" placeholder="排序" />
        </el-form-item>
        <el-form-item label="安防检测单位" prop="isSecurity">
          <el-radio-group v-model="dataForm.isSecurity">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.id!=null && dataForm.id!=''">
          <el-checkbox v-model="dataForm.isSetChild">关联修改</el-checkbox>
          <span slot="label" style="color:#000;font-size:14px">
            <el-tooltip content='勾选后将同时修改该部门的下级部门的所属大单位、所属方向、所属类型' placement="top">
            <i style="font-size:14px" class="el-icon-question"></i>
            </el-tooltip>
            关联修改
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button v-if="deptOpation" :size="size" type="primary" @click="createNewDept">确认</el-button>
        <el-button v-else :size="size" type="primary" @click="updateDept">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="importOrganizationVisible" title="组织导入" width="30%">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="primary" size="small" @click="importOrganizationFunction">确定</el-button>
          <el-button  size="small"  @click="importOrganizationVisible=false">取消</el-button>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button  type="text" style="color:blue;margin-right:10px;" @click="downloadOrganizationTemplate">模板下载</el-button>
        </el-col>
      </el-row>
      <el-upload
        ref="importOrganizationRef"
        accept=".xlsx, .xls"
        :multiple="false"
        :action="uploadURL"
        :show-file-list="true"
        :auto-upload="false"
        :limit="1"
        :on-exceed="exceedFun"
        drag
        :http-request="
          (file) => {
          return uploadFile(file)
          }">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls、xlsx、cvs文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </el-card>
</template>

<script>
import PopupTreeInput from '@/views/components/PopupTreeInput'
import TableTreeColumn from '@/views/components/TableTreeColumn'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import axios from 'axios'
import qs from 'qs'
import * as category from '@/api/category'
import * as organization from '@/api/organization'
import download from 'download-1.4.7'

export default {
  components: {
    PopupTreeInput,
    TableTreeColumn,
    Treeselect,
    MarkdownEditor: () => import('@/components/MarkdownEditor')
  },
  data() {
    return {
      armyType:'兵种',
      territoryVisible:false,
      armyVisible:false,
      size: 'small',
      loading: false,
      companyName: '', // 检索的单位名称
      orgData: [], // 单位数据
      companyOpation: true,
      companyDlgVisible: false,
      companyForm: {
        name: '',
        deptCode: '',
        type: 1,
        phone: '',
        email: '',
        // description: '',
        creator: '',
      },
      dataForm:{
        name: '',
        parentId:null,
        chager:'',
        deptCode: '',
        type: 0,
        phone: '',
        email: '',
        // description: '',
        type:'',
        typeDetailId:0,
        territory:'',
        cuser: '',
        isSetChild: false,
        isSecurity:0,
      },
      deptName: '', // 检索的组织名称
      // 组织列表控制
      deptTreeData: [],
      dialogVisible: false,
      dataRule: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' },
          { pattern: /^[^\s]+(\s+[^\s]+)*$/,message: '组织名称不合法', trigger: 'blur' }
        ],
        simpleName: [
          { required: true, message: '单位简称不能为空', trigger: 'blur' }
        ],
        deptCode: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级单位不能为空', trigger: 'blu,changer' }
        ],
        bigDept: [
          { required: true, message: '所属大单位不能为空', trigger: 'blur,change' }
        ],
        area: [
          { required: true, message: '所属方向不能为空', trigger: 'blur,change' }
        ],
        type: [
          { required: true, message: '所属类型不能为空', trigger: 'blur,change' }
        ]
      },
      // markdown配置
      markdownConfigs: {
        subfield: false, // 单双栏模式
        defaultOpen: 'edit', // edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: true,
        toolbarsFlag: false,
        scrollStyle: false,
        boxShadow: false // 边框
      },
      // 弹出框树形菜单
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      },
      selectCompany: '',
      deptShow: true,
      // 组织列表分页处理
      deptTotal: 0,
      currentPage: 1,
      pageSize: 5000,
      deptData: [],
      // 组织编辑处理
      deptOpation: true,
      userData: [],
      userInfo: {},
      deptOptions: [],
      uploadURL: "127.0.0.1",
      organizationTree: [],
      importOrganizationVisible: false,
      fileData: '',
      JBZData:[],
      LYData:[],
      serviceList: [],
      expandRowKeysList:[]
    }
  },
  // watch: {
  //   orgData: function() {
  //     if (this.orgData.length > 0) {
  //       this.showDeptList(this.orgData[0])
  //     }
  //   }
  // },
  mounted() {
    this.getAllOrganization()
    this.userInfo =JSON.parse(localStorage.getItem("userInfo"));
    this.getDeptTree()
    console.log(this.armyVisible)
    this.getLYList();
    this.getJBZList();
    this.getServiceList();
  },
  methods: {
    uploadFile(param) {
      this.fileData.append('file',param.file);
    },
    exceedFun(files, fileList) {
      this.$message.error("只能上传1个文件，请删除后再传")
    },
    downloadOrganizationTemplate() {
      organization.downloadOrganizationTemplate().then(response=> {
        console.log(response, "response")
        const fileName = "organizationTemplate.xlsx"
        const blob = new Blob([response])
        download(blob, fileName, fileName.lastIndexOf('.') + 1)
      })
    },
    getJBZList() {
      category.getCategoryList("army_cate", 1, 20).then(response => {
        if (response.code === 200) {
          this.deptOptions = response.data.list
          this.JBZData=response.data.list
        }
      })
    },
    getLYList() {
      category.getCategoryList("domain_cate", 1, 20).then(response => {
        if (response.code === 200) {
          this.deptOptions = response.data.list
          this.LYData= response.data.list
        }
      })
    },
    //获取分类
    getServiceList() {
      category.getCategoryList("bigdept", null, null).then(response => {
        if (response.code === 200) {
         this.serviceList = response.data.list
        //  console.log(this.serviceList, 999)
        }
      })
    },
    getLYorJZName(item){
      let type='-'
      switch(item.type){
        case "0":
          type= "其他";
          break;
        case "1":
          this.JBZData.map(map=>{
            if(item.typeDetailId==map.id){
              type=  '兵种：'+map.name;
            }
          })
          break;
        case "2":
          this.LYData.map(map=>{
            if(item.typeDetailId==map.id){
              type= '领域：'+map.name;
            }
          })
          break;
        default:
          break;
      }
      return type;
    },
    clickUploadOrganizationButton() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("importOrganizationButton").dispatchEvent(e);
    },
    beforeImportOrganization(file) {
      return new Promise(async (resolve, reject) => {
        console.log(file, "file");
        var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
        const fileTypeList = ["xlsx","xls"];
        if (fileTypeList.indexOf(fileType) === -1) {
          this.$message.error("当前允许上传类型为xlsx或xls!");
          return Promise.reject(false);
        } else {
          return resolve(true);
        }
      });
    },
    importOrganizationFunction() {
      // let _file = params.file;
      // let formData = new FormData();
      // formData.append("file", _file);
      this.fileData = new FormData();
      this.$refs.importOrganizationRef.submit()
      organization.importOrganization(this.fileData)
        .then(response => {
          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            this.$message.success("导入成功。")
            this.importOrganizationVisible = false;
            this.getDeptTree()
          }
        })
    },
    exportOrganizationFunction() {
      organization.exportOrganization().then(response => {
        const fileName = "组织表.xlsx"
        const blob = new Blob([response])
        download(blob, fileName, fileName.lastIndexOf('.') + 1)
      })
    },
    syncOrganization() {
       this.$confirm('是否确认同步数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$modal.loading();
        organization.syncOrganization().then(response => {
          this.$modal.closeLoading();
          if (response.code === 200) {
            this.getDeptTree();
            this.$message.success(response.msg);
          }
        }).catch(err=>{
          this.$modal.closeLoading();
        })
      }).catch(function() {
        this.$modal.closeLoading();
      })
        
    },
    async chooseArmy(visible){
      this.deptOptions = []
      this.dataForm.typeDetailId = null
      // this.armyVisible = visible ==0 ? true : false;
      // this.territoryVisible = visible ==1 ? true : false;
       this.armyVisible = true
      if(visible ==1) {
        this.armyType='兵种'
        await this.getJBZList()
      }else if(visible ==2){
        this.armyType='领域'
        await this.getLYList()
      }else{
        this.armyVisible = false
      }
    },
    chooseTerritory(visible){
      this.armyVisible = visible ==0 ? true : false;
      this.territoryVisible = visible ==1 ? true : false;
    },
    // 获取部门导航树
    getDeptTree() {
      organization.getOrganization(this.deptName, this.currentPage, this.pageSize)
        .then(response => {
          if (response.code === 200) {
            this.deptTreeData = response.data.list
            this.deptTreeData.forEach(el => {
              this.expandRowKeysList.push(el.id+'');
            })
            this.deptTotal = response.data.total
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    getAllOrganization() {
      organization.getOrganization('')
        .then(response => {
          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            this.organizationTree = [{
              id: 0,
              code: "0",
              name: "顶级组织",
              children:[]
            }]
            this.organizationTree[0].children = JSON.parse(JSON.stringify(response.data))
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 转换菜单数据结构
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
    // 转换菜单数据结构
    normalizerDept(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children
      }
    },
    // 获取组织
    // showDeptList(company, pageNum, pageSize) {
    //   this.selectCompany = company
    //   this.deptShow = true
    //   const url = this.global_url + 'organizations/getDepartments'
    //   axios.get(url, { params: { id: company.id, pageNum: pageNum, pageSize: pageSize }}).then(response => {
    //     if (response.data.code == 200) {
    //       this.deptTreeData = response.data.data.list
    //       this.deptTotal = response.data.data.total
    //     }
    //   }).catch(function(error) {
    //     console.log(error)
    //   })
    // },
    handleSizeChange(value) {
      this.pageSize = value
      this.currentPage = 1
      this.getDeptTree()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getDeptTree()
    },
    // 搜索单位
    searchCompany() {
      this.getDepeTree()
    },
    // 展示编辑框
    showCompamyEditDlg(item) {
      this.companyOpation = false
      this.companyDlgVisible = true
      this.companyForm = item
    },
    showNewCompanyDlg() {
      this.companyOpation = true
      this.companyForm = {}
      this.companyDlgVisible = true
    },
    // markdown 编辑改变事件
    changeMavon() {
    },
    // markdown 添加图片事件
    $imgAdd() {
    },
    finshEdit() {

    },
    // 获取数据
    findTreeData: function() {
      this.loading = true
      this.$api.dept.findDeptTree().then(res => {
        this.tableTreeDdata = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
      })
    },
    // 获取上级机构树
    getParentMenuTree: function(tableTreeDdata) {
      const parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeDdata
      }
      return [parent]
    },
    // 显示组织新增界面
    handleAdd: function(row) {
      this.getAllOrganization();
      if (row !== undefined) {
        this.dataForm = {
          type:0
        }
        this.dataForm.parentId = row.code
      }
      this.dialogVisible = true
      this.deptOpation = true
    },
    // 新增组织
    createNewDept() {
      this.dataForm.organizationId = this.selectCompany.id
      if (this.dataForm.parentId === undefined) {
        this.dataForm.parentId = 0
      }
      this.dataForm.cuser = this.userInfo.realName
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.dataForm,"this.dataForm")
          if(this.dataForm.type==0) {
            this.dataForm.typeDetailId = 0;
          }
          organization.addOrganization(this.dataForm).then(response => {
            if (response.code === 200) {
              this.$message.success('添加成功！')
              // this.showDeptList(this.selectCompany, 1, 5)
              this.getDeptTree()
              this.dialogVisible = false
            } else {
              this.$message.error('添加失败!')
            }
          }).catch(function(error) {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 检索组织
    searchDept() {
      this.getDeptTree()
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.getAllOrganization();
      this.chooseArmy(row.type)
      // console.log("item", row)
      this.dataForm = JSON.parse(JSON.stringify(row))
      if(this.dataForm.parentId==0) {
        // this.dataForm.parentId = null;
      }
      this.dataForm.type = Number(this.dataForm.type);
      // console.log("num", this.dataForm.typeDetailId, parseInt(this.dataForm.typeDetailId))
      this.dataForm.typeDetailId = parseInt(this.dataForm.typeDetailId)
      this.dialogVisible = true
      this.deptOpation = false
      console.log("item2", this.dataForm)
      this.isSetChild = false
    },
    // 更新组织
    updateDept() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.dataForm);
          delete data.children;

          organization.updateOrganization(data).then(response => {
            if (response.code === 200) {
              this.$message.success('更新成功！')
              this.getDeptTree()
              this.dialogVisible = false
            } else {
              this.$message.error('更新失败!')
            }
          }).catch(function(error) {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除组织
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organization.deleteOrganization(row.id).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            this.currentPage=1;
            this.getDeptTree()
          }
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(function() {
      })
    },
    // 获取删除的包含子机构的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id })
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.label
    },
    // 获取用户列表
    getUserList() {
      const url = this.global_url + 'account/listAllUser'
      axios
        .get(url, { params: {}})
        .then(response => {
          if (response.data.code === 200) {
            this.userData = response.data.data.list
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    changeParent(item) {
      this.dataForm.parentId = item.id
    },
    updateSorts(item) {
      if(!/^\d+$/.test(item.sorts)) {
        this.$message.error("请输入整数排序");
        return false;
      }
      let updateData = {
        sorts: item.sorts,
        id:item.id,
      };
      organization.updateOrganizationSorts(updateData).then(response => {
          if (response.code == 200) {
            this.$message.success(response.msg);
            this.getDeptTree();
          }else{
            this.$message.error(response.msg);
          }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .txt-content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
  }

  .page-container >>> .el-form-item__label {
    font-weight: 600;
  }
  .page-container >>> .el-button--text {
    color: #fff;
  }

  ::v-deep .el-table__row:not([class*='el-table__row--level-']) {
    td:first-child {
      padding-left: 23px;
    }
  }
</style>
