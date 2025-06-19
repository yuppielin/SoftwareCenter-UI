<template>
    <el-card id="question-item">
        <span style="color:rgb(8, 151, 151);font-size:18px;margin-right:10px;">[问答]</span>
        <span style="background:blue;color:white;padding:2px;border-radius:2px;">问</span>
        <router-link :underline="false" style="color:gray;font-size:18px;" to="">  {{data.name}}</router-link>
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
            
        },
        methods: {
      
        }
    }
</script>

<style scoped lang="scss">
    #question-item{
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