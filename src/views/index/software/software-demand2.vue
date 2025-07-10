<template>
  <div class="comment-list">
    <div v-if="demandList.length > 0">
      <div v-for="(item, index) in demandList" :key="index" class="comment-item">
        <div class="comment-header">
          <div class="user-info">
            <img :src="require('@/assets/index/softwareDefault.png')" class="avatar" />
            <div class="user-meta">
              <div class="username">{{ item.realname }}</div>
              <div class="comment-time">{{ item.ctime | parseTime('{y}-{m}-{d}') }} · {{ item.softwareVersion }}</div>
            </div>
          </div>
          <div class="comment-status">
            <el-tag size="mini" :type="item.status==0 ? 'info' : (item.status==1 ? 'warning' : 'success')" effect="plain">
              {{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}
            </el-tag>
          </div>
        </div>
        <div class="comment-content">
          <div class="comment-title">{{ item.title }}</div>
          <div class="comment-text">{{ item.description }}</div>
        </div>
        <div class="comment-actions">
          <div class="action-item" @click="replyDemandFunction(item)">
            <i class="el-icon-chat-line-square"></i> 回复 ({{ item.replyTotal }})
          </div>
          <div class="like-count">
            <i class="el-icon-star-off"></i> {{ Math.floor(Math.random() * 100) }}
          </div>
        </div>
        
        <!-- 回复区域 -->
        <transition name="slide-fade">
          <div class="reply-section" v-show="replyDemandItem && replyDemandItem.id === item.id">
            <div class="reply-header-bar">
              <span class="reply-title">全部回复 ({{ item.replyTotal }})</span>
              <el-button type="text" icon="el-icon-close" @click="replyDemandItem = null"></el-button>
            </div>
            <div class="reply-list">
              <div v-if="replyList && replyList.length > 0">
                <div v-for="(replyItem, replyIndex) in replyList" :key="replyIndex" class="reply-item">
                  <div class="reply-header">
                    <img :src="require('@/assets/index/softwareDefault.png')" class="reply-avatar" />
                    <div class="reply-user-info">
                      <div class="reply-username">{{ replyItem.realname }}</div>
                      <div class="reply-time">{{ replyItem.cTime | parseTime('{y}-{m}-{d}') }}</div>
                    </div>
                  </div>
                  <div class="reply-content">{{ replyItem.description }}</div>
                </div>
              </div>
              <div v-else class="no-replies">
                还没有回复，快来添加第一条回复吧
              </div>
              
              <div class="add-reply">
                <img :src="avatar" class="user-avatar" :onerror="defaultA" />
                <el-input
                  class="reply-input"
                  placeholder="添加回复..."
                  @focus="showDemandReply"
                />
              </div>
              
              <el-pagination
                v-if="replyDemandPage.totalPage > 1"
                class="reply-pagination"
                :current-page="replyDemandPage.pageNum"
                :page-size="replyDemandPage.pageSize"
                layout="prev, pager, next"
                :total="replyDemandPage.total"
                @current-change="answerHandleCurrent"
                small
              />
            </div>
          </div>
        </transition>
      </div>
      
      <el-pagination
        class="comment-pagination"
        v-if="totalDemand > 0"
        :current-page="pageNumDemand"
        :page-size="pageSizeDemand"
        layout="prev, pager, next"
        :total="totalDemand"
        @size-change="handleSizeChangeDemand"
        @current-change="handleCurrentChangeDemand"
        small
      />
    </div>
    
    <div v-else class="empty-state">
      <el-image :src="require('@/assets/index/nodata.png')" class="empty-image"></el-image>
      <div class="empty-text">暂无评论</div>
    </div>
    
    <!-- 保留原有对话框 -->
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
        <el-form-item label="附件上传：">
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
            <div>
              <el-button class="file-btn" size="small" type="primary">附件上传</el-button>
            </div>
          </el-upload>
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
      pageSizeDemand: 5
    };
  },
  watch: {
    softwareInfo: {
      handler(newVal) {
        if (newVal) {
          this.getDemandList();
        }
      },
      immediate: true
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
    /**
     * 查询需求列表
     */
    getDemandList() {
      if (!this.softwareInfo) {
        return;
      }
      demand
        .getSoftwareDemand(
          this.softwareInfo.softwareId,
          this.softwareInfo.id,
          this.pageNumDemand,
          this.pageSizeDemand
        )
        .then(response => {
          if (response.code === 200) {
            this.demandList = response.data.list;
            this.totalDemand = response.data.total;
          }
        });
    },

    selected(selectId) {
      // 选中折叠面板
      if (selectId === "") {
        this.replyDemandItem = null;
        return;
      }
      this.replyDemandFunction(this.demandList[selectId]);
    },

    replyDemandFunction(item) {
      if(this.replyDemandItem && this.replyDemandItem.id === item.id) {
        // 如果点击的是已选中的项，取消选中
        this.replyDemandItem = null;
        return;
      }
      
      this.replyDemandItem = item;
      this.getDemandReply(this.replyDemandItem.id);
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
          
          // 在控制台输出信息，便于调试
          console.log("回复列表加载成功", this.replyList);
        } else {
          console.error("回复列表加载失败", response);
        }
      }).catch(error => {
        console.error("回复列表加载出错", error);
      });
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
    answerHandleCurrent(current) {
      this.replyDemandPage.pageNum = current;
      this.getDemandReply(this.replyDemandItem.id);
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
      this.getDemandList();
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChangeDemand(val) {
      this.pageNumDemand = val;
      this.getDemandList();
    },
    handleRemoveDataFile(index, item) {
      delete this.fileData;
      this.tsDataVoList.splice(index, 1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  }
};
</script>
<style scoped lang="scss">
.comment-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.comment-status {
  text-align: right;
}

.comment-content {
  padding: 5px 0;
}

.comment-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
}

.action-item {
  display: flex;
  align-items: center;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    color: #05994e;
  }
}

.action-item i {
  margin-right: 5px;
}

.like-count {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 13px;
}

.like-count i {
  margin-right: 5px;
}

.reply-section {
  margin-top: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reply-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.reply-title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.reply-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.reply-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.reply-user-info {
  display: flex;
  flex-direction: column;
}

.reply-username {
  font-weight: bold;
  font-size: 13px;
  color: #333;
}

.reply-time {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.reply-content {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.no-replies {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 10px 0;
}

.add-reply {
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.reply-input {
  flex-grow: 1;
  margin-left: 10px;
  
  ::v-deep .el-input__inner {
    border-radius: 20px;
    background-color: #f5f5f5;
  }
}

.reply-pagination {
  text-align: center;
  margin-top: 15px;
}

.comment-pagination {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
  ::v-deep .el-pagination button, ::v-deep .el-pagination span {
    font-size: 13px;
  }
  
  ::v-deep .el-pagination .btn-prev, ::v-deep .el-pagination .btn-next {
    background-color: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    text-align: center;
  }
  
  ::v-deep .el-pagination .el-icon {
    font-weight: bold;
  }
}

.empty-state {
  text-align: center;
  padding: 50px 0;
}

.empty-image {
  height: 150px;
  width: auto;
}

.empty-text {
  color: #999;
  margin-top: 15px;
  font-size: 14px;
}

::v-deep .el-tag--mini {
  height: 20px;
  padding: 0 6px;
  line-height: 18px;
  border-radius: 10px;
}

/* 添加过渡动画效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>