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
                    <el-button size="small" type="warning">处理需求</el-button>
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
                    处理状态: <span>{{data.status==0?'未解决':(data.status==2?'处理中':'已解决')}}</span>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            userInfo:'',
            zbStatus:'',
            total:'',
            totalPage:'',
            keyword:'',
            status:'',
            data:{
                realname:'张三丰',
                company:'北京信通公司',
                ctime:'2022-11-11',
                title:'软件授权使用需求',
                description:'如何获取该软件',
                softwareName:'服务支撑软件',
                softwareVersion:'v1.0',
                demandStatus:'已处理',
                replay:[
                    {
                        replier:'李四',
                        replayTime:'2022-11-22',
                        content:'该需求已经处理'
                    },
                     {
                        replier:'李四',
                        replayTime:'2022-11-22',
                        content:'该需求已经处理'
                    }
                ]
            },
        }
    },
    mounted(){
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        
    },
    method:{
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
    
</style>