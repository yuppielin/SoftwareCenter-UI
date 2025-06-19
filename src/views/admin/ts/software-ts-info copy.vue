<template>
  <el-card class="custome software-question">
    <div slot="header">
        <el-row>
          <el-col :span="12" style="line-height:30px">
            查看
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button  size="mini"  onclick="history.go(-1)" icon="el-icon-back">返回</el-button>
          </el-col>
        </el-row>
    </div>
    <el-row :gutter="20">
        <el-col :span="18">
          <div class="title" style="height:40px;line-height:40px;">
            <i class="el-icon-s-opportunity">标题：</i>
            {{data.title}}
          </div>
          <div>
            <div class="subtitle">
              软件名称：
              <span>{{data.softwareName}}</span>
              <el-tag
                type="primary"
                size="mini"
                style="color: white;background-color: #3b5975;position: relative;top: 5px;"
              >{{data.version}}</el-tag>
            </div>
            <div class="subtitle">
              研发单位：
              <span>{{data.devUnit}}</span>
            </div>
            <div class="subtitle">
              提报人员：
              <span>{{data.cname}}</span>
            </div>
            <div class="subtitle">
              提报时间：
              <span>{{ data.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="title" style="margin-top:20px;text-align:right">
            <span
              style="color:white;font-size:12px;background:orange;padding:5px 6px;border-radius:5px;"
            >{{data.status==0?'未解决':(data.status==1?'处理中':'已解决')}}</span>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    <el-row :gutter="10">
      <el-col :span="19">
        <div class="title">
          内容：
          <span>{{data.description}}</span>
        </div>
      </el-col>
      <el-col :span="5" style="text-align:right">
        <el-button size="mini" type="primary" @click="reply(data,null)">处理问题</el-button>
        <el-button size="mini" type="warning" style="margin-left:10px" @click="closeQuestion">关闭</el-button>
        <el-button
          size="mini"
          type="danger"
          style="margin-left:10px"
          @click="deleteSoftwareQuestion"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <el-button
            size="mini"
            icon="el-icon-s-comment"
            type="text"
          >支持：（{{ data.softwareQuestionAnswers.length }}）</el-button>
        </template>
        <el-timeline style="padding-right: 10px;padding-top: 5px">
          <el-timeline-item
            v-for="(item,index) in data.softwareQuestionAnswers"
            :key="index"
            :timestamp="item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')"
            placement="top"
          >
            <el-card>
              <div class="title">
                <div>{{ item.description }}</div>
                <i class="el-icon-user-solid" />
                <span>{{ item.realname }} 回复于 {{ item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                <el-link icon='el-icon-chat-square' @click="reply(data, data.softwareQuestionAnswers)">回复</el-link>
                <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteReply(item)">删除</el-link>
              </div>
                <el-form
                  ref="fileForm"
                  name="fileForm"
                  label-width="100px"
                >
                <el-form-item   label="技术支持资料" v-show="item.path!=''">
                  <el-button  @click="downloadData(item)" style="color:#3b5975" type="text"> {{item.path!=''?item.path.substring(24,item.path.length-1):'暂无文件'}}</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="回复">
      <el-form
        ref="questionForm"
        name="questionForm"
        model="questionForm"
        label-position="left"
        label-width="100px"
      >
        <!-- <el-form-item label="技术支持标题">
          <span>软件授权使用问题</span>
        </el-form-item>-->
        <el-form-item
          label="回复内容："
          prop="content"
        >
          <!-- <markdown-editor ref="markdownEditor" v-model="questionForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="250px" /> -->
          <el-input
            v-model="questionForm.content"
            size="small"
            :rows="7"
            :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
            type="textarea"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>
        <!-- <el-form-item   label="上传附件" >
            <el-radio  v-model="tsForm.isFileUpload" :label="0" >是</el-radio>
            <el-radio  v-model="tsForm.isFileUpload" :label="1" >否</el-radio>
        </el-form-item>
        <el-form-item v-if="tsForm.isFileUpload==0" label="资料类型" :rules="[{required:true,message:'名称不能为空',trigger:'blur'}]">
            <el-select v-model="tsForm.type" size="small" style="width:80%">
                <el-option value="1" label="培训材料"></el-option>
                <el-option value="2" label="故障案例"></el-option>
                <el-option value="3" label="视频课件"></el-option>
                <el-option value="4" label="专家答疑"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="附件上传：" >
          <el-upload
            :multiple="true"
            :file-list="fileList"
            :show-file-list="true"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :http-request="
            (file) => {
              return uploadFile(file)
            }"
            :on-change="handleChangeFile"
            accept=".mp4, .docx, .pdf"
            class="editor-slide-upload"
          >
            <div style="margin-top:10px">
              <el-button class="file-btn" size="mini" type="primary">附件上传</el-button>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="replyConfirm">确定</el-button>
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import * as ts from '@/api/ts'
export default {
  data() {
    return {
      answerlength:0,
      dialogVisible: false,
      vvv:0,
      data: {
        // cid:"",
        // cname:"",
        // content:"",
        // ctime:"",
        // devUnit:"",
        // id:"",
        // softwareId:"",
        // softwareName:"",
        // softwareVersion:"",
        // softwareVersionID:"",
        // status:"",
        // title:"",
        cid:"",
        id:"",
        title: '',
        description: "",
        status: "",
        softwareName: '',
        version: '',
        softwareVersionId:"",
        devUnit:"",
        cname:"",
        ctime:"",
        softwareQuestionAnswers: []
      },
      fileData: {},
      questionForm: {
        content: "",
        
      },
      fileList: [],
      tsForm:{
          name:'',
          type:'',
          tsId:1,
          tsTitle:'',
          isFileUpload:1
      },
    };
  },
  mounted(){
      this.getReply();
  },
  methods: {
    async downloadData(item){
      let realpath = item.path.substring(0,item.path.length-1)
      const blob = await ts.downloadDataByPath(realpath)
      let fileName = item.path.substring(24,item.path.length-1)
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.setAttribute("download", fileName);
      a.setAttribute("target", "_blank");
      // a.download = "shili.rar"
      a.setAttribute("href", url);
      a.click();
    },
    //获取技术支持回答
    getReply(){
      ts.getSupport(this.$route.query.tsQuestionId).then(response =>{
        if(response.code === 200){
          // response.data.answers.array.forEach(element => {
          //   let item = {
          //     description: element.description
          //     id:element.id
          //     pid:element.pid
          //   }
          //   this.data.softwareQuestionAnswers.push(item)
          // });
          this.data.softwareQuestionAnswers=response.data[0].answers
          this.data.id=response.data[0].id
          this.data.title=response.data[0].title
          this.data.description=response.data[0].content
          this.data.softwareId=response.data[0].softwareId
          this.data.softwareName=response.data[0].softwareName
          this.data.softwareVersionID=response.data[0].softwareVersionID
          this.data.version=response.data[0].softwareVersion
          this.data.devUnit=response.data[0].devUnit
          this.data.status=response.data[0].status
          this.data.cid=response.data[0].cid
          this.data.cname=response.data[0].cname
          this.data.ctime=response.data[0].ctime
          for(let i = 0; i < this.data.softwareQuestionAnswers.length; i++) {
              if(this.data.softwareQuestionAnswers[i].path != '') {
              let fileName = this.data.softwareQuestionAnswers[i].path.split('/');
              this.data.softwareQuestionAnswers.path = fileName[2]
            }
          }
          //alert(this.data.description)
        }
      })
    },
    closeQuestion() {
      this.$confirm("确定关闭此技术支持吗", "提示", {
        type: "warning"
      }).then(e => {
        // question.deleteSoftwareQuestion(this.data.id).then(response => {
        // if (response.code === 200) {
        //     this.$emit('getSoftwareQuestion', this.flag)
        //     this.$message.success('删除成功')
        // }
        // })
      });
    },
    reply(question, answer) {
      this.dialogVisible = true;
      console.log(this.$route)
    },
    replyConfirm() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let formData = new FormData();
      formData.append("files",this.fileData)
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          ts.reply(this.$route.query.tsQuestionId,this.questionForm.content,userInfo.userId,this.questionForm.pid,formData).then(response =>{
            if(response.code === 200){
              this.dialogVisible = false
              this.getReply();
            }
          })
        }
      });
    },
    deleteReply(item) {
      console.log(item)
        this.$confirm("确定删除该回复吗？", "提示", {
            type: "warning"
        }).then(e => {
          ts.delQuestionAnswer(item.id).then(response => {
            if(response.code === 200){
              this.getReply();
              this.$message.success("删除成功");
            }
          })
        });
    },
    deleteSoftwareQuestion() {
      this.$confirm("确定删除该回复吗？", "提示", {
        type: "warning"
      }).then(e => {
        question.deleteSoftwareQuestion(this.data.id).then(response => {
          if (response.code === 200) {
            this.$emit("getSoftwareQuestion", this.flag);
            this.$message.success("删除成功");
          }
        });
      });
    },
    async uploadFile(param) {
      this.fileData = param.file;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleSuccess() {

    },
    beforeUpload() {

    },
    handleChangeFile() {

    },
  }
};
</script>

<style scoped lang="scss">
.software-question {
  // background: rgba(197, 194, 194, 0.1);
  background: #fff;
  line-height: 20px;
  ::v-deep .el-card__header {
    padding: 5px 20px;
  }
  ::v-deep .el-collapse {
    border-top: 0px solid #e6ebf5;
    border-bottom: 0px solid #e6ebf5;
  }
  ::v-deep .el-collapse-item__header {
    line-height: 20px;
    height: 20px;
    background-color: rgba(197, 194, 194, 0);
    border-bottom: 0px solid #e6ebf5;
  }
  ::v-deep .el-collapse-item__arrow {
    margin: 0;
  }
  ::v-deep .el-timeline-item {
    padding-bottom: 10px;
  }
  ::v-deep .el-collapse-item__content {
    margin-bottom: 0;
  }
  i {
    color: #3b5975;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    span {
      font-size: 12px;
      color: #a1a1a1;
      font-weight: 400;
      padding-left: 5px;
      padding-right: 10px;
    }
  }
  .subtitle {
    font-size: 12px;
    display: inline-block;
    width: 300px;
    span {
      font-size: 12px;
      color: #a1a1a1;
      font-weight: 400;
      padding-left: 5px;
      padding-right: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  ::v-deep .el-table th.is-leaf,
  .el-table td {
    border-bottom: 0px solid #dfe6ec;
    font-size: 10px;
  }
  ::v-deep .el-table .cell {
    font-size: 10px;
  }
}
::v-deep .el-link--inner {
  font-size: 12px;
}
::v-deep .el-link [class*=el-icon-] + span{
    margin-left: 2px;
}
::v-deep .el-icon-delete {
    font-size: 12px;
}
.editor-slide-upload {
  text-align: left;
}
</style>