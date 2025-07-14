<template>
  <div>
    <el-card id="software-item" class="custome">
      <CloseBack>软件详情</CloseBack>

      <div>
        <div v-show="data.rejectMsg" style="margin-top:5px;">
          <span style="color:red;">申请驳回:</span>
          <span>{{data.rejectMsg}}</span>
        </div>
        <el-row :gutter="20">
          <!-- 左侧图片区域 -->
          <el-col :span="6" style="text-align:center;max-width:130px;margin-right:20px">
            <div class="software-logo">
              <img
                :src="data.logo?globalUrl+data.logo:defaultS"
                :onerror="defaultS"
                width="80px"
                height="80px"
                style="object-fit:cover; border-radius:12px;"
              />
            </div>
          </el-col>

          <!-- 中间信息区域 -->
          <el-col :span="16" style="padding:0px 0 0 10px;">
            <div class="software-title" style="overflow:hidden">
              <div style="color:#333;font-size: 22px;float:left;font-weight:bold;margin-bottom:10px">
                {{ data.name }}
                <el-button 
                  size="mini" 
                  :type="isFavorite ? 'info' : 'success'" 
                  class="favorite-btn"
                  :icon="isFavorite ? 'el-icon-check' : 'el-icon-star-off'"
                  @click="toggleFavorite">
                  {{ isFavorite ? '已关注' : '关注' }}
                </el-button>
              </div>
            </div>
            <div class="security-tag">
              <el-tag type="success" size="small">安防检测</el-tag>
              
            </div>
            
            <!-- 版本号和分类信息 -->
            <div class="version-info">
              <div class="info-row">
                <div class="info-label">版本号：</div>
                <div class="info-value">
                  <el-select style="width:150px" v-model="dataVersionId" size="small" @change="handleVersionChange" popper-class="version-dropdown">
                    <el-option
                      v-for="(version,index) in data.versionList"
                      :key="index"
                      :value="version.id"
                      :label="version.version"
                    />
                  </el-select>
                </div>
              </div>
              <div class="info-row" v-if="data.softwareType==1">
                <div class="info-label">项目分类：</div>
                <div class="info-value">{{ data.category }}</div>
              </div>
              <div class="info-row" v-else>
                <div class="info-label">业务分类：</div>
                <div class="info-value">{{ data.serviceName }}</div>
              </div>
              <div class="info-row" v-show="data.softwareType!=1">
                <div class="info-label">CPU架构：</div>
                <div class="info-value">{{ data.versionData.cpu||"——" }}</div>
              </div>
            </div>

            <div class="rating-area">
              <el-rate
                :value="data.myScore/2"
                allow-half
                style="display:inline-block;font-size: 16px;margin-right:10px"
                @change="updateSoftwareScore"
              />
              <span style="color:#333;font-size:14px">(最高10分)</span>
            </div>

            <el-button
              size="small"
              title="软件下载"
              type="primary"
              class="download-btn"
              @click="downloadSoftware(data.versionData)"
              v-if="data.permission==1"
            >软件下载</el-button>
            <el-button
              v-else
              title="申请下载"
              size="small"
              type="primary"
              class="download-btn"
              @click="addSoftwareDownloadApply(data)"
            >软件申请</el-button>
            <el-button
              size="small"
              type="primary"
              class="download-btn"
              @click="downloadData(data.versionData)"
              :disabled="data.permission!=1"
            >资料下载</el-button>
            
        
          </el-col>
        </el-row>

        <!-- 详情信息区域 -->
        <div style="margin-top:30px" class="details-section">
          <div class="detail-title">详细信息</div>
          <div class="details-grid">
            <div class="detail-item">
              <div class="label">软件大小：</div>
              <div class="value">{{ formatFileSize(data.versionData.sizes) }}</div>
            </div>
            <div class="detail-item">
              <div class="label">下载次数：</div>
              <div class="value">{{data.downloadCon}} 次</div>
            </div>
            <div class="detail-item">
              <div class="label">提供单位：</div>
              <div class="value">{{ data.offerUnit }}</div>
            </div>
            <div class="detail-item">
              <div class="label">研制单位：</div>
              <div class="value">{{ data.devUnit }}</div>
            </div>
            <div class="detail-item">
              <div class="label">更新时间：</div>
              <div class="value">2025-07-03</div>
            </div>
            <div class="detail-item">
              <div class="label">软件评分：</div>
              <div class="value">{{ data.myScore/2 }}分</div>
            </div>
          </div>
        </div>

         <!-- 软件介绍区域 -->
         <div style="margin-top:30px">
          <div class="detail-title">软件介绍</div>
          <div class="app-description" style="margin-top:15px;line-height:1.6;color:#333">
           {{data.versionData.description}}
          </div>
        </div>

        <!-- 软件截图区域 -->
        <div style="margin-top:30px">
          <div class="detail-title">软件截图</div>
          <div class="screenshot-container" style="margin-top:15px">
            <el-col :span="24" style="text-align:center;max-width:100%;box-shadow:2px 2px 8px rgba(255,255,255,0.5)">
              <el-image
                v-if="imgList.length<=1"
                style="width: 100%; height: 350px"
                :src="data.pic?globalUrl+data.pic:defaultP"
                :onerror="defaultP"
                fit="cover"
              />
              <el-carousel v-else :interval="4000" height="350px" :autoplay="true">
                <el-carousel-item v-for="(item,index) in imgList" :key="index">
                  <img
                    :src="item.logo"
                    :onerror="defaultS"
                    style="width:100%;height:100%;object-fit:contain;"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </div>
        </div>

       
      </div>
    </el-card>

    <!-- 需求提报和问题提报部分 -->
    <div style="margin: 10px 20px 0px 20px;background: #fff;min-height:300px;border-radius:8px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05)">
      <div class="reviews-container">
        <div class="reviews-header">
          <h3 class="reviews-title">全部回复 ({{ totalDemand }})</h3>
          <div class="review-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="dialogDemandVisible = true">
              提交需求
            </el-button>
          </div>
        </div>

        <div class="comment-input-area">
          <div class="avatar-wrapper">
            <img :src="userInfo && userInfo.avatar ? globalUrl + userInfo.avatar : require('@/assets/index/softwareDefault.png')" class="user-avatar" :onerror="defaultS" />
          </div>
          <div class="comment-input" @click="dialogDemandVisible = true">
            说点什么...
          </div>
          
        </div>

        <div class="reviews-content">
          <SoftwareDemand :softwareInfo="data.versionData" />
        </div>
      </div>

      <!--提报需求-->
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogDemandVisible"
        title="需求提报"
        @dragDialog="handleDrag"
      >
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
              style="width:200px;float:left"
              :multiple="false"
              :appendToBody="true"
              :options="typeData"
              :disable-branch-nodes="true"
              :normalizer="normalizer"
              z-index="9999"
              :show-count="true"
              placeholder="请选择资料类型"
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

          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="info" @click="dialogDemandVisible=false">取消</el-button>
          <el-button size="small" type="primary" @click="addSoftwareDemand('demandForm')">确定</el-button>
        </span>
      </el-dialog>

      <!-- 软件段推送 -->
      <el-dialog
        :title="titleSoft"
        width="30%"
        :visible.sync="dialogSoftVisible"
        :close-on-click-modal="false"
        >
        <el-form
        ref="dataPushSoftForm"
        :model="dataPushSoftForm"
        :rules="dataRule"
        label-width="100px"
        :size="sizeSoft"
        style="text-align:left;"
        >
          <el-form-item label="段库名称" prop="name">
            <el-select  ref = "selectSoft" v-model="dataPushSoftForm.options" style="width:400px" placeholder="请选择段库名称" clearable size="small" @click="getSelectNode">
                    <el-option
                      v-for = "option in selectNodeOptions"
                      @click.native = "pushAddress"
                      :key = "option.id"
                      :value = "option"
                      :label = "option.name"
                    />
            </el-select>
          </el-form-item>
          <el-form-item label="段库地址" prop="address">
            <el-input style="width:400px" v-model="dataPushSoftForm.address" placeholder="请输入段库地址 " />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogSoftVisible = false">取消</el-button>
          <el-button  size="small" type="primary" @click="pushSoftConfirm">确认</el-button>
        </span>
      </el-dialog>

      <!--提报技术支持-->
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTsVisible"
        title="问题提报"
        @dragDialog="handleDrag"
      >
        <el-form
          ref="tsForm"
          name="tsForm"
          :model="tsForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item
            label="问题标题："
            prop="title"
            :rules="[{required:true,message:'标题不能为空',trigger:'change'},{min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '标题不合法', trigger: 'blur'}]"
          >
            <el-input v-model="tsForm.title" size="small" show-word-limit maxlength="50" />
          </el-form-item>


          <el-form-item
            label="问题内容："
            prop="content"
            :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]"
          >
            <el-input
              type="textarea"
              v-model="tsForm.content"
              show-word-limit
              maxlength="200"
              :rows="5"
            ></el-input>

          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="info" @click="dialogTsVisible=false">取消</el-button>
          <el-button size="small" type="primary" @click="addSoftwareQuestion('tsForm')">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="更新日志"
        width="800px"
        :visible.sync="dialogUpdateLogVisible"
        :close-on-click-modal="false"
        v-if="softwareLogSwitch==true"
        >
        <div v-for="(item, index) in updateLogData" style="border-top:1px solid rgb(240, 240, 240);margin-bottom:10px">
          <p>版本：{{ item.version }}</p>
          <div style="overflow:hidden">
            <div style="float:left;width:80px">更新内容：</div>
            <div style="float:right;width: calc(100% - 80px);">
              <p style="margin:0;padding:0" v-if="item.isUpgrade==1">{{ item.upgradeDescription!='' ? item.upgradeDescription : '暂无' }}</p>
              <p style="margin:0;padding:0" v-else>初始版本</p>
            </div>
          </div>
        </div>

      </el-dialog>

      <SoftwareRelation v-if="softwareLogSwitch==true" :dialogVisible="softwareRelationVisible" :data="data.versionData" @closeSoftwareRelation="closeSoftwareRelation"></SoftwareRelation>

    </div>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
import MarkdownEditor from "@/components/MarkdownEditor";
import SoftwareDemand from "./software-demand2";
import SoftwareQuestion from "./software-question2";
// import Dependency from './software-dependency'
import Timeline from "./software-detail-timeline";
import SoftwareRelation from "./software-detail-relation"
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
import * as deployPosture from '@/api/deploy-posture';
import * as favorite from "@/api/favorite";

export default {
  directives: { elDragDialog },
  components: {
    MarkdownEditor,
    SoftwareDemand,
    SoftwareQuestion,
    // Dependency,
    Timeline,
    Treeselect,
    SoftwareRelation
  },
  data() {
    return {
      id: null,
      imgSource: require("@/assets/index/softwareDefault.png"),
      defaultS: 'this.src="' + require("@/assets/index/softwareDefault.png") + '"',
      picSource: require("@/assets/index/nodata.png"),
      defaultP: 'this.src="' + require("@/assets/index/softDefault3.svg") + '"',
      globalUrl: "",
      selectedVersion: null,
      dialogTsVisible: false,
      dialogDemandVisible: false,
      pushToDeploy: false,
      activeName: "first",
      titleSoft: "软件资源推送入段库",
      sizeSoft:"small",
      userInfo: {},
      isFavorite: false,
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
          description: null
        }
      },
      // docData: [],
      dialogSoftVisible:false,
      deployList: [],
      softwareDataTypes: [],
      questionList: [],
      tsQuestionData: [],
      demandList: [],
      dependencyCount: 0,
      timelineData: [],
      dataPushSoftForm:{
          id:1,
          name: "", 
          address: "",
          softwareDownloadAddr: "",
          area: "",
          company: "",
          companyId: 1,
          maintainerId: 5,
          maintainer: "",
          maintainerTel: "",
          status: 1,
          options:[],
      },
      dataRule: {
        name: [
          { required: true, message: '段库名称不能为空', trigger: 'blur' },
          { pattern: /^[^\s]+(\s+[^\s]+)*$/,message: '段库名称不合法', trigger: 'blur' }
        ]
      },
      selectNodeValue:'',
      selectNodeOptions:[],
      softPushName:'',
      softPushAddress:'',
      softPushAddressValue:'',
      imgList: [
        { logo: require('@/assets/index/header1.png') },
        { logo: require('@/assets/index/banner.png') },
        { logo: require('@/assets/code.png') }
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
      logoAndPicUrl: appConfig.config.urlFilePrefix,
      dialogUpdateLogVisible: false,
      updateLogData:[],
      softwareRelationVisible: false,
      softwareLogSwitch: appConfig.config.softwareLogSwitch,
    };
  },
  created() {
    // 获取传递的ID
    this.globalUrl = appConfig.config.urlFilePrefix;
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.id = this.$route.params.id;
    this.dataVersionId = parseInt(this.$route.query.version);
    this.getSoftwareDetail(this.dataVersionId);
    this.getCategoryList();
    this.getFavoriteStatus();
    // this.getSoftwareDataList(this.id, this.$route.query.version)
    // this.getSoftwareDataTypeList()
  },
  mounted() {
    // this.getSelectNode();
  },
  methods: {
    changeSoftwareVersion(versionId) {
      this.dataVersionId = versionId;
      this.getSoftwareDetail(versionId);
      this.getCategoryList();
    },
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.pageNum = 1;
    //   this.getSoftwareDetail(this.dataVersionId);
    //   this.getCategoryList();
    // },
    // handleCurrentChange(val) {
    //   this.pageNum = val;
    //   this.getSoftwareDetail(this.dataVersionId);
    //   this.getCategoryList();
    // },
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

      // 下载软件分卷
      if(row.softwareVersionVolumes) {
        row.softwareVersionVolumes.forEach(element => {
            software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
        });

      }
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
          1,
          10
        )
        .then(response => {
          if (response.code === 200) {
            this.demandList = response.data.list;
            this.totalDemand = response.data.total;
            console.log(this.demandList, "demandList");
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
      this.getFavoriteStatus();
      // this.getSoftwareDetail(this.data.versionData)
      // this.getCategoryList()
    },
    handleTabClick(tab) {
      this.activeName = tab.name;
      if (this.activeName == "first") {
        this.pageNumDemand = 1;
      } else {
        this.pageNum = 1;
      }
      console.log(tab, this.activeName);
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
            // uUser: this.userInfo.userId
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
      ts.getSoftwareTs(
        this.data.id,
        this.data.versionId,
        this.pageNum,
        this.pageSize
      ).then(response => {
        if (response.code === 200) {
          this.tsQuestionData = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
        }
      });
    },
    // /**
    //  * 分页大小改变事件
    //  * @param val pageSize大小
    //  */
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.pageNum = 1;
    //   this.getTsQuestionList();
    // },
    // /**
    //  * 切换分页事件
    //  * @param val 页数
    //  */
    // handleCurrentChange(val) {
    //   this.pageNum = val;
    //   this.getTsQuestionList();
    // },
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
        path: "/index/software-data/" + this.data.id,
        query: {
          version: item.id
        }
      });
    },

    //推送段入库
    pushDataDialog(){
      this.dialogSoftVisible = true;
      this.getSelectNode();
    },
     //获取节点
    getSelectNode(){
      deployPosture.getFragmentAddress().then(response => {
          if (response.code === 200) {

            this.selectNodeOptions = response.data;

          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    //option点击
    pushAddress(){



      // this.dataPushSoftForm.id = this.$refs.selectSoft.selectedLabel
      this.dataPushSoftForm.id = this.dataPushSoftForm.options.id;
      this.dataPushSoftForm.address = this.dataPushSoftForm.options.address;
      this.dataPushSoftForm.name = this.dataPushSoftForm.options.name;
    },
    //推送
    pushSoftConfirm(){

      deployPosture.sendFragmentOne(this.dataPushSoftForm.id,this.data.softwareId,this.data.versionId).then(response => {
          if (response.code === 200) {
            console.log(response)
            this.dialogSoftVisible = false;
            this.$message.success('软件段推送成功！');

          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    showChangeLog() {
      this.dialogUpdateLogVisible = true;
      this.updateLogData = this.data.versionList;
    },
    closeSoftwareRelation() {
      this.softwareRelationVisible = false;
    },
    docusignDownload(id, type) {
      // console.log(id)
      software.docusignDownload(id, type)
    },

    // 获取关注状态
    getFavoriteStatus() {
      favorite.getFavoriteStatus(this.dataVersionId, this.userInfo.userId).then(response => {
        if (response.code === 200) {
          // 根据返回的文本状态设置布尔值
          this.isFavorite = response.data === "已关注";
        }
      }).catch(() => {
        this.isFavorite = false;
      });
    },

    // 切换关注状态
    toggleFavorite() {
      if (this.isFavorite) {
        // 取消关注
        console.log(this.data.softwareId,"xxxxxx")
        favorite.removeFavorite(this.data.softwareId,this.dataVersionId, this.userInfo.userId).then(response => {
          if (response.code === 200) {
            this.isFavorite = false;
            this.$message.success('已取消关注');
          } else {
            this.$message.error(response.msg || '取消关注失败');
          }
        }).catch(error => {
          this.$message.error('取消关注失败');
          console.error(error);
        });
      } else {
        // 添加关注
        favorite.addFavorite(this.data.softwareId,this.dataVersionId, this.userInfo.userId).then(response => {
          if (response.code === 200) {
            this.isFavorite = true;
            this.$message.success('关注成功');
          } else {
            this.$message.error(response.msg || '关注失败');
          }
        }).catch(error => {
          this.$message.error('关注失败');
          console.error(error);
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
#software-item {
  font-size: 14px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .software-logo {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    padding: 5px;
    background: #fff;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    margin-top: 10px;

    img {
      width: 90px;
      height: 90px;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  .el-card__body {
    padding: 15px 20px !important;
  }

  span {
    color: rgb(120, 120, 120);
    font-size: 14px;
  }
  
  .software-title {
    line-height: 30px;
    color: #333;
    font-size: 22px;
    font-weight: 500;
  }

  .title {
    font-size: 15px;
    margin-top: 12px;
    color: #555;
    
    &.al-left{
      text-align: left;
    }
    
    span {
      font-size: 14px;
      display: inline-block;
      margin-right: 5px;
    }
  }
  
  .detail-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    position: relative;
    padding-left: 10px;
    border-left: 4px solid #05994E;
    margin-bottom: 15px;
  }
  
  .details-section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .detail-item {
    display: flex;
    margin-bottom: 10px;
    
    .label {
      width: 80px;
      color: #666;
      font-size: 14px;
      white-space: nowrap;
    }
    
    .value {
      color: #333;
      font-size: 14px;
      flex: 1;
      font-weight: 500;
    }
  }
  
  .screenshot-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
  
  .app-description {
    color: #444;
    font-size: 14px;
    line-height: 1.8;
    text-align: justify;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
  }
  
  .rating-area {
    margin-top: 15px;
    display: flex;
    align-items: center;
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

::v-deep .el-dialog__body {
  background-color: #f5fbf8;
}

::v-deep .el-dialog__header {
  background-color: #05994e;
  color: white;
}

::v-deep .el-dialog__title {
  color: white;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: white;
}

::v-deep .el-rate__icon {
  font-size: 16px;
  color: #FFCC33 !important;
}

::v-deep .el-rate__icon.is-active {
  color: #FFCC33 !important;
}

::v-deep .el-button--success {
  background-color: #05994E;
  border-color: #05994E;
}

::v-deep .el-button--info {
  background-color: #8AB9D4;
  border-color: #8AB9D4;
  color: #ffffff;
}

.favorite-btn {
  margin-left: 15px;
  vertical-align: middle;
  transition: all 0.3s;
  font-size: 13px;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: normal;
  
  &:hover {
    opacity: 0.9;
  }
}

.download-btn {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 15px;
  background-color: #FF6633;
  border-color: #FF6633;
  border-radius: 6px;
  font-weight: 500;
  
  &:hover, &:focus {
    background-color: #ff7d4a;
    border-color: #ff7d4a;
  }
}

.version-container{
  width: 155px;
  margin:0px auto;
  float: left;
}
.softwareVersion {
  background-color: #fff;
  max-width: 90px;
  border-radius: 4px;
  padding: 6px 10px 6px 10px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  margin: 0 auto;
  margin-top: 28px;
  cursor: pointer;
  position: relative;

  &.softwareVersionActive {
    background-color: #05994e;
    color: white;
    font-weight: 500;

    .dot{
      width: 18px;
      height: 18px;
      border: 3px solid #05994e;
      background: #fff;
      border-radius: 100%;
      position: absolute;
      right: -56px;
      top: 3px;
      z-index: 22;
    }
  }
}
.version-left-split{
  width: 4px;
  height: 100%;
  background: rgb(243, 243, 243);
  position: absolute;
  left: 162px;
  min-height: 200px;
  z-index: 0;
}

[class^=el-icon-]{
  font-size: 12px;
}

::v-deep .softwareVolumesRowClass{
  background:#FFFFFF !important;
  td{
    padding:0px;
    .cell{
      color:#565656;
      font-size: 12px !important;
    }
  }

  &:hover td{
    background:#FFFFFF  !important;
  }
}

::v-deep .el-carousel {
  border-radius: 8px;
  overflow: hidden;
}

::v-deep .el-carousel__item {
  text-align: center;
}

::v-deep .el-image {
  .el-image__inner {
    object-fit: cover !important;
    border-radius: 8px;
  }
}
.security-tag {
  margin-bottom: 10px;
}

::v-deep .el-tag--success {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #05994E;
}

.version-info {
  margin-top: 5px;
  margin-bottom: 15px;
  /* background-color: #f9f9f9; */
  /* border-radius: 4px; */
  /* padding: 10px 15px; */
  
  .info-row {
    display: flex;
    margin-bottom: 5px;
    line-height: 32px;
    align-items: center;
  }
  
  .info-label {
    width: 75px;
    color: #666;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
  }
  
  .info-value {
    color: #333;
    font-size: 14px;
    font-weight: normal;
  }
}

.version-select-item {
  .el-select {
    width: 180px;
  }
}

::v-deep .version-dropdown {
  border-radius: 4px;
  
  .el-select-dropdown__item {
    padding: 0 15px;
    font-size: 14px;
  }
}

::v-deep .el-select .el-input__inner {
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding-right: 30px;
  border-color: #DCDFE6;
  background-color: white;
  color: #333;
}

::v-deep .el-select .el-input__suffix {
  right: 5px;
}

::v-deep .el-select .el-input__icon {
  line-height: 32px;
  color: #05994E;
  font-size: 14px;
}

/* App Store-like Reviews Section Styles */
.reviews-container {
  padding: 20px 30px;
}

.reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.reviews-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  i {
    margin-left: 5px;
    font-size: 14px;
    transition: transform 0.3s;
  }
  
  &:hover i {
    transform: rotate(-180deg);
  }
}

.reviews-tabs {
  display: flex;
  gap: 20px;
}

.review-tab {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #666;
}

.review-tab.active {
  background-color: #05994E;
  color: white;
}

.review-count {
  font-size: 12px;
  opacity: 0.8;
}

.reviews-content {
  padding: 10px 0;
  max-height: 600px;
  overflow-y: auto;
}

.comment-input-area {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 10px 15px;
  border: 1px solid #eee;
}

.avatar-wrapper {
  margin-right: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input {
  flex-grow: 1;
  color: #999;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.comment-tools {
  display: flex;
  gap: 15px;
  color: #999;
}

.tool-icon {
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    color: #05994E;
  }
}

/* Styling for comment items */
::v-deep .el-collapse-item__header {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

::v-deep .el-collapse-item__content {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 0 0 8px 8px;
  margin-bottom: 15px;
}

::v-deep .el-timeline-item__node {
  background-color: #05994E;
}

::v-deep .replay {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 10px;
}

::v-deep .user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
