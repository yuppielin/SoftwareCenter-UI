<template>
    <el-card class="custome">
         <div style="margin-bottom:10px;">
             <el-button size="small" style="background:#05994e;color:white;" >软件上传</el-button>
             <el-select v-model="search.offerUnit" size="small" 
                style="width:200px;margin-left:10px;"
                placeholder="提供单位"
                filterable remote reserve-keyword >
                <el-option label="中科院电子所" value="1"></el-option>
                <el-option label="中科院光电所" value="2"></el-option>
                <el-option label="中科院遥感所" value="3"></el-option>
            </el-select>
            <el-select v-model="search.devUnit" size="small" 
                style="width:200px;margin-left:10px;"
                placeholder="研制单位"
                filterable remote reserve-keyword >
                <el-option label="中科院电子所" value="1"></el-option>
                <el-option label="中科院光电所" value="2"></el-option>
                <el-option label="中科院遥感所" value="3"></el-option>
            </el-select>
            <el-select v-model="search.type" size="small" placeholder="成果类型"
                        style="width:200px;margin-left:10px;"
                        filterable multiple reserve-keyword >
                <el-option label="基础软件" value="1"></el-option>
                <el-option label="应用软件" value="2"></el-option>
                <el-option label="系统软件" value="3"></el-option>
                <el-option label="支撑软件" value="4"></el-option>
                <el-option label="工具软件" value="5"></el-option>
                <el-option label="共性软件" value="6"></el-option>
                <el-option label="其他" value="7"></el-option>
            </el-select>
            <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字"></el-input>
            <el-button size="small" style="background:#05994e;color:white;margin-left:10px" >搜索</el-button>
            <el-button size="small" style="background:gray;color:white" >重置</el-button>
        </div>
        <el-table :data="unReviewData" size="mini" style="height:calc(100vh - 238px);overflow-y:auto;"
        :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" >
            <el-table-column align="center" header-align="center" width="50" type="index" label="序号"></el-table-column>
            <el-table-column align="center" header-align="center" label="成果名称" prop="name"></el-table-column>
            <el-table-column align="center" header-align="center" label="成果版本" prop="version"></el-table-column>
            <el-table-column align="center" header-align="center" label="研制单位" prop="devUnit"></el-table-column>
            <el-table-column align="center" header-align="center" label="提供单位" prop="applyUnit"></el-table-column>
            <el-table-column align="center" header-align="center" label="应用权限" prop="property"></el-table-column>
            <el-table-column align="center" header-align="center" label="上传者" prop="uploader"></el-table-column>
            <el-table-column align="center" header-align="center" label="上传时间" prop="uploadDate"></el-table-column>
            <el-table-column align="center" header-align="center" label="操作" width="240">
                <template slot-scope="{row}">
                    <el-button size="small" style="background:gray;color:white" @click="showInfo(row)">编辑</el-button>
                    <el-button size="small" style="background:orange;color:white" @click="showInfo(row)">升级</el-button>
                    <el-button size="small" style="background:red;color:white" @click="deleteItem(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top:15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination>
    </el-card>
</template>
<script>
    export default {
        data(){
            return {
                currentPage:1,
                search:{
                    offerUnit:'',
                    devUnit:'',
                    keyWord:'',
                    type:''
                },
                unReviewData:[
                    {
                        id:1,
                        name:'资源支撑软件',
                        version:'1.2',
                        devUnit:'中科单位',
                        applyUnit:'电子15',
                        uploader:'张珊珊',
                        uploadDate:'2021-12-01',
                        status:'未审核',
                        property:'共有',
                    },
                    {
                        id:2,
                        name:'通信支撑软件',
                        version:'1.2',
                        devUnit:'中科单位',
                        applyUnit:'电子15',
                        uploader:'张珊珊',
                        uploadDate:'2021-12-01',
                        status:'未审核',
                        property:'共有',
                    },
                    {
                        id:3,
                        name:'进程通信软件',
                        version:'1.2',
                        devUnit:'中科单位',
                        applyUnit:'电子15',
                        uploader:'张珊珊',
                        uploadDate:'2021-12-01',
                        status:'未审核',
                        property:'共有',
                    }
                ]
            }
        },
        methods:{
            showInfo(item){
                this.$router.push({
                    path:'/admin/software/unreviewed/'+item.id
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            deleteItem(item){
                this.$confirm('确定删除该成果吗？','提示',{
                    type:'warning'
                }).then((e)=>{
                    console.log(e)
                })
            }
        }
    }
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
</style>