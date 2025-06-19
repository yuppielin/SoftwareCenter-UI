<template>
  <div>
    <el-row :gutter="20" style="display:flex;flex-direction:row">
      <el-col :span="12" style="border-right:1px solid #fff;">
        <el-row style="height: 45px;">
          <el-col :span="12">
            <el-button
              type="primary"
              style="margin-bottom: 10px;"
              size="small"
              @click="openAddDemandDialog"
            >提报需求</el-button>
          </el-col>
          <el-col :span="12">
            <!-- <el-input placeholder="请输入查询条件">
              <el-button size="small" slot="append" icon="el-icon-search"></el-button>
            </el-input>-->
          </el-col>
        </el-row>
        <div style="height:500px;overflow:auto;" v-if="demandList.length>0">
          <el-collapse v-model="activeDemandName" accordion @change="selected">
            <el-collapse-item v-for="(item,index) in demandList" :key="index" :name="index">
              <template slot="title">
                <el-row style="width: 100%;">
                  <el-col :span="12">
                    <el-row>
                      <span
                        style="font-weight: 600;font-size: 16px;margin-left: 10px;"
                      >{{item.title}}</span>
                      <span
                        style="font-size: 12px;margin-left:20px;"
                      >{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</span>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <el-row style="text-align: right;">
                      <el-button
                        icon="el-icon-s-comment"
                        size="small"
                        type="text"
                        @click="activeDemandName=index;replyDemandFunction(item)"
                        @click.stop.native
                      >回复（{{ item.replyTotal }}）</el-button>
                      <!-- <el-button
                      icon="el-icon-delete"
                      size="small"
                      type="text"
                      @click="deleteDemandFunction(item)"
                      @click.stop.native
                    >删除</el-button>
                    <el-button
                      style="margin-right: 20px;"
                      icon="el-icon-success"
                      size="small"
                      type="text"
                      @click="closeDemandFunction(item)"
                      @click.stop.native
                      >结束</el-button>-->
                    </el-row>
                  </el-col>
                </el-row>
              </template>
              <div>
                <span style="margin-left: 10px;">{{item.description}}</span>
              </div>
              <div>
                <el-row style="margin-left: 10px;">
                  <el-col :span="6">
                    <span style="font-size: 12px;">软件名称：{{item.softwareName}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span style="font-size: 12px;">版本号：{{item.softwareVersion}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span style="font-size: 12px;">提报人员：{{item.realname}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span style="font-size: 12px;">提报时间：{{item.ctime | parseTime('{y}-{m}-{d}')}}</span>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')" style="height:300px;width:400px;"></el-image>
          <div>暂无需求</div>
        </div>
        <el-pagination
          style="margin-top:15px;"
          v-if="totalDemand>0"
          :current-page="pageNumDemand"
          :page-size="pageSizeDemand"
          layout="total, prev, pager, next"
          :total="totalDemand"
          @size-change="handleSizeChangeDemand"
          @current-change="handleCurrentChangeDemand"
        />
      </el-col>
      <el-col :span="12">
        <div v-show="replyDemandItem!=null" style="display: flex;height:45px">
          <img :src="avatar" class="user-avatar" :onerror="defaultA" />
          <el-input
            style="margin-left: 10px;"
            placeholder="点击可回复"
            @focus="showDemandReply"
          />
        </div>
        <!-- <div v-if="replyList.length==0" style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')" style="height:300px;width:400px;"></el-image>
          <div>暂无回复</div>
        </div> -->
        <div style="height:500px;overflow:auto;">
          <el-timeline style="padding-right: 10px;padding-top: 5px;padding-left: 22px;">
            <el-timeline-item
              v-for="(replyItem,index) in replyList"
              :key="index"
              :timestamp="replyItem.realname"
              icon="el-icon-user-solid"
              placement="top"
            >
              <div class="replay">
                <div>
                  <div class="desc">{{ replyItem.description }}</div>
                  <span class="time">{{ replyItem.cTime | parseTime('{y}-{m}-{d}') }}</span>
                  <!-- <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> -->
                  <!-- <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  title="删除回复"
                  @click="deleteDemandReply(replyItem)"
                  ></el-button>-->
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-pagination
          style="margin-top:15px;"
          v-if="replyDemandPage.totalPage>1"
          :current-page="replyDemandPage.pageNum"
          :page-size="replyDemandPage.pageSize"
          layout="prev, pager, next,jumper"
          :total="replyDemandPage.total"
          @current-change="answerHandleCurrent($event)"
        />
        <!-- <div v-for="(replyItem,index) in replyList" :key="index">
          <el-card>
            <div style="color: #1f8ace;">{{replyItem.realname}}</div>
            <div>
              <span>{{replyItem.description}}</span>
            </div>
            <div>
              <span style="font-size: 12px;">{{replyItem.cTime}}</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除回复"
                @click="deleteDemandReply(replyItem)"
              ></el-button>
            </div>
          </el-card>
        </div>-->
        <!-- <el-pagination
          style="margin-top:15px;"
          :current-page="pageNumDemand"
          :page-size="pageSizeDemand"
          layout="total,  prev, pager, next"
          :total="totalDemand"
          @size-change="handleSizeChangeDemand"
          @current-change="handleCurrentChangeDemand"
        />-->
      </el-col>
    </el-row>
    <el-dialog title="需求回复" :visible.sync="replyVisible">
      <el-form
        ref="replyFormRef"
        name="replyForm"
        :model="replyForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item
          label="回复内容："
          prop="replyInfo"
          :rules="[{required:true,message:'回复内容不能为空',trigger:'blur'}]"
        >
          <el-input
            v-model="replyForm.replyInfo"
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
    <el-dialog :visible.sync="dialogDemandVisible" title="需求提报">
      <el-form
        ref="demandForm"
        name="demandForm"
        :model="demandForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item
          label="需求标题："
          prop="title"
          :rules="[{required:true,message:'标题不能为空',trigger:'blur'},{min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '标题不合法', trigger: 'blur'}]"
        >
          <el-input v-model="demandForm.title" size="small" show-word-limit maxlength="50" />
        </el-form-item>
        <el-form-item
          label="需求类型："
          prop="type"
          :rules="[{required:true,message:'请选择需求类型',trigger:'change'}]"
        >
          <treeselect
            v-model="demandForm.type"
            style="float:left"
            :multiple="false"
            :appendToBody="true"
            :options="typeData"
            :disable-branch-nodes="true"
            :normalizer="normalizer"
            z-index="9999"
            :show-count="true"
            placeholder="请选择需求类型"
          />
        </el-form-item>
        <el-form-item
          label="需求内容："
          prop="description"
          :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
        >
          <el-input
            v-model="demandForm.description"
            type="textarea"
            show-word-limit
            maxlength="200"
            :rows="5"
          />
          <!--          <markdown-editor-->
          <!--            ref="markdownEditor"-->
          <!--            v-model="questionForm.description"-->
          <!--            :options="{hideModeSwitch:true,previewStyle:'tab'}"-->
          <!--            height="250px"-->
          <!--          />-->
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="info" @click="dialogDemandVisible=false">取消</el-button>
        <el-button size="small" type="primary" @click="addSoftwareDemand('demandForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
// import * as appConfig from "/public/config";
import * as demand from "@/api/demand";
import * as category from "@/api/category";
import * as ts from "@/api/ts";
import * as devunit from "@/api/devunit";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    Treeselect
  },
  props: {
    // data: {
    //   type: Array,
    //   default: []
    // },
    softwareInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      avatar: null,
      defaultA: 'this.src="' + require("@/assets/index/avatar.png") + '"',
      demandList: [],
      softwareData: [],
      replyList: [],
      userInfo: null,
      replyVisible: false,
      replyForm: {
        replyInfo: ""
      },
      replyDemandItem: null,
      replyDemandPage: {
        pageNum: 1,
        pageSize: 8,
        total: 0,
        totalPage: 0
      },
      activeDemandName: 0,
      dialogDemandVisible: false,
      demandForm: {
        title: "",
        type: null,
        description: ""
      },
      typeData: [],
      selectedDemand: 0,

      totalDemand: 0,
      totalPageDemand: 0,
      pageNumDemand: 1,
      pageSizeDemand: 10
    };
  },
  watch: {
    // data(newValue, oldValue) {
    //   console.log(newValue, oldValue);
    //   this.demandList = JSON.parse(JSON.stringify(newValue));
    //   if (this.demandList.length > 0) {
    //     this.replyDemandFunction(this.demandList[0]);
    //   }
    // },
    async softwareInfo(newValue, oldValue) {
      this.replyDemandItem = null;
      this.softwareData = JSON.parse(JSON.stringify(newValue));
      console.log("newValue", this.softwareData);
      await this.getSoftwareDemand();
    }
  },
  async mounted() {
    this.softwareData = JSON.parse(JSON.stringify(this.softwareInfo));
    // console.log(this.softwareInfo,99999999999)
    //  await this.getSoftwareDemand(this.softwareData.id, this.softwareData.versionId)
    // if (this.demandList.length > 0) {
    //   this.replyDemandFunction(this.demandList[0]);
    // }
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getCategoryList();
    this.avatar = appConfig.config.urlFilePrefix + this.userInfo.avatar;
  },
  methods: {
    getCategoryList() {
      category.getCategoryList("demand_cate", null, null).then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list;
          console.log(this.typeData, "this.typeData");
        }
      });
    },
    async getSoftwareDemand() {
      demand
        .getSoftwareDemand(
          this.softwareData.softwareId,
          this.softwareData.id,
          this.pageNumDemand,
          this.pageSizeDemand
        )
        .then(response => {
          console.log(response, "demand response");
          if (response.code === 200) {
            this.demandList = response.data.list;
            this.totalDemand = response.data.total;
            console.log(this.demandList, "demandList");
            if (this.demandList.length > 0) {
              this.replyDemandFunction(this.demandList[this.selectedDemand]);
            }else{
              this.replyList = []; // 重置需求回复项
            }
          }
        });
    },
    addSoftwareDemand(formName) {
      console.log(this.softwareData, "demandForm");
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            title: this.demandForm.title,
            description: this.demandForm.description,
            uid: this.userInfo.userId,
            softwareId: this.softwareData.softwareId,
            versionId: this.softwareData.id,
            username: this.userInfo.username,
            realname: this.userInfo.realName,
            category: parseInt(this.demandForm.type),
            // uUser: this.userInfo.userId
          };
          demand.addDemand(data).then(response => {
            if (response.code === 200) {
              this.dialogDemandVisible = false;
              this.$message.success("需求提报成功");
              // this.$emit("getSoftwareDm");
              this.getSoftwareDemand();
               this.clearDialog();
            }
          });
        }
      });
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    handleDrag() {},
    openAddDemandDialog() {
      this.dialogDemandVisible = true;
    },
    clearDialog(){
      this.demandForm = {
            title: '',
            type: null,
            description: '',
          };
    },
    replyDemandFunction(item) {
      this.replyList = [];
      this.replyDemandItem = JSON.parse(JSON.stringify(item));
      // this.replyList = JSON.parse(JSON.stringify(item.replyList));
      
      this.getDemandReply(this.replyDemandItem.id)
    },
    selected(activeNames) {
      this.selectedDemand = activeNames;
      let item = this.demandList[this.selectedDemand];

      this.replyDemandFunction(item);
    },
    deleteDemandFunction(item) {
      this.$confirm("确定删除该需求吗？", "提示", {
        type: "warning"
      }).then(e => {
        demand.deleteDemand(item.id).then(async response => {
          console.log(response, "response");
          if (response.msg == "删除成功") {
            this.$message.success("删除成功");
            await this.getDemandQuery();
            // this.$emit("getSoftwareDm");
            this.getSoftwareDemand();
          }
        });
      });
    },
    closeDemandFunction(item) {
      this.$confirm("确定关闭该需求吗？", "提示", {
        type: "warning"
      }).then(e => {
        demand.finishDemand(item.id, this.userInfo.userId).then(response => {
          if (response.code === 1) {
            this.$message.info("需求关闭成功。");
            // this.$emit("getSoftwareDm");
            this.getSoftwareDemand();
          }
        });
      });
    },
    deleteDemandReply(item) {
      this.$confirm("确定删除该需求回复吗？", "提示", {
        type: "warning"
      }).then(e => {
        demand.deleteDemandReply(item.id).then(async response => {
          console.log(response, "response");
          if (response.msg == "删除成功") {
            this.$message.success("删除成功");
            await this.getDemandQuery();
            // this.$emit("getSoftwareDm");
            this.getSoftwareDemand();
          }
        });
      });
    },
    showDemandReply() {
      this.replyVisible = true;
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
          this.replyDemandPage.pageNum = result.pageNum;
          this.replyList = result.list;
        }
      });
    },
    answerHandleCurrent(current, item) {
      this.replyDemandPage.pageNum = current;
      let questionItem = this.demandList[this.activeDemandName];
      this.getDemandReply(questionItem.id);
    },
    //处理需求
    addAnswer() {
      // console.log(this.replyDemandItem);
      this.$refs.replyFormRef.validate(valid => {
        if (valid) {
          // debugger;
          if(!this.demandList[this.selectedDemand]) {
            this.$message.info("请选择需要回复的需求");
            return false;
          }

          const data = {
            demandId: this.demandList[this.selectedDemand].id,
            description: this.replyForm.replyInfo,
            uid: this.userInfo.userId,
            pid: this.demandList[this.selectedDemand].pid
          };
          demand.addAnswer(data).then(response => {
            if (response.code == 200) {
              this.$message.success("回复成功！！");
              // this.getDemandQuery();
              this.replyForm.replyInfo = "";
              this.replyVisible = false;
              // this.$emit("getSoftwareDm");
              this.getSoftwareDemand();
              // window.location.reload()
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChangeDemand(val) {
      this.pageSizeDemand = val;

      this.pageNumDemand = 1;
      this.getSoftwareDemand();
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChangeDemand(val) {
      this.pageNumDemand = val;
      this.getSoftwareDemand();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header.is-active {
  background-color: #e8f6ee;
}
::v-deep .el-collapse-item__content {
  background-color: #e8f6ee;
}
::v-deep .el-collapse > .is-active {
  border-left: 5px solid #05994e;
}
::v-deep .el-timeline-item__node--normal {
  width: 20px;
  height: 20px;
  left: -5px;
}
.user-avatar {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
::v-deep .el-timeline-item__timestamp {
  color: #17bae3;
  font-size: 14px;
}
::v-deep .el-timeline-item__wrapper {
  padding-left: 20px;
}
::v-deep .el-timeline-item {
  padding-bottom: 0px;
}
.replay {
  font-size: 14px;
  font-weight: 400;
  color: #565656;
  .time {
    font-size: 12px;
    color: #9595a3;
    margin-right: 10px;
  }
  .el-button--text {
    color: #565656;
  }
}
</style>