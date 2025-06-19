<template>
  <div style="overflow-y: auto;height:calc(100vh - 235px)">
    <div>
      <el-button
        v-for="(item, index) in navList"
        :key="index"
        class="nav-button"
        :class="{active:item.status==curIndex}"
        type="button"
        @click="changeStatus(item)"
      >{{ item.name }}</el-button>
    </div>
    <!-- <el-divider></el-divider> -->
    <!-- <DemandItem v-for="(item, index) in demandData" :key="index" :data='item'></DemandItem> -->
    <el-card v-for="(item, index) in demandData" :key="index" class="software-resource-card">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="title">
              <i class="el-icon-user-solid" />
              {{ item.realname }}
            </div>
            <div class="title">
              <i class="el-icon-s-check" />
              <span>{{ item.company }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="title">
              <i class="el-icon-date" />
              <span>{{ item.ctime| parseTime('{y}-{m}-{d}') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="title">
            <i class="el-icon-s-opportunity">标题：</i>
            {{ item.title }}
          </div>
          <div class="title">
            <span>{{ item.description }}</span>
          </div>
          <div style="text-align:right">
            <!-- <el-button size="small" type="warning" @click="handle(item)">处理需求</el-button> -->
            <el-button size="small" type="primary" @click="replyVisible=true">回复</el-button>
            <el-button size="small" type="danger" @click="deleteMyDemand(item)">删除</el-button>
            <el-button size="small" type="danger" v-if="item.status!=2" @click="closeDemand" v-text="'关闭'"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="title">
            软件名称:
            <span>{{ item.softwareName }}</span>
          </div>
          <div class="title">
            软件版本:
            <span>{{ item.softwareVersion }}</span>
          </div>
          <div class="title">
            处理状态:
            <span>{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</span>
          </div>
        </el-col>
      </el-row>

      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <el-button
              size="mini"
              icon="el-icon-s-comment"
              type="text"
            >回复：（{{ item.replyList.length!=0?item.replyList.length:0 }}）</el-button>
          </template>
          <el-timeline style="padding-right: 10px;padding-top: 5px">
            <el-timeline-item
              v-for="(item1,index) in item.replyList"
              :key="index"
              :timestamp="item1.ctime | parseTime('{y}-{m}-{d}')"
              placement="top"
            >
              <el-card>
                <div class="title">
                  <div>{{ item1.description }}</div>
                  <i class="el-icon-user-solid" />
                  <span>{{ item1.realname }} 回复于 {{ item1.ctime | parseTime('{y}-{m}-{d}') }}</span>
                  <el-link icon="el-icon-chat-square" @click="replyVisible=true">回复</el-link>
                  <el-link icon="el-icon-delete" style="color:red;margin-left:6px">删除</el-link>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
      </el-collapse>

      <!-- <el-dialog :visible.sync="dialogVisible" title="回复"> -->
      <el-dialog :visible.sync="replyVisible" title="回复">
        <el-form
          ref="replyForm"
          name="replyForm"
          :model="replyForm"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="回复内容：" prop="content" :rules="[{required:true,message:'回复内容不能为空',trigger:'blur'}]">
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
          <el-button size="small" type="primary" @click="addAnswer(item)">确定</el-button>
          <el-button size="small" type="info" @click="replyVisible=false">取消</el-button>
        </span>
      </el-dialog>

      <!-- <div style="margin:10px 0;" v-if="item.replyVisible">
                <markdown-editor ref="markdownEditor" v-model="answerDescription" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="400px"   />
                <div style="margin:20px 0;text-align:center;">
                    <el-button size="small" type="primary" @click="addAnswer(item)" > 处理</el-button>
                </div>
      </div>-->
    </el-card>
  </div>
</template>
<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import * as demand from "@/api/demand";
import * as ts from "@/api/ts";
import * as devunit from "@/api/devunit";
export default {
  components: {
    DemandItem: () => import("./demand-item.vue"),
    MarkdownEditor
  },
  data() {
    return {
      replyForm: {
        answerDescription: ""
      },
      zbStatus: "",
      total: "",
      totalPage: "",
      keyword: "",
      status: "",

      navList: [
        { status: 0, name: "未解决" },
        { status: 1, name: "处理中" },
        { status: 2, name: "已处理" }
      ],
      curIndex: 0,
      replyVisible: false,
      demandData: [
        {
          replyList: []
        }
      ],
      scopeId: -1
    };
  },
  async created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    await this.getDemandQuery();
  },
  async mounted() {
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // await this.getDemandQuery()
  },
  methods: {
    closeDemand() {
      this.$confirm("确定关闭该需求吗？", "提示", {
        type: "warning"
      }).then(e => {
        demand.finishDemand(item.id, this.userInfo.userId).then(response => {
          if(response.code===200){
            this.$message.info("需求关闭成功。")
            location.reload()
          }
        })
      });
    },
    deleteMyDemand(item) {
      this.$confirm("确定删除该需求吗？", "提示", {
        type: "warning"
      }).then(e => {
        demand.deleteDemand(item.id).then(async response => {
          console.log(response,"response")
          if(response.msg=="删除成功"){
            this.$message.success("删除成功");
            await this.getDemandQuery();
          }
        });
      });
    },
    // 获取需求提报列表
    async getDemandQuery() {
      this.status = this.curIndex;
      this.zbStatus = 0;
      // demand.getDemandQuery(this.userInfo.userId,this.keyword,this.status,1,10,this.zbStatus).then(response=>{
      const response = await demand.getDemandQuery(
        this.userInfo.userId,
        this.keyword,
        this.status,
        1,
        10,
        this.zbStatus
      );
      if (response.code === 200) {
        this.demandData = JSON.parse(JSON.stringify(response.data.list));
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
      }
      // })
    },
    async changeStatus(item) {
      console.log("item=============", item);
      this.curIndex = item.status;
      await this.getDemandQuery();
    },
    handle(val) {
      this.replyVisible = true;
      this.scopeId = val.id;
      console.log("val=========", val);
    },
    //处理需求
    addAnswer(item) {
      this.$refs.replyForm.validate((valid) => {
        if(valid){
          debugger;
          const data = {
            demandId: item.id,
            description: this.replyForm.answerDescription,
            uid: this.userInfo.userId,
            pid: item.pid
          };
          demand.addAnswer(data).then(response => {
            if (response.code == 200) {
              this.$message.success("回复成功！！")
              this.getDemandQuery();
              this.replyVisible = false;
              // window.location.reload()
            }
          });
        }else{
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
};
</script>
<style scoped>
</style>
