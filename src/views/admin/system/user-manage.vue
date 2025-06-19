<template>
  <el-card class="custome custome-height">
    <!--工具栏-->
    <!-- <div
      style="font-size:14px;color:gray;margin:10px 0;background-color:#f7f8fa;height:30px;line-height:30px;"
    >
      <i class="el-icon-user" style="margin-left:5px;" />
      <span style="display:inline-block;margin-left:5px;">集中管理系统用户，支持用户的增删改查，批量处理等操作。</span>
    </div> -->
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24" style="height: calc(110vh - 280px);background: rgb(242, 245, 247);">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入单位名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px;line-height:40px;"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            node-key="id"
            :data="deptOptions"
            :props="deptTreeProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            style="background-color: #F2F5F7;color: #000"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{node}">
              <el-tooltip class="item" effect="dark" :content="node.data.name" placement="top-start">
                <span>{{node.data.name | ellipsis(15)}}</span>
              </el-tooltip>
              <div></div>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="19" :xs="24">
        <el-row style="line-height:40px;">
<!--          <span style="font-size:13px;color:gray;">用户状态:</span>-->
<!--          <el-select v-model="filters.online" size="small" placeholder="请选择状态">-->
<!--            <el-option label="全部" :value="2" />-->
<!--            <el-option label="在线" :value="1" />-->
<!--            <el-option label="离线" :value="0" />-->
<!--          </el-select>-->
          <span style="font-size:13px;color:gray;margin-left:10px;">用户名称:</span>
          <el-input v-model="filters.userName" placeholder="用户名" style="width:200px;" size="small" />
          <span style="font-size:13px;color:gray;margin-left:10px;">创建时间:</span>
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px;height:32px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button
            icon="el-icon-search"
            size="small"
            style="margin-left: 5px"
            type="primary"
            @click="currentPage=1;handleQuery()"
          >搜索
          </el-button>
          <el-button type="reset" size="small" @click="resetQuery">重置</el-button>
        </el-row>
        <div class="toolbar" style="margin:10px 0;">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            :disabled="multiple"
            @click="handleDeleteBatch"
          >删除
          </el-button>
<!--          <el-button icon="el-icon-upload2" type="info" size="mini" @click="handleImport">导入</el-button>-->
<!--          <el-button icon="el-icon-download" type="warning" size="mini" @click="handleExport">导出</el-button>-->
        </div>
        <!--表格内容栏-->
        <el-table
          :data="userData"
          style="width: 100%"
          size="mini"
          @selection-change="handleSelectionChange"
          :header-cell-style="{height:'30px'}"
        >
          <el-table-column type="selection" width="60px" align="center"/>
          <!-- <el-table-column prop="id" label="#ID" width="60px" /> -->
          <el-table-column prop="username" label="用户名" align="center" width="150px" :show-overflow-tooltip="true" />
          <el-table-column prop="realname" label="真实姓名" align="center" width="150px" :show-overflow-tooltip="true" />
          <el-table-column label="身份证号" width="150px" align="center" prop="idcard" :show-overflow-tooltip="true" />
          <el-table-column label="军官证号" width="150px" align="center" prop="officerNum" :show-overflow-tooltip="true" />
          <el-table-column label="所属组织" width="150px" align="center" show-overflow-tooltip>
            <template slot-scope="scoped">
              <span v-if="scoped.row.organization!=null&&scoped.row.organization!=undefined&&scoped.row.organization!=''">{{scoped.row.organization}}</span>
              <span v-else v-text="showOrganizationName(scoped.row.organizationId)"></span>
            </template>
          </el-table-column>
          <el-table-column label="用户角色" prop="roles" align="center" width="150px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="showRoleName(scope.row.roles)"></span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="tel" align="center" width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="状态" width="80px" align="center">
           <template slot-scope="scope">
             <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.isOpen" @change="changeUserStatus(scope.row)" />
            </template>
          </el-table-column>

          <el-table-column label="操作"  align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >编辑
              </el-button>
              <el-button
                v-if="scope.row.id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="showResetDlg(scope.row)"
              >重置
              </el-button>
              <el-button
                v-if="scope.row.isLock==1"
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="unlock(scope.row)"
              >解锁
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:right;margin:10px;">
          <el-pagination
            :current-page="currentPage"
            background
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <!--重置密码对话框-->
    <el-dialog title="提示" :visible.sync="resetDlgVisible" width="30%">
      <span
        style="display:block;color:gray;font-size:14px;margin:10px 10px 10px 0px;"
      >请输入“{{ resetUser.username }}”的新密码</span>
      <el-form label-width="70px" :model="resetPwdForm" ref="resetPwdForm">
        <el-form-item
          prop="resetPassword"
          label="新密码"
          :rules="[{required: true, message: '请输入重置密码', trigger: 'blur' },{ min: 8, message: '密码长度最少8个字符', trigger: 'blur' }]"
        >
          <el-input v-model="resetPwdForm.resetPassword" :size="size" type="password" show-password autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="resetDlgVisible = false">取消</el-button>
        <el-button
          :size="size"
          style="background-color:#202d40;color:white;margin-left:5px;"
          @click.native="resetUserPwd"
        >确定
        </el-button>
      </div>
    </el-dialog>
    <!--批量导入对话框-->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        action=""
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-change="addFile"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <!-- <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据 -->
          <!-- <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link> -->
          导入数据指定模板下载：
          <el-button type="text" size="mini" @click="downloadTemplate"> 下载模板</el-button>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :size="size" @click="submitFileForm">确 定</el-button>
        <el-button :size="size" @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量处理区域-->
    <div
      style="position:fixed;width:100%;bottom:65px;"
      :style="{'display':(selectCount > 0 ? 'inline-block':'none')}"
    >
      <span style="font-size:16px;font-weight:600;">批量处理操作：</span>
      <span>
        已选择&nbsp;
        <b>{{ selectCount }}</b>&nbsp;个用户
      </span>
      <el-button type="danger" :size="size" @click="toggleSelection(operationType)">删除</el-button>
    </div>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'添加用户':'编辑用户'"
      width="800px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="100px"
        :rules="rules"
        :size="size"
        label-position="right"
      >
        <el-form-item v-if="false" label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item v-if="operation" label="登录用户" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off" @blur="setDefaultValue" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="dataForm.realname" auto-complete="off" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="dataForm.idcard" auto-complete="off" maxlength="18" />
        </el-form-item>
        <el-form-item v-if="operation" label="登录密码" prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            autocomplete="off"
            show-password
            placeholder="密码不少于8位"
            minlength="8"
          />
        </el-form-item>
        <el-form-item v-if="operation" label="确认密码" prop="password2">
          <el-input
            v-model="dataForm.password2"
            type="password"
            autocomplete="off"
            show-password
            placeholder="再次输入密码"
            minlength="8"
          />
        </el-form-item>
        <el-form-item label="军官证号" prop="officerNum">
          <el-input v-model="dataForm.officerNum" auto-complete="off" maxlength="8" />
        </el-form-item>
        <el-form-item label="用户角色" prop="roles">
          <el-select size="small" v-model="dataForm.roles" style="width:100%;">
            <el-option
              v-for="(role,index) in roleData"
              :label="role.roleName"
              :value="role.roleCode"
              :key="index"
              style="width:350px;"
            >
              <span style="float:left;font-size:12px;font-weight:600;">{{role.roleName}}</span>
              <span style="float:right;color:#8492a6;font-size:12px;">{{role.roleCode}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织" prop="organizationId">
          <treeselect
            v-model="dataForm.organizationId"
            :options="deptOptions"
            :disable-branch-nodes="true"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择归属部门"
            @select="changeOrg"
            :appendToBody="true"
            z-index="9999"
            :default-expand-level="1"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="dataForm.tel" auto-complete="off" maxlength="11" />
        </el-form-item>
        <el-form-item label="用户状态" prop="isOpen">
          <el-radio-group v-model="dataForm.isOpen">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
        <el-button
          v-if="operation"
          :size="size"
          :loading="editLoading"
          style="margin-left:5px;"
          type="primary"
          @click.native="createNewUser"
        >创建
        </el-button>
        <el-button
          v-else
          :size="size"
          :loading="editLoading"
          style="margin-left:5px;"
          type="primary"
          @click.native="updateUser"
        >保存
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// import TableColumnFilterDialog from "../common/TableColumnFilterDialog";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import axios from 'axios'
import qs from 'qs'
import * as user from '@/api/user'
import * as organization from '@/api/organization'
import * as role from "@/api/role"
export default {
  components: {
    // TableColumnFilterDialog,
    Treeselect
  },
  filters: {
    ellipsis(value, len) {
      console.log("ellipsis",value)
      if (!value) return ''
      if (value.length > len) {
          return value.slice(0, len)+"..."
      }
      return value
    }
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.dataForm.password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback();
      }
    };
    return {
      // 部门检索
      deptName: '',
      pageSize: 10, // 分页默认值
      userTotal: 0, // 总的用户数
      visible: false, // 显隐控制
      size: 'small', // 按钮大小
      append: '@aircas.cn',
      // 查询过滤参数
      filters: {
        userName: null,
        online: null,
        departmentId: null,
        startDate: null,
        endDate: null,
        pageSize: 10,
        pageNum: 1
      },
      dateRange: '',
      // 左侧部门信息Tree
      deptOptions: [],
      deptTreeProps: {
        label: 'name',
        children: 'children',
        disabled: function(data, node) {
          if(data.children&&data.children.lenght>0) {
            return true;
          }else{
            return false;
          }
        }
      },
      userData: [], // 用户数据
      roleData: [], // 角色数据
      deptData: [], // 部门数据
      orgData: [], // 组织单位数据
      selectCount: 0, // 选择的数量
      multipleSelection: [], // 选择的项
      currentPage: 1, // 当前页面
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      // 新增编辑界面数据
      dataForm: {
        id: null,
        // name: '',
        username: '',
        idcard:'',
        password: '',
        password2: '',
        // departmentId: null,
        email: '',
        organizationId: 1,
        status: 1,
        tel: null,
        roles: '',
        officerNum: '',
        isOpen:0
      },
      // rules表单验证
      rules: {
        realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }, { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: '真实 姓名不合法', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: '用户名不合法', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证', trigger: 'blur' }, { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证不合法', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 8, message: '密码长度最少8个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ],
        officerNum: [{ required: true, message: '请输入军官证号', trigger: 'blur' }],
        email: [
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        roles: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        tel: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          // {
          //   pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          //   message: '请输入正确的手机号码',
          //   trigger: 'blur'
          // }
        ],
        organizationId: [{ required: true, message: '请选择所属组织', trigger: 'blur' }]
      },
      roles: null,
      // 密码重置
      resetDlgVisible: false,
      resetPwdForm: {
        resetPassword: ''
      },
      resetUser: '',
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0
        // 设置上传的请求头部
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        // url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 导出的Execl Data
      excelData: [],
      fileList: [],
      fileData: ''
    }
  },
  computed: {
    global_url() {
      return this.$store.state.global_url + 'nacos-user-service/'
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  async mounted() {
    await this.getUserRoleList()
    await this.getDeptTree()
    await this.handleQuery()
    // this.getUserList(1, this.pageSize)
    // this.getOrgList()
  },
  methods: {
    showRoleName(item) {
      for(let num =0;num<this.roleData.length;num++){
        if(this.roleData[num].roleCode === item){
          return this.roleData[num].roleName
        }
      }
    },
    showOrganizationName(id) {
      let organizationName = null
      for(let num =0;num<this.deptOptions.length;num++){
        organizationName = this.searchDeptOptions(id,this.deptOptions[num])
        if(organizationName!=null){
          break
        }
      }
      return organizationName
    },
    searchDeptOptions(id, item) {
      if(id === item.id){
        return item.name
      }else if(item.children&&item.children.length>0){
        for(let i=0;i<item.children.length;i++){
          return this.searchDeptOptions(id,item.children[i])
        }
      }else{
        return null
      }
    },
    // 获取用户列表
    getUserList(pageNum, pageSize) {
      const url = this.global_url + 'account/all'
      axios
        .get(url, { params: { pageNum: pageNum, pageSize: pageSize }})
        .then(response => {
          if (response.data.code === 200) {
            this.userData = response.data.data.list
            this.userTotal = response.data.data.total
            // console.log(this.userData[0])
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 重置查询条件
    resetQuery() {
      let id = this.filters.departmentId
      this.dateRange = ''
      this.filters = {
        userName: '',
        online: null,
        departmentId: '',
        startDate: null,
        endDate: null,
        pageSize: 10,
        pageNum: 1
      }
      this.filters.departmentId = null
      this.currentPage = 1;
      this.$refs.tree.setCurrentKey(null)
      this.handleQuery()
    },
    // 获取分页数据
    handleCurrentChange(value) {
      this.currentPage = value
      this.handleQuery()
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.handleQuery()
    },
    // 获取所有角色
    getUserRoleList(pageNum, pageSize) {
      role.getRoles(null,1).then(response=>{
        if(response.code==200){
          this.roleData=response.data;
        }
      })
    },
    // 获取部门导航树
    getDeptTree() {
      organization.getOrganization(null, 1, 100)
        .then(response => {
          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            this.deptOptions = response.data.list
            console.log(response,"response")
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
    // 节点单击事件
    handleNodeClick(data) {
      if(data.children&&data.children.length>0) {
        // this.$refs.tree.setCurrentKey(null);
        data = data.children[0];
        // this.$refs.tree.setCheckedNodes([data])
        this.$refs.tree.setCurrentKey(data.id)
        // return false;
      }
      this.filters.departmentId = data.id
      this.currentPage = 1
      this.handleQuery()
    },
    // 获取组织单位列表
    getOrgList() {
      const url = this.global_url + 'organizations/getAll'
      axios
        .get(url)
        .then(response => {
          if (response.data.code == 200) {
            this.orgData = response.data.data.list
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 查询用户信息
    handleQuery() {
      if (this.dateRange && this.dateRange !== undefined) {
        this.filters.startDate = this.dateRange[0]
        this.filters.endDate = this.dateRange[1]
      }
      if (this.dateRange == null) {
        this.filters.startDate = null
        this.filters.endDate = null
      }
      this.filters.pageNum = this.currentPage
      this.filters.pageSize = this.pageSize
      let status = 1
      user.queryUsers2(this.filters.departmentId, this.filters.userName, this.filters.pageNum, this.filters.pageSize, this.filters.startDate, this.filters.endDate,status).then(response => {
        if (response.code === 200) {
          this.userData = response.data.list
          this.userTotal = response.data.total
          console.log(this.userData,this.userTotal)
        } else {
          this.$message.error('用户列表获取失败')
        }
      })
      .catch(function(error) {
        console.log(error)
      })
      // if(this.filters.departmentId!==null&&this.filters.departmentId!==undefined){
      //   organization.getUserByOrganization(this.filters.departmentId, this.filters.userName, this.filters.pageNum, this.filters.pageSize).then(response => {
      //     if (response.code === 200) {
      //       this.userData = response.data.list
      //       this.userTotal = response.data.total
      //       console.log(this.userData,this.userTotal)
      //     } else {
      //       this.$message.error('用户列表获取失败')
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log(error)
      //   })
      // }else{
      //   user.queryUsers(this.filters.userName, this.filters.pageNum, this.filters.pageSize, this.filters.startDate, this.filters.endDate).then(response => {
      //     if (response.code === 200) {
      //       this.userData = response.data.list
      //       this.userTotal = response.data.total
      //       console.log(this.userData,this.userTotal)
      //     } else {
      //       this.$message.error('用户列表获取失败')
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log(error)
      //   })
      // }
    },
    // 更改用户状态
    changeUserStatus(item) {
      const loginUser = JSON.parse(window.localStorage.getItem('userInfo'))
      const userInfo = {
        isOpen: item.isOpen,
        // uUser: item.id
        id: item.id
      }
      user.updateUserInfo(userInfo)
        .then(response => {
          if (response.code === 200) {
            this.$message.success('修改状态成功！')
            this.resetDlgVisible = false
            if (this.resetUser.id === loginUser.id) {
              // this.logoutSys()
              // this.$cookies.remove('Admin-Token')
              // this.$cookies.remove('JSESSIONID')
              // this.$store.commit('reset', '')
              // localStorage.clear()
              // this.$router.push({ path: '/login' })
            }
          } else {
            this.$message.error('修改状态失败')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 用户失去焦点同步更新邮箱
    setDefaultValue() {
      // const username = this.dataForm.username
      // this.dataForm.email = username
      // this.dataForm.name = username
    },
    // 创建添加弹框展示
    handleAdd: function() {
      this.dataForm = {
        id: null,
        realname: '',
        username: '',
        password: '',
        password2: '',
        // departmentId: null,
        // email: '',
        organizationId: null,
        status: 1,
        tel: null,
        roles: '',
        isOpen: 1
      }
      this.dialogVisible = true
      this.operation = true
    },
    // 新建用户
    createNewUser() {
      // this.dataForm.email = this.dataForm.email + this.append
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.dataForm);
          delete data.password2;

          user.addUser(data)
            .then(response => {
              if (response.code === 200) {
                this.$message.success('添加成功！')
                this.handleQuery()
                this.dialogVisible = false
              } else {
                // this.dataForm.email = this.dataForm.email.substr(0, this.dataForm.email.lastIndexOf('@'))
                this.$message.error('创建失败!')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 显示编辑界面
    handleEdit(item) {
      // console.log(item, "item")
      this.dataForm = {
        id: item.id,
        tel: item.tel,
        idcard: item.idcard,
        officerNum: item.officerNum,
        organizationId: item.organizationId,
        realname: item.realname,
        roles: item.roles,
        isOpen: item.isOpen
      }
      console.log('dataForm', this.dataForm)
      this.dialogVisible = true
      this.operation = false
    },
    changeOrg(node, instanceId) {
      // console.log(node, instanceId,888);
      this.dataForm.organization = node.name;
    },
    // 更新用户信息
    updateUser() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          user.updateUserInfo(this.dataForm)
            .then(response => {
              if (response.code === 200) {
                // const current = JSON.parse(localStorage.getItem('userInfo'))
                this.$message.success('更新成功！')
                // this.resetQuery();
                this.handleQuery()
                this.dialogVisible = false
                // this.getUserList(this.currentPage, this.pageSize);
              } else {
                // const array = this.dataForm.email.split('@')
                // if (array.length > 1) {
                //   this.dataForm.email = array[0]
                // }
                this.$message.error('更新失败!')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户信息
    async  initUserInfo(userName, permission, roles) {
      var url = this.global_url + 'account/info'
      await axios.get(url, { params: { userName: userName }
      }).then(response => {
        if (response.data.lenght == 0) {
          this.$message({
            message: '没有该用户!',
            type: 'error',
            duration: 2000
          })
        } else {
          const userInfo = response.data.data.list[0]
          // this.$store.commit("$_setToken","Token")
          userInfo.permission = permission
          userInfo.roles = roles
          this.$store.commit('setLogin', true)
          this.$store.commit('setUserInfo', userInfo)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
      }).catch(function(error) {
        console.log(error)
      })
    },

    async getUserInfo(userName) {
      const url = this.global_url + 'user/info'
      await axios
        .get(url, { params: { name: userName }})
        .then(response => {
          if (response.data.code == 200) {
            const permission = response.data.data.menus
            const roles = response.data.data.roles
            this.initUserInfo(userName, permission, roles)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 展示重置对话框
    showResetDlg(row) {
      this.resetDlgVisible = true
      this.resetUser = row
    },
    // 重置密码
    resetUserPwd() {
      this.$refs['resetPwdForm'].validate(valid => {
        if (valid) {
          const loginUser = JSON.parse(window.localStorage.getItem('userInfo'))
          // const userInfo = {
          //   password: this.resetPwdForm.resetPassword,
          //   id: this.resetUser.id
          // }
          user.editUserPassword(this.resetUser.id, this.resetPwdForm.resetPassword)
            .then(response => {
              if (response.code === 200) {
                this.$message.success('重置成功！')
                this.resetDlgVisible = false
                if (this.resetUser.id === loginUser.id) {
                  // this.logoutSys()
                  this.$cookies.remove('Admin-Token')
                  this.$cookies.remove('JSESSIONID')
                  this.$store.commit('reset', '')
                  localStorage.clear()
                  this.$router.push({ path: '/login' })
                }else{
                  this.handleQuery()
                }
              } else {
                this.$message.error('重置失败')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    // 发送通知
    sendMessage(message, title, userList) {
      var url = this.global_url + 'message/sendUser'
      axios.post(url, null,
        {
          params: {
            msg: message,
            title: title,
            persons: userList
          }
        },
        {
          header: { 'Content-Type': 'application/json; charset=UTF-8' }
        })
        .then(response => {
          if (response.data.code == '200') {
          }
        }).catch(function(error) {
          console.log(error)
        })
    },
    // 删除用户
    delUser(userIds) {
      const loginUser = JSON.parse(window.localStorage.getItem('userInfo'))
      let flag = false
      let ids = null
      if (userIds instanceof Array) {
        ids = userIds.join(',')
        userIds.forEach(item => {
          if (item === loginUser.id) {
            flag = true
          }
        })
      } else {
        ids = userIds
        flag = ids === loginUser.id
      }
      user.deleteUser(userIds)
        .then(response => {
          if (response.code == 200) {
            this.$message.success('删除成功!')
            if (flag) {
              this.logoutSys()
            } else {
              // const userList = []
              // userList.push(this.resetUser.userName)
              // this.sendMessage('该用户已被删除', '系统消息', userList.join(','))
            }
          } else {
            this.$message.error('删除失败!')
          }
          if (this.userData.length - 1 == 0 && this.currentPage != 1) {
            this.currentPage = this.currentPage - 1
          }
          // this.resetQuery();
          this.handleQuery()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // logout请求
    logoutSys() {
      const url = this.global_url + 'user/logout'
      axios.post(url).then(response => {
        if (response.data.code == 200) {
          // 清除cookies
          // this.$cookies.remove('repoid')
          // this.$cookies.remove('repoName');
          // this.$cookies.remove('languages');
          // this.$cookies.remove('pathWithNamespace');
          this.$store.commit('reset', '')
          localStorage.clear()
          sessionStorage.clear()
          // 跳转
          this.$router.push('/login')
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id).toString()
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 删除按钮操作
    handleDelete(row) {
      const userIds = row.id
      this.$confirm(
        '是否确认删除用户"' + row.username + '"?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.delUser(userIds)
        })
        .catch(function() {
        })
    },
    handleDeleteBatch() {
      this.$confirm(
        '是否确认删除选中的用户的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          user.deleteUsers(this.ids).then(response => {
            if (response.code == 200) {
              this.$message.success('删除成功!')
            } else {
              this.$message.error('删除失败!')
            }
            if (this.userData.length - 1 == 0 && this.currentPage != 1) {
              this.currentPage = this.currentPage - 1
            }
            // this.resetQuery();
            this.handleQuery()
          })
          .catch(function(error) {
            console.log(error)
          })
        })
        .catch(function() {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.excelData = this.dataList //你要导出的数据list。
        this.export2Excel()
      }).catch(() => {
        console.log('error')
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList()
      this.fileList = fileList
      this.submitFileForm(file)
    },
    addFile(file, fileList) {
      this.fileList = fileList
    },
    // 提交上传文件
    submitFileForm() {
      if (this.fileList.length > 0) {
        const isLt10M = this.fileList.every(
          file => file.size / 1024 / 1024 < 10
        )
        if (!isLt10M) {
          this.$message.error('请检查，上传文件大小不能超过10M！')
        } else {
          var fileData = new FormData()
          this.$refs.upload.submit() // 提交调用uploadFile函数
          fileData.append('file', this.fileList[0].raw)
          const url = this.global_url + 'account/import'
          axios
            .post(url, fileData, {
              header: { 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
              if (response.data.code == '200') {
                const result = response.data.data
                this.$message({
                  type: 'success',
                  message: '共计：' + result.total + '条数据。成功：' + result.newCount + '条；失败：' + result.failedCount + '条；更新：' + result.updatedCount + '条。',
                  duration: 3000
                })
                this.upload.open = false
                this.upload.isUploading = false
                this.resetQuery()
              } else {
                this.$message.error('上传失败！')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        }
      }
    },
    // 用户数据格式化导出
    async getAllUserList() {
      const url = this.global_url + 'account/all'
      await axios
        .get(url, { params: { pageNum: 1, pageSize: 10000 }})
        .then(response => {
          if (response.data.code == 200) {
            const list = response.data.data.list
            for (var i = 0; i < list.length; i++) {
              if (list[i].gender == 1) {
                list[i].gender = '女'
              } else {
                list[i].gender = '男'
              }
              this.orgData.forEach(element => {
                if (list[i].organizationId == element.id) {
                  list[i].organization = element.name
                }
              })
              // this.deptData.forEach(element => {
              //   if (list[i].departmentid == element.id) {
              //     list[i].departmentid = element.name;
              //   }
              // });
              // this.roleData.forEach(element => {
              //   if (list[i].roles == element.roles) {
              //     list[i].roles = element.description;
              //   }
              // });
              // list[i].organization = "中科院空天信息研究院苏州园区"
              if (list[i].status == 1) {
                list[i].status = '正常'
              } else {
                list[i].status = '异常'
              }
              this.excelData = list
            }
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 用户数据导出处理
    async export2Excel() {
      await this.getAllUserList()
      require.ensure([], () => {
        // const {export_json_to_excel} = require("../../utils/excel/Export2Excel");
        const tHeader = [
          '编号',
          '用户名',
          '姓名',
          '性别',
          '角色',
          '单位',
          '部门',
          // '邮箱',
          '状态',
          '创建时间'
        ] // 生成Excel表格的头部标题栏
        const filterVal = [
          'id',
          'userName',
          'nickName',
          'roleName',
          'organization',
          'deptName',
          'email',
          'status',
          'createTime'
        ] // 生成Excel表格的内容栏（根据自己的数据内容属性填写）
        const list = this.excelData // 需要导出Excel的数据
        const data = this.formatJson(filterVal, list)
        const dateStr = new Date().toLocaleString()
        export_json_to_excel(tHeader, data, dateStr + '用户数据') // 这里可以定义你的Excel表的默认名称
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 下载模板
    importTemplate() {
      require.ensure([], () => {
        // const {export_json_to_excel} = require("../../utils/excel/Export2Excel");
        const tHeader = [
          '用户名',
          '密码',
          '姓名',
          '性别',
          '角色',
          '单位',
          '部门',
          // '邮箱',
          '电话'
        ] // 生成Excel表格的头部标题栏
        const filterVal = [] // 生成Excel表格的内容栏（根据自己的数据内容属性填写）
        const list = [] // 需要导出Excel的数据
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '用户Excel导入模板') // 这里可以定义你的Excel表的默认名称
      })
    },
    // 下载模板
    downloadTemplate() {
      axios.get('../../../../static/importTemplate/import.xlsx',
        {
          header: { 'Content-Type': 'application/json; charset=UTF-8' },
          responseType: 'arraybuffer'
        }
      ).then(response => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' })
        const a = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        a.href = href
        a.download = decodeURIComponent('账户导入模板')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(href)
      })
    },
     // 解锁
    unlock(item) {
      const userInfo = {
        userId: item.id
      }
      user.unlock(userInfo)
        .then(response => {
          if (response.code === 200) {
            this.$message.success('解锁成功！')
            this.handleQuery()
          } else {
            this.$message.error('解锁失败')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
  }
}
</script>

<style scoped>
  .el-input__inner {
    line-height: 30px;
    height: 30px;
  }

  /* .el-select .el-input{
    width: 130px;
  }
  .input-with-select .el-input-group__append{
    background-color: #fff;
  } */

</style>
