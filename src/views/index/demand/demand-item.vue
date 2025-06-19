<template>
    <el-card class="software-resource-card">
        <div slot="header">
            <el-row :gutter="20">
                <el-col :span="18">
                    <div class="title">
                        <i class="el-icon-user-solid"></i>
                        {{data.realname}}
                    </div>
                    <div class="title">
                        <i class="el-icon-s-check"></i>
                        <span>{{data.company}}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="title">
                        <i class="el-icon-date"></i> 
                        <span>{{data.ctime| parseTime('{y}-{m}-{d}')}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="18">
                <div class="title">
                    <i class="el-icon-s-opportunity">标题：</i>
                    {{data.title}}
                </div>
                <div class="title">
                    <span>
                        {{data.description}}
                    </span>
                </div>
                <div style="text-align:right">
                    <el-button size="small" type="warning" @click="handle()">处理需求</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                </div>
            </el-col>
            <el-col :span="6">
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

        <!-- <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                <el-button
                    size="mini"
                    icon="el-icon-s-comment"
                    type="text"
                >回复：（{{ data.replyList?data.replyList.length : 0 }}）</el-button>
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
                        <div>{{ item.description }}</div>
                        <i class="el-icon-user-solid" />
                        <span>{{ item.realname }} 回复于 {{ item.cTime | parseTime('{y}-{m}-{d}')}}</span>
                        <el-link icon='el-icon-chat-square' @click="replyVisible=!replyVisible" >回复</el-link>
                        <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" >删除</el-link>
                    </div>
                    </el-card>
                </el-timeline-item>
                </el-timeline>
            </el-collapse-item>
        </el-collapse>

        <div style="margin:10px 0;" v-show="replyVisible">
            <markdown-editor ref="markdownEditor" v-model="data.replyList.description" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="400px"   />
            <div style="margin:20px 0;text-align:center;">
                <el-button size="small" type="primary" @click="addAnswer" > 处理</el-button>
            </div>
        </div> -->

    </el-card>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as demand from '@/api/demand'
import * as ts from '@/api/ts'
import  * as devunit from "@/api/devunit"
export default {
    // props:{
    //     data:{
    //         type:Object,
    //         default:{}
    //     }
    // },
    props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
  },
    data(){
        return{
            replyVisible:false,
            answer:'',
            status:'',
            keyword:'',
            total:'',
            totalPage:'',
            
            demandData:{},
            answer:{},
            userInfo:{},
        }
    },
    mounted(){
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.getReply()
        console.log("=============",this.data)
        console.log(this.data.id)
        
    },
    methods:{
        //获取需求回答
        getReply(){
            demand.getDemand(this.$route.query.demandId).then(response=>{
                if(response.code == 200){
                    this.data = response.data[0]
                    console.log(response.data)
                }
            })
        },
        //处理需求
        addAnswer(){
            this.data.replyList = {
                demandId:this.data.id,
                description:this.data.replyList.description,
                uid:this.userInfo.userId,
                pid:this.data.replyList.pid
            }
            demand.addAnswer(this.data.replyList).then(response=>{
                if(response.code == 200){
                    this.replyVisible = !this.replyVisible
                    window.location.reload()
                }
            })
        },
        handle() {
            //replyVisible=!replyVisible
            console.log(this.data.id)
        },
        //获取需求提报列表
        // getDemandQuery(){
        //     this.zbStatus=0
        //     demand.getDemandQuery(this.userInfo.userId,this.keyword,this.status,1,10,this.zbStatus).then(response=>{
        //         this.demandData=response.data.list;
        //         this.total=response.data.total;
        //         this.totalPage=response.data.totalPage;
        //     })
        // },
        
    }
}
</script>
<style scoped lang="scss">
    .el-card.is-always-shadow{
        width: 99%;
        margin: 0 auto;
        margin-top: 30px;
    }
</style>