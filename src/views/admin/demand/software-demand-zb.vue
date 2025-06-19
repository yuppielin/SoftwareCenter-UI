<template>
    <el-card style="margin:15px 20px 20px 20px;height:calc(100vh - 110px)">
        <div slot="header">
            <el-row style="margin:10px;">
                <el-col :span="12">
                    <h3>需求整编</h3>
                </el-col>
                <el-col :span="12" style="text-align:right;margin-top:10px;">
                    <el-button  size="mini"  onclick="history.go(-1)" icon="el-icon-back">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-row type="flex">
                    <el-col :span="12">
                        <h2>原始需求</h2>
                    </el-col>
                    <el-col :span="12" style="display: flex;align-items: center;justify-content: center;">
                        <el-input v-model="keyword" style="width: 200px;" size="small"></el-input>
                        <el-button icon="el-icon-search" style="margin-left: 10px;" size="small" type="primary" @click="getDemandQuery">搜索</el-button>
                        <el-button size="small" style="margin-left: 10px;margin-right: 10px;" type="info" @click="resetSearch">重置</el-button>
                    </el-col>
                </el-row>
                <div  style="max-height:calc(100vh - 260px);overflow-y:auto;">
                <p v-if="srcData != null && srcData.length==0" style="text-align:center;color:#bbb">暂无数据！</p>
                <el-card v-for="(item,index) in srcData" :key="index" style="margin:10px;">
                    <div slot="header" style="padding:10px;">
                        <i class="el-icon-s-opportunity"></i>标题：
                        {{item.title}}
                    </div>
                    <el-row :gutter="20" style="font-size:10px;">
                        <el-col :span="8">
                            <span class="subtitle"><i class="el-icon-user-solid"></i>提出者：</span>
                            <span>{{item.realname}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="subtitle"><i class="el-icon-office-building"></i>提出单位：</span>
                            <span>{{item.company}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="subtitle"><i class="el-icon-time"></i>提出时间：</span>
                            <span>{{item.ctime | parseTime('{y}-{m}-{d}')}}</span>
                        </el-col>
                    </el-row>
                    <div style="margin-top:10px;">
                        <p style="font-weight:600">需求内容：</p>
                        <div>
                            {{item.description}}
                        </div>
                    </div>
                    <div style="margin-top:10px;text-align:right;padding-right:20px;">
                        <el-button  icon="el-icon-plus"  style="background: #05994e;color: white;" size="mini" @click="addItem(item)"></el-button>
                        <el-button  icon="el-icon-minus"  style="background: red;color: white;" size="mini" @click="removeItem(item)"></el-button>
                    </div>
                </el-card>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                <h2>需求整编</h2>
                </div>
                <div  style="max-height:calc(100vh - 260px);overflow-y:auto;">
                    <div v-for="(item, index) in zbArray" :key="index">
                        <el-form :model="item" label-position="right" label-width="100" style="background:#F8F8F8;padding:20px 20px 2px 20px;">
                            <el-form-item label="需求标题:" :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]">
                                <el-input size="small" v-model="item.title" style="width:80%"></el-input>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="需求类型:" :rules="[{required:true,message:'请选择需求类型',trigger:'change'}]">
                                        <treeselect
                                            v-model="item.type"
                                            style="width:200px;float:left"
                                            :multiple="false"
                                            :appendToBody="true"
                                            :options="typeData"
                                            :disable-branch-nodes="true"
                                            :normalizer="normalizer"
                                            z-index="9999"
                                            :show-count="true"
                                            placeholder="请选择资料类型"
                                        />
                                    </el-form-item>
                                    <el-form-item label="关联版本:" :rules="[{required:true,message:'请选择需求关联的软件版本',trigger:'change'}]">
                                        <el-select :key="softwareVersionKey" v-model="item.softwareVersionId" filterable placeholder ="请选择关联软件的版本" size="small">
                                            <el-option
                                            v-for="item in softwareVersionList"
                                            :key="item.value"
                                            :label="item.version"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="关联软件:" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]">
                                        <el-select v-model="item.softwareId" filterable placeholder ="请选择关联的软件" size="small" @change="selectSoftwareChange">
                                            <el-option
                                            v-for="item in softwareList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="处理单位:" :rules="[{required:true,message:'请选择需求处理单位',trigger:'change'}]">
                                        <el-select size="small" v-model="item.dealUnit" @change="changeDealUnit">
                                            <el-option
                                            v-for="item in devUnit"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div style="margin-bottom:10px;">
                                <span style="line-height:1.5">已选需求：{{zbIdList.join(',')}}</span>
                            </div>
                            <div style="max-height:calc(100vh - 480px);overflow-y:auto;">
                                <div style="margin-bottom:10px;">
                                    <span style="line-height:1.5">需求内容：</span>
                                    <!-- <markdown-editor ref="markdownEditor" v-model="item.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="400px"   /> -->
                                    <el-input type="textarea" v-model="item.content" :rows="20" />
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <div style="margin:20px 0;text-align:right;">
                        <!-- <el-button  style="background: #05994e;color: white;" @click="addZBForm">需求拆分</el-button> -->
                        <el-button type='primary' @click="addDemand">完成整编</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import MarkdownEditor from '@/components/MarkdownEditor'
import * as demand from '@/api/demand'
import * as category from '@/api/category'
import * as ts from '@/api/ts'
import  * as devunit from "@/api/devunit"
export default {
    components: {
        Treeselect: Treeselect,
        MarkdownEditor,
    },
    data(){
        return{
            devUnit:{},
            softwareList:[],
            softwareVersionList:{},
            keyword:'',
            userInfo:{},
            srcData:[],
            zbForm:{
                title:'',
                content:'',
                dealUnit:'',
                dealUnitName: '',
                type:null,
                softwareVersionId:'',
                software:'',
                softwareId:''
            },
            zbArray: [],
            addZbForm:{
                softwareId:'',
                title:'',
                versionId:'',
                description:'',
                category:'',
                uid:'',
                zbIds:[]
            },
            zbIdList: [],
            softwareVersionList:{},
            contents:[
                1
            ],
            originDemand: [],
            typeData: [],
            softwareVersionKey: 0
        }
    },
    mounted(){
        this.zbArray.push(JSON.parse(JSON.stringify(this.zbForm)))
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.getDemandQuery()
        this.getAllSoftware()
        this.getSoftwareVersionById()
        this.getDevUnit()
        this.getCategoryList()
    },
    methods:{
        changeDealUnit() {
            console.log(this.zbArray[0],"zbArray")
            for(let i=0;i<this.devUnit.length;i++){
                if(this.devUnit[i].id == this.zbArray[0].dealUnit){
                    this.zbArray[0].dealUnitName = this.devUnit[i].name
                    break;
                }
            }
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
         * 获取分类列表
         */
        getCategoryList() {
            category.getCategoryList("demand_cate", null, null).then(response => {
                if (response.code === 200) {
                    this.typeData = response.data.list
                }
            })
        },
        //完成整编
        addDemand(){
            if(this.addZbForm.zbIds.length == 0){
                this.$message.info("未选择待整编的原始需求")
            }else{
                if(this.zbArray[0].softwareId==''||this.zbArray[0].softwareId==""||this.zbArray[0].softwareId==null||this.zbArray[0].softwareId==undefined){
                    this.$message.info("未选择关联软件")
                }else if(this.zbArray[0].title==''||this.zbArray[0].title==""||this.zbArray[0].title==null||this.zbArray[0].title==undefined){
                    this.$message.info("未选择需求标题")
                }else if(this.zbArray[0].softwareVersionId==''||this.zbArray[0].softwareVersionId==""||this.zbArray[0].softwareVersionId==null||this.zbArray[0].softwareVersionId==undefined){
                    this.$message.info("未选择软件版本")
                }else if(this.zbArray[0].content==''||this.zbArray[0].content==""||this.zbArray[0].content==null||this.zbArray[0].content==undefined){
                    this.$message.info("未选择需求内容")
                }else if(this.zbArray[0].type==''||this.zbArray[0].type==""||this.zbArray[0].type==null||this.zbArray[0].type==undefined){
                    this.$message.info("未选择需求类型")
                }else if(this.zbArray[0].dealUnitName==''||this.zbArray[0].dealUnitName==""||this.zbArray[0].dealUnitName==null||this.zbArray[0].dealUnitName==undefined){
                    this.$message.info("未选择处理单位")
                }else if(this.zbArray[0].dealUnit==''||this.zbArray[0].dealUnit==""||this.zbArray[0].dealUnit==null||this.zbArray[0].dealUnit==undefined){
                    this.$message.info("未选择处理单位")
                }else{
                    this.addZbForm.softwareId = this.zbArray[0].softwareId
                    this.addZbForm.title = this.zbArray[0].title
                    this.addZbForm.versionId = this.zbArray[0].softwareVersionId
                    this.addZbForm.description = this.zbArray[0].content
                    this.addZbForm.category = this.zbArray[0].type
                    this.addZbForm.uid = this.userInfo.userId
                    this.addZbForm.zbIds = this.addZbForm.zbIds.join(',')
                    this.addZbForm.zbstatus = 1
                    this.addZbForm.dealUnitName = this.zbArray[0].dealUnitName
                    this.addZbForm.dealUnitId = this.zbArray[0].dealUnit
                    demand.addDemand(this.addZbForm).then(response=>{
                        debugger
                        if(response.code == 200){
                            this.$message.success("整编成功")
                            this.addZbForm.zbIds = []
                            this.goToZbDemand()

                        }
                    })
                }
            }
        },
        //完成整编后跳转至需求管理首页
        goToZbDemand(){
            this.$router.push({
                // name:'alreadyZb'
                path:'/admin/demand/index'
            })
        },
        //获取单位
        getDevUnit(){
            devunit.getUnit("",1,100).then(response=>{
                if(response.code==200){
                    this.devUnit=response.data.list;
                // this.total=response.data.total;
                // this.totalPage=response.data.totalPage;
                }
            })
        },
        resetSearch(){
            this.keyword=""
            this.getDemandQuery()
        },
        //获取原始未开始解决的需求
        getDemandQuery(){
            let userId = null
            this.$modal.loading();
            if(localStorage.getItem("userType") == "admin") {
                demand.getDemandQuery(userId,this.keyword,0,null,null,0).then(response=>{
                    this.$modal.closeLoading();
                    this.srcData=JSON.parse(JSON.stringify(response.data));
                })
            }else if(localStorage.getItem("userType") == "XTUser") {
                // demand.queryBySoftwareList(this.keyword,0,null,null,0).then(response=>{
                //     this.srcData=JSON.parse(JSON.stringify(response.data));
                // })
                demand.getDemandQuery(userId,this.keyword,0,null,null,0).then(response=>{
                    this.$modal.closeLoading();
                    this.srcData=JSON.parse(JSON.stringify(response.data));
                })
            }else{
                userId = this.userInfo.userId
                demand.queryBySoftwareUid(userId,this.keyword,0,null,null,0).then(response=>{
                    this.$modal.closeLoading();
                    this.srcData=JSON.parse(JSON.stringify(response.data));
                })
            }
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
            ts.getSoftwareVersion(this.zbArray[0].softwareId).then(response =>{
                if(response.code === 200){
                    this.softwareVersionList = response.data
                    this.softwareVersionKey = this.softwareVersionKey + 1
                }
            })
        },
        selectSoftwareChange(){
            this.getSoftwareVersionById();
        },
        addItem(item){
            if(this.addZbForm.zbIds.indexOf(item.id)==-1){
                this.addZbForm.zbIds.push(item.id)
                this.zbIdList.push(item.title)
                // this.zbArray[0].content=item.description+"<\\br>"+this.zbArray[0].content
                this.zbArray[0].content=item.description+"\n"+this.zbArray[0].content
                this.originDemand.push(item.description)
            }else{
                this.$message.info("该需求已被选择。")
            }
        },
        removeItem(item){
            if(this.addZbForm.zbIds.indexOf(item.id)!=-1){
                let index = this.addZbForm.zbIds.indexOf(item.id)
                this.addZbForm.zbIds.splice(index,1)
                this.zbIdList.splice(index,1)
                this.originDemand.splice(index,1)
            }else{
                this.$message.info("该需求未被选择。")
            }
            // this.$confirm("是否移除该需求条目？","警告",{
            //     type:"warning"
            // }).then(()=>{
            //     this.srcData.splice(index,1)
            // })
        },
        addZBForm() {
            this.zbArray.push(JSON.parse(JSON.stringify(this.zbForm)))
        }
    }
}
</script>
<style scoped>
.subtitle{
    color: teal;
    font-size: 16px;
    font-weight: 600;
}
.el-card{
    border: 1px;
}
</style>
