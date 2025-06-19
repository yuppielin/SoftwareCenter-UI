<template>
    <div class="app-container">
        <el-steps :active="step" simple>
            <el-step title="基本信息" icon="el-icon-edit"></el-step>
            <el-step title="软件上传" icon="el-icon-upload"></el-step>
            <el-step title="资料上传" icon="el-icon-upload"></el-step>
            <el-step title="权限设置" icon="el-icon-picture"></el-step>
            <el-step title="待审核" icon="el-icon-picture"></el-step>
        </el-steps>
        <el-form name="baseForm" ref="baseForm" :model="baseForm" v-show="step==1" label-position="right" label-width="100px" style="margin-top:10px;">
            <el-form-item prop="name" label="软件名称:" :rules="[{ required: true, message: '软件名称不能为空', trigger: 'blur' }]">
                <el-input v-model="baseForm.name" size="small" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item prop="offerUnit" label="提供单位:" :rules="[{required:true,message:'请选择提供单位',trigger:'change'}]">
                <el-select v-model="baseForm.offerUnit" size="small" 
                style="width:400px"
                :remote-method="remoteMethod"
                :loading="loading"
                filterable remote reserve-keyword >
                    <el-option label="中科院电子所" value="1"></el-option>
                    <el-option label="中科院光电所" value="2"></el-option>
                    <el-option label="中科院遥感所" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="devUnit" label="研制单位:" :rules="[{required:true,message:'请选择研制单位',trigger:'change'}]">
                <el-select v-model="baseForm.devUnit" size="small" 
                style="width:400px"
                :remote-method="remoteMethod"
                :loading="loading"
                filterable remote reserve-keyword >
                    <el-option label="中科院电子所" value="1"></el-option>
                    <el-option label="中科院光电所" value="2"></el-option>
                    <el-option label="中科院遥感所" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="软件封面:">
                <img width="50px" height="50px" :src="dialogImageUrl" alt="" v-if="dialogImageUrl">
                <el-upload
                :auto-upload="false"
                list-type="picture"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="1">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div> -->
                </el-upload>
            </el-form-item>
            <el-form-item prop="type" label="软件类型:" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                <el-select v-model="baseForm.type" size="small" 
                style="width:400px"
                filterable multiple reserve-keyword >
                    <el-option label="基础软件" value="1"></el-option>
                    <el-option label="应用软件" value="2"></el-option>
                    <el-option label="系统软件" value="3"></el-option>
                    <el-option label="支撑软件" value="4"></el-option>
                    <el-option label="工具软件" value="5"></el-option>
                    <el-option label="共性软件" value="6"></el-option>
                    <el-option label="其他" value="7"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="platform" label="应用平台:" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                <el-select v-model="baseForm.platform" size="small" 
                style="width:400px"
                filterable multiple reserve-keyword >
                    <el-option label="Windows" value="1"></el-option>
                    <el-option label="Linux" value="2"></el-option>
                    <el-option label="国产平台" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="content" label="软件描述:" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
                <markdown-editor ref="markdownEditor" v-model="baseForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />
            </el-form-item>
              <el-form-item  label="测试证明:">
                <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                            <i class="el-icon-download"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-form>
        <el-form name="softwareForm" ref="softwareForm" :model="softwareForm" v-show="step==2" label-position="right" label-width="100px" style="margin-top:10px;">
            <el-form-item  label="软件Logo:">
                <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="1"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
                </el-upload>
            </el-form-item>
            <el-form-item prop="name" label="软件版本:" :rules="[{ required: true, message: '软件版本不能为空', trigger: 'blur' }]">
                <el-input v-model="baseForm.name" size="small" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="软件路径:" :rules="[{ required: true, message: '请上传软件', trigger: 'blur' }]">
                <el-input v-model="baseForm.name" size="small" style="width:80%"></el-input>
                <el-upload
                class="upload-demo"
                action=""
                :limit="1">
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <el-card v-show="step==3" style="margin-top:10px;">
            <div style="font-size:14px;font-weight:600;">资料上传</div>
            <el-upload
                style="margin-top:10px;"
                class="upload-demo"
                action=""
                :auto-upload="false"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                 multiple
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传pdf/doc/docx/ppt/pptx/xls/xlsx/txt文件，且不超过100M</div>
            </el-upload>
        </el-card>
         <el-form name="authForm" ref="authForm" :model="authForm" v-show="step==4" label-position="right" label-width="100px" style="margin-top:10px;">
            <el-form-item prop="property" label="应用授权:">
                <el-radio v-model="authForm.property" label="1">公开</el-radio>
                <el-radio v-model="authForm.property" label="2">私有</el-radio>
            </el-form-item>
            <el-form-item prop="scan" label="可浏览:" :rules="[{ required: true, message: '请选择对象', trigger: 'change' }]">
                <el-select v-model="authForm.scan" size="small" 
                style="width:400px"
                filterable multiple reserve-keyword >
                    <el-option label="基础软件" value="1"></el-option>
                    <el-option label="应用软件" value="2"></el-option>
                    <el-option label="系统软件" value="3"></el-option>
                    <el-option label="支撑软件" value="4"></el-option>
                    <el-option label="工具软件" value="5"></el-option>
                    <el-option label="共性软件" value="6"></el-option>
                    <el-option label="其他" value="7"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="download" label="可下载:" :rules="[{ required: true, message: '请选择对象', trigger: 'change' }]">
                <el-select v-model="authForm.download" size="small" 
                style="width:400px"
                filterable multiple reserve-keyword >
                    <el-option label="基础软件" value="1"></el-option>
                    <el-option label="应用软件" value="2"></el-option>
                    <el-option label="系统软件" value="3"></el-option>
                    <el-option label="支撑软件" value="4"></el-option>
                    <el-option label="工具软件" value="5"></el-option>
                    <el-option label="共性软件" value="6"></el-option>
                    <el-option label="其他" value="7"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-card v-show="step==5" style="text-align:center;margin-top:10px;">
            <i class="el-icon-check" style="color:green;font-size:40px;"></i>
            <div>软件已提交，请等待审核！</div>
        </el-card>
        <div style="text-align:center">
            <el-button v-if="step>1 & step!=5" size="small" style="background:#05994e;color:white;margin-top:10px" @click="perv">上一步</el-button>
            <el-button v-if="step<5" size="small" style="background:#05994e;color:white;margin-top:10px" @click="next">下一步</el-button>
        </div>
    </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
export default {
    components:{
         MarkdownEditor,
    },
    data(){
        return {
            step:1,
            loading:false,
            options: [],
            value: [],
            list: [],
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList:[],
            baseForm:{
                name:'',
                offerUnit:'',
                devUnit:'',
                type:'',
                platform:'',
                content:''
            },
            softwareForm:{
                version:'',
                path:''
            },
            authForm:{
                property:'1',
                scan:'',
                download:''
            }
        }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      next(){
          let flag = this.step + 1;
          if(flag<=5){
              this.step++;
          }
      },
      perv(){
          let flag = this.step - 1;
          if(flag>=1){
              this.step--;
          }
      }
    }
}
</script>
<style scoped>

</style>