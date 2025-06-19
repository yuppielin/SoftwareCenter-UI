<template>
    <el-card id="software-item">
        <el-row style="text-align:center">
            <el-col :span="2">
                <img :src="logoAndPicUrl+data.logo" width="60px" height="60px"/>
            </el-col>
            <el-col :span="18" style="text-align:left;line-height:20px;">
                <router-link :underline="false" style="color:rgb(8, 151, 151);font-size:18px;margin-right:20px;" :to="'/index/list/'+data.id">{{data.name}}</router-link>
                <div>
                    <div style="display:inline-block;width:200px">
                        成果类别：<span>{{data.type}}</span>
                    </div>
                    <div style="display:inline-block;width:200px;margin-left:40px;">
                        研制单位：<span>{{data.devUnit}}</span>
                    </div>
                </div>
                <div>
                    成果描述：<span>{{data.description}}</span>
                </div>
            </el-col>
            <el-col :span="4">
                <div style="text-align:center">
                    <el-button size="small" style="background:#05994e;color:white;margin-top:20px">成果下载</el-button>
                    <el-button size="small" style="background:#05994e;color:white;">资料下载</el-button>
                </div>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <div>
            版本：<span style="color:green;border:1px solid green;border-radius:2px;padding:2px 10px;">1.0</span>
            <i class="el-icon-date" style="color:rgb(8, 151, 151);margin-left:40px;"></i>
            上传时间：<span>{{data.createTime}}</span>
            <i class="el-icon-download" style="margin-left:40px;color:rgb(8, 151, 151);"></i>
            下载数量：<span>{{data.downloadNumber}}</span>
        </div>
    </el-card>
</template>
<script>
// import * as appConfig from '/public/config'
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
                selectedVersion:null,
                logoAndPicUrl: appConfig.config.urlFilePrefix
            }
        },
        mounted(){
            let item = this.data;
            if(item.version.length>0){
                this.selectedVersion=item.version[item.version.length-1]
            }
        },
        methods: {
            handleVersionChange(version){
                this.selectedVersion=version;
            }
        }
    }
</script>

<style scoped lang="scss">
    #software-item{
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