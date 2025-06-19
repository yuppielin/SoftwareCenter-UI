<template>
  <el-card class="custome custome-height">
      <el-form :inline="true">
        <el-col :span="24" style="text-align:right">
          <el-form-item label="段库地址">
            <el-input
              v-model="repo_addr"
              placeholder="请输入段库地址"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchFrag">搜索</el-button>
            <el-button type="reset" size="small" @click="searchAll">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
     
      <el-table
        size="small"
        :data="fragPushData"
        :header-cell-style="{background:'#2BB56E',height:'40px'}"
        :tree-props="{children:'children',hasChildren:'hasChildren'}"
        row-key="id"
        highlight-current-row
        style="width: 100%;"address
        class="custome"
      >
        <el-table-column type="index" width="80" align="center" label="序号"/>
        <el-table-column prop="repo_addr" width="250" align="center" label="段库地址"  />

        <el-table-column prop="repo_addr_name" align="center" label="段库名称"  />
        <el-table-column prop="software_name" align="center" label="软件名称" />
        <el-table-column prop="version" align="center" label="软件版本" />
        <el-table-column prop="time" align="center" label="推送时间" />
        <el-table-column prop="username" align="center" label="推送人" />
        <el-table-column prop="status" align="center" label="推送状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">推送成功</span>
            <span v-else>推送失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="returnStatus" align="center" label="推送结果">
          <template slot-scope="scope">
            {{ showPushStatus(scope.row.returnStatus) }}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin:10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          background layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-count="totalPage"
        />

    </div>
  </el-card>
</template>

<script>
  import * as deployPosture from '@/api/deploy-posture'

  export default {
    components: {
      
    },
    data() {
      return {
        repo_addr:'',
        // 组织列表分页处理
        pageNum:1,
        pageSize:10,
        deptTotal: 0,
        total:0,
        totalPage:1,
        searchName: '', // 检索的段库地址     
        // 组织列表控制
        fragPushData: [],

        dataForm:{
          repo_addr: '',
          repo_addr_name:'',
          software_name:'',
          version: '',
          username: '',
          time: '',
        },
      }
    },
    mounted() {
      this.getFragmentPushRecord();
    },

    methods: {
      reset(){
        this.repo_addr='';
        this.pageNum=1;
        this.pageSize = 10; 
        this.getFragmentPushRecord();
      },

      getFragmentPushRecord(){
        deployPosture.getFragmentPushRecord(this.repo_addr,this.pageNum,this.pageSize).then(response=>{

          if(response.code==200){
            this.fragPushData = response.data.list;
            this.total = response.data.total;
            this.totalPage = response.data.totalPage;
          }
        })  
      },
      //删除
      handleDelete(item){
        console.log("item");
        console.log(item);
        let record_id = item.id;

        this.$confirm('确定删除该段分发记录吗？', '提示', {
          type: 'warning'
        }).then((e) => {
          deployPosture.deleteRecord(record_id).then(response=>{
            if(response.code==200){
                this.$message.success("删除成功！");
                this.repo_addr = "";
                this.getFragmentPushRecord();
            }
          })
        })
        
      },

      // 检索组织
      searchFrag() {
        this.pageNum = 1;
        this.getFragmentPushRecord();
      },
      searchAll(){
        this.repo_addr = "";
        this.pageNum = 1;
        this.getFragmentPushRecord();
      },
      /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
      handleSizeChange(val) {
        this.pageSize = val
        this.pageNum = 1
        this.getFragmentPushRecord()
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getFragmentPushRecord();
      },

      showPushStatus(val){
        let msg = {
          0:'未返回结果',  
          1:'入库失败',  
          2:'已入库成功',
          3:'已存在，请勿重复推送',  
          4:'已更新成功' ,
        }
        return msg[val];
      },
    }
  }
</script>



<style lang='scss' scope>
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

  .el-table__row:not([class*='el-table__row--level-']) {
    td:first-child {
      padding-left: 23px;
    }
  }
</style>
