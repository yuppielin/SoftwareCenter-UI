<template>
    <el-card class="software-resource-card">
        <div slot="header">
            <el-row :gutter="20">
                <el-col :span="18">
                    <div class="title">
                        <i class="el-icon-user-solid"></i>
                        {{data.submitter}}
                    </div>
                    <div class="title">
                        <i class="el-icon-s-check"></i>
                        <span>{{data.submitUnit}}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="title">
                        <i class="el-icon-date"></i> 
                        <span>{{data.submitTime}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="18">
                <div class="title">
                    <i class="el-icon-s-opportunity">标题：</i>
                    {{data.demandTitle}}
                </div>
                <div class="title">
                    <span>
                        {{data.demandContent}}
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
                    处理状态: <span>{{data.demandStatus}}</span>
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
            demandData:{
                submitter:'张三丰',
                submitUnit:'北京信通公司',
                submitTime:'2022-11-11',
                demandTitle:'软件授权使用需求',
                demandContent:'如何获取该软件',
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
            }
        }
    },
    mounted(){
        this.data = this.demandData
    }
}
</script>
<style scoped lang="scss">
    
</style>