<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true">
      <el-col :span="12">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="showNewDlg">创建单位</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-form-item label="">
          <el-input v-model="keyword" size="small" style="width:200px;margin-left:10px;" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDevUnit">搜索</el-button>
          <el-button type="reset" size="mini" @click="reset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!--添加用户---->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :title="title" width="35%">
      <el-form ref="unitForm" name="unitForm" :model="unitForm" label-position="top" label-width="100px" >
        <el-form-item label="单位名称：" prop="name" :rules="[{required:true,message:'填写单位名称',trigger:'blur'}]">
          <el-input v-model="unitForm.name" size="small" />
        </el-form-item>
        <el-form-item label="单位简介：" prop="name">
          <el-input v-model="unitForm.description"  type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="addDevUnit" v-if="title=='添加单位'">确定</el-button>
        <el-button size="small" type="primary" @click="saveUnit" v-else>保存</el-button>
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <el-table
      class="custome"
      :data="unitData"
      size="mini"
      :header-cell-style="{background:'#2BB56E',height:'30px'}"
    >
      <el-table-column align="center" width="100" type="index" label="序号" />
      <el-table-column label="单位名称" header-align="center" prop="name"  />
      <el-table-column label="单位简介" header-align="center" prop="description" width="300" show-overflow-tooltip >
        <template slot-scope="{row}">
          <span>{{ row.description ? row.description : '暂无'  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="ctime" width="180" >
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="editInfo(row)">编辑</el-button>
          <el-button v-if="row.name!='admin'" size="mini" type="text" icon="el-icon-delete" @click="deleteItem(row.id)">删除</el-button>
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
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import  * as devunit from "@/api/devunit"
import {parseTime} from "@/utils"
export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false,
      title: '添加单位',
      unitForm: {
        name: '',
        description:''
      },
      pageNum:1,
      pageSize:10,
      total:0,
      totalPage:1,
      keyword:'',
      unitData: [],
      // rules: {
      //   name: [
      //     { required: true, message: '单位名称不能为空', trigger: 'blur' }
      //   ]
      // }
    }
  },
  mounted(){
    this.getDevUnit();
  },
  methods: {
    reset(){
      this.keyword='';
      this.pageNum=1;
      this.pageSize = 10; 
      this.getDevUnit();
    },
    getDevUnit(){
      devunit.getUnit(this.keyword,this.pageNum,this.pageSize).then(response=>{
        if(response.code==200){
          this.unitData=response.data.list;
          this.total=response.data.total;
          this.totalPage=response.data.totalPage;
        }
      })
    },
    addDevUnit(){
      this.$refs.unitForm.validate(valid=>{
        if(valid){
          // let data=JSON.parse(JSON.stringify(this.unitForm));
          let dateTime=  new Date().getTime();
          this.unitForm.ctime=dateTime
          devunit.addUnit(this.unitForm).then(response=>{
            if(response.code==200){
              this.$message.success("添加成功！");
              this.getDevUnit();
              this.dialogVisible=false;
            }
          })
        }
      })
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getDevUnit()
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDevUnit();
    },
    deleteItem(id) {
      this.$confirm('确定删除该单位信息吗？', '提示', {
        type: 'warning'
      }).then((e) => {
         devunit.delUnit(id).then(response=>{
           if(response.code==200){
              this.$message.success("删除成功！");
              this.getDevUnit();
           }
         })
      })
    },
    editInfo(item) {
      this.unitForm = item
      this.dialogVisible = true
      this.title = '编辑单位'
    },
    showNewDlg(){
      this.unitForm={}
      this.title="添加单位"
      this.dialogVisible=true
    },
    saveUnit(){
      devunit.updateUnit(this.unitForm).then(response=>{
        if(response.code==200){
          this.$message.success("更新成功！");
          this.getDevUnit();
          this.dialogVisible = false;
        }
      })
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
