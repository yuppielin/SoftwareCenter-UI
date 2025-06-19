<template>
  <el-card class="software-question" style="margin-bottom: 10px">
    <div slot="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="title">
            <i class="el-icon-user-solid" />
            {{ data.cname }}
          </div>
          <div class="title">
            <i class="el-icon-s-check" />
            <span>{{ data.devUnit }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="title">
            <i class="el-icon-date" />
            <span>{{ data.ctime }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="20">
        <div class="title">
          <i class="el-icon-s-opportunity">标题：</i>
          {{ data.title }}
        </div>
        <div class="title">
          <span>
            {{ data.content }}
          </span>
        </div>
      </el-col>
      <el-col :span="4" style="text-align:right">
<!--        <el-button size="mini" style="background:#05994e;color:white;margin-top:10px" @click="dialogVisible=true">我要回复</el-button>-->
      </el-col>
    </el-row>
    <el-collapse accordion @change="showAnswer($event, data.id)" v-if="data.answerTotal>0">
      <el-collapse-item>
        <template slot="title">
          <el-button size="small" icon="el-icon-s-comment" type="text" style="color:#3478d4;">回复：（{{ data.answerTotal }}）</el-button>
        </template>
        <el-timeline style="padding-right: 10px;padding-top: 5px">
          <el-timeline-item
            v-for="(item,index) in softwareQuestionAnswer.list"
            :key="index"
            :timestamp="item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')"
            placement="top"
          >
            <el-card>
              <div class="title">
                <div>{{ item.description }}</div>
                <i class="el-icon-user-solid" />
                <span>{{ item.cname }} 回复于 {{ item.ctime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                <!-- <el-link icon='el-icon-chat-square' @click="reply(data, item)">回复</el-link>
                <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteReply(item)">删除</el-link> -->
              </div>
               <div v-if="item.tsDataVo && item.tsDataVo.path" style="font-size:12px;color:#3478d4;">
                  <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                  <el-button  @click="downloadData(item.tsDataVo)" style="color:#3478d4" type="text" size="mini"> {{item.tsDataVo.name}}</el-button>
              </div>
            </el-card>
             <el-collapse accordion1 v-if="item.childrenPage.total>0">
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
                        <!-- <el-link icon='el-icon-chat-square' @click="reply(data, item)">回复</el-link>
                        <el-link icon='el-icon-delete'  style="color:red;margin-left:6px" @click="deleteReply(item)">删除</el-link> -->
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
                    layout="total, prev, pager, next,jumper"
                    :total= item.childrenPage.total
                    @current-change="answerHleCurrentChange($event,item)"
                  />
                </el-timeline>
                </el-collapse-item>
              </el-collapse>
          </el-timeline-item>

          <el-pagination
                style="margin-top:15px;"
                v-if="softwareQuestionAnswer.totalPage>1"
                :page-size= softwareQuestionAnswer.pageSize
                layout="total, prev, pager, next,jumper"
                :total= softwareQuestionAnswer.total
                @current-change="answerHandleCurrent($event,data)"
              />
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="问题回答">
      <el-form ref="questionForm" name="questionForm" :model="questionForm" label-position="left" label-width="100px">
        <el-form-item label="问题标题：">
          <el-input v-model="data.title" readonly size="small" />
          <!--          <span style="color: #ffffff">{{ data.title }}</span>-->
        </el-form-item>
        <el-form-item label="回复内容：" prop="description" :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]">
          <!--          <markdown-editor ref="markdownEditor" v-model="questionForm.description" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="250px" />-->
          <el-input v-model="questionForm.content" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" style="background:#05994e;color:white;" @click="addSoftwareQuestionAnswer('questionForm')">回答</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as ts from '@/api/ts'
export default {
  components: {
    MarkdownEditor
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      pageNum:1,
      pageSize:6,
      total:0,
      totalPage:0,

      softwareQuestionAnswers:[],
      softwareQuestionAnswer:{},

      dialogVisible:false,

      answerPageNum:1,
      answerlength:0,

      userInfo: {},
      answerData: {},
      questionForm: {
        description: ''
      },
      currentQuestion: ''
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  },
  methods: {
    async downloadData(item) {
      const realpath = item.path.substring(0, item.path.length - 1)
      const blob = await ts.downloadDataByPath(realpath)
      const fileName = item.path.substring(24, item.path.length - 1)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.setAttribute('download', fileName)
      a.setAttribute('target', '_blank')
      // a.download = "shili.rar"
      a.setAttribute('href', url)
      a.click()
    },
    showAnswer(event, questionId) {
      if(event>0) {
        this.questionId =  questionId
        this.getSupportAnswer()
      }
      
    },
     getSupportAnswer() {
      let params =  {
        questionId:this.questionId,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
      }
      ts.getSupportAnswer(params).then(response =>{
        if(response.code === 200){
          let result = response.data;
          console.log(result, 999);
          // this.data.softwareQuestionAnswers=result.data.list;
          this.softwareQuestionAnswers=result.data.list;
          this.answerlength = result.answerTotal;
          this.total = result.data.total
          this.totalPage = result.data.totalPage

          this.softwareQuestionAnswer = result.data;
        }
      })
    },
    answerHandleCurrent(current, item) {
      this.pageNum = current;
      this.getSupportAnswer();
    },
     answerHleCurrentChange(current, item) {
       let params =  {
        questionId:item.tsQuestionId,
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
    addSoftwareQuestionAnswer(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            questionId: this.data.id,
            description: this.questionForm.description,
            uid: this.userInfo.userId,
            softwareId: this.data.id,
            versionId: this.data.versionId,
            username: this.userInfo.username,
            realname: this.userInfo.realName,
            uUser: this.userInfo.userId,
            receivedUid: this.data.uid,
            receivedName: this.data.realname
          }
          ts.addSoftwareQuestionAnswer(data).then(response => {
            if (response.code === 200) {
              this.dialogVisible = false
              this.$emit('getSoftwareQuestion')
              this.$message.success('回复成功')
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
    .software-question{
        // background: rgba(197, 194, 194, 0.1);
        background: #fff;
        line-height:20px;
        border: 1px solid lightgray;
        ::v-deep .el-card__header{
            padding: 5px 20px;
        }
        ::v-deep .el-collapse{
            border-top: 0px solid #e6ebf5;
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__header{
            line-height: 20px;;
            height:20px;
            background-color: rgba(197, 194, 194, 0.0);
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__arrow{
            margin: 0;
        }
        ::v-deep .el-timeline-item {
            padding-bottom: 10px;
        }
        ::v-deep .el-collapse-item__content{
            margin-bottom: 0;
        }
        i{
            color: #3b5975;
        }
        .title{
            font-size:16px;
            font-weight:400;
            word-break: break-all;
            span{
                font-size: 12px;
                color:#a1a1a1;
                font-weight: 400;
                padding-left: 5px;
                padding-right: 10px;
            }
        }
        .subtitle{
            font-size:12px;
            display:inline-block;
            min-width:260px;
            border-left: 4px #409eff solid;
            height: 20px;
            line-height: 20px;
            padding-left: 5px;
            span{
                font-size: 10px;
                color:#a1a1a1;
                font-weight: 400;
                padding-left: 5px;
                padding-right: 10px;
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        // ::v-deep .el-table th.is-leaf, .el-table td {
        //   border-bottom: 0px solid #dfe6ec;
        //   font-size: 10px;
        // }
        // ::v-deep .el-table .cell {
        //   font-size: 10px;
        // }
        // ::v-deep .el-link{
        //   span,i {
        //     font-size: 14px;
        //   }
        // }
    }
</style>
