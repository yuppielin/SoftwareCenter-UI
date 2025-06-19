<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true" style="margin-bottom:-20px;">
      <el-form-item label="角色名称">
        <el-input
          v-model="filters.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="角色状态" clearable size="small">
          <el-option value="1" label="正常"/>
          <el-option value="0" label="停用"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchRole">搜索</el-button>
        <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button> -->
      </el-form-item>
    </el-form>

    <!--表格内容栏-->
    <el-table
      size="small"
      :data="roleData"
      :tree-props="{children:'children',hasChildren:'hasChildren'}"
      row-key="id"
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="150px" align="center"></el-table-column>
      <el-table-column prop="roleCode" label="角色代码" width="200px" align="center"></el-table-column>
      <el-table-column prop="description" label="角色描述" header-align="center" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="ctime" label="创建时间" width="200px">
        <template slot-scope="{row}">
           <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="80">
        <template slot-scope="scoped">
          <el-switch 
            v-model="scoped.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scoped.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="getPermissionDetail(scope.row)"
          >查看菜单</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="500px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="dataForm" label-width="80px" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="roleId" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色名称"
          prop="roleName"
          :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' },]"
        >
          <el-input v-model.trim="dataForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色代码"
          prop="roleCode"
          :rules="[{ required: true, message: '请输入角色代码', trigger: 'blur' },]"
        >
          <el-input v-model.trim="dataForm.roleCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色顺序"
          prop="roleSort"
          :rules="[{ required: true, message: '请输入角色顺序', trigger: 'blur' },]"
        >
          <el-input-number
            v-model="dataForm.roleSort"
            controls-position="right"
            :min="0"
            style="width:60%"
          />
        </el-form-item>
        <el-form-item label="角色描述 " prop="description">
          <el-input v-model="dataForm.description" auto-complete="off" type="textarea" rows="5"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="prim" label="菜单权限">
          <el-checkbox @change="handleCheckAll" v-model="checkAll">全选</el-checkbox>
          <el-checkbox @change="handleCollapseAll" v-model="collapseAll">折叠</el-checkbox>
          <el-tree
            :data="menuData"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expand-all="expendAll"
            @check-change="handleCheckChange"
            :default-checked-keys="defaultMenuIds"
            check-on-click-node
            style="max-height:200px;overflow-y:auto"
          ></el-tree>
        </el-form-item> -->
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click.native="addRole" v-if="operation">确定</el-button>
        <el-button :size="size" type="primary" @click.native="updateRole" v-else>保存</el-button>
      </div>
    </el-dialog>
    <!--角色菜单，表格树内容栏-->
    <el-dialog
      title="菜单列表"
      :visible.sync="menuAccessshow"
      width="500px"
      @click="closeDialog('perm')"
    > 
      <el-tree
            :data="menuData"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expand-all="expendAll"
            :default-checked-keys="defaultMenuIds"
            check-on-click-node
            style="max-height:200px;overflow-y:auto"
          ></el-tree>
           <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
             <el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.menuIds.length==0">
               <b>全选</b>
             </el-checkbox>
           </div>
           <div slot="footer" class="dialog-footer">
             <el-button @click="resetSelection" type="small">重置</el-button>
             <el-button @click="submitAuthForm" size="small" type="primary"
                        :loading="loading">确定
             </el-button>
           </div>
    </el-dialog>
  </el-card>
</template>

<script>
import * as role from "@/api/role" 
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/sys-menu";
import { parseTime } from '@/utils'
export default {
  components: {},
  data() {
    return {
      userInfo: {},
      size: "small",
      filters: {
        roleName: null,
        status: null
      },
      roleData: [],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      total: 0,
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "name", label: "角色名", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "createBy", label: "创建人", minWidth: 120 },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 120,
          formatter: this.dateFormat
        }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: true,
      // 新增编辑界面数据
      dataForm: {
        roleName: "",
        roleCode: "",
        description: "",
        roleType: 0,
        roleSort:1
      },
      roleMenusForm: {
        id: null,
        menuIds: []
      },
      selectRole: {},
      menuAccessshow: false,
      menuIds: [],
      defaultMenuIds: [],
      roleMenuData: [],
      menuData: [],
      loading: false,
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      collapseAll: true,
      expendAll: true,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // this.findTreeData();
    this.getRoleList();
    // this.getMenuList();
  },
  methods: {
    // 切换状态
    changeStatus(item) {
      role.changeStatus(item.id).then(response=>{
        if(response.code==200){
          this.$message.success("状态修改成功！")
          this.filters={}
          this.getRoleList();
        }
      })
    },
    //获取角色列表
    getRoleList() {
       role.getRoles(this.filters.roleName,this.filters.status).then(response=>{
         if(response.code==200){
           this.roleData=response.data;
         }
       })
    },
     /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuData = response.data.menus;
        return response;
      });
    },
    // 删除角色
    handleDelete: function(item) {
      let url = this.global_url + "role";
      this.$confirm("确定删除该角色吗？", "警告", {
        type: "warning"
      }).then(() => {
         role.deleteRole(item.id).then(response=>{
           if(response.code==200){
             this.$message.success("删除成功！");
             this.getRoleList();
           }else{
             this.$message.error(response.msg)
           }
         })
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm={};
    },
    // 显示编辑界面
    handleEdit(item) {
      // this.getRoleMenuList(item.roleId);
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm =JSON.parse(JSON.stringify(item)) ;
    },
    getPermissionDetail: function(row) {
      this.menuAccessshow = true;
      // this.showRoleMenuList(item.id);
      // this.reset();
      const roleId = row.id 
      const roleMenu = this.getRoleMenuTreeselect(roleId);

      this.roleMenusForm.id = roleId;
      roleMenu.then(res => {
        let checkedKeys = res.data.checkedKeys
         checkedKeys.forEach((v) => {
          this.$nextTick(()=>{
              this.$refs.menu.setChecked(v, true ,false);
          })
         })
      })
      // getRole(roleId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
        // this.$nextTick(() => {
        //   roleMenu.then(res => {
        //     let checkedKeys = res.checkedKeys
        //     checkedKeys.forEach((v) => {
        //         this.$nextTick(()=>{
        //             this.$refs.menu.setChecked(v, true ,false);
        //         })
        //     })
        //   });
      //   });
      //   this.title = "修改角色";
    },
    //添加角色
    addRole() {
      this.dataForm.ctime=new Date().getTime();
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            role.addRole(this.dataForm).then(response=>{
              if(response.code==200){
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
                this.filters={}
                this.getRoleList();
                this.$message.success("添加成功！")
              }
            })
          });
        }
      });
    },
    // 编辑角色
    updateRole() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            role.updateRole(this.dataForm).then(response=>{
              if(response.code==200){
                this.$message.success("更新成功！")
                this.filters={}
                this.getRoleList();
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
              }
            })
          });
        }
      });
    },
    //查询角色
    searchRole() {
      role.getRoles(this.filters.roleName,this.filters.status).then(response=>{
        if(response.code==200){
          this.roleData=response.data;
        }
      })
    },
    // //获取权限列表
    // getMenuList() {
    //   let url = this.global_url + "permission/listAllPermission";
    //   axios.get(url).then(response => {
    //     if (response.data.code == 200) {
    //       this.menuData = response.data.data.list;
    //       // this.total = response.data.data.total;
    //     }
    //   });
    // },
    // //获取角色权限列表
    // getRoleMenuList(roleId) {
    //   this.defaultMenuIds = [];
    //   let url = this.global_url + "permission/listAllPermissionByRoleId";
    //   axios.get(url, { params: { roleId: roleId } }).then(response => {
    //     if (response.data.code == 200) {
    //       this.roleMenuData = response.data.data.list;
    //       // this.total = response.data.data.total;
    //       if (this.roleMenuData.length !== 0) {
    //         this.roleMenuData.forEach(roleMenuData => {
    //           this.defaultMenuIds.push(roleMenuData.id);
    //         });
    //       }
    //       // console.log(this.defaultMenuIds);
    //       this.getMenuList();
    //     }
    //   });
    // },

    // //获取角色权限展示数据
    // showRoleMenuList(roleId) {
    //   let url = this.global_url + "permission/getAllPermissionByRoleId";
    //   axios.get(url, { params: { roleId: roleId } }).then(response => {
    //     if (response.data.code == 200) {
    //       this.roleMenuData = response.data.data.list;
    //     }
    //   });
    // },

    // //分配角色权限
    // setRolePermission(roleId, permissionIds) {
    //   let url = this.global_url + "role/permission";
    //   axios
    //     .post(url, null, {
    //       params: { roleId: roleId, permissionIds: permissionIds.join(",") }
    //     })
    //     .then(response => {
    //       if (response.data.code == 200) {
    //       } else {
    //         this.$message.error("权限设置失败");
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    // // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      // this.menuData =[]
    },
    //页码改变切换
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getRoleList();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.getRoleList();
    },
    // 数据权限
    // menuAccess: function(index, row) {
    //   this.menuAccessshow = true;
    //   this.saveroleId = row.roleId;
    //   RoleRightTree(row.roleId)
    //     .then(res => {
    //       if (res.data.success) {
    //         this.$message({
    //           type: "success",
    //           message: "获取权限成功"
    //         });
    //         this.changemenu(res.data.data);
    //         this.RoleRight = this.changeArr(res.data.data);
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: res.data.msg
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       this.$message.error("获取权限失败，请稍后再试！");
    //     });
    // },
    // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      //let result = menu.findMenuTree();
      //this.menuData = result.data.data;
      this.menuLoading = false;
    },
    //节点选择监听
    // handleCheckChange() {
    //   this.menuIds = [];
    //   let res = this.$refs.menu.getCheckedNodes();
    //   console.log(res,"res",this.menuIds)
    //   res.forEach(res => {
    //     this.menuIds.push(res.id);
    //   });
    // },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId;
        this.$refs.menuTree.setChecked(parentId, true, false);
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menu.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        this.$refs.menu.setCheckedNodes(allMenus);
      } else {
        this.$refs.menu.setCheckedNodes([]);
      }
    },
    //全部折叠
    handleCollapseAll() {
      if (this.collapseAll) {
        for (let i = 0; i < this.menuData.length; i++) {
          this.$refs.menu.store.nodesMap[this.menuData[i].id].expanded = false;
        }
      } else {
        for (let i = 0; i < this.menuData.length; i++) {
          this.$refs.menu.store.nodesMap[this.menuData[i].id].expanded = true;
        }
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      this.menuIds = []
      let oneNode = this.$refs.menu.getCheckedNodes();
      for(let o=0;o<oneNode.length;o++){
        this.menuIds.push(oneNode[o].id)
      }
      let halfNode = this.$refs.menu.getHalfCheckedNodes();
      for(let h=0;h<halfNode.length;h++){
        this.menuIds.push(halfNode[h].id)
      }
      if(this.menuIds.length === 0){
        return this.$message.info("请选择角色可用菜单！！")
      }
      let roleId = this.selectRole.id;
      this.selectRole.id = this.menuIds;
      console.log(this.menuIds,99);
      // if ("administrator" == this.selectRole.name) {
      //   this.$message({
      //     message: "超级管理员拥有所有菜单权限，不允许修改！",
      //     type: "error"
      //   });
      //   return;
      // }
      this.authLoading = true;
      // let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
      // let roleMenus = [];
      // for (let i = 0, len = checkedNodes.length; i < len; i++) {
      //   let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
      //   roleMenus.push(roleMenu);
      // }
      this.roleMenusForm.menuIds = this.menuIds;
      role.addRoleMenus(this.roleMenusForm).then(res => {
        this.$modal.msgSuccess("操作成功");
        this.authLoading = false;
        this.menuAccessshow = false;
      });
    },
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <div class="column-container">
    //       <span style="text-algin:center;margin-right:80px;">
    //         {" "}
    //         {data.menuName}{" "}
    //       </span>
    //       <span style="text-algin:center;margin-right:80px;">
    //         <el-tag
    //           type={
    //             data.elementType === "M"
    //               ? ""
    //               : data.elementType === "C"
    //               ? "success"
    //               : "info"
    //           }
    //           size="small"
    //         >
    //           {data.elementType === "M"
    //             ? "目录"
    //             : data.elementType === "F"
    //             ? "按钮"
    //             : "菜单"}
    //         </el-tag>
    //       </span>
    //       <span style="text-algin:center;margin-right:80px;">
    //         {data.parentId ? data.menuName : "顶级菜单"}
    //       </span>
    //       <span style="text-algin:center;margin-right:80px;">
    //         {data.path ? data.path : "\t"}
    //       </span>
    //     </div>
    //   );
    // }
  },
 
};
</script>
<style scoped>

</style>
