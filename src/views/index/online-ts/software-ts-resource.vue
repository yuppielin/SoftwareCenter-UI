<template>
    <div>
         <div style="margin-bottom:10px;">
             <el-row :gutter="10">
                 <el-col :span="12">
                    <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="请输入资料名称"></el-input>
                    <el-button size="small" type="primary" style="margin-left:10px" @click="searchData">搜索</el-button>
                    <el-button size="small" style="background:gray;color:white" @click="searchDataReset">重置</el-button>
                 </el-col>
                 <!-- <el-col :span="12" style="text-align:right">
                    <el-button size="small" type="primary" icon="el-icon-upload2" @click="dialogVisible=true">上传技术支持资料</el-button>
                 </el-col> -->
             </el-row>
        </div>
       
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
                <!-- <el-col :span="3">
                    <i class="el-icon-coin subText"></i>
                    <span class="subText"> {{infoData.size}}</span>
                </el-col>
                <el-col :span="3">
                    <i class="el-icon-medal subText"></i>
                    <span class="subText"> {{infoData.count}}</span>
                </el-col> -->
                <el-col :span="6">
                    <i class="el-icon-time subText"></i>
                    <span class="subText"> {{infoData.date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </el-col>
                
            </el-row>
            <!-- <el-image src="" style="width:100%;height:500px"></el-image> -->
            <!-- <div ref="preview" id="preview" style="height:500px;overflow-y:auto"></div> -->
            <div v-if="decide==1" ref="preview" id="preview"  class="pdfPriview" v-loading="loading" element-loading-text="加载中，请耐心等待" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)" style="height:500px;overflow-y:auto">
            </div>
            <iframe
                :src="previewUrl"
                v-else-if="decide==2"
                type="application/x-google-chrome-pdf"
                width="100%"
                frameborder="0"
                scrolling="auto"
                height="500px"
                />
            <el-row>
                <!-- <el-col :span="20">
                    关联技术支持：
                    <el-link :underline="false">{{infoData.title}}</el-link>
                </el-col> -->
                <!-- <el-col :span="4" style="text-align:right;">
                     <el-button size="mini" type="primary">下载</el-button>
                </el-col> -->
            </el-row>
        </el-dialog>
        <el-row :gutter="10">
            <!-- <el-col :span="4" v-for="(item,index) in resData" :key="index"> -->
                <el-col :span="4" v-for="(item,index) in tsData" :key="index">
                <el-card style="text-align:center;padding:10px;margin:10px;" class="srcItem" >
                    <el-image :src="fileIcon(item.path)" style="width:100px;height:75px;"></el-image>
                    <div style="text-align:left;">
                        <div class="resTitle">名称：<span>{{item.name}}</span></div>
                        <div class="resTitle">类型：<span>{{item.typeName}}</span></div>
                        <!-- <div class="resTitle">大小: <span>{{item.size}}</span></div> -->
                    </div>
                    <div class="srcBtn"> 
                        <el-button type="text" icon="el-icon-video-play" title="播放" @click="showItem(item)"></el-button>
                        <el-button type="text" icon="el-icon-download" title="下载" @click="downloadData(item)"></el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

                                                                                                                                        
        <el-pagination style="margin-top:15px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[12, 50, 100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import * as category from '@/api/category'
    import * as ts from '@/api/ts'
    import elDragDialog from '@/directive/el-drag-dialog'
    let docx = require("docx-preview")
    window.JSZip = require("jszip")
    export default {
    directives: { elDragDialog },    
        data(){
            return {
                currentPage: 1,
                pageSize: 12,
                total: 0,

                previewUrl:'',
                numPages:null,
                activeName:'first',
                dialogVisible: false,
                uploadDialogVisible: false,
                tsVisible: false,
                infoDlgVisible:false,
                typeData:[],
                search:{
                    typeId:'',
                    status:'',
                    keyword:'',
                },
                infoData:{},
                tsData:[
                   
                ],
                totalData:0,
                totalPageData:0,
                zpForm:{

                },
                tsForm:{
                    name:'',
                    type:'',
                    tsId:1,
                    tsTitle:''
                },
                decide:0
            }
        },
        // computed:{

        // },
        mounted(){
            // this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.getCategoryList();
            this.getTsData();
        },
        methods:{
            showItem(item){
                console.log(item)
                this.infoData = {
                    name: item.name,
                    type: item.typeName,
                    user: item.cname,
                    size: "1M",
                    count: "3",
                    date: item.ctime,
                }

                let type = item.path.substr(item.path.lastIndexOf('.'),item.path.length)
                console.log("pathpath",item.url)
                console.log(type)
                switch(type){
                    case '.docx':
                        this.loading=true
                        this.docPreview(item.id)
                        this.decide=1
                        break;
                    // case '.doc':
                    //     this.docPreview(item.id)
                    //     break;
                    // case '.pdf':
                    //     this.pdfPreview(item.url)
                    //     break;
                    case '.xlsx':
                        this.xlsxPreview(item.id)
                        break;
                    default:
                        this.previewUrl = config.url+"/appstore/"+item.path
                         this.decide=2
                        break;
                }

                // this.previewUrl = "http://192.168.91.52:8089/appstore/"+item.path
                console.log(this.previewUrl)
                this.infoDlgVisible=true;
            },
            async docPreview(id) {
                const blob = await ts.downloadData(id)
                if(blob.size==0) {
                    this.$message.error("文件不存在");
                    return false;
                }
                docx.renderAsync(blob, this.$refs.preview); 
                this.loading=false
            },
            async downloadData(row){
                const blob = await ts.downloadData(row.id)
                if(blob.size==0) {
                    this.$message.error("文件不存在");
                    return false;
                }
                let fileName = row.name
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement("a");
                a.setAttribute("download", fileName);
                a.setAttribute("target", "_blank");
                // a.download = "shili.rar"
                a.setAttribute("href", url);
                a.click();
            },
            /**
             * 获取分类列表
             */
            getCategoryList() {
            category.getCategoryList("data_type").then(response => {
                if (response.code === 200) {
                    // debugger
                    this.typeData = response.data.list
                }
            })
            },
            //获取技术支持资料
            getTsData(){
                ts.getTsData(null,this.search.keyword,this.search.search,this.currentPage,this.pageSize,1).then(response =>{
                    if(response.code === 200){
                        this.tsData=response.data.list;
                        // this.totalPage=response.data.totalPage;
                        this.total=response.data.total;
                        // console.log(this.tsData)
                    }
                })
            },
            //技术支持资料搜索
            searchData(){
                // let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                // ts.getTsData(userInfo.userId,this.search.keyword,this.search.type,1,this.pageSize).then(response=>{
                //     this.tsData=response.data.list;
                //     this.total=response.data.total;
                // })
                this.getTsData();
            },
            //技术支持搜索重置
            searchDataReset(){
                this.search.keyword=''
                this.search.status=''
                this.search.typeId=''
                this.currentPage = 1;
                this.searchData()
            },
           
            // showItem(item){
            //     this.infoData=JSON.parse(JSON.stringify(item));
            //     this.infoDlgVisible=true;
            // },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getTsData()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.currentPage = val
                this.getTsData()
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
                // this.$router.push({
                //     path:'/admin/demand/zb'
                // })
            },
            delegateForm(item){

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
       ::v-deep .el-upload-dragger{
            width: 100%;
        }
    // }
     ::v-deep .el-upload{
        width:80%
    }
    .resTitle{
        font-size: 14px;
        font-weight: 600;
        padding: 0 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        height: 30px;
        span{
            font-size: 14px;
            color: gray;
        }
    }
    .srcBtn{
        float:right;
        position:relative;
        bottom: 5px;
        right: 5px;
        height: 30px;
        font-size: 20px;
    }
    .srcItem:hover{
        -webkit-box-shadow: 0 2px 12px 0 blue;
        box-shadow: 0 2px 12px 0 blue;
    }
    .el-dialog__body{
        padding: 10px 20px;
    }
    .subText{
        font-size:10px;
        color:#9499A0
    }
</style>