<template>
    <el-card id="document-item">
        <el-row style="text-align:center">
            <el-col :span="20" style="text-align:left;line-height:20px;">
                <router-link :underline="false" style="color:rgb(8, 151, 151);font-size:18px;margin-right:20px;" to="#">[资料] {{data.name}}</router-link>
                <div>
                    <div style="display:inline-block;width:200px">
                        所属成果：<span>{{data.software}}</span>
                    </div>
                    <div style="display:inline-block;width:200px;margin-left:40px;">
                        资料类型：<span>{{data.type}}</span>
                    </div>
                </div>
                <div>
                    成果描述：<span>{{data.description}}</span>
                </div>
            </el-col>
            <el-col :span="4">
                <div style="text-align:center">
                    <el-button size="small" style="background:#05994e;color:white;">资料下载</el-button>
                </div>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <div>
            <i class="el-icon-date" style="color:rgb(8, 151, 151);"></i>
            上传时间：<span>{{data.createTime}}</span>
            <i class="el-icon-date" style="color:rgb(8, 151, 151);margin-left:40px;"></i>
            资料大小：<span>{{data.size}}</span>
        </div>
    </el-card>
</template>
<script>
    export default {
        props:{
            data:{
                type:Object,
                default:null,
                required:true
            }
        },
        data(){
            return{
                selectedVersion:null
            }
        },
        mounted(){
            let item = this.data;
        },
        methods: {
            handleVersionChange(version){
                this.selectedVersion=version;
            }
        }
    }
</script>

<style scoped lang="scss">
    #document-item{
        font-size: 12px;
        margin: 5px 0;
        ::v-deep .el-card__body{
            padding: 10px;
        }
        ::v-deep .el-button + .el-button{
            margin-left:0px;
        }
        ::v-deep .el-divider--horizontal{
            margin:10px 0;
        }
        span{
            color:rgb(161, 161, 161)
        }
    }
</style>