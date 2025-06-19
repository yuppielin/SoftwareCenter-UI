<template>
<div class="app-container">
    <div class="cur-top-admin">
        <img class="icon" src="@/assets/index/tsQuestion.png" />
        <span class="title" >技术服务</span>
    </div>
    <el-card class="custome custome-height">
<!--         <div style="margin-bottom:10px;">-->
<!--             <el-row :gutter="10">-->
<!--                  <el-col :span="8" style="text-align:left;border:1px solid transparent">-->
<!--                    <el-button size="small" v-if="activeName=='first'" type="primary" icon="el-icon-upload2"  @click="handAddTs">技术支持提报</el-button>-->
<!--                    <el-button size="small" v-if="activeName=='second' && $checkPermission(['admin'])"  type="primary" icon="el-icon-upload2" @click="handAdd()">上传技术支持资料</el-button>-->
<!--                 </el-col>-->
<!--                 <el-col :span="16" style="text-align:right">-->
<!--                    <el-select v-model="search.status" size="small"   v-if="activeName=='first'"-->
<!--                        style="width:200px;"-->
<!--                        placeholder="技术支持状态"-->
<!--                        filterable remote reserve-keyword >-->
<!--                        <el-option label="已解决" :value="2"></el-option>-->
<!--                        <el-option label="处理中" :value="1"></el-option>-->
<!--                        <el-option label="未解决" :value="0"></el-option>-->
<!--                    </el-select>-->
<!--                    <el-select v-model="search.type" size="small"   v-else-->
<!--                        style="width:200px;"-->
<!--                        placeholder="支持资料类型"-->
<!--                        filterable remote reserve-keyword >-->
<!--                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in typeData" :key="index"></el-option>-->
<!--                    </el-select>-->
<!--                    <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="请输入技术支持标题"></el-input>-->
<!--                    <el-button size="small" type="primary" style="margin-left:10px" @click="searchSupport">搜索</el-button>-->
<!--                    <el-button size="small" type="info" @click="searchSupportReset">重置</el-button>-->
<!--                 </el-col>-->
<!--                -->
<!--             </el-row>-->
<!--        </div>-->
        <el-tabs v-model="activeName" @tab-click="tabkclick">
            <el-tab-pane name="first" label="技术支持列表">
              <div style="margin-bottom:10px;">
                <el-row :gutter="10">
                  <el-col :span="8" style="text-align:left;border:1px solid transparent">
                    <el-button size="small" v-if="activeName=='first'" type="primary" icon="el-icon-upload2"  @click="handAddTs" style="background: rgba(23,138,227,1);border:0;height:32px">技术支持提报</el-button>
                    <el-button size="small" v-if="activeName=='second' && $checkPermission(['admin','XTUser'])"  type="primary" icon="el-icon-upload2" @click="handAdd()" style="background: rgba(23,138,227,1);border:0;height:32px">上传技术支持资料</el-button>
                  </el-col>
                  <el-col :span="16" style="text-align:right">
                    <el-select v-model="search.status" size="small"   v-if="activeName=='first'"
                               style="width:200px;"
                               placeholder="技术支持状态"
                               filterable remote reserve-keyword >
                      <el-option label="已解决" :value="2"></el-option>
                      <el-option label="处理中" :value="1"></el-option>
                      <el-option label="未解决" :value="0"></el-option>
                    </el-select>
                    <el-select v-model="search.type" size="small"   v-else
                               style="width:200px;"
                               placeholder="支持资料类型"
                               filterable remote reserve-keyword >
                      <el-option :label="item.name" :value="item.id" v-for="(item,index) in typeData" :key="index"></el-option>
                    </el-select>
                    <el-input size="small" v-model="search.keyword" style="width:200px;margin-left:10px;" placeholder="请输入技术支持标题"></el-input>
                    <el-button size="small" type="primary" style="margin-left:10px;background: rgba(23,138,227,1);border:0;height:32px" @click="searchSupport" icon="el-icon-search">查询</el-button>
                    <el-button size="small" type="reset" @click="searchSupportReset">重置</el-button>
                  </el-col>

                </el-row>
              </div>
                <el-table :data="tsQuestionData" size="mini" :header-cell-style="{background:'#2BB56E',height:'30px'}" style="height:calc(100vh - 310px);overflow-y: auto;">
                        <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" header-align="center" label="技术支持标题" prop="title" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" header-align="center" label="软件名称"  show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <div v-if="row.softwareName">
                                    <span style="color:rgb(8, 151, 151);font-size: 15px;">
                                        {{row.softwareName}}
                                    </span>
                                </div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="软件版本" width="100px" show-overflow-tooltip>
                          <template slot-scope="{row}">
                            <div v-if="row.softwareName">
                              <span >
                               {{row.softwareVersion}}
                              </span>
                            </div>
                            <div v-else>-</div>
                          </template>
                      </el-table-column>
                        <el-table-column align="center" label="提报人" width="200px" show-overflow-tooltip prop="cname"></el-table-column>
                        <el-table-column align="center" header-align="center" label="提报单位" prop="devUnit" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" width="180px" label="提报时间" prop="ctime">
                            <template slot-scope="scope">
                                {{scope.row.ctime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center"  label="状态" width="100">
                            <template slot-scope="{row}">
                                <div style="display: flex;align-items: center;justify-content: center;">
                                    <div v-if="row.status==2" class="table-data-status-green">已解决</div>
                                    <div v-else-if="row.status==1" class="table-data-status-yellow">处理中</div>
                                    <div v-else class="table-data-status-grey">未解决</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button size="mini" title="查看处理" type="primary" circle icon="el-icon-view" @click="showInfo(row)"></el-button>
                                <el-button size="mini" title="删除" type="danger" circle icon="el-icon-close" @click="deleteItem(row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top:15px;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
            </el-tab-pane>
             <el-tab-pane name="second" label="技术支持资料" >
               <div style="margin-bottom:10px;">
                 <el-row :gutter="10">
                   <el-col :span="8" style="text-align:left;border:1px solid transparent">
                     <el-button size="small"   type="primary" icon="el-icon-upload2" @click="handAdd()" style="background: rgba(23,138,227,1);border:0;height:32px">技术支持资料上传</el-button>
                   </el-col>
                   <el-col :span="16" style="text-align:right">
                     <el-select v-model="search.status" size="small"   v-if="activeName=='first'"
                                style="width:200px;"
                                placeholder="技术支持状态"
                                filterable remote reserve-keyword >
                       <el-option label="已解决" :value="2"></el-option>
                       <el-option label="处理中" :value="1"></el-option>
                       <el-option label="未解决" :value="0"></el-option>
                     </el-select>
                     <el-select v-model="search.type" size="small"   v-else
                                style="width:200px;"
                                placeholder="支持资料类型"
                                filterable remote reserve-keyword >
                       <el-option :label="item.name" :value="item.id" v-for="(item,index) in typeData" :key="index"></el-option>
                     </el-select>
                     <el-input size="small" v-model="search.keyword" style="width:200px;margin-left:10px;" placeholder="请输入技术支持标题"></el-input>
                     <el-button size="small" type="primary" style="margin-left:10px;background: rgba(23,138,227,1);border:0;height:32px" @click="searchSupport" icon="el-icon-search">查询</el-button>
                     <el-button size="small" type="reset" @click="searchSupportReset">重置</el-button>
                   </el-col>
                 </el-row>
               </div>
                <el-table :data="tsData" size="mini" >
                        <el-table-column align="center" header-align="center" width="55" type="index" label="序号"></el-table-column>
                        <el-table-column align="center"  header-align="center" label="资料名称" prop="name" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" width="100px" label="资料类型" >
                            <template slot-scope="{row}">
                                <span style="color:rgb(8, 151, 151);font-size: 15px;">
                                    {{row.typeName}}
                                </span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column align="center" header-align="center" label="大小" prop="size"></el-table-column> -->
                        <el-table-column align="center" width="200px" label="上传人" prop="cname"></el-table-column>
                        <el-table-column align="center" header-align="center" width="250px" label="上传单位" prop="cunit"></el-table-column>
                        <el-table-column align="center" label="上传时间" prop="ctime">
                            <template slot-scope="scope">
                                {{scope.row.ctime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="审核状态" prop="ctime">
                            <template slot-scope="scope">
                                <span v-if="scope.row.validateStatus==0 || scope.row.validateStatus==null" style="color: #bbb">待审核</span>
                                <span v-else-if="scope.row.validateStatus==1" style="color: green">已审核</span>
                                <span v-else-if="scope.row.validateStatus==2" style="color: red">已驳回</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="操作"  width="180px">
                            <template slot-scope="{row}">
                                <el-button size="mini" title="审核" type="warning" circle icon='el-icon-check'  @click="validate(row)"></el-button>
                                <el-button size="mini" title="查看" type="primary" circle icon='el-icon-view'  @click="showItem(row)"></el-button>
                                <el-button size="mini" title="编辑" type="primary" circle icon='el-icon-edit'  @click="editItem(row)"></el-button>
                                <el-button size="mini" title="下载" type="primary" circle icon='el-icon-download' @click="downloadData(row)"></el-button>
                                <el-button size="mini" title="删除" type="danger" circle icon='el-icon-close' @click="delData(row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top:15px;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20, 30]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalData">
                    </el-pagination>
                    <!-- <el-pagination style="margin-top:15px;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[5, 10, 20]"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination> -->
            </el-tab-pane>
        </el-tabs>

        <!--上传技术支持资源--->
        <el-dialog v-el-drag-dialog :visible.sync="uploadDialogVisible" title="上传技术支持资料" @dragDialog="handleDrag" width="600px">
            <el-form name="tsForm"  ref="tsForm" :model="tsForm" label-position="right" label-width="100px">
                 <el-form-item label="资料上传" :rules="[{required:true,message:'请上传资料',trigger:'blur'}]">
                    <!-- <el-input v-model="tsForm.name" size="small" style="width:calc(100% - 180px)"></el-input> -->
                    <el-upload
                    class="upload-demo"
                    style="margin-top:5px;margin-left:6px;display: inline-block;text-align:left"
                    ref="tsDataUpload"
                    action="#"
                    accept=".mp4 , .pdf, .docx,.jpg"
                    :show-file-list="false"
                    :multiple="false"
                    :http-request="
                        (file) => {
                        return uploadFile(file)
                        }"
                    >
                        <el-button size="small" type="primary">上传</el-button>
                        只能上传.docx/.pdf/.mp4/.jpg文件
                    </el-upload>

                </el-form-item>
                <el-form-item  label="资料名称" prop="name" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                    <el-input v-model="tsForm.name" size="small" style="width:80%"></el-input>

                    <!-- <el-upload
                    class="upload-demo"
                    style="margin-top:5px;margin-left:6px;display: inline-block;"
                    ref="tsDataUpload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    accept=".mp4 , .pdf, .docx,.jpg"
                    :show-file-list="false"
                    :http-request="
                        (file) => {
                        return uploadFile(file)
                        }"
                    >
                    <el-button size="small" type="primary">上传</el-button>
                    </el-upload>  -->
                </el-form-item>
                <el-form-item label="资料类型"  prop="typeId"  :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                    <el-select v-model="tsForm.typeId" size="small" style="width:80%">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in typeData" :key="index"></el-option>
                    </el-select>
                </el-form-item>

               
                <!-- <el-form-item label="关联支持" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                    <el-input v-model="tsForm.tsTitle" size="small" style="width:80%">
                        <template slot="append">
                            <el-button size="small">选择</el-button>
                        </template>
                    </el-input>
                </el-form-item> -->
                <!-- <el-form-item label="上传资源" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                    <el-upload
                    class="upload-demo"
                    style="margin-top:5px;"
                    ref="tsDataUpload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    accept=".mp4 , .pdf, .docx,.jpg"
                    multiple
                    :http-request="
                        (file) => {
                        return uploadFile(file)
                        }"
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传.docx/.pdf/.mp4/.jpg文件，且不超过500MB</div>
                    </el-upload>
                </el-form-item> -->
            </el-form>
            <span slot="footer">
                <el-button size="small" type="primary" @click="addTsData('tsForm')">提交</el-button>
                <el-button size="small" type="info" @click="uploadDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>

        <!--提报技术支持--->
        <el-dialog v-el-drag-dialog :visible.sync="tsVisible" title="提报技术支持" @dragDialog="handleDrag" width="700px">
            <el-form name="tsFormSupport" ref="tsFormSupport" :model="tsFormSupport" label-position="top" label-width="100px">
                <el-form-item label="技术支持标题" :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]" prop="title">
                    <el-input v-model="tsFormSupport.title" size="small" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item name="tsFormSupport" label="关联软件" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]" prop="softwareId">
                    <el-select v-model="tsFormSupport.softwareId" filterable placeholder ="请选择关联的软件" style="width:100%" @change="selectSoftwareChange">
                        <el-option
                        v-for="item in softwareList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item name="tsFormSupport" :rules="[{required:true,message:'请选择软件版本',trigger:'change'}]" label="关联版本" prop="softwareVersionId">
                    <el-select v-model="tsFormSupport.softwareVersionId" filterable placeholder ="请选择软件的版本" style="width:100%">
                        <el-option
                        v-for="item in softwareVersionList"
                        :key="item.value"
                        :label="item.version"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题内容" prop="content" :rules="[{required:true,message:'请选填写问题内容',trigger:'blur'}]">
                    <!-- <markdown-editor ref="markdownEditor" v-model="tsFormSupport.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="300px"  /> -->

                    <el-input
                        type="textarea"
                        v-model="tsFormSupport.content"
                        show-word-limit
                        maxlength="200"
                        :rows="5"
                        ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" type="primary" @click="submitSupport">提交</el-button>
                <el-button size="small" type="info" @click="tsVisible=false">取消</el-button>
            </span>
        </el-dialog>

        <!--技术支持资源--->
        <el-dialog
            v-el-drag-dialog :visible.sync="infoDlgVisible"
            title="技术支持资料详情"
            @close="handleClose"
            width="800px"
            >
            <div style="font-size:18px;font-weight:600;">{{infoData.name}}</div>
            <el-row :gutter="20">
                <el-col :span="4">
                    <i class="el-icon-menu subText"></i>
                    <span class="subText"> {{infoData.type}}</span>
                </el-col>
                <el-col :span="4">
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

            <!-- <div ref="preview" id="preview" :src="previewfile" style="height:500px;overflow-y:auto"></div> -->
            <div v-if="decide==1" ref="preview" id="preview"  class="pdfPriview" v-loading="loading" element-loading-text="加载中，请耐心等待" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,0.8)" style="height:500px;overflow-y:auto">
            </div>
            <el-image v-else-if="decide==4" :src="this.srcUrl" style="width:100%;height:500px"></el-image>
            <div v-else-if="decide==3" src="" ref="previewothers" id="previewothers"  class="pdfPriviewothers" style="height:500px;text-align:center;line-height:500px;background:#aebfcf">
                不支持此类型文件预览
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
            <el-row v-show="infoData.tsName!=null">
                <el-col :span="20">
                    关联技术支持：
                    <el-button  @click="goToInfo(infoData)" style="color:#3b5975" type="text"> {{infoData.tsName}}</el-button>
                    <!-- <el-link :underline="false" href:>{{infoData.tsName!=null?infoData.tsName:'无关联技术支持'}}</el-link> -->
                </el-col>
                <!-- <el-col :span="4" style="text-align:right;">
                     <el-button size="mini" type="primary"@click="downloadData(infoData)">下载</el-button>
                </el-col> -->
            </el-row>
        </el-dialog>
    </el-card>
</div>
</template>
<script>
    import * as software from '@/api/software'
    import Treeselect from '@riophae/vue-treeselect'
    import elDragDialog from '@/directive/el-drag-dialog'
    import MarkdownEditor from '@/components/MarkdownEditor'
    import * as category from '@/api/category'
    import * as ts from '@/api/ts'
    import {parseTime} from "@/utils"
    import axios from "axios"
    import XLSX from 'xlsx'
    // const pdfJS = require("pdfjs-dist")
    // pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry")
    let docx = require("docx-preview")
    window.JSZip = require("jszip")
    // import pdf from 'vue-pdf'
    // import Worker from "./file.worker.js"
    export default {
    directives: { elDragDialog },
        components: {
            MarkdownEditor
        },
        data(){
            return {

                // url:"http://image.cache.timepack.cn/nodejs.pdf",
                // numPages: null, // pdf 总页数
                // pdfUrl:'http://192.168.91.52:8089/appstore/upload/ts/1683529301107_2023-05-08-14-59-25.mp4',
                previewUrl:'',
                numPages:null,
                srcUrl:'',
                loading:false,
                decide:0,
                previewfile:'',
                devUnitList: [],
                activeName:'first',
                currentPage:1,
                dialogVisible: false,
                uploadDialogVisible: false,
                tsVisible: false,
                infoDlgVisible:false,
                search:{
                    type:'',
                    status:'',
                    keyword:'',
                },
                infoData:{},
                // tsData:[
                //     {
                //         id:1,
                //         title:'软件部署技术支持',
                //         size: '1M',
                //         softwareName:'资源支撑软件',
                //         softwareVersion:'1.2',
                //         submiter:'张珊珊',
                //         submitDate:'2021-12-01',
                //         status:1,
                //     },
                // ],
                tsQuestionData:[],
                tsData:[],
                zpForm:{

                },
                tsForm:{
                    name:'',
                    type:'',
                    typeId:'',
                    // tsTitle:'',
                    // isFileUpload:1,
                },
                tsFormSupport:{
                    cid:'',
                    title: "",
                    content: "",
                    softwareId:'',
                    softwareName:'',
                    softwareVersionId: '',
                    softwareVersion: '',
                    devUnit:"",
                    status:0,
                },
                fileData: {},
                fileData1: {},
                typeData:[],
                pageNum:1,
                pageSize:10,
                totalData:0,
                totalPageData:0,
                total:0,
                totalPage:0,
                softwareList:[],
                softwareVersionList:[],
                userInfo:{},
            }
        },
        mounted(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.getCategoryList();
            // this.getTsQuestionList();
            this.getAllSoftware();
            // this.getTsData();
            this.tabkclick()
        },
        methods:{
            //点击关联技术支持，跳转至该技术支持查看详情页
            goToInfo(infoData){
                console.log(infoData, 'infoData============')
                this.$router.push({
                    path:"/admin/ts/"+infoData.tsId+"/info?tsQuestionId="+infoData.tsId
                })
            },
            //计算pdf页码总数
            getNumPages() {
                let loadingTask = pdf.createLoadingTask(this.url)
                loadingTask.promise.then(pdf => {
                    this.numPages = pdf.numPages
                }).catch(err => {
                    console.error('pdf 加载失败', err);
                })
            },
            //添加技术支持资料
            addTsData(tsForm){
                this.$refs[tsForm].validate((valid) => {
                    if (valid) {
                        if(this.fileData1.size>0){
                            let typeName = null
                            this.fileData = new FormData()
                            this.$refs.tsDataUpload.submit()
                            if (this.tsForm.typeId) {
                                typeName = this.typeData.find(item=>item.id === this.tsForm.typeId).name;
                            }
                            // const data = {
                            //     name: this.tsForm.name,
                            //     typeId: this.tsForm.typeId,
                            //     typeName: typeName,
                            //     cid:this.userInfo.id
                            // }
                            this.fileData.append('name',this.tsForm.name)
                            this.fileData.append('typeId',this.tsForm.typeId)
                            this.fileData.append('typeName',typeName)
                            this.fileData.append('cid',this.userInfo.userId)
                            this.fileData.append('file',this.fileData1)
                            console.log(this.tsForm.path)
                            // this.fileData.append('tsData', JSON.stringify(data))
                            if(this.tsForm.id!=null&& this.tsForm.id!='') {
                                this.fileData.append('id',this.tsForm.id)
                                ts.editTsData(this.fileData).then(response => {
                                    if (response.code === 200) {
                                        this.uploadDialogVisible = false
                                        this.$message.success('修改成功')
                                        this.getTsData()
                                        this.$refs.tsDataUpload.clearFiles()
                                    }
                                })
                            }else {
                                ts.addTsData(this.fileData).then(response => {
                                    if (response.code === 200) {
                                        this.uploadDialogVisible = false
                                        this.$message.success('添加成功')
                                        this.getTsData()
                                        this.$refs.tsDataUpload.clearFiles()
                                    }
                                })
                            }
                        }else{
                            this.$message.warning("请上传资料。")
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            async uploadFile(param) {
                console.log("file");
                console.log(param);
                this.fileData1 = param.file;
                this.tsForm.name = param.file.name;
                

            },
            //删除技术支持资料
            delData(row){
                this.$confirm('确定删除该技术支持资料吗？','提示',{
                    type:'warning'
                }).then(async (e)=>{
                    await ts.delData(row.id).then(res=>{
                        if(res.code==200){
                            this.$message.success("删除成功！");
                            this.getTsData();
                        }   
                    })
                   
                })
            },
            //下载技术支持资料
            downloadData(row){
                console.log(row)
                this.$download.dowanlodByPathHerf(row.path, row.name)
                // const blob = await ts.downloadData(row.id)
                // if(blob.size<=0) {
                //     this.$message.error("该文件不存在");
                //     return false;
                // }
                // let fileName = row.name + row.path.substring(row.path.lastIndexOf("."))
                // const url = window.URL.createObjectURL(new Blob([blob]));
                // const a = document.createElement("a");
                // a.setAttribute("download", fileName);
                // a.setAttribute("target", "_blank");
                // a.setAttribute("href", url);
                // a.click();
            },
            //获取技术支持资料
            getTsData(){
                ts.getTsData(null,this.search.keyword,this.search.type,this.currentPage,this.pageSize).then(response =>{
                    if(response.code === 200){
                        this.tsData=response.data.list;
                        this.totalData=response.data.total;
                        this.totalPageData=response.data.totalPage;
                    }
                })
            },
            //获取所有软件
            getAllSoftware(){
                ts.getAllSoftware().then(response =>{
                    if(response.code === 200){
                        this.softwareList = response.data
                    }
                })
            },
            getSoftwareVersionById() {
                ts.getSoftwareVersion(this.tsFormSupport.softwareId).then(response =>{
                    if(response.code === 200){
                        this.softwareVersionList = response.data
                    }
                })
            },
            //技术支持搜索
            searchSupport(){
                if(this.activeName=='first'){
                    // let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    // ts.getTsQuestion(userInfo.userId,this.search.keyword,this.search.status,1,10).then(response=>{
                    //     this.tsQuestionData=response.data.list;
                    //     this.total=response.data.total;
                    //     this.totalPage=response.data.totalPage;
                    // })
                    this.getTsQuestionList();
                }else{
                    // let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    // ts.getTsData(userInfo.userId,this.search.keyword,this.search.typeId,1,10).then(response=>{
                    //     console.log(this.search)
                    //     this.tsData=response.data.list;
                    //     this.totalData=response.data.total;
                    //     this.totalPageData=response.data.totalPage;
                    // })
                    this.getTsData();
                }
                // let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                // ts.getTsQuestion(userInfo.userId,this.search.keyword,this.search.status,1,10).then(response=>{
                //     this.tsQuestionData=response.data.list;
                //     this.total=response.data.total;
                //     this.totalPage=response.data.totalPage;
                // })
            },
            //技术支持资料搜索
            searchData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                ts.getTsData(userInfo.userId,this.search.keyword,this.search.type,1,10).then(response=>{
                    this.tsData=response.data.list;
                    this.totalData=response.data.total;
                    this.totalPageData=response.data.totalPage;
                })
            },
            //技术支持搜索重置
            searchSupportReset(){
                this.search.keyword=''
                this.search.status=''
                this.search.type=''
                this.currentPage = 1;
                this.searchSupport()
            },
            //选择关联软件版本
            selectSoftwareChange(){
                this.getSoftwareVersionById();
            },
            // handleVersionChange(item) {
            //     item.versions.forEach(i => {
            //         if (i.version === item.version) {
            //         item.uname = i.uname
            //         item.ctime = i.ctime
            //         item.ifBackup = !!i.backup
            //         }
            //     })
            // },
            //软件研制单位
            getSoftwareDevUnitList() {
                software.getSoftwareDevUnit().then(response => {
                    if (response.code === 200) {
                    this.devUnitList = response.data
                }
            })
            },
            //提交技术支持
            async submitSupport(){
                this.$refs.tsFormSupport.validate(async (valid) => {
                    if(valid){
                        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                        this.tsFormSupport.cid = userInfo.userId;
                        for(let i = 0 ; i < this.softwareList.length ; i++) {
                            if(this.tsFormSupport.softwareId ==  this.softwareList[i].id) {
                                this.tsFormSupport.softwareName = this.softwareList[i].name
                            }
                        }
                        for(let i = 0 ; i < this.softwareVersionList.length ; i++) {
                            if(this.tsFormSupport.softwareVersionId ==  this.softwareVersionList[i].id) {
                                this.tsFormSupport.softwareVersion = this.softwareVersionList[i].version
                            }
                        }
                        let res = await ts.addTsQuestion(this.tsFormSupport)
                        this.getCategoryList();
                        this.getTsQuestionList();
                        this.tsVisible=false
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })

                // ts.addTsQuestion(JSON.stringify(params)).then(response=>{
                //     if(response.code ===200){
                //         this.getCategoryList();
                //         this.getTsQuestionList();
                //     }
                // })
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
            //获取技术支持问题
            getTsQuestionList(){
                ts.getTsQuestion(null,this.search.keyword,this.search.status,this.currentPage,this.pageSize).then(response=>{
                    if(response.code==200){
                        this.tsQuestionData=response.data.list;
                        this.total=response.data.total;
                        this.totalPage=response.data.totalPage;
                    }
                })
            },
            showInfo(item){
                this.$router.push({
                    path:'/admin/ts/'+item.id + '/info',
                    query:{
                        tsQuestionId:item.id
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.getTsQuestionList()
                this.getTsData()

                // this.queryInfo.pageSize=val
                // this.getDataList()
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val
                 this.getTsQuestionList()
                 this.getTsData()
                // this.queryInfo.pageNum=val
                // this.getDataList
                // console.log(`当前页: ${val}`);
            },
            async getDataList(){
                const {data:res} = await this.$http.get
            },
            handleClose(){
                this.$refs.form.resetFields();
            },
            handleDrag() {
                // this.$refs.select.blur()
            },
            deleteItem(item){
                this.$confirm('确定删除该技术支持吗？','提示',{
                    type:'warning'
                }).then((e)=>{
                    ts.delTsQuestion(item.id).then(response=>{
                        if(response.code=200){
                            this.$message.success("删除成功！")
                            // this.getCategoryList();
                            this.getTsQuestionList();
                        }
                    })
                   
                })
            },
            demandZB(){
                this.$router.push({
                    path:'/admin/demand/zb'
                })
            },
            delegateForm(item){

            },
            // showItem(item){
            //     console.log(item)
            //     this.infoData = {
            //         name: item.name,
            //         type: item.typeName,
            //         user: item.cname,
            //         size: "1M",
            //         count: "3",
            //         date: item.ctime,
            //     }
            //     let type = item.path.substr(item.path.lastIndexOf('.'),item.path.length)
            //     console.log("pathpath",item.url)
            //     console.log(type)
            //     switch(type){
            //         case '.docx':
            //             this.docPreview(item.id)
            //             break;
            //         case '.doc':
            //             this.docPreview(item.id)
            //             break;
            //         case '.pdf':
            //             this.pdfPreview(item.url)
            //             break;
            //         case '.xlsx':
            //             this.xlsxPreview(item.id)
            //             break;
            //     }
            //     this.infoDlgVisible=true;
            // },
            // async docPreview(id) {
            //     const blob = await ts.downloadData(id)
            //     docx.renderAsync(blob, this.$refs.preview);

            // },
            showItem(item){
                console.log(item)
                this.infoData = {
                    name: item.name,
                    type: item.typeName,
                    user: item.cname,
                    size: "1M",
                    count: "3",
                    date: item.ctime,
                    tsName:item.tsName,
                    id:item.id,
                    tsId:item.tsId,
                    tsAnswerId:item.tsAnswerId,
                }

                let type = item.path.substr(item.path.lastIndexOf('.'),item.path.length)
                console.log("pathpath",item.url)
                console.log(type)
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
                    // case '.xlsx':
                    //     this.xlsxPreview(item.id)
                    //     break;
                    case '.pdf':
                        this.previewUrl = config.url+"/appstore/"+item.path
                        this.decide=2
                        break;
                    case '.mp4':
                        this.previewUrl = config.url+"/appstore/"+item.path
                        this.decide=2
                    break;
                    case '.jpg':
                        // this.loading=true
                        // this.jpgPreview(item.id)
                        this.srcUrl = config.url+"/appstore/"+item.path
                        console.log(this.srcUrl)
                        this.decide=4
                    break;
                    default:
                        this.decide=3
                    break;
                }

                // this.previewUrl = "http://192.168.91.52:8089/appstore/"+item.path
                console.log(this.previewUrl)
                this.infoDlgVisible=true;
            },
            async docPreview(id) {
                const blob = await ts.downloadData(id)
                docx.renderAsync(blob, this.$refs.preview);
                this.loading=false
            },
            async jpgPreview(id) {
                const blob = await ts.downloadData(id)
                const imageHref = URL.createObjectURL(blob)
                preloadingImg.value = imageHref
                this.loading=false
            },
            xlsxPreview(id){
                // if(typeof require !== 'undefined') XLSX =require('xlsx')
                const xhr = new XMLHttpRequest()
                xhr.open('get','http://192.168.91.52:8089/appstore/ts-data/download?id=' + id,true)
                xhr.responseType = 'arraybuffer'
                xhr.onload = function(){
                    if(xhr.status == 200){
                        debugger
                        let data = new Uint8Array(xhr.response)
                        let workbook = XLSX.read(data,{type:'buffer'})
                        let sheetName = workbook.SheetNames
                        let innerHTML = ''
                        for (let i in sheetName){
                            let sheet = workbook.Sheets[sheetName[i]]
                            innerHTML += XLSX.utils.sheet_to_html(sheet)
                        }
                        _self.$nextTick(()=>{
                            document.querySelector('#preview').innerHTML = innerHTML
                        })
                    }
                }
                xhr.send()

            },


            async pdfPreview(url) {
                // const blob = await ts.downloadData(id)
                // let blobUrl = URL.createObjectURL(blob)
                // console.log("=======================",url)
                // this.pdfUrl = url
            },

            handAdd() {
                this.uploadDialogVisible=true
                this.resetForm('tsForm')
                this.$nextTick(()=>{
                    this.$refs['tsDataUpload'].clearFiles()
                })
            },
            handAddTs() {
                this.tsVisible=true;
                this.resetForm('tsFormSupport')
            },
            editItem(item) {
                this.uploadDialogVisible=true;
                // console.log(item, 999);
                this.$nextTick(()=>{
                    this.$refs.tsDataUpload.clearFiles()
                })
                this.tsForm =  Object.assign({}, item);
            },
            tabkclick() {
               // 初始化分页
               this.currentPage = 1;
               if(this.activeName=="first") {
                    this.getTsQuestionList();
               }else{
                    this.getTsData();
               }
            },
            validate(item) {
                this.$confirm('确定审核发布吗？','提示',{
                    type:'warning'
                }).then((e)=>{
                    ts.validate({id:item.id, validateStatus:1}).then(response=>{
                        if(response.code=200){
                            this.$message.success(response.msg)
                            this.getTsData();
                        }else{
                            this.$message.error(response.msg)
                        }
                    })
                   
                })
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
            max-width: 622.84px;
        }
        .el-form-item {
            margin-bottom: 6px;
        }
    // }
</style>
