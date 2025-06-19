<template>
  <el-card class="software-question" style="margin-bottom: 10px">
    <div slot="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="title">
            <i class="el-icon-s-management" />
            {{ data.softwareName }}
            <span><{{ data.identity }}></span>
            <el-tag type="primary" size="mini" style="margin: 0 10px;color: white;background-color: #2187a8">{{ data.version }}</el-tag>
<!--            <span>{{ data.identity }}</span>-->
          </div>
          <div class="title">
            <i class="el-icon-s-check" />
            研发单位：
            <span>{{ data.softwareDevUnit }}</span>
            <!--            <span>{{ data.submitUnit }}</span>-->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="title">
            <i class="el-icon-user-solid" />
            评价人：
            <span>{{ data.realname }}</span>
          </div>
          <div class="title">
            <i class="el-icon-date" />
            评价时间：
            <span>{{ data.ctime }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10">
      <el-col :span="20">
        <div class="title">
          <i class="el-icon-s-opportunity">标题：</i>
          <div>
          {{ data.title }}
          </div>
        </div>
        <div class="title">
          <span>
            {{ data.description }}
          </span>
        </div>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button size="mini" style="background:red;color:white;margin-top:10px" @click="deleteSoftwareQuestion">删除</el-button>
      </el-col>
    </el-row>
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <el-button size="mini" icon="el-icon-s-comment" type="text">评价：（{{ data.softwareQuestionAnswers.length }}）</el-button>
        </template>
        <el-timeline style="padding-right: 10px;padding-top: 5px">
          <el-timeline-item v-for="(item,index) in data.softwareQuestionAnswers" :key="index" :timestamp="item.ctime" placement="top">
            <el-card>
              <div class="title">
                <div>{{ item.description }}</div>
                <i class="el-icon-user-solid" />
                <span>{{ item.realname }} 回复于 {{ item.ctime }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="软件评价">
      <el-form ref="questionForm" name="questionForm" model="questionForm" label-position="left" label-width="100px">
        <el-form-item label="评价标题">
          <span>软件授权使用问题</span>
        </el-form-item>
        <el-form-item label="回复内容：" prop="content" :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]">
<!--          <markdown-editor ref="markdownEditor" v-model="questionForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="250px" />-->
          <el-input v-model="questionForm.content" size="small" :rows="5" type="textarea" show-word-limit maxlength="200" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" style="background:#05994e;color:white;">评价</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as question from '@/api/question'
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
    },
    flag: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
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
    deleteSoftwareQuestion() {
      this.$confirm('确定删除该评论吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        question.deleteSoftwareQuestion(this.data.id).then(response => {
          if (response.code === 200) {
            this.$emit('getSoftwareQuestion', this.flag)
            this.$message.success('删除成功')
          }
        })
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
            color:rgb(8, 151, 151);
        }
        .title{
            font-size:14px;
            font-weight: 600;
            span{
                font-size: 12px;
                color:#a1a1a1;
                font-weight: 400;
                padding-left: 5px;
              padding-right: 10px;
            }
        }
    }
</style>
