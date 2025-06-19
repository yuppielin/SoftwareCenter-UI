<template>
  <div>
    <el-card class="custome custome-height">
      <div class="inCardDiv">
        <el-row>
          <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="topLeftIcon">
                    <i
                      class="el-icon-s-grid"
                      style="color:white;font-size:40px;margin:20px 0 0 20px;"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ systemAndSoftwareInfo.totalCount }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">系统总数</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
          <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="topLeftIcon">
                    <i class="el-icon-box" style="color:white;font-size:40px;margin:20px 0 0 20px;"></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span
                      style="font-size: 40px;line-height: 40px"
                    >{{ systemAndSoftwareInfo.afCount }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">待检测</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
          <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="topLeftIcon">
                    <i
                      class="el-icon-s-platform"
                      style="color:white;font-size:40px;margin:20px 0 0 20px;"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ systemAndSoftwareInfo.syCount }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">待试用</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
          <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="topLeftIcon">
                    <i
                      class="el-icon-search"
                      style="color:white;font-size:40px;margin:20px 0 0 20px;"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ systemAndSoftwareInfo.unReleaseCount }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">待发布</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
          <el-col :span="4">
            <el-card class="topCard">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="topLeftIcon">
                    <i
                      class="el-icon-search"
                      style="color:white;font-size:40px;margin:20px 0 0 20px;"
                    ></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="width:100px;height:80px;margin: 0 auto;text-align: center;">
                    <span style="font-size: 40px;line-height: 40px">{{ systemAndSoftwareInfo.releaseCount }}</span>
                    <br />
                    <span style="font-size: 16px;line-height: 40px;">已发布</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-form
          style="margin-top: 10px;"
          id="taskSearchForm"
          ref="taskSearchForm"
          v-model="taskSearchForm"
          label-position="right"
          label-width="100px"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item label="上传单位：" prop="cUnit">
                <el-input style="width: 100%;" size="small" v-model="taskSearchForm.cUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="上传人：" prop="cName">
                <el-input style="width: 100%;" size="small" v-model="taskSearchForm.cName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="当前阶段："
                prop="stage"
              >
                <el-select style="width: 100%;" size="small" v-model="taskSearchForm.searchStage">
                  <el-option
                    v-for="item in selectstageNameList"
                    :key="item.index"
                    :label="item.label"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态：" prop="status">
                <el-select style="width: 100%;" size="small" v-model="taskSearchForm.status">
                  <el-option :value="0" label="进行中">进行中</el-option>
                  <el-option :value="1" label="已通过">已通过</el-option>
                  <el-option :value="2" label="未通过">未通过</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align: right;margin-top:3px">
              <el-button size="small" type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
              <el-button size="small" type="reset"  @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="uploadRow" style="background: #d4d6d8;">
          <el-col :span="12" style="height: 40px;" class="uploadRow">
            <span style="margin-left: 20px;">{{taskTableTitle}}</span>
          </el-col>
        </el-row>
        <el-table :border="true" :data="showTaskData" max-height="530px" :header-cell-style="{height:'30px'}">
          <el-table-column label="序号" align="center" type="index" width="100"></el-table-column>
          <el-table-column label="系统名称"  header-align="center" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="上传时间" align="center" prop="ctime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.ctime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前阶段" width="180" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="showSystemStage(scope.row.stage)"></span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scoped">
              <span
                v-text="stageStatusList[scoped.row.status]"
                style="padding:2px 5px;color:white;border-radius:2px;font-size:12px;"
                :style="{background:scoped.row.status==0?'orange':scoped.row.status==1?'#67C23A':'#F56C6C'}"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="上传单位" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="scope.row.cunit!=null?scope.row.cunit:selectDictLabels(testDepartmentList,scope.row.cunitId)"></span>
            </template>
          </el-table-column>
          <el-table-column label="上传人" align="center" prop="cname" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.stage!='1'"
                size="small"
                @click="showTaskDetail(scope.row)"
                icon="el-icon-tickets"
              >系统详情</el-button>
              <!-- <span style="font-size: 12px;" v-else>未上传成功</span> -->

              <el-button
                v-if="userRole=='admin'"
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
          :page-sizes="[9, 50, 100, 200, 300, 400, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <softwareRelease :dialogVisible="uploadDialog" @closeDialog="uploadDialog = false" />
  </div>
</template>
<script>
import softwareRelease from "./softwareRelease";
import * as organization from "@/api/organization";

import * as softwareTaskApi from "@/api/software-task"; //软件任务接口

import { getStatisticInfoByRole } from "@/api/software";

export default {
  components: {
    softwareRelease
  },
  data() {
    return {
      systemAndSoftwareInfo: {
        afCount: 0,
        releaseCount: 0,
        syCount: 0,
        totalCount: 0,
        unReleaseCount: 0
      },
      currentPage: 1,
      pageSize: 9,
      totalCount: 0,
      taskSearchForm: {
        cName: "",
        cUnit: "",
        searchStage: null,
        status: null
      },

      uploadDialog: false,
      softwareSearchForm: {
        softwareName: "",
        softwareStatus: "",
        createTime: ""
      },

      userRole: "user",
      showTaskData: [],
      taskTableTitle: "系统列表",
      stageNameList: [
        "软件上传",
        "检测申请审核",
        "检测任务下达",
        "安防检测",
        "试用任务审核",
        "软件试用",
        "软件审核发布"
      ],
      selectstageNameList: [
        {
          index: 1,
          label: "软件上传"
        },
        {
          index: 2,
          label: "检测申请审核"
        },
        {
          index: 3,
          label: "检测任务下达"
        },
        {
          index: 4,
          label: "安防检测"
        },
        {
          index: 5,
          label: "试用任务审核"
        },
        {
          index: 6,
          label: "软件试用"
        },
        {
          index: 7,
          label: "软件审核发布"
        }
      ],
      stageStatusList: ["进行中", "已通过", "未通过"]
    };
  },
  mounted() {
    this.getDeptTree()
    this.listSoftwareTask();
    this.userRole = localStorage.getItem("userType");

    this.getSoftwareStatisticInfo();
  },
  methods: {
    // 获取部门导航树
    getDeptTree() {
      organization
        .getOrganization()
        .then(response => {
          if (response.code === 200) {
            let softwareTypeArray = response.data;
            this.testDepartmentList = [];
            if (softwareTypeArray.length > 0) {
              softwareTypeArray.forEach(element => {
                let item = this.buildTreeOptions(element);
                this.testDepartmentList.push(item);
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      };
      if (item.children.length > 0) {
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      return node;
    },
    getSoftwareStatisticInfo() {
      getStatisticInfoByRole().then(res => {
        if (res.code == 200) {
          this.systemAndSoftwareInfo = res.data;
          console.log(this.systemAndSoftwareInfo, res)
        }
      });
    },
    showSystemStage(value) {
      if (value != null && value != undefined && value.trim() != "") {
        let num = parseInt(value) - 1;
        return this.stageNameList[num];
      }
    },
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.listSoftwareTask();
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listSoftwareTask();
    },
    showTaskDetail(item) {
      localStorage.setItem("taskInfo", JSON.stringify(item));
      localStorage.setItem("systemId", item.id);
      this.$router.push({
        path: "/admin/softwareUpload/taskDetails"
      });
    },
    taskStep(txt) {
      let index = this.stageNameList.indexOf(txt);
      return index;
    },
    listSoftwareTask(taskId) {
      softwareTaskApi
        .listSoftwareTaskByRole({
          ...this.taskSearchForm,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(response => {
          this.showTaskData = response.data.list;
          this.totalCount = response.data.total;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.currentPage = 1;
      this.listSoftwareTask();
    },
    /** 重置按钮操作 */
    resetQuery() {
      (this.taskSearchForm = {
        cName: "",
        cUnit: "",
        searchStage: null,
        status: null,
        searchStatus: null
      }),
        this.handleQuery();
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
};
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
.topCard {
  background: #eff2f4;
  border: 1px solid #e3e8ea;
}
.topLeftIcon {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  /* background: #13ce66; */
  background: #54deec;
  margin: 0 auto;
}
/* #showStatusPage >>> .el-pager li.active {
  background-color: #cccccc;
} */
</style>