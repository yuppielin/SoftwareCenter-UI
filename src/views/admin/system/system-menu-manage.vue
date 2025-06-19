<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryParams" ref="queryForm">
      <el-row>
        <el-col :span="12">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleMenuAdd">添加</el-button>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable size="small" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
              <el-option value="0" label="正常" />
              <el-option value="1" label="停用" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="reset" size="mini"  @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    <!--列表-->
    <el-table
      style="max-height:calc(100vh - 240px);overflow-y:auto;"
      size="small"
      :data="menuListData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="menuId"
      v-loading="loading"
      default-expand-all
      :header-cell-style="{height:'30px'}"
    >
      <el-table-column prop="menuName" header-align="center" label="菜单名称" width="250"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="100" align="center"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" header-align="center"></el-table-column>
      <el-table-column label="菜单类型" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:blue;" v-if="scope.row.menuType=='M'">目录</span>
          <span style="color:green;" v-else-if="scope.row.menuType=='C'">菜单</span>
          <span style="color:gray;" v-else>按钮</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" show-overflow-tooltip label="组件路径" header-align="center"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80">
         <template slot-scope="scoped">
          <el-switch 
            v-model="scoped.row.status"
            active-value="0"
            inactive-value="1"
            @change="changeStatus(scoped.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" id="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    style="width: 25px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
                size="small"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType == 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跳转地址" prop="redirect" v-if="form.menuType != 'F'">
              <el-input v-model="form.redirect" placeholder="请输入跳转地址" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="50" size="small" />
            </el-form-item>
          </el-col>
           <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label" style="color:#000">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                参数
              </span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M' " label="权限路径">
              <el-input v-model="form.permissionUrl" placeholder="请输入权限路径" maxlength="50" size="small"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="是否缓存">
              <el-radio-group v-model="form.isCache">
                <el-radio label="0" :key="0">不缓存</el-radio>
                <el-radio label="1" :key="1">缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-input v-model="form.icon" placeholder="请输入软件图标名称（elementUI）" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio label="0" :key="0">显示</el-radio>
                <el-radio label="1" :key="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio label="0" :key="0">正常</el-radio>
                <el-radio label="1" :key="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType == 'M'">
            <el-form-item prop="alwaysShow" label="恒定展示">
              <el-radio-group v-model="form.alwaysShow">
                <el-radio label="0" :key="0">是</el-radio>
                <el-radio label="1" :key="1">否</el-radio>
              </el-radio-group>
              <el-tooltip content='如果选择是，无论该目录下有多少个子节点，该目录都会展示，如果选择否，当该目录下只有一个节点时，该目录隐藏，只显示那个子节点' placement="top">
                <i style="margin-left: 10px;" class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm()"
        >保存</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as sysMenu from "@/api/sys-menu";
// import IconSelect from "@/components/IconSelect";

export default {
  components: { Treeselect },
  data() {
    return {
      // 查询参数
      queryParams: {
        menuName: null,
        visible: undefined,
        status: null
      },
      // 菜单表格树数据
      menuListData: [],

      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      loading: false, //是显示加载
      //添加编辑弹框标题
      title: "添加",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      //rules表单验证
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
      },
      // 选择数据
      selectdata: []
    };
  },

  watch: {},
  created() {},
  computed: {},
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 切换状态
    changeStatus(item) {
      let data = {
        menuId: item.menuId,
        status: item.status,
      }
      this.loading = true;
      sysMenu.updateMenuStatus(data) .then(response => {
        this.getMenuList();
        this.loading = false;
      });
    },
    //获取权限列表
    getMenuList() {
      this.loading = true;
      sysMenu.listMenu(this.queryParams).then(response => {
        this.menuListData = this.handleTree(response.data, "menuId");
        this.loading = false;
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
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      sysMenu.listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: "主类目", children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    //取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: "",
        menuType: "M",
        orderNum: 0,
        // isFrame: "1",
        isCache: "1",
        visible: "0",
        status: "0",
        redirect: "noRedirect",
        alwaysShow: "1"
      };
      // this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getMenuList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //新增按钮操作
    handleMenuAdd() {
      this.reset();
      this.getTreeselect();
      this.form.parentId = 0;
      this.open = true;
      this.title = "添加菜单";
    },
    //新增按钮操作
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    //修改按钮操作
    handleEdit(row) {
      this.reset();
      this.getTreeselect();
      sysMenu.getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.menuName + '"的数据项？')
        .then(function() {
          return sysMenu.delMenu(row.menuId);
        })
        .then(() => {
          this.getMenuList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    // 编辑、增加页面保存方法
    submitForm() {
      if (this.form.parentId == undefined) {
        this.form.parentId = 0;
      }
      // this.form.name = this.form.menuName;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            sysMenu.updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getMenuList();
            });
          } else {
            sysMenu.addMenu(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getMenuList();
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
#treeselect >>> .vue-treeselect__input-container {
  height: 30px !important;
}
.el-form-item{
  margin-bottom: 0px;
}
</style>

