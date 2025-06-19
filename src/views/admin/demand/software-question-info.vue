<template>
   <el-card style="margin:90px 20px 20px 20px;">
        <div class="content">
        <div>
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
        <el-divider></el-divider>
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
                    <el-button slot="reference"  size="small" type="warning" style="margin-right:10px;">处理中</el-button>
                    <el-popover
                    placement="bottom"
                    width="500"
                    trigger="click">
                    <div style="text-align:center;">
                        <el-input type="textarea" :rows="5" v-model="answer" placeholder="回复内容" value="问题已处理"></el-input>
                        <el-button type="primary" size="mini" style="margin-top:5px;">回复</el-button>
                    </div>
                    <el-button slot="reference"  size="small" type="primary">处理问题</el-button>
                    </el-popover>
                    <el-button size="small" type="danger" style="margin-left:10px;">删除</el-button>
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
                    处理状态: <span>{{data.demandStatus}}</span>
                </div>
            </el-col>
        </el-row>
        </div>
   </el-card>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{
            answer:'',
            status:'1',
            demandData:{
                submitter:'张三丰',
                submitUnit:'北京信通公司',
                submitTime:'2022-11-11',
                demandTitle:'软件授权使用问题',
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
            color:rgb(8, 151, 151);
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
    // }
</style>