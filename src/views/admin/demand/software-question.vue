<template>
    <el-card  class="custome">
         <div style="margin-bottom:10px;">
             <el-row :gutter="10">
                 <el-col :span="12">
                    <el-select v-model="search.status" size="small" 
                        style="width:200px;"
                        placeholder="问题状态"
                        filterable remote reserve-keyword >
                        <el-option label="已解决" value="1"></el-option>
                        <el-option label="处理中" value="2"></el-option>
                        <el-option label="未解决" value="3"></el-option>
                    </el-select>
                    <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字"></el-input>
                    <el-button size="small" type="primary" style="margin-left:10px" >搜索</el-button>
                    <el-button size="small" style="background:gray;color:white" >重置</el-button>
                 </el-col>
                 <el-col :span="12" style="text-align:right">
                    <el-button size="small" type="primary" icon="el-icon-upload2" @click="dialogVisible=true">问题导入</el-button>
                    <el-button size="small" type="primary" icon="el-icon-download">问题导出</el-button>
                 </el-col>
             </el-row>
        </div>
        <!--需求导入对话框--->
        <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" title="问题导入" @dragDialog="handleDrag" width="30%">
           <el-card>
               <el-row :gutter="10">
                   <el-col :span="12">
                       <el-button style="background:#05994e;color:white;" size="small">确定</el-button>
                       <el-button style="background:#05994e;color:white;" size="small"  @click="dialogVisible=false">取消</el-button>
                   </el-col>
                   <el-col :span="12" style="text-align:right;">
                       <el-link :underline='false' style="color:blue;margin-right:10px;">问题模板下载</el-link>
                   </el-col>
               </el-row>
           </el-card>
           <el-upload
            class="upload-demo"
            style="margin-top:5px;"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls、xlsx、cvs文件，且不超过500kb</div>
            </el-upload>  
        </el-dialog>
        <el-table :data="demandData" size="mini" style="height:calc(100vh - 238px);overflow-y:auto;"
        :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" >
            <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
            <el-table-column align="center" header-align="center" label="问题标题" prop="title"></el-table-column>
            <el-table-column align="center" header-align="center" label="软件名称（版本）" >
                <template slot-scope="{row}">
                    <span style="color:rgb(8, 151, 151)">
                        {{row.softwareName}}
                    </span>
                     ({{row.softwareVersion}})
                </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="提报人" prop="submiter"></el-table-column>
            <el-table-column align="center" header-align="center" label="提报时间" prop="submitDate"></el-table-column>
            <el-table-column align="center" header-align="center" label="状态">
                <template slot-scope="{row}">
                    <span v-if="row.status==1" style="color:green">已解决</span>
                    <span v-else-if="row.status==2" style="color:orange">解决中</span>
                    <span v-else style="color:red">未解决</span>
                </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="操作" width="240">
                <template slot-scope="{row}">
                    <el-button size="small" style="background:gray;color:white" @click="showInfo(row)">查看问题</el-button>
                    <el-button size="small" style="background:red;color:white" @click="deleteItem(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top:15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination>
    </el-card>
</template>
<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
    directives: { elDragDialog },    
        data(){
            return {
                currentPage:1,
                dialogVisible: false,
                search:{
                    status:'',
                    keyWord:'',
                },
                demandData:[
                    {
                        id:1,
                        title:'软件部署问题',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:1,
                    },
                    {
                        id:2,
                        title:'软件部署问题',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:2,
                    },
                    {
                        id:3,
                        title:'软件部署问题',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:3,
                    }
                ]
            }
        },
        methods:{
            showInfo(item){
                this.$router.push({
                    path:'/admin/demand/question/'+item.id + '/info'
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            handleDrag() {
                this.$refs.select.blur()
            },
            deleteItem(item){
                this.$confirm('确定删除该需求吗？','提示',{
                    type:'warning'
                }).then((e)=>{
                    console.log(e)
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    // .app-container{
       ::v-deep .el-card__body {
            padding: 10px;
            line-height: 30px;
        }
        .el-upload-dragger{
            width: 100%;
        }
    // }
</style>