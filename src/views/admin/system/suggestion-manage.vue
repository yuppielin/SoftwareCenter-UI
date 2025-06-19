<template>
  <el-card class="custome custome-height">
    <!-- 搜索筛选 -->
    <el-form :inline="true">
        <!-- <el-form-item>
          <el-date-picker
            v-model="search.ctime"
            size="small"
            style="margin-left:10px;"
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item> -->
        <el-form-item label="">
          <el-input v-model="search.keyword" size="small" style="width:200px;margin-left:10px;" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="getSuggestion">搜索</el-button>
          <el-button type="reset" size="small" @click="reset">重置</el-button>
        </el-form-item>
      
    </el-form>
   
    <el-table
      class="custome"
      :data="unitData"
      size="mini"
      :header-cell-style="{background:'#2BB56E',height:'30px'}"
    >
      <el-table-column align="center" width="80" type="index" label="序号" />
      <el-table-column label="标题" header-align="center" prop="title"  />
      <el-table-column label="内容" header-align="center" prop="content" width="300" show-overflow-tooltip >
        <template slot-scope="{row}">
          <span>{{ row.content ? row.content : '暂无'  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈状态" align="center" prop="reply"  show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.reply" placement="top">
            <span v-if="row.reply!='' && row.reply!=null" style="color:green">已反馈</span>
            <span v-else style="color:#bbb">未反馈</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="提报人" align="center" prop="cname"  />
      <el-table-column label="提报单位" align="center" prop="deptName"  />
      <el-table-column label="创建时间" align="center" prop="ctime" width="180" >
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button v-if="row.name!='admin'" size="mini" type="primary" title="反馈备注"  circle icon="el-icon-service" @click="replyShow(row)"></el-button>
          <el-button v-if="row.name!='admin'" size="mini" type="danger"  circle icon="el-icon-delete" @click="deleteItem(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:15px;"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[10, 50, 100, 200, 300, 400]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :visible.sync="visibleDlg" width="600px" title="反馈备注" :close-on-click-modal="false">
        <el-form ref="suggestionForm" name="suggestionForm" :model="suggestionForm" label-position="right">
          <el-form-item>
            <el-input type="textarea" :rows="8" placeholder="反馈备注" v-model="suggestionForm.reply"></el-input>
          </el-form-item>
          <el-form-item  style="text-align: center;">
             <el-button size="small" type="primary" @click="reply">确定</el-button>
              <el-button size="small" style="background:orange;color:white;" @click="visibleDlg=false">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
import  * as suggestion from "@/api/system-suggestion"
import {parseTime} from "@/utils"
export default {
  data() {
    return {
      pageNum:1,
      pageSize:10,
      total:0,
      totalPage:1,
      search:{
        keyword:'',
        ctime:''
      },
      visibleDlg: false,
      suggestionForm: {
        id: null,
        reply: '',
      },
      unitData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
    }
  },
  mounted(){
    this.getSuggestion();
  },
  methods: {
    reset(){
      this.search.keyword='';
      this.pageNum=1;
      this.pageSize = 10; 
      this.getSuggestion();
    },
    getSuggestion(){
      suggestion.listSuggestion({title:this.search.keyword, pageNum:this.pageNum, pageSize:this.pageSize}).then(response=>{
        if(response.code==200){
          this.unitData=response.data.list;
          this.total=response.data.total;
          console.log(this.total);
          this.totalPage=response.data.totalPage;
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
      this.getSuggestion()
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getSuggestion();
    },
    deleteItem(id) {
      this.$confirm('确定删除该意见/建议吗？', '提示', {
        type: 'warning'
      }).then((e) => {
         suggestion.delSuggestion(id).then(response=>{
           if(response.code==200){
              this.$message.success("删除成功！");
              this.getSuggestion();
           }
         })
      })
    },
    replyShow(form) {
      this.suggestionForm = form;
      this.visibleDlg = true
    },
    reply() {
      suggestion.reply(this.suggestionForm).then(response => {
          if (response.code === 200) {
            this.$message.success("软件资料更新成功");
            this.visibleDlg = false;
            this.reset();
          }
      });
    }
  }
}
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
    .el-button--small{
      padding: 8px 15px;
    }
</style>
