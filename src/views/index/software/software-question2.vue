<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-row style="height: 45px;">
          <el-col :span="12">
            <el-button
              type="primary"
              style="margin-bottom: 10px;"
              size="small"
              @click="handAddTs"
            >技术支持提报</el-button>
          </el-col>
          <el-col :span="12">
            <!-- <el-input placeholder="请输入查询条件">
              <el-button size="small" slot="append" icon="el-icon-search"></el-button>
            </el-input>-->
          </el-col>
        </el-row>
        <div style="height:500px;overflow:auto;" v-if="tsQuestionList.length>0">
          <el-collapse v-model="activeTsName" accordion @change="selected">
            <el-collapse-item v-for="(item,index) in tsQuestionList" :key="index" :name="index">
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
                        @click="activeTsName=index;showTsQuestionReply(item)"
                        @click.stop.native
                      >回复（{{ item.answerTotal }}）</el-button>
                      <!-- <el-button
                      icon="el-icon-delete"
                      size="small"
                      type="text"
                      @click="deleteTsQuestion(item.id)"
                      @click.stop.native
                      >删除</el-button>-->
                      <!-- <el-button
                      style="margin-right: 20px;"
                      icon="el-icon-success"
                      size="small"
                      type="text"
                      @click="closeTsQuestion(item.id)"
                      @click.stop.native
                      >结束</el-button>-->
                    </el-row>
                  </el-col>
                </el-row>
              </template>
              <div>
                <span style="margin-left: 10px;">{{item.content}}</span>
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
                    <span style="font-size: 12px;">提报人员：{{item.cname}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span style="font-size: 12px;">提报时间：{{item.ctime.split(' ')[0]}}</span>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')"  style="height:300px;width:400px;"></el-image>
          <div>暂无技术支持</div>
        </div>
        <el-pagination
          style="margin-top:15px;"
          v-if="total>0"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
      <el-col :span="12">
        <div  v-show="questionItem!=null" style="display: flex;height: 45px;">
          <img :src="avatar" class="user-avatar" :onerror="defaultA" />
          <el-input
            style="margin-left: 10px;"
            placeholder="点击可回复"
            @focus="replyTwo(null)"
          />
        </div>
        <!-- <div v-if="softwareQuestionAnswers.length==0" style="text-align:center;">
          <el-image :src="require('@/assets/index/nodata.png')"  style="height:300px;width:400px;"></el-image>
          <div>暂无回复</div>
        </div> -->
        <div style="height:500px;overflow:auto;">
          <el-timeline style="padding-right: 10px;padding-top: 5px">
            <el-timeline-item
              v-for="(item,index) in softwareQuestionAnswers"
              :key="index"
              :timestamp="item.cname"
              icon="el-icon-user-solid"
              placement="top"
            >
              <div class="replay">
                <div class="title">
                  <div>{{ item.description }}</div>
                  <div
                    v-if="item.tsDataVo && item.tsDataVo.path"
                    style="font-size:12px;color:#3478d4;"
                  >
                    <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                    <el-button
                      @click="downloadData(item.tsDataVo)"
                      style="color:#3478d4"
                      type="text"
                      size="mini"
                    >{{item.tsDataVo.name}}</el-button>
                  </div>
                  <span
                    style="color: rgba(149,149,163,1);font-size: 12px;"
                  >{{ item.ctime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  <!-- <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> -->
                  <!-- <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  title="删除回复"
                  @click="deleteReply(item)"
                  ></el-button>-->
                  <el-button
                    icon="el-icon-s-comment"
                    size="small"
                    type="text"
                    title="回复"
                    @click="replyTwo(item)"
                  >（{{ item.childrenPage.total }}）</el-button>
                  <el-button
                    v-if="!item.open"
                    icon="el-icon-arrow-down"
                    size="small"
                    type="text"
                    title="展开"
                    v-show="item.childrenPage.total>0"
                    @click="item.open=!item.open"
                  ></el-button>
                  <el-button
                    v-else
                    icon="el-icon-arrow-up"
                    size="small"
                    type="text"
                    title="收起"
                    v-show="item.childrenPage.total>0"
                    @click="item.open=!item.open"
                  ></el-button>
                </div>
              </div>
              <el-timeline v-show="item.open == true" style="padding-right: 40px;padding-top: 5px">
                <el-timeline-item
                  v-for="(replyItem,index) in item.childrenPage.list"
                  :key="index"
                  :timestamp="replyItem.cname"
                  icon="el-icon-user-solid"
                  placement="top"
                >
                  <div class="replay">
                    <div class="title">
                      <div>{{ replyItem.description }}</div>
                      <div
                        v-if="replyItem.tsDataVo && replyItem.tsDataVo.path"
                        style="font-size:12px;color:#3478d4;"
                      >
                        <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                        <el-button
                          @click="downloadData(replyItem.tsDataVo)"
                          style="color:#3478d4"
                          type="text"
                          size="mini"
                        >{{replyItem.tsDataVo.name}}</el-button>
                      </div>
                      <span
                        style="color: rgba(149,149,163,1);font-size: 12px;"
                      >{{ replyItem.ctime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      <!-- <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> -->
                      <!-- <el-button
                      type="text"
                      size="small"
                      icon="el-icon-delete"
                      title="删除回复"
                      @click="deleteReply(replyItem)"
                      ></el-button>-->
                      <el-button
                        icon="el-icon-s-comment"
                        size="small"
                        type="text"
                        title="回复"
                        @click="replyTwo(replyItem)"
                      ></el-button>
                    </div>
                  </div>
                </el-timeline-item>

                <el-pagination
                  style="margin-top:15px;"
                  v-if="item.childrenPage.totalPage>1"
                  :current-page="rightPageNumOne"
                  :page-size="item.childrenPage.pageSize"
                  layout=" prev, pager, next"
                  :total="item.childrenPage.total"
                  @current-change="answerHleCurrentChange($event,item)"
                />
              </el-timeline>
            </el-timeline-item>
          </el-timeline>
        </div>

        <el-pagination
          style="margin-top:15px;"
          v-if="softwareQuestionAnswer.totalPage>1"
          :current-page="rightPageNumTwo"
          :page-size="softwareQuestionAnswer.pageSize"
          layout="prev, pager, next,jumper"
          :total="softwareQuestionAnswer.total"
          @current-change="answerHandleCurrent($event,data)"
        />
      </el-col>
    </el-row>
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
    <el-dialog :visible.sync="tsVisible" title="提报技术支持" width="700px">
      <el-form
        name="tsFormSupport"
        ref="tsFormSupport"
        :model="tsFormSupport"
        label-position="right"
        label-width="120px"
      >
        <el-form-item
          label="技术支持标题"
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
<style lang="scss" scoped>
::v-deep .el-collapse-item__header.is-active {
  background-color: #e1f1ff;
}
::v-deep .el-collapse-item__content {
  background-color: #e1f1ff;
}
::v-deep .el-collapse > .is-active {
  border-left: 5px solid rgba(23, 138, 227, 1);
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