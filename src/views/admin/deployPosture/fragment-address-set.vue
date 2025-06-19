<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true">
      <el-col :span="12">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showNewDlgAdd">添加地址</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-form-item label="">
          <el-input v-model="repo_name" size="small" style="width:200px;margin-left:10px;" placeholder="请输入段库名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="getFragSearch">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <!--添加用户---->
    <el-dialog
      :title="title"
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
        <el-form-item label="段库名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入段库名称 " />
        </el-form-item>
        <el-form-item label="段库地址" prop="address">
          <el-input v-model="dataForm.address" placeholder="请输入段库地址 " />
        </el-form-item>
        
        <el-form-item label="软件下载地址" prop="softwareDownloadAddr">
          <el-input v-model="dataForm.softwareDownloadAddr" placeholder="请输入软件下载地址 " />
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
          <el-row>
          <el-form-item label="所属单位" prop="companyId">
            <treeselect
              v-model="dataForm.companyId"
              :options="deptOptions"
              :disable-branch-nodes="true"
              :normalizer="normalizerCom"
              :show-count="true"
              placeholder="请选择所属单位"
              @select="changeCompany"
            />
        </el-form-item>  
          <el-form-item prop="maintainerId" label="维护人员">
              <treeselect
                v-model="dataForm.maintainerId"
                :normalizer="normalizer"
                noResultsText="暂无数据"
                :multiple="false"
                value-consists-of="ALL_WITH_INDETERMINATE"
                sort-value-by="INDEX"
                :options="serviceList"
                :show-count="true"
                :appendToBody="true"
                :limit="2"
                :limitText="count => `及其它${count}项`"
                z-index="9999"
                placeholder="请选维护人员 "
                clearable
                @select="changeContain"
              ></treeselect>
          </el-form-item>   
           </el-row>       
          <el-form-item label="维护电话" prop="maintainerTel">
            <el-input v-model="dataForm.maintainerTel" placeholder="请输入维护电话 " />
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button v-if="deptOpation" :size="size" type="primary" @click="createNewFrag">确认</el-button>
        <el-button v-else :size="size" type="primary" @click="updateFrag">保存</el-button>
      </span>
    </el-dialog>

    <!-- 表格展示 -->
    <el-table
      class="custome"
      :data="unitData"
      size="small"
      :header-cell-style="{background:'#2BB56E',height:'30px'}"
    >
      <el-table-column align="center" width="80" type="index" label="序号" />
      <el-table-column align="center" label="段库名称" header-align="center" prop="name"  />
      <el-table-column align="center" label="段库地址" header-align="center" prop="address"  />
      <el-table-column align="center" label="所属区域" header-align="center" prop="area"  />
      <el-table-column align="center" label="所属单位" header-align="center" prop="company"  />

      <!-- <el-table-column align="center" label="状态" header-align="center" prop="status"  /> -->

      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" @change="changeUserStatus(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button size="small" type="text" icon="el-icon-edit" @click="editInfo(row)">编辑</el-button>
          <el-button v-if="row.name!='admin'" size="small" type="text" icon="el-icon-delete" @click="deleteItem(row.id)">删除</el-button>
         

        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      style="margin-top:15px;"
      :current-page="pageNum"
      :page-size="pageSize" 
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-count="totalPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </el-card>
</template>
<script>

import * as deployPosture from '@/api/deploy-posture'
import * as user from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import TableTreeColumn from '@/views/components/TableTreeColumn'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import * as organization from '@/api/organization'
import {parseTime} from "@/utils"
export default {
  components: {
    TableTreeColumn,
    Treeselect
  },
  directives: { elDragDialog },
  data() {
    return {
   
      dialogVisible: false,
      deptOpation: true,
      title: '添加单位',
      pageNum:1,
      pageSize:10,
      total:0,
      totalPage:1,
      repo_name:'',
      unitData: [],
      size: 'small',
      
      dataForm:{

        name: '',
        address:'',
        softwareDownloadAddr:'',
        area: '',
        company: null,
        companyId: 1,
        maintainerId: 1,
        maintainer: null,
        maintainerTel:'',
        status:1,
      },
      // 下拉框
      deptOptions: [],
      serviceList: [],
      dataRule: {
        name: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' },
          { pattern: /^[^\s]+(\s+[^\s]+)*$/,message: '组织名称不合法', trigger: 'blur' }
        ]
      },
     

    }
  },
  mounted(){
    this.getFragmentAddress();
    this.getServiceList();
    this.getDeptTree()
  },
  methods: {
    reset(){
      this.repo_name='';
      this.pageNum=1;
      this.pageSize = 10; 
      this.getFragmentAddress();
    },

    getFragmentAddress(){
      console.log(this.pageNum,this.pageSize)
      deployPosture.getFragmentAddress(this.repo_name,null,this.pageNum,this.pageSize).then(response=>{
        if(response.code==200){
          this.unitData=response.data.list;
          this.total=response.data.total;
          this.totalPage=response.data.totalPage;
        }
      }).catch(function(error) {
          console.log(error)
        })
    },

     //获取维护人员
    getServiceList() {
      user.getUserList().then(response => {
        if (response.code === 200) {
          // this.dataForm.maintainerId = response.data.id
          this.serviceList = response.data 
        }
      })
    },
    // 获取部门导航树
    getDeptTree() {
      organization.getOrganization(null, null, null)
        .then(response => {
          if (response.code === 200) {
            // this.deptOptions = response.data.data;
            // this.dataForm.companyId = response.data.id
            this.deptOptions = response.data
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    // 更改用户状态
    changeUserStatus(item){
      deployPosture.updateFrgmentAddress(item)
        .then(response => {
          if (response.code === 200) {
              // this.deptOptions = response.data.data;
              // this.dataForm.companyId = response.data.id
              // console.log(response)
              this.$message.success("修改状态成功！");
              this.getFragmentAddress();
              // this.deptOptions = response.data.list
          }
        }).catch(function(error) {
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
        label: node.realname,
        children: node.children
      }
    },
    normalizerCom(node){
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    //所属单位
    changeCompany(node, instanceId) {
      this.dataForm.company = node.name;
    },
    //所属维修人员
    changeContain(node, instanceId) {
      // console.log(node, instanceId,888);
      this.dataForm.maintainer = node.realname;
    },

    //搜索
    getFragSearch(){
      this.pageNum = 1
      console.log("start search!")
      this.getFragmentAddress();
    },
    // 新增段库地址
    createNewFrag() {
      this.deptOpation = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.status = 1
          deployPosture.addFrgmentAddress(this.dataForm).then(response => {
              if (response.code === 200) {
                this.$message.success('添加成功！')
                this.dialogVisible = false;
                this.cleanDialog();
                this.getFragmentAddress();
              } else {
                // this.dataForm.email = this.dataForm.email.substr(0, this.dataForm.email.lastIndexOf('@'))
                this.$message.error('创建失败!');
              }
            })
            .catch(function(error) {
              console.log(error);
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑段库地址
    updateFrag() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          deployPosture.updateFrgmentAddress(this.dataForm).then(response => {
              if (response.code === 200) {
                this.$message.success('编辑成功！');
                this.dialogVisible = false;
                this.cleanDialog();
                this.getFragmentAddress();
                
              } else {
                // this.dataForm.email = this.dataForm.email.substr(0, this.dataForm.email.lastIndexOf('@'))
                this.$message.error('创建失败!')
              }
            })
            .catch(function(error) {
              console.log(error);
            })
        } else {
          // console.log('error submit!!')
          return false
        }

      })
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getFragmentAddress();
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.getFragmentAddress();
    },


    deleteItem(id) {

      this.$confirm('确定删除该段库信息吗？', '提示', {
        type: 'warning'
      }).then((e) => {
         deployPosture.deleteFragmentAddress(id).then(response=>{
           if(response.code==200){
              this.$message.success("删除成功！");
              this.getFragmentAddress();
           }
         })
      })
    },


    //自编辑  
    editInfo(item) {
      console.log("item")
      console.log(item)
      this.deptOpation = false;
      this.dataForm = item;
      this.dialogVisible = true;
      this.title = '编辑段库';
    },
    //添加地址
    showNewDlgAdd(){
      this.dataForm={};
      this.title="添加段库";
      this.dialogVisible=true;
    },

    //清空表单
    cleanDialog(){
      this.$refs['dataForm'].resetFields();
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
