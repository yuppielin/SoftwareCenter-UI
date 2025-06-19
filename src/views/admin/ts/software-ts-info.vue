<template>
  <el-card class="custome software-question">
    <div slot="header">
        <el-row>
          <el-col :span="12" style="line-height:30px">
            技术支持处理情况
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button  size="mini"  onclick="history.go(-1)" icon="el-icon-back">返回</el-button>
          </el-col>
        </el-row>
    </div>
    <el-row :gutter="10">
        <el-col :span="20">
          <div class="title" style="font-size:18px;color:#3478d4;font-weight:600;margin-top:5px;">
            <i class="el-icon-s-opportunity"></i>
            {{data.title}}
          </div>
          <div style="margin-top:10px;">
            <div class="subtitle">
              软件名称：
              <span>{{data.softwareName}}</span>
              <div v-show="data.softwareVersion" style="margin: 0 10px;color: white;background-color: #2187a8;display:inline-block;font-size:12px;border-radius:2px;padding:0 10px;">
                   v {{ data.softwareVersion }}
              </div>
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
        <el-col :span="4">
          <div class="title" style="margin-top:10px;text-align:right">
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
          <!-- 内容：
          <span> -->
            {{data.description}}
            <!-- </span> -->
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
            style="color:#3478d4;"
          >回复：（{{ answerlength }}）</el-button>
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
                <span>{{ item.cname }} 回复于 {{ item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                <el-link icon='el-icon-chat-square' @click="reply(data, item)">回复</el-link>
                <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteReply(item)">删除</el-link>
              </div>
               <div v-if="item.tsDataVo && item.tsDataVo.path" style="font-size:12px;color:#3478d4;">
                  <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                  <el-button  @click="downloadData(item.tsDataVo)" style="color:#3478d4" type="text" size="mini"> {{item.tsDataVo.name}}</el-button>
              </div>
            </el-card>
             <el-collapse accordion1>
              <el-collapse-item>
                <template slot="title">
                  <el-button
                    size="mini"
                    icon="el-icon-s-comment"
                    type="text"
                    style="color:#3478d4;"
                  >回复：（{{ item.childrenPage.total }}）</el-button>
                </template>
                <el-timeline style="padding-top: 5px;padding-left:0px">
                  <el-timeline-item
                    v-for="(item,index) in item.childrenPage.list"
                    :key="index"
                    placement="top"
                    style="background-color:#f7f8fa"
                  >
                    <div>
                      <div class="title">
                        <div>{{ item.description }}</div>
                        <i class="el-icon-user-solid" />
                        <span>{{ item.cname }} 回复 {{item.receiver}} {{ item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                        <el-link icon='el-icon-chat-square' @click="reply(data, item)">回复</el-link>
                        <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteReply(item)">删除</el-link>
                      </div>
                      <div v-if="item.tsDataVo && item.tsDataVo.path" style="font-size:12px;color:#3478d4;">
                          <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                          <el-button  @click="downloadData(item.tsDataVo)" style="color:#3478d4" type="text" size="mini"> {{item.tsDataVo.name}}</el-button>
                      </div>
                    </div>
                  </el-timeline-item>
                  <el-pagination
                    style="margin-top:15px;"
                    v-if="item.childrenPage.totalPage>1"
                    :page-size= item.childrenPage.pageSize
                    layout="total, prev, pager, next, jumper"
                    :total= item.childrenPage.total
                    @current-change="answerHleCurrentChange($event,item)"
                  />
                </el-timeline>
                </el-collapse-item>
              </el-collapse>
          </el-timeline-item>
        </el-timeline>
         <el-pagination
                style="margin-top:15px;"
                v-if="total>pageSize"
                :current-page="pageNum"
                :page-size= pageSize
                layout="prev, pager, next, jumper"
                :total= total
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
      </el-collapse-item>
     
    </el-collapse>
     
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="回复">
      <el-form
        ref="questionForm"
        name="questionForm"
        :model="questionForm"
        label-position="left"
        label-width="100px"
      >
        <!-- <el-form-item label="技术支持标题">
          <span>软件授权使用问题</span>
        </el-form-item>-->
        <el-form-item
          label="回复内容："
          prop="content"
          :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
        >
          <!-- <markdown-editor ref="markdownEditor" v-model="questionForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="250px" /> -->
          <el-input
            v-model="questionForm.content"
            size="small"
            :rows="7"
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
          <!-- <el-input v-model="questionForm.tsDataVo.name" style="width:calc(100% - 100px);display:inline-block">   </el-input> -->
          <el-upload
            style="display:inline-block;"
            action="#"
            :multiple="false"
            :file-list="fileList"
            :show-file-list="false"
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
            <div >
              <el-button class="file-btn" size="small" type="primary">附件上传</el-button>
            </div>
          </el-upload>
        </el-form-item>
        <el-table v-if="tsDataVoList.length>0" :data="tsDataVoList" size="mini" style="margin:10px;">
              <el-table-column min-width="200px" label="资料名称">
                <template slot-scope="{row}">
                  <template>
                    <el-input v-model="row.name" class="edit-input" size="small" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" label="资料类型" prop="category">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.typeId" size="small" style="width:80%">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in typeData" :key="index"></el-option>
                    </el-select>
                </template>
              </el-table-column>
            
              <el-table-column align="center" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    style="color:red;"
                    @click="handleRemoveDataFile(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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
import * as category from '@/api/category'

import { Input } from 'element-ui';
export default {
  data() {
    return {
      pageNum:1,
      pageSize:6,
      total:0,

      answerPageNum:1,
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
        tsDataVo: {
          name: ''
        }
      },
      tsDataVoList: [],
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
      this.getSupportAnswer();
      this.getCategoryList();
  },
  methods: {
    /**
     * 获取分类列表
     */
    getCategoryList() {
      category.getCategoryList("data_type").then(response => {
          if (response.code === 200) {
              // debugger
              this.typeData = response.data.list
          }
      })
    },
    async downloadData(item){
      // let realpath = item.path.substring(0,item.path.length-1)
      // const blob = await ts.downloadDataByPath(realpath)
      // let fileName = item.path.substring(24,item.path.length-1)
      let realpath = item.path
      const blob = await ts.downloadDataByPath(realpath)
      let fileName = item.name
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
          console.log(response.data[0], "9998989");
          let result = response.data;
          // this.data.softwareQuestionAnswers=result.answers
          this.data.id=result.id
          this.data.title=result.title
          this.data.description=result.content
          this.data.softwareId=result.softwareId
          this.data.softwareName=result.softwareName
          this.data.softwareVersionID=result.softwareVersionID
          this.data.version=result.softwareVersion
          this.data.devUnit=result.devUnit
          this.data.status=result.status
          this.data.cid=result.cid
          this.data.cname=result.cname
          this.data.ctime=result.ctime
         
        }
      })
    },

    getSupportAnswer() {
      let params =  {
        questionId:this.$route.query.tsQuestionId,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
      }
      ts.getSupportAnswer(params).then(response =>{
        if(response.code === 200){
          let result = response.data;
          this.data.softwareQuestionAnswers=result.data.list;
          this.answerlength = result.answerTotal;
          this.total = result.data.total
        }
      })
    },
    
    answerHleCurrentChange(current, item) {
       let params =  {
        questionId:this.$route.query.tsQuestionId,
        answerId:item.id,
        pageNum:current,
        pageSize:item.childrenPage.pageSize,
      }
      // this.answerPageNum
      ts.getSupportAnswerPage(params).then(response =>{
        if(response.code === 200){
          let result = response.data;
          item.childrenPage=result;
        }
      })
    },
    closeQuestion() {
      this.$confirm("确定关闭此技术支持吗", "提示", {
        type: "warning"
      }).then(e => {
        ts.finishTsQuestion({id:this.data.id}).then(response => {
        if (response.code === 200) {
            // this.$emit('getSoftwareQuestion', this.flag)
            this.$message.success('关闭成功')
            this.$router.push({
              path: "/admin/ts/question"
            })
        }
        })
      });
    },
    reply(question, answer) {
      // debugger
      
      this.dialogVisible = true;
      // 重置表单
      // this.resetForm('questionForm');
      this.questionForm = {}
      // 重置文件列表
      this.tsDataVoList =[];
      this.fileData = null;
      // console.log(this.$route)
      console.log(answer, 9999);
       if(answer!=null) {
        this.questionForm.pid = answer.id
        this.questionForm.receiveId = answer.cid
        this.questionForm.receiver = answer.cname
        this.questionForm.firstLevelPid = answer.firstLevelPid==0 ? answer.id : answer.firstLevelPid;
      }else{
        // this.questionForm.receiveId = this.data.cid
        // this.questionForm.receiver = this.data.cname
        
      }
    },
    replyConfirm() {
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          this.$modal.loading();
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          let formData = new FormData();
          formData.append("files", this.fileData)
          formData.append("tsQuestionId", this.$route.query.tsQuestionId);
          formData.append("description", this.questionForm.content);
          formData.append("cid", userInfo.userId);
          formData.append("pid", this.questionForm.pid?this.questionForm.pid:0);
          formData.append("firstLevelPid", this.questionForm.firstLevelPid?this.questionForm.firstLevelPid:0);
          if( this.questionForm.receiveId) {
            formData.append("receiveId",this.questionForm.receiveId);
          }
          if(this.questionForm.receiver) {
              formData.append("receiver", this.questionForm.receiver);
          }
          
          if(this.tsDataVoList.length>0) {
            this.tsDataVoList.forEach(( obj,index) => {
              for(var item in obj) {
                formData.append("tsDataVoList["+index+"]."+item, obj[item])
              }
              
            })
          }
          ts.reply(formData).then(response =>{
            if(response.code === 200){
              this.$message.success("回复成功")
              this.$modal.closeLoading();
              this.dialogVisible = false
              this.getSupportAnswer();
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
              this.getSupportAnswer();
              this.$message.success("删除成功");
            }
          })
        });
    },
    deleteSoftwareQuestion() {
      this.$confirm("确定删除该技术支持吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delTsQuestion(this.data.id).then(response => {
          if (response.code === 200) {
            // this.$emit("getSoftwareQuestion", this.flag);
            this.$message.success("删除成功");
            this.$router.push({
              path: "/admin/ts/question"
            })
          }
        });
      });
    },
    async uploadFile(param) {
      this.fileData = param.file;
      // this.questionForm.tsDataVo.name = param.file.name
      this.tsDataVoList = [{
        name : param.file.name,
        typeId: this.typeData[0].id,
        typeName: this.typeData[0].name,
      }]
    },
    handleRemoveDataFile(index, item) {
      delete this.fileData 
      this.tsDataVoList.splice(index, 1);
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
    handleChangeFile(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [file]
    },
     handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
       this.getSupportAnswer()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getSupportAnswer()
       
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
    font-size: 16px;
    font-weight:400;
    word-break: break-all;
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
    width: 260px;
    border-left: 4px #409eff solid;
    height: 20px;
    line-height: 20px;
    padding-left: 5px;
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
  .ribbon {
    background: red;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    right: -90px;
    top: 10px;
    transform: rotate(45deg);
    box-shadow: 0 0 10px #888;
  }

  .ribbon span {
    /* border: 1px solid #54CBFF; */
    color: #fff;
    display: block;
    margin: 1px 0;
    padding: 5px 85px;
    text-align: center;
    text-shadow: 0 0 5px #444;
    font-size: 10px;
  }
</style>