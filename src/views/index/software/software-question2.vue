<template>
  <div>
    <div class="review-list">
      <div v-if="tsQuestionList.length>0" class="review-items">
        <el-collapse v-model="activeTsName" accordion @change="selected">
          <el-collapse-item v-for="(item,index) in tsQuestionList" :key="index" :name="index">
            <template slot="title">
              <div class="review-header">
                <div class="review-title">
                  <span class="review-title-text">{{item.title}}</span>
                  <el-tag size="mini" :type="item.status==0 ? 'info' : (item.status==1 ? 'warning' : 'success')" effect="plain">
                    {{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}
                  </el-tag>
                </div>
                <div class="review-actions">
                  <el-button
                    icon="el-icon-s-comment"
                    size="small"
                    type="text"
                    class="reply-btn"
                    @click="activeTsName=index;showTsQuestionReply(item)"
                    @click.stop.native
                  >回复（{{ item.answerTotal }}）</el-button>
                </div>
              </div>
            </template>
            <div class="review-content">
              <p class="review-description">{{item.content}}</p>
              <div class="review-meta">
                <span class="meta-item"><i class="el-icon-goods"></i> {{item.softwareName}}</span>
                <span class="meta-item"><i class="el-icon-document"></i> {{item.softwareVersion}}</span>
                <span class="meta-item"><i class="el-icon-user"></i> {{item.cname}}</span>
                <span class="meta-item"><i class="el-icon-time"></i> {{item.ctime.split(' ')[0]}}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        
        <el-pagination
          class="review-pagination"
          v-if="total>0"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      
      <div v-else class="empty-state">
        <el-image :src="require('@/assets/index/nodata.png')" class="empty-image"></el-image>
        <div class="empty-text">暂无问题</div>
      </div>
    </div>
    
    <div class="reply-section">
      <div v-show="questionItem!=null" class="reply-input">
        <img :src="avatar" class="user-avatar" :onerror="defaultA" />
        <el-input
          class="reply-field"
          placeholder="点击可回复"
          @focus="replyTwo(null)"
        />
      </div>
      
      <div class="reply-list">
        <el-timeline>
          <el-timeline-item
            v-for="(item,index) in softwareQuestionAnswers"
            :key="index"
            :timestamp="item.cname"
            icon="el-icon-user-solid"
            placement="top"
          >
            <div class="replay">
              <div class="reply-content">
                <div class="reply-text">{{ item.description }}</div>
                <div
                  v-if="item.tsDataVo && item.tsDataVo.path"
                  class="reply-attachment"
                >
                  <i class="el-icon-files"></i>
                  <el-button
                    @click="downloadData(item.tsDataVo)"
                    type="text"
                    size="mini"
                    class="download-btn"
                  >{{item.tsDataVo.name}}</el-button>
                </div>
                <div class="reply-footer">
                  <span class="reply-time">{{ item.ctime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  <el-button
                    icon="el-icon-s-comment"
                    size="normal"
                    type="text"
                    title="回复"
                    class="reply-count-btn"
                    @click="replyTwo(item)"
                  >{{ item.childrenPage.total > 0 ? '(' + item.childrenPage.total + ')' : '' }}</el-button>
                  <el-button
                    v-if="!item.open"
                    icon="el-icon-arrow-down"
                    size="normal"
                    type="text"
                    title="展开"
                    class="expand-btn"
                    v-show="item.childrenPage.total>0"
                    @click="item.open=!item.open"
                  ></el-button>
                  <el-button
                    v-else
                    icon="el-icon-arrow-up"
                    size="normal"
                    type="text"
                    title="收起"
                    class="expand-btn"
                    v-show="item.childrenPage.total>0"
                    @click="item.open=!item.open"
                  ></el-button>
                </div>
              </div>
            </div>
            
            <div v-show="item.open == true" class="nested-replies">
              <el-timeline>
                <el-timeline-item
                  v-for="(replyItem,index) in item.childrenPage.list"
                  :key="index"
                  :timestamp="replyItem.cname"
                  icon="el-icon-user-solid"
                  placement="top"
                >
                  <div class="replay nested">
                    <div class="reply-content">
                      <div class="reply-text">{{ replyItem.description }}</div>
                      <div
                        v-if="replyItem.tsDataVo && replyItem.tsDataVo.path"
                        class="reply-attachment"
                      >
                        <i class="el-icon-files"></i>
                        <el-button
                          @click="downloadData(replyItem.tsDataVo)"
                          type="text"
                          size="mini"
                          class="download-btn"
                        >{{replyItem.tsDataVo.name}}</el-button>
                      </div>
                      <div class="reply-footer">
                        <span class="reply-time">{{ replyItem.ctime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                        <el-button
                          icon="el-icon-s-comment"
                          size="normal"
                          type="text"
                          title="回复"
                          class="reply-btn"
                          @click="replyTwo(replyItem)"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </el-timeline-item>
                
                <el-pagination
                  class="nested-pagination"
                  v-if="item.childrenPage.totalPage>1"
                  :current-page="rightPageNumOne"
                  :page-size="item.childrenPage.pageSize"
                  layout=" prev, pager, next"
                  :total="item.childrenPage.total"
                  @current-change="answerHleCurrentChange($event,item)"
                />
              </el-timeline>
            </div>
          </el-timeline-item>
        </el-timeline>
        
        <el-pagination
          class="reply-pagination"
          v-if="softwareQuestionAnswer.totalPage>1"
          :current-page="rightPageNumTwo"
          :page-size="softwareQuestionAnswer.pageSize"
          layout="prev, pager, next,jumper"
          :total="softwareQuestionAnswer.total"
          @current-change="answerHandleCurrent($event,data)"
        />
      </div>
    </div>
    
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="回复">
      <el-form
        ref="questionForm"
        name="questionForm"
        :model="questionForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="回复内容：" prop="content" :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]">
          <el-input
            v-model="questionForm.content"
            size="small"
            :rows="7"
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
        <el-table
          v-if="tsDataVoList.length>0"
          :data="tsDataVoList"
          size="mini"
          style="margin:10px;"
        >
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
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item,index) in typeData"
                  :key="index"
                ></el-option>
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
    <!--提报技术支持--->
    <el-dialog :visible.sync="tsVisible" title="提报问题" width="700px">
      <el-form
        name="tsFormSupport"
        ref="tsFormSupport"
        :model="tsFormSupport"
        label-position="right"
        label-width="120px"
      >
        <el-form-item
          label="问题标题"
          :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]"
          prop="title"
        >
          <el-input v-model="tsFormSupport.title" size="small" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item
          label="问题内容"
          prop="content"
          :rules="[{required:true,message:'请选填写问题内容',trigger:'blur'}]"
        >
          <!-- <markdown-editor
            ref="markdownEditor"
            v-model="tsFormSupport.content"
            :options="{hideModeSwitch:true,previewStyle:'tab'}"
            height="300px"
          /> -->
          <el-input type='textarea' rows="5" v-model="tsFormSupport.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="submitSupport">提交</el-button>
        <el-button size="small" type="info" @click="tsVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
import MarkdownEditor from "@/components/MarkdownEditor";
// import * as appConfig from "/public/config";
import * as demand from "@/api/demand";
import * as category from "@/api/category";
import * as ts from "@/api/ts";
import * as devunit from "@/api/devunit";
export default {
  components: {
    MarkdownEditor
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
      questionItem: null,
      tsQuestionList: [],
      softwareData: [],
      replyList: [],
      userInfo: null,
      replyVisible: false,
      replyForm: {
        replyInfo: ""
      },
      activeTsName: 0,
      dialogDemandVisible: false,
      demandForm: {
        title: "",
        type: null,
        description: ""
      },
      typeData: [],
      softwareQuestionAnswers: [],
      answerlength: 0,
      total: 0,
      totalPage: 0,
      softwareQuestionAnswer: {
        pageSize: 5
      },
      pageNum: 1,
      pageSize: 6,

      dialogVisible: false,
      fileData: {},
      questionForm: {
        content: "",
        tsDataVo: {
          name: ""
        }
      },
      tsDataVoList: [],
      fileList: [],
      tsVisible: false,
      tsFormSupport: {
        cid: "",
        title: "",
        content: "",
        softwareId: "",
        softwareName: "",
        softwareVersionId: "",
        softwareVersion: "",
        devUnit: "",
        status: 0
      },
      rightPageNumOne: 1,
      rightPageNumTwo: 1
    };
  },
  watch: {
    // data(newValue, oldValue) {
    //   console.log(newValue, oldValue);
    //   this.tsQuestionList = JSON.parse(JSON.stringify(newValue));
    //   if (this.tsQuestionList.length > 0) {
    //     this.questionItem = JSON.parse(JSON.stringify(this.tsQuestionList[0]));
    //     this.showTsQuestionReply(
    //       this.tsQuestionList[0],
    //       this.tsQuestionList[0].answerTotal
    //     );
    //   }
    // },
    softwareInfo(newValue, oldValue) {
      console.log(newValue, oldValue);
      this.questionItem = null
      this.softwareData = JSON.parse(JSON.stringify(newValue));
      this.tsFormSupport.softwareId = this.softwareData.softwareId;
      this.tsFormSupport.softwareVersionId = this.softwareData.id;
      this.getAllSoftware();
      if (
        this.tsFormSupport.softwareId != undefined &&
        this.tsFormSupport.softwareId != null
      ) {
        this.getTsQuestionList();
        this.getSoftwareVersionById();
      }
    }
  },
  async mounted() {
    // console.log("demandData", this.data, this.softwareInfo);
    // this.tsQuestionList = JSON.parse(JSON.stringify(this.data));
    // if (this.tsQuestionList.length > 0) {
    //   this.questionItem = JSON.parse(JSON.stringify(this.tsQuestionList[0]));
    //   console.log(this.questionItem, "questionItem");
    //   this.showTsQuestionReply(
    //     this.tsQuestionList[0],
    //     this.tsQuestionList[0].answerTotal
    //   );
    // }
    this.softwareData = JSON.parse(JSON.stringify(this.softwareInfo));
    this.tsFormSupport.softwareId = this.softwareData.softwareId;
    this.tsFormSupport.softwareVersionId = this.softwareData.id;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    await this.getCategoryList();
    console.log(this.softwareData, "this.softwareData");
    await this.getAllSoftware();
    if (
      this.tsFormSupport.softwareId != undefined &&
      this.tsFormSupport.softwareId != null
    ) {
      await this.getTsQuestionList();
      await this.getSoftwareVersionById();
    }
    this.avatar = appConfig.config.urlFilePrefix + this.userInfo.avatar;
  },
  methods: {
    answerHleCurrentChange(current, item) {
      let params = {
        questionId: item.tsQuestionId,
        answerId: item.id,
        pageNum: current,
        pageSize: item.childrenPage.pageSize
      };
      // this.answerPageNum
      ts.getSupportAnswerPage(params).then(response => {
        if (response.code === 200) {
          let result = response.data;
          item.childrenPage = result;
        }
      });
    },
    // 获取技术支持问题
    getTsQuestionList() {
      ts.getSoftwareTs(
        this.softwareData.softwareId,
        this.softwareData.id,
        this.pageNum,
        this.pageSize
      ).then(response => {
        if (response.code === 200) {
          this.tsQuestionList = JSON.parse(JSON.stringify(response.data.list));
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          if (this.tsQuestionList.length > 0) {
            this.questionItem = JSON.parse(
              JSON.stringify(this.tsQuestionList[this.activeTsName])
            );
            this.showTsQuestionReply(this.tsQuestionList[this.activeTsName]);
          }else{
            this.softwareQuestionAnswers = [];
          }
        }
      });
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getTsQuestionList();
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTsQuestionList();
    },
    handAddTs() {
      this.tsVisible = true;
      this.resetForm("tsFormSupport");
    },
    //获取所有软件
    getAllSoftware() {
      ts.getAllSoftware().then(response => {
        if (response.code === 200) {
          this.softwareList = response.data;
        }
      });
    },
    getSoftwareVersionById() {
      ts.getSoftwareVersion(this.tsFormSupport.softwareId).then(response => {
        if (response.code === 200) {
          this.softwareVersionList = response.data;
        }
      });
    },
    //提交技术支持
    async submitSupport() {
      this.$refs.tsFormSupport.validate(async valid => {
        if (valid) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          this.tsFormSupport.cid = userInfo.userId;
          for (let i = 0; i < this.softwareList.length; i++) {
            if (this.tsFormSupport.softwareId == this.softwareList[i].id) {
              this.tsFormSupport.softwareName = this.softwareList[i].name;
            }
          }
          for (let i = 0; i < this.softwareVersionList.length; i++) {
            if (
              this.tsFormSupport.softwareVersionId ==
              this.softwareVersionList[i].id
            ) {
              this.tsFormSupport.softwareVersion = this.softwareVersionList[
                i
              ].version;
            }
          }
          let res = await ts.addTsQuestion(this.tsFormSupport);
          this.getCategoryList();
          this.tsVisible = false;
          // this.$emit("getSoftwareTs");
          this.getTsQuestionList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    answerHandleCurrent(current, item) {
      this.rightPageNumTwo = current;
      let questionItem = this.tsQuestionList[this.activeTsName];
      this.getTsQuestionReply(questionItem.id, questionItem.answerTotal);
    },
    async downloadData(item) {
      let index = item.path.lastIndexOf('/');
      // const realpath = item.path.substring(0, item.path.length - 1);
      const realpath = item.path;
      const blob = await ts.downloadDataByPath(realpath);
      // const fileName = item.path.substring(24, item.path.length - 1);
      const fileName = item.name;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.setAttribute("download", fileName);
      a.setAttribute("target", "_blank");
      // a.download = "shili.rar"
      a.setAttribute("href", url);
      a.click();
    },
    selected(activeNames) {
      let item = this.tsQuestionList[this.activeTsName];

      this.showTsQuestionReply(item);
    },
    showTsQuestionReply(item) {
      this.rightPageNumOne = 1;
      this.rightPageNumTwo = 1;
      this.questionItem = JSON.parse(JSON.stringify(item));
      this.getTsQuestionReply(this.questionItem.id);
    },
    getTsQuestionReply(questionId) {
      let params = {
        questionId: questionId,
        pageNum: this.rightPageNumTwo,
        pageSize: 5
      };
      ts.getSupportAnswer(params).then(response => {
        if (response.code === 200) {
          let result = response.data;
          console.log(result, 999);
          this.softwareQuestionAnswers = [];
          if (result.data.list.length > 0) {
            result.data.list.forEach(item => {
              let info = JSON.parse(JSON.stringify(item));
              info.open = false;
              this.softwareQuestionAnswers.push(info);
            });
          }
          this.answerlength = result.answerTotal;
          // this.total = result.data.total;
          // this.totalPage = result.data.totalPage;

          this.softwareQuestionAnswer = result.data;
        }
      });
    },
    deleteTsQuestion(id) {
      this.$confirm("确定删除该技术支持吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delTsQuestion(id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            // this.$emit("getSoftwareTs");
            this.getTsQuestionList();
          }
        });
      });
    },
    closeTsQuestion(id) {
      this.$confirm("确定关闭此技术支持吗", "提示", {
        type: "warning"
      }).then(e => {
        ts.finishTsQuestion({ id: id }).then(response => {
          if (response.code === 200) {
            this.$message.success("关闭成功");
            // this.$emit("getSoftwareTs");
            this.getTsQuestionList();
          }
        });
      });
    },
    getCategoryList() {
      category.getCategoryList("data_type").then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list;
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
    deleteReply(item) {
      console.log(item);
      this.$confirm("确定删除该回复吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delQuestionAnswer(item.id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.$emit("getSoftwareTs");
          }
        });
      });
    },
    replyTwo(answer) {
      // debugger
      let question = this.questionItem;

      this.dialogVisible = true;
      // 重置表单
      // this.resetForm('questionForm');
      this.questionForm = {};
      // 重置文件列表
      this.tsDataVoList = [];
      this.fileData = null;
      // console.log(this.$route)
      console.log(answer, 9999);
      if (answer != null) {
        this.questionForm.pid = answer.id;
        this.questionForm.receiveId = answer.cid;
        this.questionForm.receiver = answer.cname;
        this.questionForm.firstLevelPid =
          answer.firstLevelPid == 0 ? answer.id : answer.firstLevelPid;
      } else {
        // this.questionForm.receiveId = this.data.cid
        // this.questionForm.receiver = this.data.cname
      }
    },
    async uploadFile(param) {
      this.fileData = param.file;
      let peixunId = 0
      // this.questionForm.tsDataVo.name = param.file.name
      if(this.typeData.length>0){
        for(let i=0;i<this.typeData.length;i++){
          if(this.typeData[i].name == "培训材料"){
            peixunId = this.typeData[i].id
          }
        }
      }
      this.tsDataVoList = [
        {
          name: param.file.name,
          typeId: peixunId,
          typeName: "培训材料"
        }
      ];
    },
    handleRemoveDataFile(index, item) {
      delete this.fileData;
      this.tsDataVoList.splice(index, 1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleSuccess() {},
    beforeUpload() {},
    handleChangeFile(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [file];
    },
    replyConfirm() {
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          this.$modal.loading();
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let formData = new FormData();
          formData.append("files", this.fileData);
          formData.append("tsQuestionId", this.questionItem.id);
          formData.append("description", this.questionForm.content);
          formData.append("cid", userInfo.userId);
          formData.append("pid", this.questionForm.pid ? this.questionForm.pid : 0);
          formData.append(
            "firstLevelPid",
            this.questionForm.firstLevelPid ? this.questionForm.firstLevelPid : 0
          );
          if (this.questionForm.receiveId) {
            formData.append("receiveId", this.questionForm.receiveId);
          }
          if (this.questionForm.receiver) {
            formData.append("receiver", this.questionForm.receiver);
          }

          if (this.tsDataVoList.length > 0) {
            this.tsDataVoList.forEach((obj, index) => {
              for (var item in obj) {
                formData.append("tsDataVoList[" + index + "]." + item, obj[item]);
              }
            });
          }
          ts.reply(formData).then(response => {
            if (response.code === 200) {
              this.$message.success("回复成功");
              this.$modal.closeLoading();
              this.dialogVisible = false;
              this.getTsQuestionReply(this.questionItem.id);
              // this.$emit("getSoftwareTs");
              this.getTsQuestionList();
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.review-list {
  width: 48%;
  float: left;
  height: 600px;
  overflow: auto;
  padding-right: 15px;
  border-right: 1px solid #eee;
}

.review-items {
  height: 100%;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.review-title {
  display: flex;
  align-items: center;
}

.review-title-text {
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
}

.review-actions {
  text-align: right;
}

.reply-btn {
  color: #05994e;
}

.review-content {
  padding: 10px;
}

.review-description {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #333;
}

.review-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.meta-item {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 5px;
  color: #05994e;
}

.review-pagination {
  margin-top: 15px;
}

.empty-state {
  text-align: center;
  padding: 20px;
}

.empty-image {
  height: 200px;
  width: 200px;
}

.empty-text {
  color: #999;
  margin-top: 10px;
}

.reply-section {
  width: 48%;
  float: right;
  height: 600px;
  overflow: auto;
  padding-left: 15px;
}

.reply-input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-field {
  margin-left: 10px;
}

.reply-list {
  height: calc(100% - 60px);
  overflow: auto;
}

.replay {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 10px;
  
  &.nested {
    background-color: #f9f9f9;
    margin-left: 15px;
  }
}

.reply-content {
  width: 100%;
}

.reply-text {
  margin-bottom: 8px;
  line-height: 1.5;
}

.reply-attachment {
  font-size: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  
  i {
    color: #05994e;
    margin-right: 5px;
  }
}

.download-btn {
  color: #05994e;
  padding: 0;
}

.reply-footer {
  display: flex;
  align-items: center;
}

.reply-time {
  color: #999;
  font-size: 12px;
  margin-right: 10px;
}

.reply-count-btn {
  color: #05994e;
  font-size: 14px;
  padding: 2px 5px;
  margin-left: 2px;
}

.expand-btn {
  margin-left: 5px;
}

.nested-replies {
  margin-left: 20px;
  margin-top: 10px;
}

.nested-pagination {
  margin-top: 15px;
  text-align: center;
}

.reply-pagination {
  margin-top: 15px;
  text-align: center;
}

::v-deep .el-timeline-item__node {
  background-color: #05994e;
}

::v-deep .el-tag--mini {
  height: 20px;
  padding: 0 6px;
  line-height: 18px;
}

::v-deep .el-tag--info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

::v-deep .el-tag--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

::v-deep .el-tag--success {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
</style>