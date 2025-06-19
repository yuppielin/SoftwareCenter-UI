<template>
    <div>
        <div>
            <el-button v-for="(item, index) in navList" :key="index" @click="changeStatus(item)" class="nav-button" :class="{active:item.status==curIndex}" type="button">{{item.name}}</el-button>

            <el-button class="my-btn-color" style="float:right" @click="create">提报表单</el-button>
        </div>
        <el-divider></el-divider>
        <TechnicalItem></TechnicalItem>
    </div>
</template>
<script>
export default {
    components:{
        TechnicalItem:()=>import('./technical-item.vue')
    },
    data(){
        return{
            navList:[
                {status:1,name:'受理中'},
                {status:2,name:'处理中'},
                {status:3,name:'已处理'},
            ],
            curIndex : -1,
        }
    },
    methods: {
        changeStatus(item){
            this.curIndex = item.status
        },
        create(){
            this.$router.push({
                path: '/index/technical/add',
            })
        },
    }
}
</script>
<style scoped>

</style>