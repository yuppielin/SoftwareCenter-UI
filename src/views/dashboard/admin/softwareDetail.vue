<template>
  <div>
    <el-card id="software-item" class="custome">
      <CloseBack>软件详情</CloseBack>
      <!-- <el-row :gutter="10" slot="header">
        <el-col :span="12">
          <el-button icon="el-icon-back" type="text" @click="goBack"></el-button>
          <span style="font-size:16px;">软件详情</span>
          <div v-show="data.rejectMsg" style="margin-top:5px;">
            <span style="color:red;">申请驳回:</span>
            <span>{{data.rejectMsg}}</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right"></el-col>
      </el-row> -->
      
      <div>
        <div v-show="data.rejectMsg" style="margin-top:5px;">
          <span style="color:red;">申请驳回:</span>
          <span>{{data.rejectMsg}}</span>
        </div>
        <el-row :gutter="10">
          <el-col :span="11" style="text-align:center;max-width:600px;box-shadow:2px 2px 8px rgba(255,255,255,0.5)">
            <el-image
              v-if="imgList.length<=1"
              style="width: 100%; height: 350px"
              :src="data.pic?globalUrl+data.pic:defaultP"
              :onerror="defaultP"
            />
            <el-carousel v-else :interval="4000" height="350px" :autoplay="true">
              <el-carousel-item v-for="(item,index) in imgList" :key="index">
                <img
                  :src="item.logo?logoAndPicUrl+item.logo:defaultS"
                  :onerror="defaultS"
                  style="width:100%;height:100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>

          <el-col :span="13" style="padding:0px 0 0 20px;">
            <el-row :gutter="10">
              <el-col :span="5" style="max-width:120px">
                <div class="software-logo">
                  <!-- <img :src="data.logo" width="60px" height="60px" /> -->
                  <img
                    :src="data.logo?globalUrl+data.logo:defaultS"
                    :onerror="defaultS"
                    width="60px"
                    height="60px"
                  />
                </div>
              </el-col>
              <el-col :span="19">
                <div class="software-title" style="overflow:hidden">
                  <div style="color:rgba(59,89,117,1);font-size: 16px;float:left">{{ data.name }}</div>
                  <!-- <div style="float:right;font-size:12px;color:#808080">
                    综合应用效能：
                    <span
                      style="font-size:18px;color: orange;font-weight: 600"
                    >{{ data.score }}分</span>
                  </div>-->
                </div>
                <el-row>
                  <div class="title">
                    <span style="text-align:left;width:70px">版本号：</span>
                    <el-select style="height:18px" v-model="dataVersionId" size="mini" @change="handleVersionChange">
                      <el-option
                        v-for="(version,index) in data.versionList"
                        :key="index"
                        :value="version.id"
                        :label="version.version"
                      />
                    </el-select>
                  </div>
                  <div class="title" style="width:auto"><span style="text-align:left;width:70px">软件描述：</span>{{data.versionData.description}}</div>
                  
                </el-row>
                
                <!-- <el-row>
                  <div class="title" style="text-align:right">综合应用效能：<span style="font-size:18px;color: orange;font-weight: 600">0分</span> </div>
                </el-row>-->
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-row>
                <div
                  class="title"
                >
                  <span>软件校验码：</span>
                  {{ (data.versionData.md5&&data.versionData.md5!==undefined)?data.versionData.md5:null }}
                </div>
              </el-row>
              <el-col :span="12">
                <div class="title">
                  <span>更新时间：</span>
                  {{ parseTime(data.versionData.ctime, '{y}-{m}-{d}') }}
                </div>
                <div class="title">
                 <span>提供单位：</span>
                  {{ data.offerUnit }}
                </div>
                <!-- <div class="title" v-show="data.softwareType!=1">
                  <span>软件评分：</span>
                  <el-rate
                    v-model="data.myScore/2"
                    allow-half
                    style="display:inline-block"
                    @change="updateSoftwareScore"
                  />
                  <span >(最高10分)</span>
                </div> -->
                <div v-if="data.softwareType==1" class="title"><span>项目分类：</span>{{ data.category }}</div>
                <div v-else class="title"><span>业务分类：</span>{{ data.serviceName }}</div>
              </el-col>
              <el-col :span="12">
                <div class="title" v-show="data.softwareType!=1">
                  <span>CPU架构：</span>
                  {{ data.versionData.cpu||"——" }}
                </div>
                <div class="title">
                  <span> 软件大小：</span>
                  {{ formatFileSize(data.versionData.sizes) }}
                </div>
                <div class="title">
                 <span> 研制单位：</span>
                  {{ data.devUnit }}
                </div>
              </el-col>
              <!-- <el-row>
                <div v-if="data.softwareType==1" class="title"><span>项目分类：</span>{{ data.category }}</div>
                <div v-else class="title"><span>业务分类：</span>{{ data.serviceName }}</div>
              </el-row> -->
            </el-row>
            <!-- <div class="title" style="margin-top:0px">
              软件描述：
              <span>{{ data.versionData.description }}</span>
            </div>-->
            <div v-if="data.versionData.isUpgrade==1" class="title" style="margin-top:10px;">
              <span>升级描述：</span>
              {{ data.versionData.upgradeDescription?data.versionData.upgradeDescription:'-' }}
            </div>
            <div style="border-top:1px solid #f0f0f0;margin:32px 0px"></div>
            <div style="margin-left:75px">
              <el-button
                size="small"
                title="软件下载"
                type="primary"
                @click="downloadSoftware(data.versionData)"
              >软件下载</el-button>
              <el-button
                size="small"
                type="primary"
                @click="downloadData(data.versionData)"
              >资料下载</el-button>
              <div style="margin-top:32px">
                <span>
                  <i class="el-icon-time"></i>
                  {{data.ctime}}创建
                </span>
                <span style="margin-left: 30px;">
                  <i class="el-icon-download"></i>
                  {{data.downloadCon}}次下载
                </span>
                <div style="margin-left: 30px;display:inline-block"  v-show="data.softwareType!=1">
                  <span>应用效能综合评分</span>
                  <el-rate
                    v-model="data.myScore/2"
                    allow-half
                    style="display:inline-block;"
                    @change="updateSoftwareScore"
                  />
                  <!-- <span >(最高10分)</span> -->
                </div>
              </div>
            </div>
            
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div style="margin: 10px 20px 0px 20px;background: #fff;min-height:300px" >
      <el-row  style="padding-top:33px; ">
        <el-col  style="width:170px;height:100%;margin-right:26px">
          <div class="version-container">
            <div
              v-for="(item, index) in data.versionList"
              :key="index"
              class="softwareVersion"
              :class="dataVersionId==item.id?'softwareVersionActive':''"
              @click="changeSoftwareVersion(item.id)"
            >
            版本{{item.version}}
              <div class="dot"></div>
            </div>
          </div>
          <div class="version-left-split"></div>
        </el-col>
        <el-col  style="width:calc(100% - 200px)">
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="'技术支持（共 '+ total +' 条）'" name="first" v-if="data.softwareType!=1">
              <SoftwareQuestion :softwareInfo="data.versionData" />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
import MarkdownEditor from "@/components/MarkdownEditor";
// import SoftwareDemand from '../../index/software/software-demand'
import SoftwareQuestion from "../../index/software/software-question2";
// import Dependency from './software-dependency'
import Timeline from "../../index/software/software-detail-timeline";
// import * as appConfig from "/public/config";
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as question from "@/api/question";
import * as deploy from "@/api/deploy";
import * as demand from "@/api/demand";
import * as ts from "@/api/ts";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import download from "download-1.4.7";

export default {
  directives: { elDragDialog },
  components: {
    MarkdownEditor,
    // SoftwareDemand,
    SoftwareQuestion,
    // Dependency,
    Timeline,
    Treeselect
  },
  data() {
    return {
      id: null,
      imgSource: require("@/assets/index/softwareDefault.png"),
      defaultS: 'this.src="' + require("@/assets/index/softwareDefault.png") + '"',
      picSource: require("@/assets/index/nodata.png"),
      defaultP: 'this.src="' + require("@/assets/index/pic.png") + '"',
      globalUrl: "",
      selectedVersion: null,
      dialogTsVisible: false,
      dialogDemandVisible: false,
      pushToDeploy: false,
      activeName: "first",
      userInfo: {},
      tsForm: {
        title: "",
        type: "",
        content: ""
      },
      demandForm: {
        title: "",
        type: null,
        description: ""
      },
      data: {
        versionData: {
          md5: 0,
          description: 0
        }
      },
      // docData: [],
      deployList: [],
      softwareDataTypes: [],
      questionList: [],
      tsQuestionData: [],
      demandList: [],
      dependencyCount: 0,
      timelineData: [],
      imgList: [
        // require('@/assets/imgs/banner.png'),
      ],
      typeData: [],
      dataVersionId: null,

      total: 0,
      totalPage: 0,
      pageNum: 1,
      pageSize: 10,

      totalDemand: 0,
      totalPageDemand: 0,
      pageNumDemand: 1,
      pageSizeDemand: 10,
      logoAndPicUrl: appConfig.config.urlFilePrefix
    };
  },
  created() {
    // 获取传递的ID
    this.globalUrl = appConfig.config.urlFilePrefix;
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.id = this.$route.params.id;
    this.dataVersionId = parseInt(this.$route.query.version);
    this.getSoftwareDetail(this.$route.query.version);
    this.getCategoryList();
    // this.getSoftwareDataList(this.id, this.$route.query.version)
    // this.getSoftwareDataTypeList()
  },
  mounted() {},
  methods: {
    changeSoftwareVersion(versionId) {
      this.dataVersionId = versionId;
      this.getSoftwareDetail(versionId);
      this.getCategoryList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getSoftwareDetail(this.dataVersionId);
      this.getCategoryList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getSoftwareDetail(this.dataVersionId);
      this.getCategoryList();
    },
    goBack() {
      window.history.go(-1);
    },
    /**
     * 获取分类列表
     */
    getCategoryList() {
      category.getCategoryList("demand_cate", null, null).then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list;
          console.log(this.typeData, "this.typeData");
        }
      });
    },
    formatFileSize(size) {
      if (size < 1024) {
        return size + "b";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "Kb";
      } else {
        return (size / 1024 / 1024).toFixed(2) + "Mb";
      }
    },
    getSoftwareDeployList(deployId) {
      software.getSoftwareDeployList(deployId).then(response => {
        if (response.code === 200) {
          this.deployList = response.data;
        }
      });
    },
    updateSoftwareScore(value) {
      software
        .updateSoftwareScore(this.data.id, this.userInfo.userId, value * 2)
        .then(response => {
          if (response.code === 200) {
            this.$message.success("软件资源评分更新成功");
            this.getSoftwareDetail(this.$route.query.version);
          }
        });
    },
    toSceneList(item) {
      window.open(config.deploy_service_url);
    },
    pushSoftware() {
      this.pushToDeploy = true;
      deploy.pushSoftware(this.data.versionId).then(response => {
        // eslint-disable-next-line no-empty
        if (response.code === 200) {
          this.$message.success("推送成功");
        } else {
          this.$message.error(response.msg);
        }
        this.pushToDeploy = false;
      });
    },
    downloadSoftware(row) {
      // if (this.data.permission === 0) {
      //   this.$message.error('无下载权限')
      // } else if (this.data.permission === 1) {
      //   this.$confirm('确认提交下载申请' + this.data.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply()
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } else if (this.data.permission === 2) {
      // software.downloadSoftware(this.userInfo.userId, this.data.versionId).then(response => {
      //   if (response.code === 200) {
      //     // window.location.href = response.data

      //     const elelink = document.createElement("a")
      //     elelink.style.display = "none"
      //     elelink.download = row.fileName
      //     elelink.href = response.data
      //     document.body.appendChild(elelink)
      //     elelink.click()
      //     document.body.removeChild(elelink)
      //   }
      // })

      software.downloadSoftwareFile(this.userInfo.userId, row.id);
      // }
    },
    downloadSoftwareData(row) {
      if (row.status === 1) {
        software
          .downloadSoftwareData(this.userInfo.userId, row.id)
          .then(response => {
            const blob = new Blob([response]);
            download(blob, row.name, row.name.lastIndexOf(".") + 1);
          });
      } else {
        this.$message.warning("该软件资料没有通过审核或已驳回");
      }
    },
    addSoftwareDownloadApply(item) {
      this.$confirm("确认提交下载申请" + item.name + "吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          software
            .downloadSoftwareApply(
              item.versionId,
              this.userInfo.userId,
              this.userInfo.realName
            )
            .then(response => {
              if (response.code === 200) {
                this.$message.success("软件资源下载申请已提交");
              }
            });
        })
        .catch(() => {
          console.log(error);
        });
    },
    // addSoftwareDownloadApply() {
    //   software.downloadSoftwareApply(this.data.versionId, this.userInfo.userId, this.userInfo.realName).then(response => {
    //     if (response.code === 200) {
    //       this.$message.success('软件资源下载申请提交成功')
    //     }
    //   })
    // },
    // getSoftwareDataList(softwareId, softwareVersion) {
    //   software.getSoftwareDataList(softwareId, softwareVersion).then(response => {
    //     if (response.code === 200) {
    //       this.docData = response.data
    //       this.docData = this.docData.map(v => {
    //         this.$set(v, 'edit', false)
    //         v.originalName = v.name
    //         return v
    //       })
    //     }
    //   })
    // },
    getSoftwareDataTypeList() {
      category.getCategoryList(42, null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list;
        }
      });
    },
    getSoftwareDemand(id, versionId) {
      demand
        .getSoftwareDemand(
          id,
          versionId,
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
    selectModuleAdd() {},
    handleVersionChange() {
      // const versionData = this.data.versions.find(item => item.version === version)
      // this.data.description = versionData.description
      // this.data.versionId = versionData.id
      // this.getSoftwareDetail(versionData.id)

      // this.data.versionData = version
      this.getSoftwareDetail(this.dataVersionId);
      this.getCategoryList();
      // this.getSoftwareDetail(this.data.versionData)
      // this.getCategoryList()
    },
    handleTabClick(tab, event) {
      if (this.activeName == "first") {
        this.pageNumDemand = 1;
      } else {
        this.pageNum = 1;
      }
      console.log(tab, event, this.activeName);
    },
    handleDrag() {},
    getSoftwareDetail(version) {
      software
        .getSoftwareInfo(this.$route.params.id, version, this.userInfo.userId)
        .then(response => {
          this.data = response.data;
          console.log(this.data, "this.data");
          // if (this.data.deployId) {
          //   this.getSoftwareDeployList(this.data.deployId)
          // }
          // if (this.data.relations) {
          //   this.dependencyCount = this.data.relations.split(',').length
          // }
          // this.selectedVersion = this.data.version
          // this.getSoftwareDataList(this.data.id, this.data.version)
          // this.getSoftwareDemand()
          this.getSoftwareDemand(this.data.id, this.data.versionId);
          this.getTsQuestionList();
        });
    },
    getSoftwareQuestion() {
      question
        .getSoftwareQuestionList(this.data.versionId, this.userInfo.userId)
        .then(response => {
          if (response.code === 200) {
            this.questionList = response.data;
          }
        });
    },
    addSoftwareQuestion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            title: this.tsForm.title,
            content: this.tsForm.description,
            cid: this.userInfo.userId,
            softwareId: this.data.id,
            softwareVersion: this.data.version,
            softwareVersionId: this.data.versionId,
            softwareName: this.data.name
            // username: this.userInfo.username,
            // realname: this.userInfo.realName,
            // uUser: this.userInfo.userId
          };
          ts.addTsQuestion(data).then(response => {
            if (response.code === 200) {
              this.dialogTsVisible = false;
              this.getSoftwareDetail(this.data.versionId);
              this.$message.success("技术支持提报成功");
            }
          });
        }
      });
    },
    // getSoftwareDemand() {
    //   question.getSoftwareDemandList(this.data.versionId, this.userInfo.userId).then(response => {
    //     if (response.code === 200) {
    //       this.questionList = response.data
    //     }
    //   })
    // },
    addSoftwareDemand(formName) {
      console.log(this.demandForm, "demandForm");
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            title: this.demandForm.title,
            description: this.demandForm.description,
            uid: this.userInfo.userId,
            softwareId: this.data.id,
            versionId: this.data.versionId,
            username: this.userInfo.username,
            realname: this.userInfo.realName,
            category: parseInt(this.demandForm.type),
            uUser: this.userInfo.userId
          };
          demand.addDemand(data).then(response => {
            if (response.code === 200) {
              this.dialogDemandVisible = false;
              this.getSoftwareDetail(this.data.versionId);
              this.$message.success("需求提报成功");
            }
          });
        }
      });
    },
    // 获取技术支持问题
    getTsQuestionList() {
      console.log("getTs")
      ts.getSoftwareTs(this.data.id, this.data.versionId, this.pageNum, this.pageSize).then(
        response => {
          if (response.code === 200) {
            this.tsQuestionData = response.data.list;
            this.total = response.data.total;
            this.totalPage = response.data.totalPage;
          }
        }
      );
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
    /**
     * 分页大小改变事件
     * @param val pageSize大小
     */
    handleSizeChangeDemand(val) {
      this.pageSizeDemand = val;

      this.pageNumDemand = 1;
      this.getSoftwareDemand(this.data.id, this.data.versionId);
    },
    /**
     * 切换分页事件
     * @param val 页数
     */
    handleCurrentChangeDemand(val) {
      this.pageNumDemand = val;
      this.getSoftwareDemand(this.data.id, this.data.versionId);
    },
    downloadData(item) {
      this.$router.push({
        path: "/admin/softwareDetailData/" + this.data.softwareId,
        query: {
          version: item.id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
#software-item {
  font-size: 14px;
  //margin: 50px 10px 10px 10px;
  //margin-top:40px;
  .software-logo {
    // border: 1px solid lightgray;
    width: 96px;
    height: 96px;
    border-radius: 4px;
    padding: 5px;
    background: #fff;
    text-align: center;

    img {
      width: 80px;
      height: 80px;
      margin-top: 2px;
    }
  }

  .el-card__body {
    padding: 10px !important;
  }

  span {
    color: rgb(161, 161, 161);
    font-size: 12px;
  }
  .software-title {
    line-height: 25px;
    color: #02061F;
    font-size: 18px;
  }

  .title {
    font-size: 12px;
    // line-height: 24px;
    margin-top: 12px;
    color:#565656;
    &.al-left{
      text-align: left;
    }
    span {
      width: 75px;
      // font-size: 12px;
      color: rgb(161, 161, 161);
      display: inline-block;
      text-align: right;
    }
  }
  }
</style>
<style scoped lang="scss">
::v-deep .el-table {
  overflow: visible !important;
}
::v-deep .el-table .cell {
  overflow: visible !important;
}

::v-deep .el-table__body-wrapper {
  overflow: visible !important;
}

.version-container{
  width: 155px;
  margin:0px auto;
  float: left;
}
.softwareVersion {
  background-color: #fff;
  max-width: 77px;
  // height: 25px;
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  margin: 0 auto;
  margin-top: 28px;
  cursor: pointer;

  position: relative;

  &.softwareVersionActive {
   
    background-color:  rgba(60, 135, 222);
    color: white;

    .dot{
      width: 16px;
      height: 16px;
      border: 3px solid rgb(23,138, 227);
      background: #fff;
      border-radius: 100%;
      position: absolute;
      right: -56px;
      top: 2px;
      z-index: 22;
    }
  }

  
  
}
.version-left-split{
  width: 4px;
  height: 100%;
  background: rgb(243, 243, 243);
  // float: right;
  position: absolute;
  left: 162px;
  min-height: 200px;
  z-index: 0;
}
[class^=el-icon-]{
  font-size: 12px;
}
::v-deep .el-rate__icon{
  font-size: 12px;
}
</style>
