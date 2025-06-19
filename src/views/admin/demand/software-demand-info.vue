<template>
    <el-card style="margin:30px 20px 20px 20px;">
        <div slot="header">
        <el-row>
          <el-col :span="12" style="line-height:30px">
            查看
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button  size="mini"  onclick="history.go(-1)" icon="el-icon-back">返回</el-button>
          </el-col>
        </el-row>
    </div>
        <div class="content">
        <div>
            <el-row :gutter="20">
                <el-col :span="18">
                    <div class="title">
                        <i class="el-icon-user-solid"></i>
                        <!-- {{data.submitter}} -->
                        {{data.realname}}
                    </div>
                    <div class="title">
                        <i class="el-icon-s-check"></i>
                        <!-- <span>{{data.submitUnit}}</span> -->
                        <span>{{data.company}}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="title">
                        <i class="el-icon-date"></i> 
                        <!-- <span>{{data.submitTime}}</span> -->
                        <span>{{data.ctime| parseTime('{y}-{m}-{d}')}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <el-row :gutter="20">
            <el-col :span="18">
                <div class="title">
                    <i style="font-size: 14px;" class="el-icon-s-opportunity">标题：</i>
                    {{data.title}}
                </div>
                <div class="title">
                    <span>
                        {{data.description}}
                    </span>
                </div>
                <div style="text-align:right">
                    <!-- <el-button slot="reference"  size="small" type="warning" style="margin-right:10px;">处理中</el-button> -->
                    <!-- <el-popover
                    placement="bottom"
                    width="500"
                    trigger="click">
                    <div style="text-align:center;">
                        <el-input type="textarea" :rows="5" v-model="answer" placeholder="回复内容" value="问题已处理"></el-input>
                        <el-button type="primary" size="mini" style="margin-top:5px;">回复</el-button>
                    </div>
                    <el-button slot="reference"  size="small" type="primary">处理需求</el-button>
                    </el-popover> -->
                    <el-button slot="reference"  size="small" type="primary" v-if="data.status!=2" @click="replyVisible=!replyVisible">处理需求</el-button>
                    <!-- <el-button size="small" type="primary" @click="replyVisible=!replyVisible" style="margin-left:10px;" >回复</el-button> -->
                    <el-button size="small" type="danger" style="margin-left:10px;" v-if="data.status!=2" @click="closeDemand">关闭</el-button>
                </div>
            </el-col>
            <el-col :span="6" style="border-left:1px solid #DCDFE6">
                <div  class="title">
                    软件名称: <span>{{data.softwareName}}</span>
                </div>
                <div  class="title">
                    软件版本: <span>{{data.softwareVersion}}</span>
                </div>
                <div  class="title">
                    处理状态: <span>{{data.status==0?'未解决':(data.status==1?'处理中':'已解决')}}</span>
                </div>
            </el-col>
        </el-row>
        </div>

        <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                <el-button
                    size="mini"
                    icon="el-icon-s-comment"
                    type="text"
                >回复：（{{ replyListLength }}）</el-button>
                </template>
                <el-timeline style="padding-right: 10px;padding-top: 5px">
                <el-timeline-item
                    v-for="(item,index) in data.replyList"
                    :key="index"
                    :timestamp="item.cTime | parseTime('{y}-{m}-{d}')"
                    placement="top"
                >
                    <el-card>
                    <div class="title">
                        <div v-text="item.description!=null?item.description:'无'"></div>
                        <i class="el-icon-user-solid" />
                        <span>{{ item.realname }} 回复于 {{ item.cTime | parseTime('{y}-{m}-{d}')}}</span>
                        <!-- <el-link icon='el-icon-chat-square' @click="replyVisible=!replyVisible" >回复</el-link> -->
                        <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteDemand(item)">删除</el-link>
                    </div>
                    </el-card>
                </el-timeline-item>
                </el-timeline>
            </el-collapse-item>
        </el-collapse>
        <div style="margin:10px 0;" v-show="replyVisible">
            <el-input type="textarea" :rows="3" v-model="demandReply" height="400px"></el-input>
            <div style="margin:20px 0;text-align:center;">
                <el-button size="small" type="primary" @click="addAnswer" > 处理</el-button>
            </div>
        </div>
        
    </el-card>
</template>
<script>
import * as demand from '@/api/demand'
import * as ts from '@/api/ts'
export default {
    data(){
        return{
            replyVisible:false,
            answer:'',
            status:'',
            data:{
                // submitter:'张三丰',
                // submitUnit:'北京信通公司',
                // submitTime:'2022-11-11',
                // demandTitle:'软件授权使用需求',
                // demandContent:'如何获取该软件',
                // softwareName:'服务支撑软件',
                // softwareVersion:'v1.0',
                // demandStatus:'已处理',
                // replay:[
                //     {
                //         replier:'李四',
                //         replayTime:'2022-11-22',
                //         content:'该需求已经处理'
                //     },
                //      {
                //         replier:'李四',
                //         replayTime:'2022-11-22',
                //         content:'该需求已经处理'
                //     }
                // ]
            },
            answer:{},
            replyListLength: 0,
            demandReply: "",
            softwareList: [],
            userInfo: {}
        }
    },
    mounted(){
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.getReply()
        this.getAllSoftware()
    },
    methods:{
        //删除需求
        deleteDemand(item){
            this.$confirm('确定删除该需求吗？','提示',{
                type:'warning'
            }).then(async (e)=>{
                await demand.deleteDemandReply(item.id)
                await this.getReply()
                this.$message.success('删除成功')
            })
        },
        closeDemand() {
            this.$confirm("确定关闭该需求吗？", "提示", {
                type: "warning"
            }).then(e => {
                demand.finishDemand(this.$route.query.demandId, this.userInfo.userId).then(response => {
                    if(response.code===200){
                        this.$message.success("需求关闭成功!")
                        location.reload()
                    }
                })
            });
        },
        //获取所有软件
        getAllSoftware(){
            ts.getAllSoftware().then(response =>{
                if(response.code === 200){
                    this.softwareList = response.data      
                }
            })
        },
        getSoftwareName() {
            for(let i=0;i<this.softwareList.length;i++){
                if(this.data.softwareId===this.softwareList[i].id){
                    return this.softwareList[i].name
                }
            }
        },
        getSoftwareVersionById() {
            ts.getSoftwareVersion(this.zbForm.softwareId).then(response =>{
                if(response.code === 200){
                    this.softwareVersionList = response.data      
                }
            })
        },
        //获取需求回答
        getReply(){
            demand.getDemand(this.$route.query.demandId).then(response=>{
                if(response.code == 200){
                    this.data = response.data[0]
                    this.replyListLength = this.data.replyList.length
                    console.log(this.data)
                }
            })
        },
        //处理需求
        addAnswer(){
            this.data.replyList = {
                demandId:this.data.id,
                description:this.demandReply,
                uid:this.userInfo.userId,
                pid:null
            }
            demand.addAnswer(this.data.replyList).then(response=>{
                if(response.code == 200){
                    this.replyVisible = !this.replyVisible
                    this.getReply()
                    this.demandReply = ""
                    // window.location.reload()
                }
            })
        },
        
    }
}
</script>
<style scoped lang="scss">
    // .app-container{
    //     padding: 15px 10px;
    //     line-height:20px;
        .content{
            background: rgba(197, 194, 194, 0.1);
            border-radius: 4px;
            margin:5px 0;
            padding: 10px;
        }
        ::v-deep .el-card__header{
            padding: 5px 20px;
        }
        ::v-deep .el-collapse{
            border-top: 0px solid #e6ebf5; 
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__header{
            line-height: 20px;;
            height:20px;
            background-color: rgba(197, 194, 194, 0.0);
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__arrow{
            margin: 0;
        }
        ::v-deep .el-divider--horizontal{
            margin:10px 0;
        }
        i{
            // color:rgb(8, 151, 151);
            color:#05994e;
        }
        .title{
            font-size:14px;
            font-weight: 600;
            span{
                font-size: 12px;
                color:#a1a1a1;
                font-weight: 400;
                padding-left: 5px;
            }
        }
        ::v-deep .el-link{
            .el-icon-delete{
                font-size:14px;
            }
            span{
                font-size:14px;
            }
        }
    // }
</style>