<template>
  <div style="margin:10px 20px;">
    <div style="font-size:14px;color:gray;margin:10px 0;background-color:#f7f8fa;height:30px;line-height:30px;">
      <i class="iconfont icon-jiaosefenpei" style="margin-left:5px;"></i>
      <span style="display:inline-block;margin-left:5px;">集中系统权限，支持权限的增删改查，批量处理等操作。</span>
    </div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.permissionName" placeholder="输入权限名称" ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.permission" placeholder="输入权限代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- <div class="toolbar" style="float:left;padding:0 0 10px 0">
        <el-tooltip content="展开" placement="top">
          <el-button icon="el-icon-caret-bottom" @click="findPage(null)" size="small"></el-button>
        </el-tooltip>
        <el-tooltip content="折叠" placement="top">
          <el-button icon="el-icon-caret-right" @click="visible=true" size="small"></el-button>
        </el-tooltip>
        <el-tooltip content="刷新" placement="top">
          <el-button icon="el-icon-refresh" size="small"></el-button>
        </el-tooltip>
    </div> -->
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="authListData"
    :header-cell-style="{background:'#f8f8f9',color:'#515a6e',height:'40px'}"
    :tree-props="{children:'children',hasChildren:'hasChildren'}" row-key="Id" v-loading="loading">
      <el-table-column prop="name" label="权限名称" width="300">
      </el-table-column>
      <el-table-column  prop="code" label="权限代码" width="300">
      </el-table-column>
      <el-table-column  label="权限类型" width="300">
          <template slot-scope="scope">
              <span style="color:green;" v-if="scope.row.type==1">菜单</span>
              <span style="color:red;" v-else>操作</span>
          </template>
      </el-table-column>
      <el-table-column  prop="path" label="组件路径">
      </el-table-column>
      <el-table-column  prop="description" label="权限描述">
      </el-table-column>
      <el-table-column  prop="editTime" label="创建时间" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination> -->
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="editForm.type">
                <el-radio :label="3">目录</el-radio>
                <el-radio :label="6">菜单</el-radio>
                <el-radio :label="9">按钮</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="权限名称"></el-input>
        </el-form-item>
        <el-form-item label="父级模块" prop="parentId">
          <popup-tree-input size="small"
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="editForm.parentName==null?'顶级菜单':editForm.parentName"
            :nodeKey="''+editForm.parentId"
            :currentChangeHandle="handleTreeSelectChange"
          ></popup-tree-input>
          <!-- <treeselect
                v-model="editForm.parentId"
                :options="menuOptions"
                :show-count="true"
                placeholder="选择上级模块"
              /> -->
        </el-form-item>
        <el-form-item label="显示状态" prop="display">
            <el-radio-group v-model="editForm.display">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="路由地址" prop="router">
          <el-input size="small" v-model="editForm.router" auto-complete="off" placeholder="路由地址"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input size="small" v-model="editForm.description" auto-complete="off" placeholder="权限描述" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="权限代码" prop="permission">
          <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="权限代码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "../common/popup-tree-input";
//import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  //components: { Treeselect},
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      menuOptions:[
        {
          id: '1',
          label: '全局概览',
        },
        {
          id: '2',
          label: '项目协同',
          children: [{
            id: '1',
            label: '项目概览'
          }, {
            id: '2',
            label: '需求管理'
          },{
            id:'3',
            label: '项目设置',
            children:[
                {
                    id: '1',
                    label: '基本设置'
                },
                {
                    id: '2',
                    label: '成员管理'
                },
                {
                    id: '3',
                    label: '模块管理'
                },
            ]
          }]
        }
        ],
      title: '添加',
      //添加编辑表单
      editForm: {
        Id: null,
        type:6,
        name: '',
        parentId:null,
        parentName:"",
        code: '',
        description:'',
        token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        parentName:[
            { required: true, message: '请选择父级模块', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限代码', trigger: 'blur' }
        ],
        router: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        permissionName: '',
        permission: '',
        roleId: '0',
        token: localStorage.getItem('logintoken')
      },
      // 选择数据
      selectdata: [],
      userparm: [
          {
          id: 1,
          name: "ROLE_ADMIN",
          description: "系统管理员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 2,
          name: "ROLE_MANAGER",
          description: "项目管理员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 3,
          name: "ROLE_PROEJCT_MANAGER",
          description: "项目经理",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 4,
          name: "ROLE_DEV",
          description: "开发人员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 5,
          name: "ROLE_TEST",
          description: "测试人员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 6,
          name: "ROLE_OPT",
          description: "运维人员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        },
        {
          id: 7,
          name: "ROLE_USER",
          description: "普通人员",
          createdBy: "yuecj",
          createTime: "2020-08-09"
        }
      ], //搜索权限
      popupTreeData:[{
          id: 1,
          label: '全局概览',
        }, {
          id: 2,
          label: '项目协同',
          children: [{
            id: 3,
            label: '项目概览'
          }, {
            id: 4,
            label: '需求管理'
          },{
            id: 5,
            label: '任务管理'
          },{
            id: 6,
            label: '缺陷管理'
          },{
            id: 7,
            label: '项目设置',
            children:[
                {
                    id: 8,
                    label: '基本设置'
                },
                {
                    id: 9,
                    label: '成员管理'
                },
                {
                    id: 10,
                    label: '模块管理'
                },
            ]
          }]
        }, {
          id: 11,
          label: '代码托管',
          children: [{
            id: 12,
            label: '代码浏览'
          }, {
            id: 13,
            label: '分支管理'
          }, {
            id: 14,
            label: '代码版本'
          }, {
            id: 15,
            label: '代码合并'
          }, {
            id: 8,
            label: '代码统计'
          }, {
            id: 8,
            label: '仓库设置'
          },]
        }],
      popupTreeProps: {
        label: "label",
        children: "children",
      },
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    PopupTreeInput
  },
  watch: {},
  created() {
    this.getdata(this.formInline)
    this.getAccsee()
  },

  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.loading = true
      // 模拟数据
      let res = {
        code: 0,
        msg: null,
        count: 0,
        data: [
          {
            addUser: null,
            editUser: null,
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 1,
            name: '全局概览',
            code: 'system:OverView',
            type:1,
          },
          {
            addUser: null,
            editUser: null,
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 3,
            name: '项目协同',
            code: 'system:User:save',
            type:1,
            children:[
                 {
                    addUser: null,
                    editUser: null,
                    addTime: "2020-09-08",
                    editTime: "2020-09-08",
                    Id: 1,
                    name: '项目管理',
                    code: 'system:OverView',
                    type:1,
                },
                {
                    addUser: null,
                    editUser: null,
                    addTime: "2020-09-08",
                    editTime: "2020-09-08",
                    Id: 1,
                    name: '需求管理',
                    code: 'system:OverView',
                    type:1,
                },
                {
                    addUser: null,
                    editUser: null,
                    addTime: "2020-09-08",
                    editTime: "2020-09-08",
                    Id: 1,
                    name: '任务管理',
                    code: 'system:OverView',
                    type:1,
                },
                 {
                    addUser: null,
                    editUser: null,
                    addTime: "2020-09-08",
                    editTime: "2020-09-08",
                    Id: 1,
                    name: '缺陷管理',
                    code: 'system:OverView',
                    type:1,
                },
                 {
                    addUser: null,
                    editUser: null,
                    addTime: "2020-09-08",
                    editTime: "2020-09-08",
                    Id: 1,
                    name: '项目设置',
                    code: 'system:OverView',
                    type:1,
                },
            ]
          },
          {
            addUser: null,
            editUser: null,
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 4,
            name: '代码托管',
            code: 'system:User:delete',
          },
          {
            addUser: 'root',
            editUser: 'root',
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 5,
            name: '集成构建',
            code: 'system:Role:list',
          },
          {
            addUser: 'root',
            editUser: 'root',
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 7,
            name: '代码分析',
            code: 'system:Role:save',

          },
          {
            addUser: 'root',
            editUser: 'root',
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 8,
            name: '测试管理',
            code: 'system:Role:delete',
          },
          {
            addUser: 'root',
            editUser: 'root',
            addTime: "2020-09-08",
            editTime: "2020-09-08",
            Id: 9,
            name: '持续部署',
            code: 'system:Variable:list',
          },
        ]
      }
      this.loading = false
      this.authListData = res.data
      // 分页赋值
      this.pageparm.currentPage = this.formInline.page
      this.pageparm.pageSize = this.formInline.limit
      this.pageparm.total = res.count
    },
    handleTreeSelectChange(data, node) {
      this.editForm.parentId = data.id;
      this.editForm.parentName = data.label;
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    // 获取权限
    getAccsee() {
      roleDropDown()
        .then(res => {
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.userparm = res.data
          }
        })
        .catch(err => {
          this.$message.error('权限获取失败，请稍后再试！')
        })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      // 深拷贝并赋值
      //this.editForm = Object.assign({}, row)
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.permissionId = row.permissionId
        this.editForm.permissionName = row.permissionName
        this.editForm.permission = row.permission
      } else {
        this.title = '添加'
        this.editForm.permissionId = ''
        this.editForm.permissionName = ''
        this.editForm.permission = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          ermissionSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '权限管理保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('权限管理保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除权限
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ermissionDelete(row.permissionId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '权限管理已删除！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('权限管理删除失败,请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 配置权限
    RolePermission() {
      let parms = {
        roleId: '',
        permissionIds: ''
      }
      if (this.formInline.roleId == '0') {
        this.$message({
          type: 'info',
          message: '请选择角色'
        })
        return false
      }
      parms.roleId = this.formInline.roleId
      let len = this.selectdata
      let ids = []
      if (len != 0) {
        for (let i = 0; i < len.length; i++) {
          ids.push(len[i].permissionId)
        }
      }
      parms.permissionIds = ids.join(',')
      RolePermission(parms)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '配置权限成功！'
            })
            this.getdata(this.formInline)
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('配置权限失败,请稍后再试！')
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

