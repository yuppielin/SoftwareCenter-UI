<template>
    <div style="margin:60px 20px 0 20px;">
        <el-card>
            <div slot="header" style="height:20px;line-height:20px;">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <i class="el-icon-menu"></i>
                        <span style="font-size:14px;font-weight:600;margin-left:10px;">软件封装</span>
                    </el-col>
                    <el-col :span="12" style="text-align:right;">
                        <el-button type="text" size="mini" icon="el-icon-upload" @click="goToUpload">上传软件</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-radio-group v-model="packageType" @change="changeType">
                <el-radio :label="1">软件封装</el-radio>
                <el-radio :label="2">服务封装</el-radio>
            </el-radio-group>
            <div>
                 <span style="font-size:10px;color:gray;">注：本系统仅支持客户端软件、服务段软件的封装，手机端软件请直接走软件上传程序！</span>
            </div>
        </el-card>
        <el-card style="margin-top:10px;height:calc(100vh - 270px);overflow-y:auto;">
            <el-steps :active="step" align-center>
                <el-step title="软件信息"></el-step>
                <el-step title="打包信息"></el-step>
                <el-step title="封装发布"></el-step>
            </el-steps>
            <el-form :model="packageForm" label-position="right" label-width="100px" style="margin-top:10px;">
                <div v-show="step==1">
                    <el-tabs v-model="activeName" type="border-card" tab-position="left" style="margin-top:10px;">
                        <el-tab-pane label="基本信息">
                            <el-form-item label="软件类型" :rules="[{required:true,message:'软件名称不能为空',trigger:'blur'}]">
                               <el-select v-model="packageForm.type" size="small" 
                                style="width:400px" >
                                    <el-option label="客户端软件" :value="1"></el-option>
                                    <el-option label="服务段软件" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="软件名称" :rules="[{required:true,message:'软件名称不能为空',trigger:'blur'}]">
                                <el-input v-model="packageForm.name" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="软件标识" :rules="[{required:true,message:'软件标识不能为空',trigger:'blur'}]" >
                                <el-input v-model="packageForm.prefix" size="mini" placeholder="eg:1.0.0.0"></el-input>
                            </el-form-item>
                            <el-form-item label="制作单位" :rules="[{required:true,message:'单位名称不能为空',trigger:'blur'}]">
                                <el-input v-model="packageForm.unit" size="mini"></el-input>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="联系人员">
                                        <el-input v-model="packageForm.connector" size="mini"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系方式" :rules="[{pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,message:'请输入正确的电话号码',trigger:'blur'}]">
                                        <el-input v-model="packageForm.connectPhone" size="mini"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="软件描述" :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]">
                                <el-input v-model="packageForm.description" type="textarea" :rows="5"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="版本信息">
                            <el-form-item label="软件版本" :rules="[{required:true,message:'软件版本不能为空',trigger:'blur'}]" >
                                <el-input v-model="packageForm.version" size="mini" placeholder="eg:1.0.0.0"></el-input>
                            </el-form-item>
                            <el-form-item label="变更描述">
                                <el-input v-model="packageForm.updateInfo" type="textarea" :rows="5"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="环境信息">
                            <el-form-item label="CPU架构">
                                <el-select v-model="packageForm.architecture" size="small" 
                                style="width:400px" >
                                    <el-option label="飞腾" :value="1"></el-option>
                                    <el-option label="龙芯" :value="2"></el-option>
                                    <el-option label="申威" :value="3"></el-option>
                                    <el-option label="x86" :value="4"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作系统">
                                <el-select v-model="packageForm.os" size="small" 
                                style="width:400px" >
                                    <el-option label="银河麒麟" :value="1"></el-option>
                                    <el-option label="中标麒麟" :value="2"></el-option>
                                    <el-option label="CentOS" :value="3"></el-option>
                                    <el-option label="Unbutu" :value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="软件依赖">
                            <el-button size="mini" type="warning" @click="dependencyDlg=true">添加软件依赖信息</el-button>
                            <el-table :data="dependencyData" :header-cell-style="{background:'rgba(0,0,0,0.7)',height:'20px',color:'white'}" size="mini" style="margin-top:10px;">
                                <el-table-column label="软件名称" width="200" prop="name"></el-table-column>
                                <el-table-column label="软件标识" width="200" prop="prefix"></el-table-column>
                                <el-table-column label="原因描述" show-overflow-tooltip prop="reason"></el-table-column>
                            </el-table>
                            <el-dialog title="添加当前软件所依赖的软件信息" :visible.sync="dependencyDlg">
                                <div style="font-size:14px;font-weight:600">请输入软件依赖信息</div>
                                <el-form :model="dependencyForm" label-width="100px" label-position="right">
                                    <el-form-item label="软件标识" :rules="[{required:true,message:'软件标识不能为空',trigger:'blur'}]" prop="prefix">
                                        <el-input size="mini" v-model="dependencyForm.prefix"></el-input>
                                    </el-form-item>
                                    <el-form-item label="软件名称" :rules="[{required:true,message:'软件标识不能为空',trigger:'blur'}]" prop="name">
                                        <el-input size="mini" v-model="dependencyForm.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="原因描述" prop="reason">
                                        <el-input size="mini" v-model="dependencyForm.reason" type="textarea" :rows="5"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button size="mini" type="info" @click="dependencyDlg=false">取消</el-button>
                                        <el-button size="mini" type="primary">添加</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-dialog>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div v-show="step==2">
                    <el-row :gutter="0">
                        <el-col :span="4">
                            <el-card style="height:calc(100vh - 400px);overflow-y:auto;">
                                <div style="margin:10px 0;">
                                    <el-button icon="el-icon-upload" size="mini" type="warning">导入目录</el-button>
                                    <el-button icon="el-icon-upload" size="mini" type="info">导入文件</el-button>
                                </div>
                                <i class="el-icon-menu"></i>
                                <span style="margin-left:10px;font-size:14px;font-weight:600" @click="iconVisible=false">封装文件</span>
                                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true">
                                    <span class="custom-tree-node" slot-scope="{node,data}" style="font-size:16px;">
                                    <i class="el-icon-folder" style="color:rgb(230, 211, 106)"></i>
                                    {{data.label}}
                                    <!-- <span style="font-size:14px;color:black;padding-left:10px;" v-if="node.isCurrent">
                                        <i class="el-icon-circle-plus" @click="handleAddTask"></i>
                                        <i class="el-icon-edit" @click="handleEditTask(data)"></i>
                                        <i class="el-icon-remove" @click="deleteProjectTask(data)"></i>
                                    </span> -->
                                    </span>
                                </el-tree>
                                <i class="el-icon-menu"></i>
                                <span style="margin-left:10px;font-size:14px;font-weight:600" @click="iconVisible=true">默认图标</span>
                            </el-card>
                        </el-col>
                        <el-col :span="20">
                             <el-card v-if="!iconVisible">
                                <span style="font-size:12px;background:lightgray;padding:5px 10px;display:block;">注：打包的文件目录包括软件、环境依赖、配置、脚本等文件。</span>
                                <el-table :data="fileData" :header-cell-style="{background:'rgba(0,0,0,.7)',color:'white',height:'20px;'}" size="mini" style="height:calc(100vh - 465px);overflow-y:auto;">
                                    <el-table-column label="文件名称" prop="name"></el-table-column>
                                    <el-table-column label="文件大小" prop="size"></el-table-column>
                                    <el-table-column label="修改日期" prop="date"></el-table-column>
                                    <el-table-column label="操作" width="100">
                                        <el-button type="text" icon="el-icon-remove"></el-button>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                            <el-card v-else style="height:calc(100vh - 400px);overflow-y:auto;"> 
                                <el-form-item>
                                    <div>设置默认图标</div>
                                    <el-upload
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <div v-show="step==3">
                    <div style="text-align:center">
                         <el-button type="primary" size="mini" @click="progress">打包封装</el-button>
                    </div>
                    <div style="text-align:center;margin:10px 0;">
                        <el-progress type="circle" :percentage="percentage" color="#8e71c7"></el-progress>
                    </div>
                    <div v-show="isPackage" style="text-align:center;font-size:12px;" >
                        <el-link :underline="false" style="color:#1890ff">封装包下载：ZXCPJF_V1.0.0.0_X86.zip</el-link>
                    </div>
                </div>
            </el-form>
            <div class="nv-footer">
                <el-button type="primary" size="mini" :disabled="step==1" @click="prev">上一步</el-button>
                <el-button type="primary" size="mini" :disabled="step==3" @click="next">下一步</el-button>
            </div>
        </el-card>

    </div>
</template>
<script>
export default {
    data(){
        return {
            packageType:1,
            step:1,
            packageForm:{
                type:1,
            },
            activeName:'1',
            dependencyData:[
                {
                    name:"依赖软件",
                    prefix:"YLRJJZ",
                    reason:'原因描述'
                },
                {
                    name:"依赖软件",
                    prefix:"YLRJJZ",
                    reason:'原因描述'
                },
            ],
            dependencyDlg:false,
            dependencyForm:{
                name:'',
                prefix:'',
                reason:''
            },
            treeData: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                    label: '三级 1-1-1'
                    }]
                }]
                }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                    label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                    label: '三级 2-2-1'
                    }]
                }]
                }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                    label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                    label: '三级 3-2-1'
                    }]
                }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                fileData:[
                    {
                        name:"setup.sh",
                        size:'12KB',
                        date:'2021-09-09'
                    },
                    {
                        name:"setup.sh",
                        size:'12KB',
                        date:'2021-09-09'
                    },
                    {
                        name:"setup.sh",
                        size:'12KB',
                        date:'2021-09-09'
                    },
                ],
                percentage:0,
                isPackage:false,
                iconVisible:false,
                dialogImageUrl: '',
                dialogVisible: false
        }
    },
    methods:{
        goToUpload(){
            this.$router.push({
                path:'/index/software/fragment-upload'
            })
        },
        next(){
            let flag = this.step + 1;
            if(flag<=3){
                this.step++;
            }
        },
        prev(){
            let flag = this.step - 1;
            if(flag>=1){
                this.step--;
            }
        },
        handleNodeClick(data) {
            console.log(data);
        },
        //打包下载
        progress(){
            let timer=setInterval(()=>{
                this.percentage +=5;
                if(this.percentage>=100){
                    clearInterval(timer);
                    this.$message.success("软件打包成功，请下载！")
                    this.isPackage=true;
                }
            },1000)

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        changeType(){
            if(this.packageType==2){
                //windows.open('');
            }
        }
    }
}
</script>
<style scoped>
    .nv-footer{
        position:fixed;
        bottom: 20px;
        left: 50%;
        width: 100%;
    }
</style>