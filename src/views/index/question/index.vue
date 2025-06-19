<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="全部评价" name="first">
        <QuestionItem v-for="(item,index) in questionData" :data="item" :flag="flag" :key="index" @getSoftwareQuestion="getSoftwareQuestion" />
      </el-tab-pane>
      <el-tab-pane label="我的评价" name="second">
        <QuestionItem v-for="(item,index) in questionData" :data="item" :flag="flag" :key="index" @getSoftwareQuestion="getSoftwareQuestion" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as question from '@/api/question'
export default {
  components: {
    QuestionItem: () => import('./software-question-item.vue')
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      pageSize: 10,
      total: 1,
      questionData: [
        {
          softwareName:"Google浏览器",
          softwareDevUnit:'Google',
          version:'87',
          identity:'identity',
          realname:'张三',
          ctime:'2023-03-02 12:23:12',
          title:"标题",
          description:"描述",
          softwareQuestionAnswers:[]
        }
      ],
      userInfo: {},
      flag: 0
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // this.getSoftwareQuestion(0)
  },
  methods: {
    getSoftwareQuestion(flag) {
      question.getSoftwareQuestionListByUser(this.userInfo.userId, flag, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.questionData = response.data.list
          this.total = response.data.total
        }
      })
    },
    handleTabClick(tab) {
      switch (tab.name) {
        case 'first':
          this.flag = 0
          // this.getSoftwareQuestion(0)
          break
        case 'second':
          this.flag = 1
          // this.getSoftwareQuestion(1)
          break
        default:
          break
      }
    }
  }
}
</script>
