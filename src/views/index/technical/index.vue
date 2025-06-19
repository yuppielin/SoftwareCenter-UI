<template>
 <div class="app-container">
    <el-tabs v-model="activeName">
        <MyTechnicalItem></MyTechnicalItem>
    </el-tabs>
 </div>
</template>
<script>
export default {
    components:{
        MyTechnicalItem:()=>import('./software-my-technical.vue'),
    },
    data(){
        return {
            activeName:'first',
            softwareData:[
                {
                    name:'资源服务软件',
                    logo:require("@/assets/imgs/1.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    version:["1.0","2.0","3.0"],
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    downloadNumber:10
                },
                {
                    name:'资源服务软件',
                    logo:require("@/assets/imgs/2.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    version:["1.0","2.0","3.0"],
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    downloadNumber:10
                },
                {
                    name:'资源服务软件',
                    logo:require("@/assets/imgs/3.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    version:["1.0","2.0","3.0"],
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    downloadNumber:10
                },
                {
                    name:'资源服务软件',
                    logo:require("@/assets/imgs/4.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    version:["1.0","2.0","3.0"],
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    downloadNumber:10
                }
            ],
        }
    }
}
</script>
<style scoped>

</style>