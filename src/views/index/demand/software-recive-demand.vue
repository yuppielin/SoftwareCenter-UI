<template>
    <div>
        <DemandItem v-for="(item, index) in demandData" :key="index" :data='item'></DemandItem>
        <div v-if="demandData.length==0" style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')"  style="height:600px"></el-image>
        </div>
    </div>
</template>
<script>
export default {
    components:{
        DemandItem:()=>import('./demand-item.vue')
    },
    // props:{
    //     data:{
    //         type:Object,
    //         default:{}
    //     }
    // },
    data(){
        return{
            demandData:[
            //     {
            //         submitter:'李四',
            //         submitUnit:'北京信通公司',
            //         submitTime:'2022-11-11',
            //         demandTitle:'软件授权使用需求',
            //         demandContent:'如何获取该软件',
            //         softwareName:'服务支撑软件',
            //         softwareVersion:'v1.0',
            //         demandStatus:'已处理',
            //         replay:[
            //             {
            //                 replier:'李四',
            //                 replayTime:'2022-11-22',
            //                 content:'该需求已经处理'
            //             },
            //             {
            //                 replier:'李四',
            //                 replayTime:'2022-11-22',
            //                 content:'该需求已经处理'
            //             }
            //         ]
            //     },
            //     {
            //         submitter:'李四',
            //         submitUnit:'北京信通公司',
            //         submitTime:'2022-11-11',
            //         demandTitle:'软件授权使用需求',
            //         demandContent:'如何获取该软件',
            //         softwareName:'服务支撑软件',
            //         softwareVersion:'v1.0',
            //         demandStatus:'已处理',
            //         replay:[
            //             {
            //                 replier:'李四',
            //                 replayTime:'2022-11-22',
            //                 content:'该需求已经处理'
            //             },
            //             {
            //                 replier:'李四',
            //                 replayTime:'2022-11-22',
            //                 content:'该需求已经处理'
            //             }
            //         ]
            //     }
            ]
        }
    },
    mounted(){
        this.data = this.demandData
    }
}
</script>
<style scoped lang="scss">
    
</style>