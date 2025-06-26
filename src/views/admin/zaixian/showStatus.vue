<template>
  <div>
    <el-card class="custome custome-height">
      <div class="inCardDiv">
        <el-row style="text-align: left;">
          <!--          <el-button-->
          <!--            size="small"-->
          <!--            v-if="$checkPermission(['applicationUser'])"-->
          <!--            type="primary"-->
          <!--            @click="uploadDialog=true"-->
          <!--            icon="el-icon-upload"-->
          <!--          >软件上传</el-button>-->
        </el-row>
        <el-row v-show="userRole==='applicationUser'" :gutter="20" style="margin-top: 10px;">
          <el-col :span="5">
            <el-card  class="topCard topCard-1">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/softwareManage.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.totalCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[0] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!--          <el-col :span="1" style="border: 1px solid transparent;"></el-col>-->
          <el-col :span="5">
            <el-card class="topCard topCard-2">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview1.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.releaseCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[5] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!--          <el-col :span="1" style="border: 1px solid transparent;"></el-col>-->
          <el-col :span="5">
            <el-card class="topCard topCard-3">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview2.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.unReleaseCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[4] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!--          <el-col :span="1" style="border: 1px solid transparent;"></el-col>-->
          <el-col :span="5">
            <el-card class="topCard topCard-5">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview4.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ stateStatisticInfo.syCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[3] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!--          <el-col :span="1" style="border: 1px solid transparent;"></el-col>-->
          <el-col :span="5">
            <el-card class="topCard topCard-4">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview3.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ stateStatisticInfo.afCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[2] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!-- <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div
                    class="topLeftIcon"
                  >
                    <i
                      class="el-icon-s-check"
                      style="color:white;font-size:40px;margin:20px 0 0 20px;"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ applocationTopInfo.unExamineTask }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[1] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>-->
        </el-row>
        <el-row
          v-show="userRole==='AFUser'||userRole==='SYUser'"
          :gutter="20"
          style="margin-top: 10px;"
        >
          <el-col :span="6">
            <el-card class="topCard topCard-1">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/softwareManage.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.totalCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[0] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="topCard topCard-4">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview3.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      v-if="userRole==='AFUser'"
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.afCount }}</span>
                    <span
                      v-if="userRole==='SYUser'"
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.syCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[1] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="topCard topCard-2">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview1.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.passCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[2] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="topCard topCard-3">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview2.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.unPassCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[3] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row
          v-show="userRole==='SHUser'||userRole==='XTUser'"
          :gutter="80"
          style="margin-top: 10px;"
        >
          <el-col :span="8">
            <el-card class="topCard topCard-1">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/softwareManage.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ stateStatisticInfo.totalCount }}</span>
                    <br>
                    <span style="font-size: 16px;line-height: 40px;">{{ taskShowTop[0] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="topCard topCard-2">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview1.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px;"
                    >{{ stateStatisticInfo.checkingCount }}</span>
                    <br>
                    <span
                      class="divcssUnderline"
                      style="font-size: 16px;line-height: 40px;cursor: pointer;"
                      @click="taskSearchForm.searchStatus='0';handleQuery()"
                    >{{ taskShowTop[1] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="topCard topCard-3">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>
                    <img src="@/assets/index/adminOverview2.png" width="80" height="80"/>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px;"
                    >{{ stateStatisticInfo.checkedCount }}</span>
                    <br>
                    <!-- <span
                      class="divcssUnderline"
                      style="font-size: 16px;line-height: 40px;cursor: pointer;"
                      @click="taskSearchForm.searchStatus='1,2';handleQuery()"
                    >{{ taskShowTop[2] }}</span> -->
                    <span
                      style="font-size: 16px;line-height: 40px;cursor: pointer;"
                    >{{ taskShowTop[2] }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="search-col">
          <el-col :span="4" style="margin-top: 10px">
            <el-button
              v-if="$checkPermission(['applicationUser','SHUser'])"
              size="small"
              type="primary"
              icon="el-icon-upload"
              @click="uploadDialog=true"
            >软件/资料上传</el-button>
          </el-col>
          <el-col :span="20">
            <el-form
              v-show="userRole!=='user'"
              id="taskSearchForm"
              ref="taskSearchForm"
              v-model="taskSearchForm"
              label-position="right"
              label-width="100px"
              :prop="false"
              :inline="true"
              style="text-align:right"
            >
              <!-- <el-row :gutter="10" type="flex" justify="end"> -->
                <span :span="7">
                  <el-form-item label="上传单位：" prop="cUnit">
                    <el-input v-model="taskSearchForm.cUnit" placeholder="请输入上传单位" style="width: 100%;" size="small" />
                  </el-form-item>
                </span>
                <span v-show="userRole!='applicationUser'" :span="7">
                  <el-form-item label="上传人：" prop="cName">
                    <el-input v-model="taskSearchForm.cName" placeholder="请选择上传人" style="width: 100%;" size="small" />
                  </el-form-item>
                </span>
<!--                <el-col :span="7" :style="{'display': userRole!='AFUser'&&userRole!='SYUser'?'':'none'}">-->
                <span :span="7" v-show="userRole!='AFUser'&&userRole!='SYUser'">
                  <el-form-item
                    label="当前阶段："
                    prop="stage"
                  >
                    <el-select v-model="taskSearchForm.searchStage" placeholder="请选择当前阶段" style="width: 100%;" size="small">
                      <el-option
                        v-for="item in selectstageNameList"
                        :key="item.index"
                        :label="item.label"
                        :value="item.index"
                      />
                    </el-select>
                  </el-form-item>
                </span>
                <span style="text-align: left;">
                  <el-form-item label="状态：" prop="status">
                    <el-select v-model="taskSearchForm.status" placeholder="请选择状态" style="width: 100%;" size="small">
                      <el-option :value="0" label="进行中">进行中</el-option>
                      <el-option :value="1" label="已通过">已通过</el-option>
                      <el-option :value="2" label="未通过">未通过</el-option>
                    </el-select>
                  </el-form-item>
                </span>
                <span style="text-align: left;">
                  <el-form-item style="margin-right:0">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button size="small" type="reset" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </span>
              <!-- </el-row> -->
            </el-form>
          </el-col>
        </el-row>
<!--        <el-row v-show="userRole!=='user'" class="uploadRow" style="background: #d4d6d8;">-->
<!--          <el-col :span="12" style="height: 40px;" class="uploadRow">-->
<!--            <span style="margin-left: 20px;">{{ taskTableTitle }}</span>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-table v-show="userRole!=='user'" :border="true" :data="showTaskData" max-height="500px">
          <el-table-column label="序号" align="center" type="index" width="100" />
          <el-table-column label="系统名称" header-align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="上传时间" align="center" prop="ctime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.ctime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前阶段" width="180" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="showSystemStage(scope.row.stage)" />
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scoped">
              <span
                style="padding:2px 5px;color:white;border-radius:2px;font-size:12px;"
                :class="scoped.row.status==0?'table-data-status-yellow':scoped.row.status==1?'table-data-status-green':'table-data-status-grey'"
                v-text="stageStatusList[scoped.row.status]"
              />
            </template>
          </el-table-column>
          <el-table-column label="上传单位" align="center" prop="cunit" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="scope.row.cunit!=null?scope.row.cunit:selectDictLabels(testDepartmentList,scope.row.cunitId)" />
            </template>
          </el-table-column>
          <el-table-column label="上传人" align="center" prop="cname" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.stage=='4'&&scope.row.status==0&&userRole =='AFUser'"
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="showTaskDetail(scope.row)"
              >安防检测</el-button>
              <el-button
                v-else-if="scope.row.stage=='4'&&scope.row.status==2&&(userRole =='applicationUser'||userRole=='SHUser')"
                size="small"
                type="primary"
                icon="el-icon-upload"
                @click="showTaskDetail(scope.row)"
              >软件重传</el-button>
              <el-button
                v-else-if="scope.row.stage=='6'&&scope.row.status==0&&userRole =='SYUser'"
                size="small"
                type="primary"
                icon="el-icon-odometer"
                @click="showTaskDetail(scope.row)"
              >软件试用</el-button>
              <el-button
                v-else-if="scope.row.stage!='1'"
                size="small"
                icon="el-icon-tickets"
                @click="showTaskDetail(scope.row)"
              >系统详情</el-button>
              <el-button
                v-else-if="scope.row.stage=='1'&&(userRole =='applicationUser'||userRole=='SHUser')"
                class="yellowButton"
                size="small"
                icon="el-icon-upload2"
                @click="uploadSystemSecond(scope.row)"
              >继续操作</el-button>
              <span
               v-else
               >未上传成功</span>
              <el-button
                v-if="scope.row.stage =='3'&&showPassButton(scope.row)"
                size="small"
                type="primary"
                @click="openAFDialog(scope.row)"
              >通过</el-button>
              <el-button
                v-else-if="showPassButton(scope.row)"
                size="small"
                type="primary"
                @click="openReviewerDialog(scope.row)"
              >通过</el-button>
              <el-button
                v-if="scope.row.stage =='1'"
                size="small"
                type="danger"
                @click="remove(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          id="showStatusPage"
          background
          style="margin-top:15px;"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[8, 50, 100, 200, 300, 400, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <softwareRelease :dialog-visible="uploadDialog" @closeDialog="uploadDialog = false" />
    <AFUnitSelectDialog
      :visible="afSelectVisible"
      :data="afFormData"
      @close="closeAFDialog"
      @closeOut="closeAFDialogOut"
    />
    <el-dialog :title="reviewerForm.title" :visible.sync="reviewerForm.dialogVisible">
      <el-form
        ref="reviewerFormRef"
        :model="reviewerForm"
        label-width="110px"
        label-position="right"
      >
        <el-form-item
          label="审核人："
          prop="reviewerName"
          :rules="[{required:true,message:'审核人姓名不能为空',trigger:'blur'}]"
        >
          <el-input
            v-model="reviewerForm.reviewerName"
            style="width: 80%;"
            maxlength="10"
            placeholder="请输入审核人真实姓名"
          />
        </el-form-item>
        <el-form-item
          label="联系方式："
          prop="telphone"
          :rules="[{required:true,message:'联系方式不能为空',trigger:'blur'}]"
        >
          <el-input v-model="reviewerForm.telphone" style="width: 80%;" maxlength="11" placeholder="请输入审核人联系方式" />
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;">
        <el-button size="small" type="primary" @click="clickReviewButton('pass')">提交</el-button>
        <el-button size="small" @click="clickReviewButton('refuse')">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import softwareRelease from './softwareRelease'
import * as organization from '@/api/organization'

import * as softwareTaskApi from '@/api/software-task' // 软件任务接口

import { getStatisticInfoByRole } from '@/api/software'

export default {
  components: {
    softwareRelease,
    AFUnitSelectDialog: () => import('./AFUnitSelectDialog.vue')
  },
  data() {
    return {
      stateStatisticInfo: {
        totalCount: 0,
        passCount: 0,
        anPassCount: 0,
        afCount: 0,
        syCount: 0,
        checkingCount: 0,
        checkedCount: 0
      },
      currentPage: 1,
      pageSize: 8,
      totalCount: 0,
      taskSearchForm: {
        cName: '',
        cUnit: '',
        searchStage: null,
        status: null
      },

      afSelectVisible: false,
      afFormData: {
        softwareSystemName: ''
      },
      uploadDialog: false,
      softwareSearchForm: {
        softwareName: '',
        softwareStatus: '',
        createTime: ''
      },

      userRole: 'user',
      softwareTopInfo: {
        unStart: 0,
        unExamine: 0,
        unDetection: 0,
        unTest: 0,
        unPublish: 0,
        hasPublish: 0
      },
      applocationTopInfo: {
        allTask: 0,
        unAFTask: 0,
        unTestTask: 0,
        unExamineTask: 0,
        unPublishTask: 0,
        hasPublishTask: 0
      },
      taskTopInfo: {
        allTask: 0,
        undoTask: 0,
        passTask: 0,
        refuseTask: 0
      },
      applicationShowTop: [
        '软件总数',
        '待审核数',
        '待检测数',
        '待试用数',
        '未发布数',
        '已发布数'
      ],
      taskShowTop: ['软件总数', '未发布', '已通过', '未通过'],
      afShowTop: ['系统总数', '待检测软件', '已通过软件', '未通过软件'],
      syShowTop: ['系统总数', '待试用软件', '已通过软件', '未通过软件'],
      zgxtShowTop: ['系统总数', '未处理', '已处理'],
      softwareData: [],
      showTaskData: [],
      applicationData: [],
      afTaskData: [],
      testTaskData: [],
      xtData: [],
      shData: [],
      taskListData: [],
      taskTableTitle: '系统列表',
      stageNameList: [
        '软件上传',
        '检测申请审核',
        '检测任务下达',
        '安防检测',
        '试用任务审核',
        '软件试用',
        '软件审核发布'
      ],
      selectstageNameList: [
        {
          index: 1,
          label: '软件上传'
        },
        {
          index: 2,
          label: '检测申请审核'
        },
        {
          index: 3,
          label: '检测任务下达'
        },
        {
          index: 4,
          label: '安防检测'
        },
        {
          index: 5,
          label: '试用任务审核'
        },
        {
          index: 6,
          label: '软件试用'
        },
        {
          index: 7,
          label: '软件审核发布'
        }
      ],
      stageStatusList: ['进行中', '已通过', '未通过'],

      reviewerForm: {
        title: null,
        dialogVisible: false,
        reviewerName: '',
        telphone: null
      },
      reviewerItem: {},
      testDepartmentList: []
    }
  },
  mounted() {
    this.getDeptTree()
    this.listSoftwareTask()
    this.userRole = localStorage.getItem('userType')

    if (this.userRole === 'applicationUser') {
      this.taskShowTop = []
      this.taskShowTop = this.taskShowTop.concat(this.applicationShowTop)
    } else if (this.userRole === 'AFUser') {
      this.taskShowTop = []
      this.taskShowTop = this.taskShowTop.concat(this.afShowTop)
    } else if (this.userRole === 'SYUser') {
      this.taskShowTop = []
      this.taskShowTop = this.taskShowTop.concat(this.syShowTop)
    } else if (this.userRole === 'SHUser' || this.userRole === 'XTUser') {
      this.taskShowTop = []
      this.taskShowTop = this.taskShowTop.concat(this.zgxtShowTop)
    }

    this.getSoftwareStatisticInfo()
  },
  methods: {
    // 获取部门导航树
    getDeptTree() {
      organization
        .getOrganization()
        .then(response => {
          if (response.code === 200) {
            const softwareTypeArray = response.data
            this.testDepartmentList = []
            if (softwareTypeArray.length > 0) {
              softwareTypeArray.forEach(element => {
                const item = this.buildTreeOptions(element)
                this.testDepartmentList.push(item)
              })
            }
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    buildTreeOptions(item) {
      const node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      }
      if (item.children.length > 0) {
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]))
        }
      }
      return node
    },
    clickReviewButton(sign) {
      if (sign === 'pass') {
        this.$refs.reviewerFormRef.validate(valid => {
          if (valid) {
            this.passProcess(this.reviewerItem)
            this.reviewerForm.dialogVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.reviewerForm.dialogVisible = false
      }
    },
    openReviewerDialog(item) {
      this.reviewerForm = {
        title: this.showSystemStage(item.stage) + '审核人信息填写',
        dialogVisible: true,
        reviewerName: '',
        telphone: null
      }
      this.reviewerItem = JSON.parse(JSON.stringify(item))
    },
    getSoftwareStatisticInfo() {
      getStatisticInfoByRole().then(res => {
        if (res.code == 200) {
          this.stateStatisticInfo = res.data
        }
      })
    },
    uploadSystemSecond(item) {
      console.log(item, 'uploadSystemSecond')
      localStorage.setItem('systemId', item.id)
      if (item.taskUploadType === 1) {
        this.$router.push({
          path: '/admin/softwareUpload/basicSoftwareUpload'
        })
      } else {
        this.$router.push({ path: '/admin/softwareUpload/applicationUpload' })
      }
    },
    showPassButton(item) {
      if (item.status === 0) {
        if (this.userRole === 'SHUser' && item.stage === '2') {
          return true
        } else if (this.userRole === 'XTUser' && item.stage === '3') {
          return true
        } else if (this.userRole === 'XTUser' && item.stage === '5') {
          return true
        } else if (this.userRole === 'XTUser' && item.stage === '7') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    showSystemStage(value) {
      if (value != null && value != undefined && value.trim() != '') {
        const num = parseInt(value) - 1
        return this.stageNameList[num]
      }
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.listSoftwareTask()
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.listSoftwareTask()
    },

    openAFDialog(item) {
      this.afFormData = item
      this.afSelectVisible = true
      console.log(this.afFormData, this.afSelectVisible)
    },
    closeAFDialogOut() {
      this.afSelectVisible = false
    },
    closeAFDialog(item) {
      this.afSelectVisible = false
      if (item.afUnitId != null) {
        this.$confirm('要通过该流程吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            const stageNum = parseInt(item.stage) + 1
            const data = {
              id: item.id,
              stage: stageNum,
              status: 0,
              afUnitId: item.afUnitId,
              contactUser: item.contactUser,
              contactInfor: item.contactInfor
            }
            softwareTaskApi.afTastPublishAudit(data).then(async response => {
              if (response.code === 200) {
                await this.listSoftwareTask()
                location.reload()
              }
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    showTaskDetail(item) {
      localStorage.setItem('taskInfo', JSON.stringify(item))
      // if (
      //   item.taskPhase === "软件试用" &&
      //   item.phaseStatus === "undo" &&
      //   this.userRole === "SYUser"
      // ) {
      //   localStorage.setItem("systemId", item.id);
      //   this.$router.push({
      //     path: "/admin/softwareUpload/testReportUpload"
      //   });
      // } else {
      localStorage.setItem('systemId', item.id)
      this.$router.push({
        path: '/admin/softwareUpload/taskDetails'
      })
      // }
    },
    taskStep(txt) {
      const index = this.stageNameList.indexOf(txt)
      return index
    },
    passProcess(item) {
      if (item.stage === '3') {
        console.log('aaaa')
        this.openAFDialog(item)
      } else if (this.showSystemStage(item.stage) === '软件审核发布') {
        this.$confirm('要发布该软件吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            const stageNum = parseInt(item.stage)
            const data = {
              id: item.id,
              stage: stageNum,
              status: 1,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            }
            softwareTaskApi.afTaskAudit(data).then(async response => {
              if (response.code === 200) {
                await this.listSoftwareTask()
                // location.reload();
              }
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else if (this.showSystemStage(item.stage) === '检测申请审核') {
        this.$confirm('要提交上级审批吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            const stageNum = parseInt(item.stage) + 1
            const data = {
              id: item.id,
              stage: stageNum,
              status: 0,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            }
            softwareTaskApi.afTaskAudit(data).then(async response => {
              if (response.code === 200) {
                await this.listSoftwareTask()
                // location.reload();
              }
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$confirm('要通过该流程吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            const stageNum = parseInt(item.stage) + 1
            const data = {
              id: item.id,
              stage: stageNum,
              status: 0,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            }
            softwareTaskApi.afTaskAudit(data).then(async response => {
              if (response.code === 200) {
                await this.listSoftwareTask()
                location.reload()
              }
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    listSoftwareTask(taskId) {
      this.$modal.loading()
      softwareTaskApi
        .listSoftwareTaskByRole({
          ...this.taskSearchForm,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(response => {
          this.$modal.closeLoading()
          this.showTaskData = response.data.list
          this.totalCount = response.data.total
        })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.currentPage = 1
      this.listSoftwareTask()
    },
    /** 重置按钮操作 */
    resetQuery() {
      (this.taskSearchForm = {
        cName: '',
        cUnit: '',
        searchStage: null,
        status: null,
        searchStatus: null
      }),
      this.handleQuery()
    },
    // 删除
    remove(item) {
       this.$confirm('确定删除该系统吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        this.$modal.loading('删除中，请稍候');
        softwareTaskApi.delSoftwareTask(item.id).then(response => {
          this.$modal.closeLoading()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.resetQuery();
        })
       })
    }
  }
}
</script>

<style scoped>
.inCardDiv {
  margin: 20px;
}
.uploadRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
#softwareSearchForm .el-form-item {
  margin-bottom: 0;
}
#taskSearchForm .el-form-item {
  margin-bottom: 0;
}
/*.topCard {*/
/*  background: #eff2f4;*/
/*  border: 1px solid #e3e8ea;*/
/*}*/
/*.topLeftIcon {*/
/*  width: 80px;*/
/*  height: 80px;*/
/*  border-radius: 40px;*/
/*  !* background: #13ce66; *!*/
/*  background: #54deec;*/
/*  margin: 0 auto;*/
/*}*/
/* #showStatusPage >>> .el-pager li.active {
  background-color: #cccccc;
} */
  .el-col-5 {
    width: 20%;
  }
  /deep/ .search-col .el-form-item__label {
    display: none!important;
  }
  /deep/ .search-col .el-form-item__content {
    margin-left: 0!important;
  }
.search-col .el-button,.search-col .el-button:hover {
  background: rgba(23,138,227,1);
}
.divcssUnderline {
  padding-bottom: 5px;
  border-bottom: 1px solid black;
}
</style>
