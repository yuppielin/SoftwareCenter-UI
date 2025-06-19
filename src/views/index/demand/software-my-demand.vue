<template>
  <div style="overflow-y: auto;height:calc(100vh - 150px)">
    <!--    <div>-->
    <!--      <el-button-->
    <!--        v-for="(item, index) in navList"-->
    <!--        :key="index"-->
    <!--        class="nav-button"-->
    <!--        :class="{active:item.status==curIndex}"-->
    <!--        type="button"-->
    <!--        @click="changeStatus(item)"-->
    <!--      >{{ item.name }}</el-button>-->
    <!--    </div>-->
    <!--    <span style="width:50%;border-right:1px solid rgba(230,237,240,1);">-->
    <!--        <div>-->
    <!--        <el-button-->
    <!--          v-for="(item, index) in navList"-->
    <!--          :key="index"-->
    <!--          class="nav-button"-->
    <!--          :class="{active:item.status==curIndex}"-->
    <!--          type="button"-->
    <!--          @click="changeStatus(item)"-->
    <!--        >{{ item.name }}</el-button>-->
    <!--      </div>-->
    <!--      -->
    <!--    </span>-->
    <!--    <span style="width:50%"></span>-->

    <el-row>
      <el-col :span="12" style="border-right:1px solid rgba(154,159,161,0.5);">
        <div calss="status-btn" style="text-align:right;margin-right: 10px;margin-top: 15px">
          <el-radio-group v-model="statusRadio" @change="changeStatus()">
            <el-radio-button :label=0>未解决</el-radio-button>
            <el-radio-button :label=1>处理中</el-radio-button>
            <el-radio-button :label=2>已处理</el-radio-button>
          </el-radio-group>
<!--          <el-button-->
<!--            v-for="(item, index) in navList"-->
<!--            :key="index" plain-->
<!--            :class="{active:item.status==curIndex}"-->
<!--            type="primary"-->
<!--            @click="changeStatus(item)"-->
<!--            style="border: none"-->
<!--          >{{ item.name }}</el-button>-->
        </div>
        <el-collapse v-model="activeDemand" accordion style="margin-top: 10px;min-height: calc(100vh - 270px)">
          <el-collapse-item v-for="(item, index) in demandData" :key="index" :name="index">
            <span slot="title" class="collapse-title" size="mini" type="text" @click="handleDemandClick(item)">
              <el-row>
                <el-col :span="18">
                  <div style="font-weight:bold;font-size:16px">
                    {{ item.title }}
                  </div>
                </el-col>
                <el-col :span="6" class="btn-demand" style="text-align:right;padding-right:20px">
                  <el-button v-if="item.status!=2" size="mini" icon="el-icon-message" type="text" @click.stop.native @click="replyDemand(item, index)">回复 {{ item.replyTotal }}</el-button>
                  <el-button size="mini" type="text" icon="el-icon-delete" @click.stop.native @click="deleteMyDemand(item)">删除</el-button>
                  <el-button v-if="item.status!=2" size="mini" icon="el-icon-circle-check" type="text" @click.stop.native @click="closeDemand(item)">关闭</el-button>
                </el-col>
              </el-row>
            </span>
            <el-row>
              <el-col :span="24" style="padding-left: 25px;color: rgba(86,86,86,1)">{{ item.description }}</el-col>
              <el-col :span="24" style="padding-left: 25px;margin-top:5px">
                <el-row>
                  <el-col :span="6" class="ts-col-label">
                    软件名称：<span>{{ item.softwareName }}</span>
                  </el-col>
                  <el-col :span="6" class="ts-col-label">
                    软件版本:
                    <span>{{ item.softwareVersion }}</span>
                  </el-col>
                  <el-col :span="6" class="ts-col-label">
                    处理状态:
                    <span>{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</span>
                  </el-col>
                  <el-col :span="6" class="ts-col-label">
                    提报时间：
                    <span>{{ item.ctime| parseTime('{y}-{m}-{d}') }}</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-pagination
          style="margin-top:15px;"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
      <el-col :span="12">
        <el-row style="margin-top: 15px" v-if="this.statusRadio!=2">
          <el-col :span="2" style="text-align: right">
            <img :src="avatar+'?imgSource'" class="user-avatar" :onerror="defaultA">
          </el-col>
          <el-col :span="22" style="padding-left: 20px">
            <el-input :disabled="replyAble" placeholder="点击可回复" style="width: 80%" v-model="replyMessage">
              <el-button :disabled="replyAble" slot="append" size="small" @click="replyAnswer">回复</el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-divider />
        <el-timeline style="padding-right: 10px;padding-top: 5px;overflow-y:auto;height: calc(100vh - 310px);">
          <el-timeline-item
            v-for="(item1,index) in this.currentDemand.replyList"
            :key="index"
            :timestamp="item1.realname"
            icon="el-icon-user-solid"
            placement="top"
          >
            <el-card style="border: none">
              <div class="title" style="padding: 10px 0">
                <div style="color: rgba(63,63,63,1);word-break: break-all;">{{ item1.description }}</div>
                <span style="color: rgba(149,149,163,1)">{{ item1.ctime | parseTime('{y}-{m}-{d}') }}</span>
                <!-- <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> -->
                <el-button icon="el-icon-delete" type="text" style="margin-left:6px" @click="deleteMyDemandReply(item1)" />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
         <el-pagination
                style="margin-top:15px;"
                v-if="replyDemandPage.totalPage>1"
                :page-size="replyDemandPage.pageSize"
                layout="prev, pager, next,jumper"
                :current-page="replyDemandPage.pageNum"
                :total="replyDemandPage.total"
                @current-change="answerHandleCurrent($event)"
              />
      </el-col>
    </el-row>
<!--    <div style="text-align:center;">-->
<!--      <el-image :src="require('@/assets/index/nodata.png')"  style="height:600px"></el-image>-->
<!--    </div>-->
    <!--    <el-card v-for="(item, index) in demandData" :key="index" class="software-resource-card">-->
    <!--      <div slot="header">-->
    <!--        <el-row :gutter="20">-->
    <!--          <el-col :span="16">-->
    <!--            标题:-->
    <!--            <span style="font-size:16px;font-weight:600px;"> {{ item.title }}</span>-->
    <!--          </el-col>-->
    <!--          <el-col :span="8" style="text-align:right;">-->
    <!--            <el-button v-if="item.status!=2" size="mini" type="primary" @click="replyDemand(item)">回复</el-button>-->
    <!--            <el-button size="mini" type="danger" @click="deleteMyDemand(item)">删除</el-button>-->
    <!--            <el-button v-if="item.status!=2" size="mini" type="danger" @click="closeDemand(item)">关闭</el-button>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row :gutter="20">-->
    <!--          <el-col :span="6">-->
    <!--            <div class="title">-->
    <!--              软件名称:-->
    <!--              <span>{{ item.softwareName }}</span>-->
    <!--            </div>-->
    <!--          </el-col>-->
    <!--          <el-col :span="6">-->
    <!--            <div class="title">-->
    <!--              软件版本:-->
    <!--              <span>{{ item.softwareVersion }}</span>-->
    <!--            </div>-->
    <!--          </el-col>-->
    <!--          <el-col :span="6">-->
    <!--            <div class="title">-->
    <!--              处理状态:-->
    <!--              <span>{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</span>-->
    <!--            </div>-->
    <!--          </el-col>-->
    <!--          <el-col :span="6">-->
    <!--            <div class="title">-->
    <!--              提报时间：-->
    <!--              <span>{{ item.ctime| parseTime('{y}-{m}-{d}') }}</span>-->
    <!--            </div>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--      </div>-->
    <!--      <el-row :gutter="20">-->
    <!--        <el-col :span="24">-->
    <!--          <div class="title">-->
    <!--            内容：-->
    <!--            <span style="font-size:14px">{{ item.description }}</span>-->
    <!--          </div>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-collapse accordion>-->
    <!--        <el-collapse-item>-->
    <!--          <template slot="title">-->
    <!--            <el-button-->
    <!--              size="mini"-->
    <!--              icon="el-icon-s-comment"-->
    <!--              type="text"-->
    <!--            >回复：（{{ item.replyList.length!=0?item.replyList.length:0 }}）</el-button>-->
    <!--          </template>-->
    <!--          <el-timeline style="padding-right: 10px;padding-top: 5px">-->
    <!--            <el-timeline-item-->
    <!--              v-for="(item1,index) in item.replyList"-->
    <!--              :key="index"-->
    <!--              :timestamp="item1.ctime | parseTime('{y}-{m}-{d}')"-->
    <!--              placement="top"-->
    <!--            >-->
    <!--              <el-card>-->
    <!--                <div class="title">-->
    <!--                  <div>{{ item1.description }}</div>-->
    <!--                  <i class="el-icon-user-solid" />-->
    <!--                  <span>{{ item1.realname }} 回复于 {{ item1.ctime | parseTime('{y}-{m}-{d}') }}</span>-->
    <!--                  &lt;!&ndash; <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> &ndash;&gt;-->
    <!--                  <el-link icon="el-icon-delete" style="color:red;margin-left:6px" @click="deleteMyDemandReply(item1)">删除</el-link>-->
    <!--                </div>-->
    <!--              </el-card>-->
    <!--            </el-timeline-item>-->
    <!--          </el-timeline>-->
    <!--        </el-collapse-item>-->
    <!--      </el-collapse>-->
    <!--    </el-card>-->
    <!--    <div v-if="demandData.length==0" style="text-align:center;">-->
    <!--      <el-image :src="require('@/assets/index/nodata.png')" style="height:600px" />-->
    <!--    </div>-->
    <el-dialog :before-close="beforeClose" :visible.sync="replyVisible" title="回复">
      <el-form
        ref="replyFormRef"
        name="replyForm"
        :model="replyForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="回复内容：" prop="answerDescription" :rules="[{required:true,message:'回复内容不能为空',trigger:'blur'}]">
          <el-input
            v-model="replyForm.answerDescription"
            size="small"
            :rows="7"
            :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
            type="textarea"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="addAnswer()">确定</el-button>
        <el-button size="small" type="info" @click="replyVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import * as demand from '@/api/demand'
import * as ts from '@/api/ts'
import * as devunit from '@/api/devunit'
export default {
  components: {
    DemandItem: () => import('./demand-item.vue'),
    MarkdownEditor
  },
  data() {
    return {
      activeDemand: 0,
      avatar: null,
      replyForm: {
        answerDescription: ''
      },
      replyDemandItem: {},
      replyDemandIndex: 0,
      replyAble: true,
      replyDemandPage: {
        pageNum: 1,
        pageSize: 6
      },
      zbStatus: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: '',
      keyword: '',
      status: '',
      defaultA: 'this.src="' + require('@/assets/index/avatar.png') + '"',
      replyMessage: '',
      navList: [
        { status: 0, name: '未解决' },
        { status: 1, name: '处理中' },
        { status: 2, name: '已处理' }
      ],
      curIndex: 0,
      replyVisible: false,
      demandData: [],
      scopeId: -1,
      statusRadio: 0,
      currentDemand: {
        replyList: [
          // {
          //   answerDescription: '2222222',
          //   realname: '張三',
          //   description: '111110',
          //   ctime: '2020-04-04'
          // },
          // {
          //   answerDescription: '2222222',
          //   realname: '李四',
          //   description: '111110',
          //   ctime: '2020-04-04'
          // }
        ]
      }
    }
  },
  async created() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    await this.getDemandQuery()
  },
  async mounted() {
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // await this.getDemandQuery()
  },
  methods: {
    handleCurrentChange(value) {
      debugger
      this.currentPage = value
      this.getDemandQuery()
    },
    handleDemandClick(item) {
      this.currentDemand = JSON.parse(JSON.stringify(item))
      this.replyAble = false
      this.getDemandReply(item.id)
    },
    getDemandReply(demandId) {
      let params = {
        demandId: demandId,
        pageNum: this.replyDemandPage.pageNum,
        pageSize: this.replyDemandPage.pageSize
      };
      demand.getSupportAnswer(params).then(response => {
        if (response.code === 200) {
          let result = response.data;
        
          this.replyDemandPage.total = result.total;
          this.replyDemandPage.totalPage = result.totalPage;
          this.currentDemand.replyList = result.list;
        }
      });
    },
    answerHandleCurrent(current) {
      this.replyDemandPage.pageNum = current;
      this.getDemandReply(this.currentDemand.id);
    },
    beforeClose() {
      this.$refs.replyFormRef.clearValidate()
    },
    replyDemand(item, index) {
      this.replyVisible = true
      this.replyDemandItem = item
      this.replyDemandIndex = index;
    },
    closeDemand(item) {
      this.$confirm('确定关闭该需求吗？', '提示', {
        type: 'warning'
      }).then(e => {
        demand.finishDemand(item.id, this.userInfo.userId).then(response => {
          if (response.code === 200) {
            this.$message.info('需求关闭成功。')
            location.reload()
          }
        })
      })
    },
    deleteMyDemand(item) {
      this.$confirm('确定删除该需求吗？', '提示', {
        type: 'warning'
      }).then(e => {
        demand.deleteDemand(item.id).then(async response => {
          console.log(response, 'response')
          if (response.msg == '删除成功') {
            this.$message.success('删除成功')
            await this.getDemandQuery()
          }
        })
      })
    },
    deleteMyDemandReply(item) {
      this.$confirm('确定删除该需求吗？', '提示', {
        type: 'warning'
      }).then(e => {
        demand.deleteDemandReply(item.id).then(async response => {
          console.log(response, 'response')
          if (response.msg == '删除成功') {
            this.$message.success('删除成功')
            await this.getDemandQuery()
          }
        })
      })
    },
    // 获取需求提报列表
    async getDemandQuery() {
      this.status = this.curIndex
      this.zbStatus = 0
      // demand.getDemandQuery(this.userInfo.userId,this.keyword,this.status,1,10,this.zbStatus).then(response=>{
      const response = await demand.getDemandQuery(
        this.userInfo.userId,
        this.keyword,
        this.status,
        this.currentPage,
        this.pageSize,
        this.zbStatus
      )
      if (response.code === 200) {
        this.demandData = JSON.parse(JSON.stringify(response.data.list))
        this.total = response.data.total
        this.totalPage = response.data.totalPage
        // console.log("this.demandData===============", this.demandData);
        if(this.demandData && this.demandData.length>0){
          this.replyAble = false
          // this.currentDemand = this.demandData[0]
          this.replyDemandIndex = 0
          this.currentDemand =  this.demandData[this.activeDemand];
          this.handleDemandClick(this.currentDemand);
        }else{
          this.replyAble = true
          this.currentDemand = {
            replyList: []
          }
          this.replyDemandIndex = 0
        }
        
      }
      // })
    },
    async changeStatus() {
      this.currentPage = 1
      this.replyMessage = ""
      this.curIndex = this.statusRadio
      await this.getDemandQuery()
      this.activeDemand = 0
    },
    handle(val) {
      this.replyVisible = true
      this.scopeId = val.id
      console.log('val=========', val)
    },
    replyAnswer() {
      if (this.replyMessage) {
        const data = {
          demandId: this.currentDemand.id,
          description: this.replyMessage,
          uid: this.userInfo.userId,
          pid: this.currentDemand.pid
        }
        demand.addAnswer(data).then(response => {
          if (response.code === 200) {
            this.$message.success('回复成功！！')
            this.getDemandQuery()
            this.replyForm.answerDescription = ''
            this.replyVisible = false
            this.replyMessage = ""
            // window.location.reload()
          }
        })
      } else {
        this.$message.warning('回复内容不能为空')
      }
    },
    // 处理需求
    addAnswer() {
      console.log(this.replyDemandItem)
      console.log(this.$refs)
      this.$refs.replyFormRef.validate(valid => {
        if (valid) {
          const data = {
            demandId: this.replyDemandItem.id,
            description: this.replyForm.answerDescription,
            uid: this.userInfo.userId,
            pid: this.replyDemandItem.pid
          }
          demand.addAnswer(data).then(response => {
            if (response.code == 200) {
              this.$message.success('回复成功！！')
              this.getDemandQuery()
              this.replyForm.answerDescription = ''
              this.replyVisible = false
              // window.location.reload()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    // create(){
    //     this.$router.push({
    //         path: '/index/technical/add',
    //     })
    // },
  }
}
</script>
<style scoped>
  .el-card{
    border: 1px solid lightgray;
  }
  .software-resource-card >>> .el-card__header {
    padding: 20px 20px 0 20px;
  }
  .software-resource-card >>> .el-collapse{
    border: 0px;
  }
  .software-resource-card >>>.el-collapse-item__arrow{
    margin:0px;
  }
  .software-resource-card >>>.el-collapse-item__wrap{
    border-bottom: 0px;
  }
  ::v-deep .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }
  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
  .ts-col-label {
    color: rgba(149,149,163,1);
    font-size: 12px;
  }
  .ts-col-label>span {
    color: rgba(63,63,63,1);
    font-size: 12px;
  }
  /deep/ .el-collapse-item__content {
    padding-bottom: 0px!important;
  }
  /deep/ .el-collapse .is-active .el-collapse-item__header,/deep/ .el-collapse .is-active .el-collapse-item__content {
    background: rgba(23,138,227,0.05);
  }
  /deep/ .el-collapse>.is-active{
    border-left:2px solid rgba(23,138,227,1);
  }
  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }
  /deep/ .el-card__body {
    padding-bottom: 0px!important;
  }
  /deep/ .el-timeline-item__timestamp {
    color: rgba(23,138,227,1);
  }
  /deep/ .el-timeline-item__node--normal {
    width: 20px;
    height: 20px;
    left: -5px
  }
  /deep/ .el-button span {
    /*color: rgba(23,138,227,1);*/
  }
  .el-button--primary:active,/deep/ .el-button--primary.is-active {
    color: #fff;
  }
  /deep/ .el-collapse {
    border-top: none;
    border-bottom: none;
  }
  /deep/ .btn-demand .el-button--text {
    color: rgba(86,86,86,1)
  }
</style>
