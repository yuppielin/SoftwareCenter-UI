<template>
    <el-dialog id="softwareDetailDialog" :before-close="close" :visible.sync="dialogVisible" title="软件详情" :show-close="false">
        <div style="max-height: 70vh;overflow: auto;">
            <el-steps
                :active="activeStep"
                finish-status="success"
                style="margin: 20px 0"
                align-center>
                <el-step title="步骤1"  description="上传软件实体"></el-step>
                <el-step title="步骤2"  description="填写软件信息"></el-step>
            </el-steps>
            <div style="border: 1px solid #aebfcf;">
                <el-form v-if="activeStep===1" style="margin: 10px;" ref="reuploadSoftwareFormRef" :model="reuploadSoftwareForm" label-position="right" label-width="100px">
                    <el-form-item prop="name" label="软件名称：" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                        <el-row>
                            <el-input class="notClick" size="small" style="width: 70%;" v-model="reuploadSoftwareForm.name"></el-input>
                            <el-button icon="el-icon-upload" style="margin-left: 10px;" size="small" type="primary" @click="uploadRefuseSoftware">软件上传</el-button>
                        </el-row>
                    </el-form-item>

                    <el-form-item v-if="taskUploadType==1" label="软件分卷：" style="width: 76%;">
                        <el-row style="margin-bottom:6px">
                            <el-col :span="12">
                                <span style="font-size:12px;color:#909399;line-height: 36px;">没有分卷可不上传</span>
                            </el-col>
                            <el-col :span="12" style="text-align:right;">
                                <el-button icon="el-icon-upload" style="margin-left: 10px;" size="mini" type="primary" @click="uploadRefuseSoftwareVolums">软件分卷上传</el-button>
                            </el-col>
                        </el-row>
                        <el-table
                            :header-show="false"
                            :data="softwareInfoForm.softwareVersionVolumes"
                            size="mini"
                            :header-cell-style="{height:'30px', padding:'0'}"
                            :cell-style="{height:'30px', padding:'0'}"
                            >
                            <el-table-column label="分卷文件名称" prop="fileName" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scopedSplit">
                                    <el-button
                                    type="text"
                                    @click="deleteSoftwareFileSplit(softwareInfoForm, scopedSplit.$index)"
                                ><span style="color: red;font-size: 15px;">删除</span></el-button>
                                </template>
                            </el-table-column>
                            </el-table>
                    </el-form-item>

                </el-form>
                <global-uploader />
                <el-form v-if="activeStep===2" style="margin: 10px;" ref="softwareInfoFormRef" name="softwareInfoForm" :model="softwareInfoForm" label-position="right" label-width="120px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item prop="name" label="软件名称：" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                                <el-input v-model="softwareInfoForm.name"></el-input>
                            </el-form-item>
                            <el-form-item v-if="taskUploadType==2" prop="prefix" label="软件前缀：" :rules="[{required:true,message:'软件前缀不能为空',trigger:'blur'}]">
                                <el-input v-model="softwareInfoForm.prefix"></el-input>
                            </el-form-item>
                            <el-form-item prop="devUnit" label="研制单位：" :rules="[{required:true,message:'研制单位不能为空',trigger:'blur'}]">
                                <el-input v-model="softwareInfoForm.devUnit"></el-input>
                            </el-form-item>
                            <el-form-item v-if="taskUploadType==2" label="CPU架构：" prop="cpu" :rules="[{required:true,message:'请选择CPU架构',trigger:'change'}]">
                                <el-select multiple v-model="softwareInfoForm.cpu" style="width:100%">
                                    <el-option v-for="(item,index) in fragmentArchList" :key="index" :label="item.name" :value="item.identities"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="taskUploadType==1" :rules="[{required:true,message:'软件分类不能为空',trigger:'change'}]" label="软件分类：">
                                <treeselect
                                :normalizer="normalizer"
                                v-model="softwareInfoForm.service"
                                noResultsText="暂无数据"
                                :multiple="true"
                                value-consists-of="ALL_WITH_INDETERMINATE"
                                sort-value-by='INDEX'
                                :limit="2"
                                :limitText="count => `及其它${count}项`"
                                :options="softwareOptions"
                                :show-count="true"
                                :appendToBody="true"
                                z-index="9999"
                                placeholder="请选软件分类 "
                                clearable
                                ></treeselect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="version" label="软件版本：" :rules="[{required:true,message:'版本不能为空',trigger:'blur'}]">
                                <el-input v-model="softwareInfoForm.version"></el-input>
                            </el-form-item>
                            <el-form-item v-if="taskUploadType==2" prop="fragmentType" label="软件段类型：" :rules="[{required:true,message:'请选择类型',trigger:'trigger'}]">
                                <el-select v-model="softwareInfoForm.fragmentType" style="width:100%">
                                    <el-option v-for="(item,index) in softwareTypeList" :key="index" :label="item.name" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="offerUnit" label="提供单位：">
                                <!-- <el-input v-model="softwareInfoForm.offerUnit"></el-input> -->
                                <treeselect
                                    size="small"
                                    v-model="softwareInfoForm.offerUnitId"
                                    :multiple="false"
                                    :normalizer="normalizer"
                                    :options="testDepartmentList"
                                    placeholder="请选择提供单位"
                                    :appendToBody="true"
                                    z-index="9999"
                                    :disable-branch-nodes="true"
                                    @select="getSelectOfferUnit"
                                ></treeselect>
                            </el-form-item>
                            <el-form-item prop="md5" label="软件校验码：">
                                <el-input class="notClick" v-model="softwareInfoForm.md5"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="软件描述：" prop="description" :rules="[{required:true,message:'描述不能为空',trigger:'blur'}]">
                        <el-input v-model="softwareInfoForm.description" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="软件Logo：">
                        <el-upload
                        :auto-upload="true"
                        class="upload-demo"
                        action=""
                        :show-file-list="false"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-upload="beforeUploadSoftwareLogoAndCover"
                        :http-request="uploadSoftwareLogo"
                        :limit="1"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
                        </el-upload>
                        <el-image
                        style="width: 100px;height: 100px;"
                        v-if="softwareInfoForm.logo!=null"
                        :src="logoAndPicUrl+softwareInfoForm.logo"
                        fit="cover" />
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
                        :limit="1">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
                        </el-upload>
                        <el-image
                        v-if="softwareInfoForm.pic!=null"
                        :src="logoAndPicUrl+softwareInfoForm.pic"
                        fit="cover" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-row type="flex" justify="center" style="margin-top: 10px">
            <el-button type="info" v-show="activeStep===1" size="small" @click="cancelInfo">取消</el-button>
            <el-button type="default" v-show="activeStep===2" size="small" @click="activeStep=1">上一步</el-button>
            <el-button :disabled="reuploadSoftwareForm.name==null||reuploadSoftwareForm.name==undefined||reuploadSoftwareForm.name.trim()==''" type="primary" v-show="activeStep===1" size="small" @click="activeStep=2">下一步</el-button>
            <el-button type="primary" v-show="activeStep===2" size="small" @click="saveInfo">确定</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as category from '@/api/category'
// 软件上传
import globaluploader from "@/components/VueSimpleUploader/GlobalUploader";
import Bus from "@/components/VueSimpleUploader/js/bus";
import * as application from "@/api/application"
import * as organization from "@/api/organization";
// import * as appConfig from '/public/config'
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        data:{
            type:Object,
            default:null
        },
        taskType:{
            taskType:Number,
            default:null
        }
    },
    components:{
        Treeselect:Treeselect,
        "global-uploader": globaluploader,
    },
    data(){
        return {
            softwareId: 0,
            taskId: 0,
            activeStep: 1,
            reuploadSoftwareForm: {
                name: ""
            },
            userInfo: {},
            taskUploadType: null,
            dialogVisible: false,
            softwareInfoForm:{
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
            reuploadSoftwareInfo: {},
            testDepartmentList: [],
            logoAndPicUrl: appConfig.config.urlFilePrefix,
            isUploadVolums: false,

        }
    },
    created() {
        // 文件选择后的回调
        Bus.$on("fileAdded", () => {
            console.log("文件已选择");
        });
        // 文件上传成功的回调
        // Bus.$on("fileSuccess", list => {
        //     console.log("文件上传成功!!");
        //     console.log(list, "list");
        //     // list.map((item) => {
        //     //   return
        //     // })
        //     this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

        //     let softwareTypeMap = {};
        //     this.softwareTypeList.forEach(item=> {
        //         softwareTypeMap[item.name] = item.val
        //     })
        //     console.log(softwareTypeMap,this.softwareTypeList)
        //     let lists = list.map((item)=> {
        //         item.offerUnitId = this.userInfo.organizationId;
        //         item.offerUnit = this.userInfo.organization;
        //         item.fragmentType =  softwareTypeMap[item.type];
        //         return item
        //     })
        //     let num = lists.length-1
        //     this.reuploadSoftwareInfo = JSON.parse(JSON.stringify(lists[num]));
        //     console.log(this.reuploadSoftwareInfo, this.data, "this.reuploadSoftwareInfo")
        //     this.reuploadSoftwareForm.name = this.reuploadSoftwareInfo.name
        //     this.reuploadSoftwareInfo.logo = null
        //     this.reuploadSoftwareInfo.pic = null
        //     this.softwareInfoForm = JSON.parse(JSON.stringify(this.reuploadSoftwareInfo))
        //     this.softwareInfoForm.cpu = JSON.parse(JSON.stringify(this.reuploadSoftwareInfo.cpu))
        // });
        Bus.$on("successFile", file => {
            console.log("文件上传成功！！")
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

            // 上传分卷文件
            if(this.isUploadVolums===true) {
                if(!this.softwareInfoForm.softwareVersionVolumes) {
                    this.$set(this.softwareInfoForm, "softwareVersionVolumes", [])
                }
                this.softwareInfoForm.softwareVersionVolumes.push(
                    {
                        fileName: file.fileName,
                        paths: file.path,
                        sizes: file.size,
                        md5: file.md5
                    }
                )
                return false;
            }

            if(this.taskUploadType == 2){
                let softwareTypeMap = {};
                this.softwareTypeList.forEach(item=> {
                    softwareTypeMap[item.name] = item.val
                })

                console.log(file, "successFile")
                let uploadFile = JSON.parse(JSON.stringify(file))
                uploadFile.offerUnitId = this.userInfo.organizationId;
                uploadFile.offerUnit = this.userInfo.organization;
                uploadFile.fragmentType =  softwareTypeMap[uploadFile.type];
                
                this.reuploadSoftwareInfo = JSON.parse(JSON.stringify(uploadFile));
                console.log(this.reuploadSoftwareInfo, this.data, "this.reuploadSoftwareInfo")
                this.reuploadSoftwareForm.name = this.reuploadSoftwareInfo.name
                this.reuploadSoftwareInfo.logo = null
                this.reuploadSoftwareInfo.pic = null
                this.softwareInfoForm = JSON.parse(JSON.stringify(this.reuploadSoftwareInfo))
                this.softwareInfoForm.cpu = JSON.parse(JSON.stringify(this.reuploadSoftwareInfo.cpu))
            }else{
                let indexFile = file.fileName.lastIndexOf(".")
                let softwareName = file.fileName.substring(0, indexFile)

                console.log(file,indexFile,softwareName, "successFile")
                this.softwareInfoForm.fileName = file.fileName
                this.softwareInfoForm.md5 = file.md5
                this.softwareInfoForm.path = file.path
                this.softwareInfoForm.size = file.size
                this.softwareInfoForm.name = softwareName
                this.softwareInfoForm.offerUnitId = this.userInfo.organizationId;
                this.softwareInfoForm.offerUnit = this.userInfo.organization;
                this.softwareInfoForm.logo = null
                this.softwareInfoForm.pic = null
                this.reuploadSoftwareForm.name = softwareName
            }
        });
    },
    beforeDestroy() {
        Bus.$off("fileAdded");
        Bus.$off("successFile");
    },
    async mounted(){
        await this.getSoftwareTypeList();
        await this.getFragmentTypeList();
        await this.getFragmentArchList();
        await this.getTestDepartmentList()
        this.softwareId=JSON.parse(JSON.stringify(this.data)).id;
        this.taskId=JSON.parse(JSON.stringify(this.data)).taskId;
        this.dialogVisible = this.visible
        this.taskUploadType = this.taskType
    },
    watch: {
        visible(newVal, oldVal) {
            console.log(newVal);
            this.dialogVisible = newVal;
        },
        taskType(newVal, oldVal) {
            console.log(newVal);
            this.taskUploadType = newVal;
        },
        data(newVal, oldVal) {
            console.log(newVal);
            this.softwareId=JSON.parse(JSON.stringify(newVal)).id;
            this.taskId=JSON.parse(JSON.stringify(newVal)).taskId;
        }
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
                            console.log(item);
                            this.testDepartmentList.push(item);
                        });
                    }
                }
            });
        },
        getSelectOfferUnit(item) {
            console.log("getSelectOfferUnit",item)
            this.softwareInfoForm.offerUnit = item.name
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
            let file = params.file
            let formData = new FormData();
            formData.append("file", file);
            application.commonFileUpload(formData).then(response => {
                if (response.code === 200) {
                    this.softwareInfoForm.logo = response.data.fileName
                }
            });
        },
        uploadSoftwareCover(params) {
            let file = params.file
            let formData = new FormData();
            formData.append("file", file);
            application.commonFileUpload(formData).then(response => {
                if (response.code === 200) {
                    this.softwareInfoForm.pic = response.data.fileName
                }
            });
        },
        uploadRefuseSoftware() {
            // 打开文件选择框
            Bus.$emit("openUploader", {
                // 给服务端的额外参数
                params: {
                // page: 'home'
                },
                options: {
                    target: appConfig.config.url + "/appstore/upload/fileUpload",
                    accept: [".zip", ".tar"],
                    singleFile: true
                }
            });
            this.isUploadVolums = false;
        },
        uploadRefuseSoftwareVolums() {
            // 打开文件选择框
            Bus.$emit("openUploader", {
                // 给服务端的额外参数
                params: {
                // page: 'home'
                },
                options: {
                    target: appConfig.config.url + "/appstore/upload/fileUpload",
                    accept: [".z*"],
                    singleFile: false
                }
            });
            this.isUploadVolums = true;
        },
        deleteSoftwareFileSplit(item, index) {
            item.softwareVersionVolumes.splice(index, 1)
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
            let judge = JSON.stringify(this.softwareInfoForm)
            if (judge!==JSON.stringify(this.data)) {
                this.$confirm("要取消对软件详细信息的修改吗", "提示", {
                    confirmButtonText: "取消",
                    cancelButtonText: "继续",
                    type: "warning"
                }).then(async () => {
                    this.$emit('edit', null)
                    this.dialogVisible=false
                    this.$emit('close')
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "继续修改"
                    });
                });
            } else {
                this.dialogVisible=false
                this.$emit('close')
            }
        },
        saveInfo(){
            this.$confirm("要保存修改后的软件信息吗", "提示", {
                confirmButtonText: "保存",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                this.$refs['softwareInfoFormRef'].validate((valid)=>{
                    if(valid){
                        console.log(this.softwareInfoForm, "this.softwareInfoForm")
                        this.$emit('edit', this.softwareInfoForm)
                        this.dialogVisible=false
                        this.$emit('close')
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
            this.$emit('close')
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
#softwareDetailDialog >>> .el-dialog {
    margin-top: 10vh !important;
}
::v-deep .el-form-item--medium .el-form-item__content {
    line-height: 20px;
}
</style>