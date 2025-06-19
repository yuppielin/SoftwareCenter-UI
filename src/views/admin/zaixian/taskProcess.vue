<template>
  <div>
    <el-card>
      <!-- <div
        style="height:50px;line-height:50px;margin:0 0 10px 0;background:#F7F8FA;border-radius:5px;"
      >
        <i class="el-icon-s-order" style="margin-left:10px;"></i>
        <span style="font-size:18px;display:inline-block;font-weight:600;">流程图</span>
        <el-button @click="goBack" size="small" icon="el-icon-back">返回</el-button>
      </div> -->
      <el-row style="height:50px;line-height:50px;margin:0 0 10px 0;background:#F7F8FA;border-radius:5px;">
        <el-col :span="12">
          <div>
            <i class="el-icon-s-order" style="margin-left:10px;"></i>
            <span style="font-size:18px;display:inline-block;font-weight:600;">流程图</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button @click="goBack" style="margin-right: 20px;" size="small" icon="el-icon-back">返回</el-button>
        </el-col>
      </el-row>
      <div class="super-flow-base-demo">
        <super-flow
          :node-list="nodeList"
          :link-list="linkList"
          :origin="origin"
          :draggable="false"
          :linkAddable="false"
          :linkEditable="false"
          :hasMarkLine="false"
        >
          <template v-slot:node="{meta}">
            <el-tooltip :disabled="meta.phase>2" placement="bottom" effect="light">
              <div slot="content">
                节点名称：{{phaseName[meta.phase]}}-{{meta.label}}
                <br />
                节点负责人：{{meta.nodePerson}}
              </div>
              <div style="height: 100%;width: 100%;background-color: red;">
                <span @mousedown.stop @click="nodeClick(meta)">{{meta.label}}</span>
              </div>
            </el-tooltip>
          </template>
        </super-flow>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      feedbackData: {
        unreadCount: 0,
        feedbackInfoTable: []
      },
      userRole: "user",
      nodeList: [
        {
          id: 1,
          coordinate: [10, 10],
          width: 50,
          height: 50,
          meta: {
            label: "软件上传",
            status: "pass",
            type: "nodeProcess",
            phase: 0,
            nodePerson: "超级用户"
          }
        },
        {
          id: 2,
          coordinate: [140, 10],
          width: 50,
          height: 50,
          meta: {
            label: "检测申请审核",
            status: "pass",
            type: "nodeProcess",
            phase: 0,
            nodePerson: "超级用户"
          }
        },
        {
          id: 3,
          coordinate: [270, 10],
          width: 50,
          height: 50,
          meta: {
            label: "检测申请审核",
            status: "pass",
            type: "nodeProcess",
            phase: 0,
            nodePerson: "超级用户"
          }
        }
      ],
      linkList: [
        {
          id: "l1",
          startAt: [80, 40],
          startId: 1,
          endAt: [0, 40],
          endId: 2,
          meta: null
        },
        {
          id: "l2",
          startAt: [80, 40],
          startId: 2,
          endAt: [0, 40],
          endId: 3,
          meta: null
        }
      ],
      origin: [0, 0],
      phaseName: ["安防检测", "软件试用", "软件发布", "开始结束", "示例"],
      stageNameList: [
        "软件上传",
        "检测申请审核",
        "检测任务下达",
        "安防检测",
        "试用任务审核",
        "试用任务下达",
        "软件试用",
        "软件发布申请",
        "软件审核发布"
      ],
      stageStatusList: ["undo","pass","refuse"],
      taskInfo: {},
      uploadURL: "127.0.0.1"
    };
  },
  async mounted() {
    this.userRole = localStorage.getItem("userType");
    if (this.userRole === undefined || this.userRole === null) {
      this.userRole = "user";
    }
    this.taskInfo = JSON.parse(localStorage.getItem("taskInfo"));
    console.log(this.taskInfo);
    await this.drawProcess(parseInt(this.taskInfo.stage), this.taskInfo.status);
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    nodeClick(item) {
      console.log(item);
    },
    drawProcess(stage, status) {
      console.log(stage, status, "stage and status");
      let sign = false;
      for (let i = 0; i < this.stageNameList.length; i++) {
        if (i !== stage - 1) {
          if (sign) {
            this.nodeList[i + 1].meta.status = "undo";
          } else {
            this.nodeList[i + 1].meta.status = "pass";
          }
        } else {
          sign = true;
          this.nodeList[i + 1].meta.status = this.stageStatusList[status];
        }
      }
    }
  }
};
</script>
<style scoped>
.inCardDiv {
  margin: 20px;
}
.super-flow-base-demo {
  width: 400px;
  height: 70px;
  margin: 0;
  background-color: #f5f5f5;
  overflow: hidden;
  zoom: 0.8;
}
.nodeStart-start {
  width: 100%;
  height: 100%;
  color: #55abfc;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcessTitle0 {
  width: 100%;
  height: 30%;
  background: #fcc155;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcessTitle1 {
  width: 100%;
  height: 30%;
  background: #f77dff;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcessTitle2 {
  width: 100%;
  height: 30%;
  background: #def972;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcessTitle4 {
  width: 100%;
  height: 30%;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcess-undo {
  width: 100%;
  height: 70%;
  background: #b1b9b4;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcess-pass {
  width: 100%;
  height: 70%;
  background: #30b95c;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeProcess-refuse {
  width: 100%;
  height: 70%;
  background: #f35c5c;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodeEnd-end {
  width: 100%;
  height: 100%;
  color: red;
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.divStyle1 {
  font-size: 14px;
  width: 100%;
  height: 100%;
}
.divStyle2 {
  width: 100%;
  height: 100%;
}
</style>