<template>
  <div>
    <el-card class="custome">
      <div class="inCardDiv">
        <el-row style="text-align: end;">
          <el-button size="small" style="margin-right: 10px;" @click="showTaskProcess" type="primary">流程图</el-button>
          <el-button
            size="small"
            @click="showTaskHistory"
            icon="el-icon-s-data"
            type="info"
            style="margin-right: 10px;"
          >审核历史</el-button>
          <el-button @click="goBack" size="small" icon="el-icon-back">返回</el-button>
        </el-row>
        <el-row>
          <el-form
            id="taskInfoForm"
            v-model="taskInfoForm"
            label-position="right"
            label-width="150px"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="系统名称：" prop="softwareSystemName">
                  <span>{{taskInfoForm.softwareSystemName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请单位：" prop="taskUnit">
                  <span>{{taskInfoForm.taskUnit}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="申请人：" prop="taskCreator">
                  <span>{{taskInfoForm.taskCreator}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请时间：" prop="createTime">
                  <span>{{taskInfoForm.createTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="流程阶段：" prop="taskPhase">
                  <span>{{taskInfoForm.taskPhase}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="阶段状态：" prop="phaseStatus">
                  <span>{{showPhaseStatus(taskInfoForm.phaseStatus)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="试用单位："
              prop="testDepartment"
              v-show="taskStep(taskInfoForm.taskPhase)>=4"
            >
              <treeselect
                :disabled="true"
                size="small"
                v-model="taskInfoForm.testDepartment"
                :multiple="true"
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :show-count="true"
                :options="testDepartmentList"
                placeholder="请选择试用单位"
              ></treeselect>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row style="background: #d4d6d8;margin-top: 10px;">
          <el-col :span="4" style="height: 40px;" class="uploadRow">
            <span style="margin-left: 20px;">软件列表</span>
          </el-col>
          <el-col :span="20" style="height: 40px;justify-content: flex-end;" class="uploadRow">
            <el-button
              type="primary"
              style="margin-right: 10px;"
              @click="changeSoftwareAFTestStatus('pass')"
              v-show="(userRole==='AFUser'&&taskInfoForm.taskPhase==='安防检测'&&taskInfoForm.phaseStatus==='undo')||(userRole==='SYUser'&&taskInfoForm.taskPhase==='软件试用'&&taskInfoForm.phaseStatus==='undo')"
              :disabled="selectedSoftwareList.length==0"
              size="small"
              icon="el-icon-check"
            >通过</el-button>
            <el-button
              type="danger"
              style="margin-right: 10px;"
              @click="changeSoftwareAFTestStatus('refuse')"
              v-show="(userRole==='AFUser'&&taskInfoForm.taskPhase==='安防检测'&&taskInfoForm.phaseStatus==='undo')||(userRole==='SYUser'&&taskInfoForm.taskPhase==='软件试用'&&taskInfoForm.phaseStatus==='undo')"
              :disabled="selectedSoftwareList.length==0"
              size="small"
              icon="el-icon-close"
            >未通过</el-button>
            <el-button
              type="primary"
              style="margin-right: 20px;"
              :disabled="selectedSoftwareList.length==0"
              size="small"
              icon="el-icon-upload"
            >批量下载</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="taskSoftwareList"
          :border="true"
          max-height="500px"
          :data="taskSoftwareList"
          @selection-change="handleTableSelectionChange"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column type="expand" label="文档" width="80" align="center">
            <template slot-scope="scope">
              <el-table :data="scope.row.softwareDocumentList" max-height="200px" :border="true">
                <el-table-column
                  label="序号"
                  width="80"
                  type="index"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="名称"
                  prop="documentName"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="类型"
                  prop="documentType"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scoped">
                    <el-button icon="el-icon-download">材料下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="软件名称" prop="softwareName" header-align="center"></el-table-column>
          <el-table-column label="软件版本" width="200" align="center" prop="softwareVersion"></el-table-column>
          <el-table-column
            v-show="taskInfoForm.softwareSelectType==='duanSoftware'"
            label="软件类型"
            width="150"
            align="center"
            prop="softwareType"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.softwareType" disabled>
                <el-option
                  v-for="(item,index) in softwareTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-show="taskInfoForm.softwareSelectType==='duanSoftware'"
            label="软件前缀"
            width="150"
            align="center"
            prop="softwarePrefix"
          ></el-table-column>
          <el-table-column label="研制单位" width="100" align="center" prop="softwareUnit"></el-table-column>
          <el-table-column label="安防检测" width="100" align="center">
            <template slot-scope="scopeAf">
              <span>{{showAFAndTestStatus(scopeAf.row.afStatus, "af")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="软件试用" width="100" align="center">
            <template slot-scope="scopeTest">
              <span>{{showAFAndTestStatus(scopeTest.row.testStatus, "test")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-row class="uploadRow" style="justify-content: center;">
                <el-button
                  style="margin-right: 20px;"
                  size="small"
                  icon="el-icon-download"
                  type="primary"
                  @click="downloadTaskSoftware(scope.row.softwareId)"
                >软件下载</el-button>
                <el-upload
                  style="margin-right: 20px;"
                  v-show="(taskInfoForm.taskPhase=='安防检测'&&userRole=='applicationUser'&&scope.row.afStatus==='refuse')||(taskInfoForm.taskPhase=='软件试用'&&userRole=='applicationUser'&&scope.row.testStatus==='refuse')"
                  multiple
                  :action="uploadURL"
                  :http-request="uploadSecurityDetectionReport"
                  :show-file-list="false"
                  :auto-upload="true"
                >
                  <el-button slot="trigger" icon="el-icon-upload" type="primary" size="small">软件上传</el-button>
                </el-upload>
                <el-button size="small" icon="el-icon-view" @click="openTableExpand(scope.row)">查看材料</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="taskStep(taskInfoForm.taskPhase)>=6">
          <el-row style="background: #d4d6d8;margin-top: 10px;">
            <el-col :span="12" style="height: 40px;" class="uploadRow">
              <span style="margin-left: 20px;">软件试用报告列表</span>
            </el-col>
            <el-col :span="12" style="height: 40px;justify-content: flex-end;" class="uploadRow">
              <el-upload
                v-show="userRole==='SYUser'&&taskInfoForm.taskPhase==='软件试用'&&taskInfoForm.phaseStatus==='undo'"
                style="margin-right: 20px;"
                multiple
                :action="uploadURL"
                :http-request="uploadSoftwareTrialReport"
                :show-file-list="false"
                :auto-upload="true"
              >
                <el-button :disabled="!judgeTestReport" slot="trigger" icon="el-icon-upload" type="primary" size="small">上传试用报告</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-table :border="true" :data="testReportList" max-height="500px">
            <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
            <el-table-column label="报告名称" prop="name" header-align="center"></el-table-column>
            <el-table-column label="试用单位" prop="testDepartment" header-align="center"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-row>
                  <el-button
                    style="margin-right: 10px;"
                    size="small"
                    type="primary"
                    icon="el-icon-download"
                    @click="downloadTaskSoftware(scope.row.softwareId)"
                  >软件试用报告下载</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="dialog-footer" style="margin-top: 10px;">
          <el-row type="flex" justify="center">
            <el-button type="primary">保存</el-button>
            <el-button
              v-show="taskInfoForm.taskPhase=='软件试用'&&userRole=='SYUser'&&taskInfoForm.phaseStatus==='undo'"
              @click="saveTaskDetail"
              type="primary"
            >提交</el-button>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-dialog title="审核历史" :visible.sync="taskHistoryVisible">
      <el-table :data="showTaskHistoryList" max-height="500px">
        <el-table-column label="序号" width="100" align="center" type="index"></el-table-column>
        <el-table-column label="阶段名称" prop="taskPhase"></el-table-column>
        <el-table-column label="阶段状态" width="180" align="center" prop="phaseStatus">
          <template slot-scope="scope">
            <span>{{showPhaseStatus(scope.row.phaseStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="phasePerson"></el-table-column>
        <el-table-column label="审核时间" prop="dateTime"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { Pass } from 'codemirror';
import * as organization from '@/api/organization'
export default {
  components: { Treeselect },
  data() {
    return {
      feedbackData: {
        unreadCount: 0,
        feedbackInfoTable: []
      },
      afreportVisible: false,
      taskInfoForm: {
        taskId: 1,
        softwareSystemName: "testtask-20230328-081520",
        taskUnit: "相关部门",
        taskCreator: "申请人",
        createTime: "2023-03-28",
        taskEndTime: "2023-03-29",
        taskPhase: "安防检测",
        phaseStatus: "refuse",
        testDepartment: [],
        announcement: {
          judge: "no",
          title: "",
          info: ""
        },
        downloadPrivilege: []
      },
      softwareTypeList: [
        {
          id: 1,
          label: "服务段"
        },
        {
          id: 2,
          label: "客户端段"
        },
        {
          id: 3,
          label: "镜像段"
        },
        {
          id: 4,
          label: "数据段"
        },
        {
          id: 5,
          label: "数据库段"
        }
      ],
      taskSoftwareList: [
        {
          softwareId: 1,
          softwareName: "应用服务段",
          softwareVersion: "v1.0",
          softwareType: 1,
          softwarePrefix: "YYFWRJ",
          softwareUnit: "研制单位",
          softwareDomain: 7,
          softwareDes: "软件描述",
          afStatus: "undo",
          testStatus: "undo",
          softwareDocumentList: [
            {
              documentId: 1,
              documentName: "用户手册",
              documentType: "文档"
            },
            {
              documentId: 2,
              documentName: "部署手册",
              documentType: "文档"
            }
          ]
        },
        {
          softwareId: 2,
          softwareName: "应用数据段",
          softwareVersion: "v1.0",
          softwarePrefix: "YYSJRJ",
          softwareType: 4,
          softwareUnit: "研制单位",
          softwareDomain: 9,
          softwareDes: "软件描述",
          afStatus: "undo",
          testStatus: "undo",
          softwareDocumentList: [
            {
              documentId: 3,
              documentName: "用户手册",
              documentType: "文档"
            },
            {
              documentId: 4,
              documentName: "部署手册",
              documentType: "文档"
            }
          ]
        }
      ],
      certificateList: [
        {
          certificateId: 1,
          certificateName: "软件杀毒证明",
          fromSoftware: "应用服务段",
          fromSoftwareVersion: "v1.0"
        },
        {
          certificateId: 2,
          certificateName: "软件杀毒证明",
          fromSoftware: "应用数据段",
          fromSoftwareVersion: "v1.0"
        }
      ],
      afReportList: [
        {
          id: 1,
          name: "安防检测报告1",
          testDepartment: "安防中心"
        },
        {
          id: 2,
          name: "安防检测报告2",
          testDepartment: "安防中心"
        },
        {
          id: 3,
          name: "安防检测报告3",
          testDepartment: "安防中心"
        }
      ],
      testReportList: [
        {
          id: 1,
          name: "软件试用报告1",
          testDepartment: "软件试用单位1"
        },
        {
          id: 2,
          name: "软件试用报告2",
          testDepartment: "软件试用单位2"
        },
        {
          id: 3,
          name: "软件试用报告3",
          testDepartment: "软件试用单位3"
        }
      ],
      taskHistoryVisible: false,
      phaseNameList: [
        "软件上传", //申请人
        "检测申请审核", //部门主管 zhijiedian
        "检测任务下达", //xt zhijiedian
        "安防检测", //af
        "试用任务审核", //xt zhijiedian
        "试用任务下达", //主管 zhijiedian
        "软件试用", //试用
        "软件发布申请", //申请人 公告和权限
        "软件审核发布" // xt zhijiedian
      ],
      taskHistoryList: [
        {
          taskPhase: "软件上传",
          phaseStatus: "pass",
          phasePerson: "业务管理人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "检测申请审核",
          phaseStatus: "pass",
          phasePerson: "部门主管人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "检测任务下达",
          phaseStatus: "pass",
          phasePerson: "信T局管理人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "安防检测",
          phaseStatus: "refuse",
          phasePerson: "安防检测人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "试用任务审核",
          phaseStatus: "undo",
          phasePerson: "信T局管理人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "试用任务下达",
          phaseStatus: "undo",
          phasePerson: "部门主管人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "软件试用",
          phaseStatus: "undo",
          phasePerson: "试用管理人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "软件发布申请",
          phaseStatus: "undo",
          phasePerson: "业务管理人员",
          dateTime: "2023/4/2 12:12:12"
        },
        {
          taskPhase: "软件审核发布",
          phaseStatus: "undo",
          phasePerson: "信T局管理人员",
          dateTime: "2023/4/2 12:12:12"
        }
      ],
      showTaskHistoryList: [],
      testDepartmentList: [
        {
          id: 1,
          label: "1区单位",
          name: "1区单位",
          children: [
            {
              id: 4,
              label: "1区单位部门",
              name: "1区单位部门",
              children: [
                {
                  id: 10,
                  label: "1区单位部门小组1",
                  name: "1区单位部门小组1"
                },
                {
                  id: 11,
                  label: "1区单位部门小组2",
                  name: "1区单位部门小组2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "2区单位",
          name: "2区单位",
          children: [
            {
              id: 5,
              label: "2区单位部门1",
              name: "2区单位部门1"
            },
            {
              id: 6,
              label: "2区单位部门2",
              name: "2区单位部门2"
            },
            {
              id: 7,
              label: "2区单位部门3",
              name: "2区单位部门3"
            }
          ]
        },
        {
          id: 3,
          label: "3区单位",
          name: "3区单位",
          children: [
            {
              id: 8,
              label: "3区单位部门1",
              name: "3区单位部门1"
            },
            {
              id: 9,
              label: "3区单位部门2",
              name: "3区单位部门2"
            }
          ]
        }
      ],
      uploadURL: "127.0.0.1",
      userRole: "user",
      timer: "",
      selectedSoftwareList: [],
      judgeTestReport: false
    };
  },
  mounted() {
    this.getDeptTree()
    this.userRole = this.userName;
    this.taskInfoForm = JSON.parse(localStorage.getItem("taskInfo"));
    console.log(this.taskInfoForm, this.taskStep(this.taskInfoForm.taskPhase));
    this.taskSoftwareList = JSON.parse(
      JSON.stringify(this.taskInfoForm.taskSoftwareList)
    );
    this.certificateList = JSON.parse(
      JSON.stringify(this.taskInfoForm.certificateList)
    );
    // this.afReportList = JSON.parse(JSON.stringify(this.taskInfoForm.afReportList))
    // this.testReportList = JSON.parse(JSON.stringify(this.taskInfoForm.testReportList))
    // this.so
    // this.timer = setInterval(() => {
    //   if ((JSON.parse(localStorage.getItem("userInfo")) !== null)&&(JSON.parse(localStorage.getItem("privilegeList")) !== null)) {
    //     this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //     this.privilegeList = JSON.parse(localStorage.getItem('privilegeList'));
    //   }
    // }, 1000)
  },
  computed: {
    userName() {
      return localStorage.getItem("userType");
    }
  },
  watch: {
    userName(newVal, oldVal) {
      console.log(newVal, "newVal");
      this.userRole = newVal;
    }
  },
  methods: {
    // 获取部门导航树
    getDeptTree() {
      organization.getOrganization("", this.currentPage, this.pageSize)
        .then(response => {
          if (response.code === 200) {
            let softwareTypeArray = response.data.list
            this.testDepartmentList = []
            if(softwareTypeArray.length>0){
              softwareTypeArray.forEach(element => {
                let item = this.buildTreeOptions(element)
                this.testDepartmentList.push(item)
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      }
      if(item.children.length > 0){
        for(let num =0;num<item.children.length;num++){
          node.children.push(this.buildTreeOptions(item.children[num]))
        }
      }
      return node
    },
    goBack() {
      history.go(-1)
    },
    openTableExpand(row) {
      this.$refs.taskSoftwareList.toggleRowExpansion(row)
    },
    handlePreview() {},
    handleRemove() {},
    judgeTestDepartment() {
      if (this.taskStep(this.taskInfoForm.taskPhase) > 6) {
        return true;
      } else if (this.taskStep(this.taskInfoForm.taskPhase) == 6) {
        if (this.userRole == "applicationUser") {
          console.log("cc")
          if(this.taskInfoForm.phaseStatus==='undo'){
          console.log("ccc")
            return false;
          }else{
          console.log("cccc")
            return true;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    changeSoftwareAFTestStatus(sign) {
      if (this.taskInfoForm.taskPhase === "安防检测") {
        this.selectedSoftwareList.forEach(item => {
          let num = this.taskSoftwareList.indexOf(item);
          this.taskSoftwareList[num].afStatus = sign;
        });
      } else if (this.taskInfoForm.taskPhase === "软件试用") {
        this.selectedSoftwareList.forEach(item => {
          let num = this.taskSoftwareList.indexOf(item);
          this.taskSoftwareList[num].testStatus = sign;
        });
        let item = false
        for(let i=0;i<this.taskSoftwareList.length;i++){
          if(this.taskSoftwareList[i].testStatus!="pass"){
            item = true
          }
        }
        if(item){
          this.judgeTestReport = false
        }else{
          this.judgeTestReport = true
        }
      }
      this.selectedSoftwareList = []
      this.$refs.taskSoftwareList.clearSelection()
    },
    handleTableSelectionChange(val) {
      this.selectedSoftwareList = val;
      console.log(this.selectedSoftwareList);
    },
    taskStep(txt) {
      let index = this.phaseNameList.indexOf(txt);
      return index;
    },
    drawProcess(phaseLabel, status) {
      this.showTaskHistoryList = [];
      console.log(phaseLabel, status, "phaseLabel and status");
      for (let i = 0; i < this.phaseNameList.length; i++) {
        if (this.phaseNameList[i] !== phaseLabel) {
          this.showTaskHistoryList.push(this.taskHistoryList[i]);
          this.showTaskHistoryList[i].phaseStatus = "pass";
          this.showTaskHistoryList[i].phasePerson;
        } else {
          this.showTaskHistoryList.push(this.taskHistoryList[i]);
          this.showTaskHistoryList[i].phaseStatus = status;
          break;
        }
      }
    },
    showTaskProcess() {
      localStorage.setItem("taskInfo", JSON.stringify(this.taskInfoForm));
      let routeUrl = this.$router.resolve({
        path: "/admin/softwareUpload/taskProcess"
      });
      window.open(routeUrl.href, "_blank");
    },
    async showTaskHistory() {
      this.taskHistoryVisible = !this.taskHistoryVisible;
      await this.drawProcess(
        this.taskInfoForm.taskPhase,
        this.taskInfoForm.phaseStatus
      );
    },
    showPhaseStatus(item) {
      if (item === "undo") {
        return "未进行";
      } else if (item === "pass") {
        return "已通过";
      } else if (item === "refuse") {
        return "未通过";
      }
    },
    showAFAndTestStatus(item, sign) {
      if (item === "undo") {
        if (sign === "af") {
          return "待检测";
        } else if (sign === "test") {
          return "待试用";
        }
      } else if (item === "pass") {
        return "已通过";
      } else if (item === "refuse") {
        return "未通过";
      }
    },
    saveTaskDetail() {
      if (
        this.taskInfoForm.taskPhase == "软件审核发布" &&
        this.userRole == "XTUser"
      ) {
        this.$confirm("确认发布软件", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let taskList = JSON.parse(localStorage.getItem("taskListData"));
            for (let i = 0; i < taskList.length; i++) {
              if (taskList[i].taskId === this.taskInfoForm.taskId) {
                taskList[i].phaseStatus = "pass";
                let date = new Date();
                let year = date.getFullYear();
                let month =
                  date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
                let day =
                  date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hour =
                  date.getHours() < 10
                    ? "0" + date.getHours()
                    : date.getHours();
                let minute =
                  date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes();
                let second =
                  date.getSeconds() < 10
                    ? "0" + date.getSeconds()
                    : date.getSeconds();
                taskList[i].taskEndTime =
                  year +
                  "-" +
                  month +
                  "-" +
                  day +
                  " " +
                  hour +
                  ":" +
                  minute +
                  ":" +
                  second;
                taskList[
                  i
                ].downloadPrivilege = this.taskInfoForm.downloadPrivilege;
                taskList[i].announcement = this.taskInfoForm.announcement;
                break;
              }
            }
            localStorage.setItem("taskListData", JSON.stringify(taskList));
            this.$router.push({ path: "/admin/softwareUpload/showStatus" });
          })
          .catch(error => {
            console.log(error);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (this.userRole === "AFUser") {
        this.$confirm("是否已上传软件安防检测报告并提交", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let statusAll = true;
            for (let i = 0; i < this.taskSoftwareList.length; i++) {
              if (this.taskSoftwareList[i].afStatus === "undo") {
                statusAll = false;
                break;
              }
            }
            if (!statusAll) {
              return this.$message.info(
                "请完成对软件的安全检测并修改软件状态。"
              );
            }
            let taskList = JSON.parse(localStorage.getItem("taskListData"));
            for (let i = 0; i < taskList.length; i++) {
              if (taskList[i].taskId === this.taskInfoForm.taskId) {
                taskList[i].taskPhase = "试用任务审核";
                taskList[i].phaseStatus = "undo";
                taskList[i].taskEndTime = "未结束";
                taskList[i].taskSoftwareList = this.taskSoftwareList;
                break;
              }
            }
            localStorage.setItem("taskListData", JSON.stringify(taskList));
            this.$router.push({ path: "/admin/softwareUpload/showStatus" });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (this.userRole === "SYUser") {
        this.$confirm("是否已上传软件试用报告并提交", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let statusAll = true;
            for (let i = 0; i < this.taskSoftwareList.length; i++) {
              if (this.taskSoftwareList[i].testStatus === "undo") {
                statusAll = false;
                break;
              }
            }
            if (!statusAll) {
              return this.$message.info("请完成对软件的试用并修改软件状态。");
            }
            let taskList = JSON.parse(localStorage.getItem("taskListData"));
            // for (let n = 0; n < this.taskSoftwareList.length; n++) {
            //   this.taskSoftwareList[n].testStatus = "pass";
            // }
            for (let i = 0; i < taskList.length; i++) {
              if (taskList[i].taskId === this.taskInfoForm.taskId) {
                taskList[i].taskPhase = "软件发布申请";
                taskList[i].phaseStatus = "undo";
                taskList[i].taskEndTime = "未结束";
                taskList[i].taskSoftwareList=this.taskSoftwareList
                break;
              }
            }
            localStorage.setItem("taskListData", JSON.stringify(taskList));
            this.$router.push({ path: "/admin/softwareUpload/showStatus" });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    passProcess() {
      this.$confirm("要通过该流程吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let taskList = JSON.parse(localStorage.getItem("taskListData"));
          for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId === this.taskInfoForm.taskId) {
              let num = this.taskStep(this.taskInfoForm.taskPhase);
              taskList[i].taskPhase = this.phaseNameList[num + 1];
              taskList[i].phaseStatus = "undo";
              taskList[i].taskEndTime = "未结束";
              break;
            }
          }
          localStorage.setItem("taskListData", JSON.stringify(taskList));
          this.$router.push({ path: "/admin/softwareUpload/showStatus" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    applicationPublish() {
      this.$confirm("是否提交软件发布申请", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let taskList = JSON.parse(localStorage.getItem("taskListData"));
          for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId === this.taskInfoForm.taskId) {
              taskList[i].taskPhase = "软件审核发布";
              taskList[i].phaseStatus = "undo";
              taskList[i].taskEndTime = "未结束";
              taskList[i].downloadPrivilege = JSON.parse(
                JSON.stringify(this.taskInfoForm.downloadPrivilege)
              );
              taskList[i].announcement = this.taskInfoForm.announcement;
              break;
            }
          }
          localStorage.setItem("taskListData", JSON.stringify(taskList));
          this.$router.push({ path: "/admin/softwareUpload/showStatus" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    downloadTaskSoftware(id) {},
    uploadSecurityDetectionReport() {
      this.afreportVisible = true;
    },
    uploadSoftwareTrialReport() {},
    showCollapse() {}
  }
};
</script>
<style scoped>
.uploadRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.inCardDiv {
  margin: 20px;
}
#taskInfoForm .el-form-item {
  margin-bottom: 0;
}
.el-form >>> .el-form-item__label {
    text-align: justify;
    text-align-last: justify;
    font-size: 16px;
}
</style>