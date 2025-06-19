<template>
   <el-card style="margin:40px 20px 20px 20px;">
         <div style="margin-bottom:10px;">
            <el-button size="small" style="background:#05994e;color:white;" @click="dialogVisible=true">添加问题类型</el-button>
            <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字"></el-input>
            <el-button size="small" style="background:#05994e;color:white;margin-left:10px" >搜索</el-button>
            <el-button size="small" style="background:gray;color:white" >重置</el-button>
        </div>
        <!--添加分类---->
        <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :title="title" @dragDialog="handleDrag" width="40%">
            <el-form name="unitForm" ref="unitForm" :model="unitForm" label-position="right" label-width="100px"  :rules="rules">
                <el-form-item label="分类名称：" prop="name">
                    <el-input size="small" v-model="unitForm.name" style="max-width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="分类标识：" prop="realName">
                    <el-input size="small" v-model="unitForm.tag" style="max-width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="上级分类：" prop="address">
                      <treeselect style="max-width:400px;"
                    v-model="unitForm.type"
                    :multiple="false"
                    :options="typeData"
                    :disable-branch-nodes="false"
                    :normalizer="normalizer"
                    :show-count="true"
                    @select="selectModuleAdd"
                    placeholder="请选择上级问题类型"/>
                    <!-- <el-input size="small" v-model="unitForm.address" style="width:400px;"></el-input> -->
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" style="background:#05994e;color:white;" >确定</el-button>
                <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
        <el-table :data="typeData" size="mini" style="height:calc(100vh - 238px);overflow-y:auto;" :tree-props="{children:'children',hasChildren:'hasChildren'}" row-key="id"
        :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" >
            <el-table-column align="center" header-align="center" width="50" type="index" label="序号"></el-table-column>
            <el-table-column align="left" header-align="left" label="分类名称" prop="name"></el-table-column>
            <el-table-column align="center" header-align="center" label="分类标识" prop="tag"></el-table-column>
            <el-table-column align="center" header-align="center" label="排序" width="80">
                <template slot-scope="scope">
                      <el-input v-model="scope.row.sort" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="操作" width="200">
                <template slot-scope="{row}">
                    <el-button size="mini" style="background:orange;color:white" @click="dialogVisible=true,title='编辑分类'" >编辑</el-button>
                    <el-button size="mini" style="background:red;color:white" @click="deleteItem(row)" v-if="row.name!='admin'">删除</el-button>
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
    import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
    export default {
        components:{
            Treeselect
        },
        directives: { elDragDialog },
        data(){
            return {
                currentPage:1,
                title:'添加分类',
                dialogVisible:false,
                unitForm:{
                    name:'',
                    tag:'',
                    chager:'',
                    phone:'',
                    email:'',
                    address:'',
                },
                search:{
                    offerUnit:'',
                    devUnit:'',
                    keyWord:'',
                    type:''
                },
                typeData:[
                    {
                        id:1,
                        name:'使用问题',
                        tag:'Platform',
                        sort:1,
                    },
                    {
                        id:5,
                        name:'部署问题',
                        tag:'Service',
                        sort:1,
                    },
                     {
                        id:9,
                        name:'升级问题',
                        tag:'App',
                        sort:1,
                    },
                     {
                        id:9,
                        name:'其他问题',
                        tag:'App',
                        sort:1,
                    },
                ],
                rules:{
                    name:[
                        {required:true,message:'分类名称不能为空',trigger:'blur'}
                    ],
                    tag:[
                        {required:true,message:'分类标识不能为空',trigger:'blur'}
                    ],
                }
            }
        },
        methods:{
            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                };
            },
            editUserInfo(item){
                this.$router.push({
                    path:'/admin/system/unit/'+item.id + "/edit"
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
            },
            handleDrag(){

            },
            selectModuleAdd(){

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