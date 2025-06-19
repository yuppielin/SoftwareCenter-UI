<template>
    <el-dialog id="softwareDetailDialog" @close="close" :visible.sync="dialogVisible" title="软件详情" :show-close="true">
        <div style="height: 70vh;overflow: auto;">
            <div style="border: 1px solid #aebfcf;">
            <el-form style="margin: 10px;" ref="softwareForm" name="softwareForm" :model="softwareForm" label-position="right" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item prop="name" label="软件名称：" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                            <el-input v-model="softwareForm.name"></el-input>
                        </el-form-item>
                        <el-form-item prop="prefix" label="软件前缀：" :rules="[{required:true,message:'软件前缀不能为空',trigger:'blur'}]">
                            <el-input v-model="softwareForm.prefix"></el-input>
                        </el-form-item>
                        <el-form-item prop="devUnit" label="研制单位：" :rules="[{required:true,message:'研制单位不能为空',trigger:'blur'}]">
                            <el-input v-model="softwareForm.devUnit"></el-input>
                        </el-form-item>
                        <el-form-item label="CPU架构：" prop="cpu" :rules="[{required:true,message:'请选择CPU架构',trigger:'change'}]">
                            <el-select multiple :collapse-tags='true' v-model="softwareForm.cpu"  style="width:100%">
                                <el-option v-for="(item,index) in fragmentArchList" :key="index" :label="item.name" :value="item.identities"></el-option>
                             </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="version" label="软件版本：" :rules="[{required:true,message:'版本不能为空',trigger:'blur'}]">
                            <el-input v-model="softwareForm.version"></el-input>
                        </el-form-item>
                        <el-form-item prop="fragmentType" label="软件段类型：" :rules="[{required:true,message:'请选择类型',trigger:'trigger'}]">
                            <el-select v-model="softwareForm.fragmentType" style="width:100%">
                                <el-option v-for="(item,index) in softwareTypeList" :key="index" :label="item.name" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="offerUnit" label="提供单位：">
                            <!-- <el-input v-model="softwareForm.offerUnit"></el-input> -->
                            <treeselect
                                size="small"
                                v-model="softwareForm.offerUnitId"
                                :multiple="false"
                                :normalizer="normalizer"
                                :options="testDepartmentList"
                                placeholder="请选择提供单位"
                                :disable-branch-nodes="true"
                                @select="getSelectOfferUnit"
                            ></treeselect>
                        </el-form-item>
                        <!-- <el-form-item prop="md5" label="软件校验码：">
                            <span>{{softwareForm.md5}}</span> -->
                            <!-- <el-input class="notClick" v-model="softwareForm.md5"></el-input> -->
                        <!-- </el-form-item> -->
                    </el-col>
                </el-row>
                <el-form-item prop="md5" label="软件校验码：">
                    <span style="display: inline-block;line-height: 32px;">{{softwareForm.md5}}</span>
                </el-form-item>
                <el-form-item label="软件描述：" prop="description" :rules="[{required:true,message:'描述不能为空',trigger:'blur'}]">
                    <el-input v-model="softwareForm.description" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item :rules="[{message:'请上传Logo',trigger:'blur'}]" label="软件Logo：">
                    <el-upload
                    :auto-upload="true"
                    class="upload-demo"
                    action=""
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeUploadSoftwareLogoAndCover"
                    :http-request="uploadSoftwareLogo"
                    :multiple="false"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
                    </el-upload>
                    <el-image
                    :key="logoKey"
                    style="width: 100px;height: 100px;"
                    v-show="softwareForm.logo!=null"
                    :src="softwareUrl+softwareForm.logo"
                    fit="fill" />
                </el-form-item>
                <el-form-item label="软件封面：">
                    <el-upload
                    :auto-upload="true"
                    list-type="picture"
                    action="#"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeUploadSoftwareLogoAndCover"
                    :http-request="uploadSoftwareCover"
                    :multiple="false">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
                    </el-upload>
                    <el-image
                    :key="picKey"
                    v-show="softwareForm.pic!=null"
                    :src="softwareUrl+softwareForm.pic"
                    fit="cover" />
                </el-form-item>
            </el-form>
            </div>
        </div>
        <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-button type="info" size="small" @click="cancelInfo">取消</el-button>
            <el-button type="primary" size="small" @click="saveInfo">确定</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as category from '@/api/category'
import * as application from '@/api/application'
import * as organization from "@/api/organization";
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        data:{
            type:Object,
            default:null
        }
    },
    components:{
        Treeselect:Treeselect,
    },
    data(){
        return {
            userInfo: {},
            dialogVisible: false,
            softwareForm:{
                name:"",
                version:'',
                fragmentType:'',
                service:[],
                description:'',
                devUnit:'',
                prefix:'',
                cpu: [], // cpu架构
                offerUnit: '',
                offerUnitId: '',
                md5: '',
                logo: null,
                pic: null
            },
            softwareTypeList: [],
            fragmentArchList: [],
            softwareOptions:[],
            softwareUrl: config.url + "/appstore",
            // service: []
            logoKey: 0,
            picKey: 0,
            testDepartmentList: []
        }
    },
    watch: {
        visible(newVal, oldVal) {
            // console.log(newVal);
            this.dialogVisible = newVal;
        },
        data(newVal, oldVal) {
            // console.log(newVal);
            this.softwareForm=JSON.parse(JSON.stringify(newVal));
        }
    },
    async mounted(){
        await this.getSoftwareTypeList();
        await this.getFragmentTypeList();
        await this.getFragmentArchList();
        await this.getTestDepartmentList()
        this.softwareForm=JSON.parse(JSON.stringify(this.data));
        this.dialogVisible = this.visible
    },
    methods:{
        getTestDepartmentList() {
            organization.getOrganization().then(response => {
                if (response.code === 200) {
                    let softwareTypeArray = response.data;
                    this.testDepartmentList = [];
                    if (softwareTypeArray.length > 0) {
                        softwareTypeArray.forEach(element => {
                        let item = this.buildTreeOptions(element);
                            // console.log(item);
                            this.testDepartmentList.push(item);
                        });
                    }
                }
            });
        },
        getSelectOfferUnit(item) {
            console.log("getSelectOfferUnit",item)
            this.softwareForm.offerUnit = item.name
        },
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            }
        },
        beforeUploadSoftwareLogoAndCover(file) {
            let fileSize = file.size / 1024 / 1024
            const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
            const acceptType = ["gif","jpg","png"];
            if (acceptType.indexOf(fileType) === -1) {
                this.$message.error("当前允许上传类型为gif,jpg,png!");
                return Promise.reject(false);
            } else if(fileSize > 10) {
                this.$message.error("当前允许上传大小为10M!");
                return Promise.reject(false);
            } else {
                return true;
            }
        },
        uploadSoftwareLogo(params) {
            console.log("application",params)
            let file = params.file
            let formData = new FormData();
            formData.append("file", file);
            application.commonFileUpload(formData).then(response => {
                if (response.code === 200) {
                    this.softwareForm.logo = response.data.fileName
                    console.log(this.softwareForm,this.softwareForm.logo)
                    this.logoKey = this.logoKey + 1
                }
            });
        },
        uploadSoftwareCover(params) {
            console.log("application",params)
            let file = params.file
            let formData = new FormData();
            formData.append("file", file);
            application.commonFileUpload(formData).then(response => {
                console.log(response)
                if (response.code === 200) {
                    this.softwareForm.pic = response.data.fileName
                    console.log(this.softwareForm,this.softwareForm.pic)
                    this.picKey = this.picKey + 1
                }
            });
        },
        getSoftwareTypeList() {
            category.getCategoryList("service", 1, 10).then(response => {
                let softwareTypeArray = response.data.list
                this.softwareOptions = []
                if(softwareTypeArray.length>0){
                    softwareTypeArray.forEach(element => {
                    let item = this.buildTreeOptions(element)
                        this.softwareOptions.push(item)
                    });
                }
                
            })
        },
        buildTreeOptions(item) {
            let node = {
                id: item.id,
                name: item.name,
                label: item.name,
                children: []
            }
            if(item.children.length > 0){
                for(let num =0;num<item.children.length;num++){
                    node.children.push(this.buildTreeOptions(item.children[num]))
                }
            }
            return node
        },
        getFragmentTypeList() {
            category.getCategoryList("fragment_type", null, null).then(response => {
                let res = this.handleTree(response.data.list)
                this.softwareTypeList = res;
            });
        },
        getFragmentArchList() {
            category.getCategoryList("fragment_arch", null, null).then(response => {
                let res = this.handleTree(response.data.list)
                this.fragmentArchList = res;
            });
        },
        handlePreview(file){},
        handleRemove(file){},
        cancelInfo(){
            let judge = JSON.stringify(this.softwareForm)
            if (judge!==JSON.stringify(this.data)) {
                this.$confirm("要取消对软件详细信息的修改吗", "提示", {
                    confirmButtonText: "取消",
                    cancelButtonText: "继续",
                    type: "warning"
                }).then(async () => {
                    this.$emit('close', this.data)
                    this.dialogVisible=false
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "继续修改"
                    });
                });
            } else {
                this.dialogVisible=false
            }
        },
        saveInfo(){
            this.$confirm("要保存修改后的软件信息吗", "提示", {
                confirmButtonText: "保存",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                this.$refs['softwareForm'].validate((valid)=>{
                    if(valid){
                        // if(this.softwareForm.logo==null||this.softwareForm.logo==undefined||this.softwareForm.logo.trim()=="") {
                        //     this.$message.info("请上传logo！！")
                        // }else{
                            this.$emit('close', this.softwareForm)
                            this.dialogVisible=false
                        // }
                    }
                })
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "继续修改"
                });
            });
        },
        close(){
            this.dialogVisible=false
        }
    }
}
</script>
<style scoped>
.uploadRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.inCardDiv {
  margin: 20px;
}
.notClick {
  pointer-events: none;
}
/* #softwareDetailDialog >>> .el-dialog {
    margin-top: 10vh !important;
} */
::v-deep .el-form-item--medium .el-form-item__content {
    line-height: 20px;
}
</style>