<template>
    <div class="app-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="推荐成果" name="first">
                <RecommentSoftware v-for="(item,index) in softwareData" :data="item" :key="index"></RecommentSoftware>
            </el-tab-pane>
            <el-tab-pane label="推荐资料" name="second">
                <RecommentDocument v-for="(item,index) in documentData" :data="item" :key="index"></RecommentDocument>
            </el-tab-pane>
            <el-tab-pane label="推荐问答" name="third">
                <RecommentQuestion v-for="(item,index) in questionData" :data="item" :key="index"></RecommentQuestion>
            </el-tab-pane>
            <el-tab-pane label="推荐需求" name="fourth">
                <RecommentDemand v-for="(item,index) in demandData" :data="item" :key="index"></RecommentDemand>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    components:{
        RecommentSoftware:()=>import('./recommend-software.vue'),
        RecommentDocument:()=>import('./recommend-document.vue'),
        RecommentQuestion:()=>import('./recommend-question.vue'),
        RecommentDemand:()=>import('./recommend-demand.vue'),
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
            documentData:[
                {
                    name:'资源服务软件使用说明书.doc',
                    type:'文档类',
                    software:'服务支撑软件',
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    size:'10.2M'
                },
                 {
                    name:'资源服务软件使用说明书.doc',
                    type:'文档类',
                    software:'服务支撑软件',
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    size:'10.2M'
                },
                {
                    name:'资源服务软件使用说明书.doc',
                    type:'文档类',
                    software:'服务支撑软件',
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    size:'10.2M'
                },
            ],
            questionData:[
                {
                    name:"数据库链接失败",
                },
                 {
                    name:"文件大小上传限制",
                }
            ],
            demandData:[
                {
                    name:'资源服务软件集成需求',
                    software:'资源服务软件',
                    logo:require("@/assets/imgs/1.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    reporter:'张三'
                },
                 {
                    name:'资源服务软件集成需求',
                    software:'资源服务软件',
                    logo:require("@/assets/imgs/1.png"),
                    type:'支撑软件',
                    devUnit:'中国工程',
                    description:"软件成果描述",
                    createTime:"2022-03-25",
                    reporter:'张三'
                },
            ],
        }
    }
}
</script>
<style scoped>

</style>