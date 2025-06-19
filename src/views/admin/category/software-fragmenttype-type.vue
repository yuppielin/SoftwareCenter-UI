<template>
    <div class="app-container">
        <el-card class="custome" >
            <div style="margin-bottom:10px;">
                <el-button size="small" type="primary" @click="handleAdd">添加软件段类型</el-button>
                <el-input size="small" v-model="search.keyword" style="width:200px;margin-left:10px;" placeholder="关键字"></el-input>
                <el-button size="small" type="primary" icon="el-icon-search" style="margin-left:10px" @click="queryCategory">搜索</el-button>
                <el-button size="small" type="reset" title="重置" @click="handleReset">重置</el-button>
            </div>
            <!--添加分类---->
            <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :title="title" @dragDialog="handleDrag" width="40%">
                <el-form name="typeForm" ref="typeForm" :model="typeForm" label-position="right" label-width="100px"  :rules="rules">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input size="small" v-model="typeForm.name" style="max-width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="分类值：" prop="val">
                        <el-input size="small" v-model="typeForm.val" style="max-width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="分类标识：" prop="identity">
                        <el-input size="small" v-model="typeForm.identity" style="max-width:400px;"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="上级分类：" prop="parentId">
                        <treeselect style="max-width:400px;"
                        v-model="typeForm.parentId"
                        :multiple="false"
                        :appendToBody="true"
                        z-index="9999"
                        :options="typeData"
                        :disable-branch-nodes="false"
                        :normalizer="normalizer"
                        :show-count="true"
                        @select="selectModuleAdd"
                        placeholder="请选择上级分类"/>
                    </el-form-item> -->
                </el-form>
                <span slot="footer">
                    <el-button size="small" type="primary" @click="addCategory('typeForm')">确定</el-button>
                    <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
                </span>
            </el-dialog>
            <el-table :data="typeData" size="mini" style="overflow-y:auto;" :tree-props="{children:'children',hasChildren:'hasChildren'}" row-key="id"
            :header-cell-style="{background:'#2BB56E',height:'30px'}" >
                <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
                <el-table-column align="left" header-align="left" label="分类名称" prop="name"></el-table-column>
                <el-table-column align="left" header-align="left" width="400" label="分类值" prop="val"></el-table-column>
                <el-table-column align="center" header-align="center" label="分类标识" prop="identity"></el-table-column>
                <el-table-column align="center" maxlength="9" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" header-align="center" label="排序" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" size="mini" @blur="updateCategorySort(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column align="center" header-align="center" label="操作" width="200">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" circle icon="el-icon-edit" title="编辑" @click="handleEdit(row)" ></el-button>
                        <el-button size="mini" type="danger" circle icon="el-icon-delete" title="删除" @click="deleteItem(row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top:15px;"
                :current-page="currentPage"
                :page-size= pageSize
                layout="total, prev, pager, next, jumper"
                :total= totalCount
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-card>
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import * as category from '@/api/category'
    export default {
        components:{
            Treeselect
        },
        directives: { elDragDialog },
        data(){
            return {
                currentPage: 1,
                pageSize: 10,
                totalCount: 0,
                title:'添加分类',
                dialogVisible:false,
                typeForm:{
                    name:'',
                    identity:'',
                },
                search:{
                    offerUnit:'',
                    devUnit:'',
                    keyWord:'',
                    type:''
                },
                typeData:[],
                rules:{
                    name:[
                        {required:true,message:'分类名称不能为空',trigger:'blur'}
                    ],
                    identity:[
                        {required:true,message:'分类标识不能为空',trigger:'blur'}
                    ],
                }
            }
        },
 mounted() {
    // 获取分类列表
    this.getCategoryList()
  },
  methods: {
    /**
     * 获取分类列表
     */
    getCategoryList() {
      category.getCategoryList("fragment_type", this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list
          this.totalCount = response.data.total
        }
      })
    },
    queryCategory() {
      // 查询软件分类 42 为资料分类的根节点id
      if (this.search.keyword) {
        category.queryCategory("fragment_type", this.search.keyword, this.currentPage, this.pageSize).then(response => {
          if (response.code === 200) {
            this.typeData = response.data.list
            this.totalCount = response.data.total
          }
        })
      } else {
        this.getCategoryList()
      }
    },
    /**
     * 更新分类排序
     * @param item 分类数据
     */
    updateCategorySort(item) {
      category.updateCategorySort(item.id, item.sort).then(response => {
        if (response.code === 200) {
          this.getCategoryList()
        }
      })
    },
    /**
     * 删除分类
     * @param id 分类id
     */
    deleteCategory(id) {
      category.deleteCategory(id).then(response => {
        if (response.code === 200) {
          this.$message.success('删除成功')
          this.getCategoryList()
        }
      })
    },
    /**
     * 添加分类
     * @param typeForm form表单数据
     */
    addCategory(typeForm) {
      let pid = 80
      const categoryData = this.typeForm
      if (categoryData.parentId) {
        pid = categoryData.parentId
      }
      this.$refs[typeForm].validate((valid) => {
        if (valid) {
          if (this.title === '编辑分类') {
            category.updateCategory(categoryData.id, categoryData.name, categoryData.identity, pid).then(response => {
              if (response.code === 200) {
                this.dialogVisible = false
                this.$message.success('更新成功')
                this.getCategoryList()
              }
            })
          } else {
            category.addCategory(categoryData.name, categoryData.identity, pid).then(response => {
              if (response.code === 200) {
                this.dialogVisible = false
                this.$message.success('添加成功')
                this.getCategoryList()
              }
            })
          }
          
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
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
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getCategoryList()
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryCategory()
    },
    /**
     * 处理编辑
     * @param row 当前分类
     */
    handleEdit(row) {
      this.dialogVisible = true
      this.title = '编辑分类'
      this.typeForm = row
      if (this.typeForm.parentId === 80) {
        this.typeForm.parentId = null
      }
    },
    /**
     * 取消事件
     */
    handleCancel() {
      this.dialogVisible = false
    },
    /**
     * 处理添加
     */
    handleAdd() {
      this.typeForm = {
        name: '',
        identity: '',
        parentId: null
      }
      this.title = '添加分类'
      this.dialogVisible = true
      // category.getCategoryList(42, null, null).then(response => {
      //   if (response.code === 200) {
      //     // this.$message.success('added successfully')
      //     this.typeDatas = response.data.list
      //   }
      // })
    },
    /**
     * 删除资料分类
     * @param item 资料数据
     */
    deleteItem(item) {
      this.$confirm('确定删除该领域分类吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        this.deleteCategory(item.id)
      })
    },
    handleDrag() {

    },
    selectModuleAdd() {

    },
    handleReset() {
        this.search.keyword=null
        this.queryCategory();
      },
    }
    }
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
</style>