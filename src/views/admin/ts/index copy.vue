<template>
    <el-card class="custome">
         <div style="margin-bottom:10px;">
             <el-row :gutter="10">
                 <el-col :span="16">
                    <el-select v-model="search.status" size="small" 
                        style="width:200px;"
                        placeholder="技术支持状态"
                        filterable remote reserve-keyword >
                        <el-option label="已解决" value="1"></el-option>
                        <el-option label="处理中" value="2"></el-option>
                        <el-option label="未解决" value="3"></el-option>
                    </el-select>
                    <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字"></el-input>
                    <el-button size="small" type="primary" style="margin-left:10px">搜索</el-button>
                    <el-button size="small" type="info" >重置</el-button>
                 </el-col>
                 <el-col :span="8" style="text-align:right">
                    <!-- <el-button size="small" type="primary" icon="el-icon-upload2" @click="dialogVisible=true">技术支持表单导入</el-button>
                    <el-button size="small" type="primary" icon="el-icon-download">技术支持条目导出</el-button> -->
                    <el-button size="small" v-if="activeName=='first'" type="primary" icon="el-icon-upload2"  @click="tsVisible=true">技术支持提报</el-button>
                    <el-button size="small" v-if="activeName=='second' && $checkPermission(['admin'])"  type="primary" icon="el-icon-download" @click=" uploadDialogVisible=true ">上传技术支持资料</el-button>
                 </el-col>
             </el-row>
        </div>
        <!--技术支持导入对话框--->
        <!-- <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" title="技术支持导入" @dragDialog="handleDrag" width="30%">
           <el-card>
               <el-row :gutter="10">
                   <el-col :span="12">
                       <el-button style="background:#05994e;color:white;" size="small">确定</el-button>
                       <el-button style="background:#05994e;color:white;" size="small"  @click="dialogVisible=false">取消</el-button>
                   </el-col>
                   <el-col :span="12" style="text-align:right;">
                       <el-link :underline='false' style="color:blue;margin-right:10px;">技术支持模板下载</el-link>
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
        </el-dialog> -->
        <el-tabs v-model="activeName">
            <el-tab-pane name="first" label="技术支持表单">
                <el-table :data="demandData" size="mini" 
                    :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" >
                        <el-table-column align="center" header-align="center" width="50" type="selection" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" label="技术支持标题" prop="title"></el-table-column>
                        <el-table-column align="center" header-align="center" label="软件名称（版本）" >
                            <template slot-scope="{row}">
                                <span style="color:rgb(8, 151, 151)">
                                    {{row.softwareName}}
                                </span>
                                ({{row.softwareVersion}})
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="提报人" prop="submiter"></el-table-column>
                        <el-table-column align="center" header-align="center" label="提报单位" prop="submiter"></el-table-column>
                        <el-table-column align="center" header-align="center" label="提报时间" prop="submitDate"></el-table-column>
                        <el-table-column align="center" header-align="center" label="状态">
                            <template slot-scope="{row}">
                                <span v-if="row.status==1" style="color:green">已解决</span>
                                <span v-else-if="row.status==2" style="color:orange">解决中</span>
                                <span v-else style="color:red">未解决</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="操作" width="300">
                            <template slot-scope="{row}">
                                <el-button size="small" type="text" icon="el-icon-view" @click="showInfo(row)">查看处理</el-button>
                                <!-- <el-button size="small" style="background:orange;color:white" @click="delegateForm(row)">任务指派</el-button> -->
                                <el-button size="small" type="text" icon="el-icon-delete" @click="deleteItem(row)">删除</el-button>
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
                   
            </el-tab-pane>
             <!-- <el-tab-pane name="second" label="技术支持任务" >
                <el-table :data="demandData" size="mini" style="height:calc(100vh - 238px);overflow-y:auto;"
                    :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" >
                        <el-table-column align="center" header-align="center" width="50" type="selection" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" width="50" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" label="技术支持标题" prop="title"></el-table-column>
                        <el-table-column align="center" header-align="center" label="软件名称（版本）" >
                            <template slot-scope="{row}">
                                <span style="color:rgb(8, 151, 151)">
                                    {{row.softwareName}}
                                </span>
                                ({{row.softwareVersion}})
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="原始技术支持" prop="title"></el-table-column>
                        <el-table-column align="center" header-align="center" label="技术支持单位" prop="title"></el-table-column>
                        <el-table-column align="center" header-align="center" label="处理单位" prop="title"></el-table-column>
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
                                <el-button size="small" style="background:gray;color:white" @click="showInfo(row)">查看技术支持</el-button>
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
            </el-tab-pane> -->
             <el-tab-pane name="second" label="技术支持资料" >
                <el-table :data="demandData" size="mini" >
                        <el-table-column align="center" header-align="center" width="50" type="selection" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" label="资料名称" prop="title"></el-table-column>
                        <el-table-column align="center" header-align="center" label="软件类型" >
                            <template slot-scope="{row}">
                                <span style="color:rgb(8, 151, 151)">
                                    {{row.softwareName}}
                                </span>
                                ({{row.softwareVersion}})
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="大小" prop="size"></el-table-column>
                        <el-table-column align="center" header-align="center" label="上传人" prop="submiter"></el-table-column>
                        <el-table-column align="center" header-align="center" label="上传单位" prop="submiter"></el-table-column>
                        <el-table-column align="center" header-align="center" label="上传时间" prop="submitDate"></el-table-column>
                       
                        <el-table-column align="center" header-align="center" label="操作" width="240">
                            <template slot-scope="{row}">
                                <el-button size="small" type='text' icon='el-icon-view' @click="showItem(row)">查看</el-button>
                                <el-button size="small" type='text' icon='el-icon-download' @click="showInfo(row)">下载</el-button>
                                <el-button size="small" type='text' icon='el-icon-delete' @click="deleteItem(row)">删除</el-button>
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
            </el-tab-pane>
        </el-tabs>

        <!--上传技术支持资源--->
        <el-dialog v-el-drag-dialog :visible.sync="uploadDialogVisible" title="上传技术支持资料" @dragDialog="handleDrag" width="40%">
            <el-form name="tsForm" ref="tsForm" :model="tsForm" label-position="right" label-width="100px">
                <el-form-item label="资料名称" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                    <el-input v-model="tsForm.name" size="small" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="资料类型" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                    <el-select v-model="tsForm.type" size="small" style="width:80%">
                        <el-option value="1" label="培训材料"></el-option>
                        <el-option value="2" label="故障案例"></el-option>
                        <el-option value="3" label="视频课件"></el-option>
                        <el-option value="4" label="专家答疑"></el-option>
                    </el-select>
                </el-form-item>
                
              
                <!-- <el-form-item label="关联支持" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                    <el-input v-model="tsForm.tsTitle" size="small" style="width:80%">
                        <template slot="append">
                            <el-button size="small">选择</el-button>
                        </template>
                    </el-input>
                </el-form-item> -->
                <el-form-item label="上传资源" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                    <el-upload
                    class="upload-demo"
                    style="margin-top:5px;"
                    drag
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传word/pdf/mp4/avi文件，且不超过500MB</div>
                    </el-upload> 
                </el-form-item>
            </el-form> 
            <span slot="footer">
                <el-button size="small" type="primary">提交</el-button>
                <el-button size="small" type="info" @click="uploadDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>

        <!--提报技术支持--->
        <el-dialog v-el-drag-dialog :visible.sync="tsVisible" title="提报技术支持" @dragDialog="handleDrag" width="50%">
            <el-form name="tsForm" ref="tsForm" :model="tsForm" label-position="right" label-width="100px">
                <el-form-item label="表单标题" :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]">
                    <el-input v-model="tsForm.name" size="small" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="关联软件" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]">
                    <el-select v-model="tsForm.type" size="small" style="width:80%">
                        <el-option value="1" label="培训材料"></el-option>
                        <el-option value="2" label="故障案例"></el-option>
                        <el-option value="3" label="视频课件"></el-option>
                        <el-option value="4" label="专家答疑"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支持类型" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]">
                    <el-select v-model="tsForm.type" size="small" style="width:80%">
                        <el-option value="1" label="培训材料"></el-option>
                        <el-option value="2" label="故障案例"></el-option>
                        <el-option value="3" label="视频课件"></el-option>
                        <el-option value="4" label="专家答疑"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表单内容" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                    <markdown-editor ref="markdownEditor" v-model="tsForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="300px"   />
                </el-form-item>
            </el-form> 
            <span slot="footer">
                <el-button size="small" type="primary">提交</el-button>
                <el-button size="small" type="info" @click="tsVisible=false">取消</el-button>
            </span>
        </el-dialog>

        <!--技术支持资源--->
        <el-dialog v-el-drag-dialog :visible.sync="infoDlgVisible" title="技术支持资料详情" @dragDialog="handleDrag" width="50%">
            <div style="font-size:18px;font-weight:600;">{{infoData.name}}</div>
            <el-row :gutter="20">
                <el-col :span="3">
                    <i class="el-icon-menu subText"></i>
                    <span class="subText"> {{infoData.type}}</span>
                </el-col>
                <el-col :span="3">
                    <i class="el-icon-s-custom subText"></i>
                    <span class="subText"> {{infoData.user}}</span>
                </el-col>
                <el-col :span="3">
                    <i class="el-icon-coin subText"></i>
                    <span class="subText"> {{infoData.size}}</span>
                </el-col>
                <el-col :span="3">
                    <i class="el-icon-medal subText"></i>
                    <span class="subText"> {{infoData.count}}</span>
                </el-col>
                <el-col :span="6">
                    <i class="el-icon-time subText"></i>
                    <span class="subText"> {{infoData.date}}</span>
                </el-col>
                
            </el-row>
            <el-image src="" style="width:100%;height:500px"></el-image>
            <el-row>
                <el-col :span="20">
                    关联技术支持：
                    <el-link :underline="false">{{infoData.title}}</el-link>
                </el-col>
                <el-col :span="4" style="text-align:right;">
                     <el-button size="mini" type="primary">下载</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </el-card>
</template>
<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    import MarkdownEditor from '@/components/MarkdownEditor'
    export default {
    directives: { elDragDialog },  
        components: {
            MarkdownEditor
        },  
        data(){
            return {
                activeName:'first',
                currentPage:1,
                dialogVisible: false,
                uploadDialogVisible: false,
                tsVisible: false,
                infoDlgVisible:false,
                search:{
                    status:'',
                    keyWord:'',
                },
                infoData:{},
                demandData:[
                    {
                        id:1,
                        title:'软件部署技术支持',
                        size: '1M',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:1,
                    },
                    {
                        id:2,
                        title:'软件部署技术支持',
                        size: '1M',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:2,
                    },
                    {
                        id:3,
                        title:'软件部署技术支持',
                        size: '1M',
                        softwareName:'资源支撑软件',
                        softwareVersion:'1.2',
                        submiter:'张珊珊',
                        submitDate:'2021-12-01',
                        status:3,
                    }
                ],
                zpForm:{

                },
                tsForm:{
                    name:'',
                    type:'',
                    tsId:1,
                    tsTitle:'',
                    isFileUpload:1
                },
            }
        },
        methods:{
            showInfo(item){
                this.$router.push({
                    path:'/admin/ts/'+item.id + '/info'
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
                this.$confirm('确定删除该技术支持吗？','提示',{
                    type:'warning'
                }).then((e)=>{
                    console.log(e)
                })
            },
            demandZB(){
                this.$router.push({
                    path:'/admin/demand/zb'
                })
            },
            delegateForm(item){

            },
             showItem(item){
                 this.infoData = {
                     name: "技术支持标题1",
                     type: "培训",
                     user: "李四",
                     size: "1M",
                     count: "3",
                     date: "2023-02-03",
                 }
                this.infoDlgVisible=true;
            },
        }
    }
</script>

<style scoped lang="scss">
    // .app-container{
       ::v-deep .el-card__body {
            padding: 10px;
            line-height: 30px;
        }
       ::v-deep .el-upload-dragger{
            width: 100%;
        }
    // }
</style>