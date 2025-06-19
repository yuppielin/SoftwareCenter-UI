<template>
<div class="app-container">
    <div class="cur-top-admin">
      <img class="icon" src="@/assets/index/softwareManage.png" />
      <span class="title" >软件管理</span>
    </div>
  <el-card style="height:calc(100vh - 140px);overflow-y:auto">
    <div style="margin-bottom:10px;height: 40px;">
      <el-col :span="12">
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="goToSoftwareUpload"
        >软件上传</el-button>
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="goToFragmentUpload"
        >软件段上传</el-button>
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="warning"
          @click="goToBatch"
        >软件段批量上传</el-button>
      </el-col>

      <el-col :span="$checkPermission(['admin','XTUser'])?12:24" style="text-align: right;">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="search.system" filterable clearable placeholder="请选择软件所属系统">
              <el-option
                v-for="(item,index) in sysData"
                :key="index"
                :value="item.id"
                :label="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <treeselect
              :normalizer="normalizer"
              v-model="search.service"
              noResultsText="暂无数据"
              value-consists-of="ALL"
              :options="softwareOptions"
              :appendToBody="true"
              z-index="9999"
              placeholder="请选软件分类 "
              clearable
              :style="{ width: '180px'}"
              @select="selectChange"
            ></treeselect>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              class="inline-input"
              v-model="search.keyword"
              :fetch-suggestions="querySearch"
              style="width: 100%"
              placeholder="请输入软件名称段前缀"
              @select="getSoftwareList"
              @change="getSoftwareList"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="getSoftwareList">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-right" @click="handleReset"></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <!-- <el-table
      :data="reviewData"
    >
      <el-table-column align="center" header-align="center" width="55" type="index" label="序号" />
      <el-table-column  label="软件名称" width="300" prop="name" show-overflow-tooltip>
        <template slot-scope="{row}">
            <span >{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="段前缀" width="150" show-overflow-tooltip >
         <template slot-scope="scope">
          <span>{{ scope.row.versionData.prefix ? scope.row.versionData.prefix  :'—'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="软件版本" prop="version" width="150">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.versionData.id"
            size="mini"
          >
            <el-option v-for="(version,index) in scope.row.versions" :key="index" :value="version.id" :label="version.version" @click.native="getVersionIndex(version, scope.row)" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="研制单位" prop="devUnit"  show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="提供单位" prop="offerUnit" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="上传人" prop="uname" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.versionData.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="上传时间" prop="ctime">
         <template slot-scope="scope">
          <span>{{ parseTime(scope.row.versionData.ctime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="180">
        <template slot-scope="{row}">
          <el-button size="small" type="text" icon="el-icon-edit" @click="editSoftware(row)">编辑</el-button>
          <el-button size="small" type="text" icon="el-icon-top" @click="upgradeSoftware(row)">升级</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <!-- <div class="title"></div> -->
    <el-table :show-header="false">
      <el-table-column type="selection" width="100"></el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
        <el-row :gutter="20">
        <el-col :span="3" style="display: flex;">
          <el-row>
            <el-col :span="12">
              <img
                :src="logoAndPicUrl+row.versionData.logo"
                :onerror="defaultImg"
                width="60px"
                height="60px"
              />
            </el-col>
            <el-col :span="12" style="line-height:1.5">
              <div
                style="font-size:16px;font-weight:600;display:inline-block;width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;color:#2098cc;"
              >{{row.name}}</div>
              <el-select
                v-model="row.versionData.id"
                size="mini"
                style="display:inline-block;width:100px;"
                class="version"
              >
                <el-option
                  v-for="(version,index) in row.versions"
                  :key="index"
                  :value="version.id"
                  :label="version.version"
                  @click.native="getVersionIndex(version, row)"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">段前缀</span>
          <br />
          <span class="subContent">{{row.versionData.prefix?row.versionData.prefix:'-'}}</span>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">大小</span>
          <br />
          <span class="subContent">{{formatFileSize(row.versionData.sizes)}}</span>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">研制单位</span>
          <br />
          <span class="subContent">{{row.versionData.source?row.versionData.source:'-'}}</span>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">提供单位</span>
          <br />
          <span class="subContent">{{row.versionData.offerUnit}}</span>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">上传人</span>
          <br />
          <span class="subContent">{{row.versionData.uname}}</span>
        </el-col>
        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">上传时间</span>
          <br />
          <span class="subContent">{{row.versionData.ctime|parseTime('{y}-{m}-{d} {h}:{m}:{s}')}}</span>
        </el-col>
        <el-col :span="3" style="text-align:right;padding:20px;">
          <el-button v-if = "item.softwareType == 2" circle size="mini" type="warning" icon="el-icon-folder-add" title="添加" @click="addSoftware(row)"></el-button>
          <el-button circle size="mini" type="warning" icon="el-icon-sell" title="升级" @click="upgradeSoftware(row)"></el-button>
          <el-button circle size="mini" type="primary" icon="el-icon-edit" title="编辑" @click="editSoftware(row)"></el-button>
          <el-button circle size="mini" type="danger" icon="el-icon-close" title="删除" @click="deleteItem(row)"></el-button>
        </el-col>
      </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-card v-for="(item,index) in reviewData" :key="index" style="margin:10px 0;">
      <el-row :gutter="20">
        <el-col :span="3" style="display: flex;">
          <el-row>
            <el-col :span="12">
              <img
                :src="logoAndPicUrl+item.versionData.logo"
                :onerror="defaultImg"
                width="60px"
                height="60px"
              />
            </el-col>
            <el-col :span="12" style="line-height:1.5">
              <div
                style="font-size:16px;font-weight:600;display:inline-block;width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;color:#2098cc;"
              >{{item.name}}</div>
              <el-select
                v-model="item.versionData.id"
                size="mini"
                style="display:inline-block;width:100px;"
                class="version"
              >
                <el-option
                  v-for="(version,index) in item.versions"
                  :key="index"
                  :value="version.id"
                  :label="version.version"
                  @click.native="getVersionIndex(version, item)"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">段前缀</span>
          <br />
          <span class="subContent">{{item.versionData.prefix?item.versionData.prefix:'-'}}</span>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">大小</span>
          <br />
          <span class="subContent">{{formatFileSize(item.versionData.sizes)}}</span>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">研制单位</span>
          <br />
          <span class="subContent">{{item.versionData.source?item.versionData.source:'-'}}</span>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">提供单位</span>
          <br />
          <span class="subContent">{{item.versionData.offerUnit}}</span>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">上传人</span>
          <br />
          <span class="subContent">{{item.versionData.uname}}</span>
        </el-col>

        <el-col :span="3" style="line-height:2.0">
          <span class="subTitle">上传时间</span>
          <br />
          <span class="subContent">{{item.versionData.ctime|parseTime('{y}-{m}-{d} {h}:{m}:{s}')}}</span>
        </el-col>

        <el-col :span="3" style="text-align:right;padding:20px;">
          <!-- <el-button circle size="mini" type="primary" class="softwareUpgradeIcon" @click="upgradeSoftware(item)"></el-button>
          <el-button circle size="mini" type="primary" class="softwareEditIcon" @click="editSoftware(item)"></el-button>
          <el-button circle size="mini" type="danger" class="softwareDeleteIcon" @click="deleteItem(item)"></el-button> -->
          <el-button v-if = "item.softwareType == 2" circle size="mini" type="warning" icon="el-icon-folder-add" title="添加" @click="addSoftware(item)"></el-button>

          <el-button circle size="mini" type="warning" icon="el-icon-sell" title="升级" @click="upgradeSoftware(item)"></el-button>
          <el-button circle size="mini" type="primary" icon="el-icon-edit" title="编辑" @click="editSoftware(item)"></el-button>
          <el-button circle size="mini" type="danger" icon="el-icon-close" title="删除" @click="deleteItem(item)"></el-button>
        </el-col>

        <!-- <el-col :span="24">
            <el-row>
              <el-col :span="2" style="text-align:center;">
                 <img :src="logoAndPicUrl+item.versionData.logo" :onerror="defaultImg" width="60px" height="60px">
              </el-col>
              <el-col :span="22">
                <el-row>
                  <el-col :span="12">
                    <div style="font-size:16px;font-weight:600;display:inline-block;width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{item.name}}</div>
                    <el-select  v-model="item.versionData.id" size="mini" style="display:inline-block;margin-left:10px;width:120px;" class="version">
                      <el-option v-for="(version,index) in item.versions" :key="index" :value="version.id" :label="version.version" @click.native="getVersionIndex(version, item)" />
                    </el-select >
                  </el-col>
                  <el-col :span="12" style="text-align:right;">
                    <el-button size="small" type="text" icon="el-icon-edit" @click="editSoftware(item)">编辑</el-button>
                    <el-button size="small" type="text" icon="el-icon-top" @click="upgradeSoftware(item)">升级</el-button>
                    <el-button size="small" type="text" icon="el-icon-delete" @click="deleteItem(item)">删除</el-button>
                  </el-col>
                </el-row>

                   <el-row :gutter="10" style="margin-top:5px;">
                     <el-col :span="4">
                       <span class="subTitle" style="margin-left:0px;">段 前 缀：{{item.versionData.prefix?item.versionData.prefix:'-'}}</span>
                     </el-col>
                     <el-col :span="4">
                       <span class="subTitle">大    小：{{formatFileSize(item.versionData.sizes)}}</span>
                     </el-col>
                     <el-col :span="4">
                       <span class="subTitle">研制单位：{{item.versionData.source?item.versionData.source:'-'}}</span>
                     </el-col>
                     <el-col :span="4">
                       <span class="subTitle">提供单位：{{item.versionData.offerUnit}}</span>
                     </el-col>
                     <el-col :span="4">
                       <span class="subTitle">上传人：{{item.versionData.uname}}</span>
                     </el-col>
                     <el-col :span="4">
                       <span class="subTitle">上传时间：{{item.versionData.ctime|parseTime('{y}-{m}-{d} {h}:{m}:{s}')}}</span>
                     </el-col>
                   </el-row>
              </el-col>
            </el-row>
        </el-col>-->
      </el-row>

    </el-card>


    <div style="margin-bottom:10px;height: 40px;">

      <el-col :span="12">
        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="primary"
          @click="goToSoftwareUpload"
        >全选</el-button>

        <el-button
          v-if="$checkPermission(['admin','XTUser'])"
          size="small"
          type="warning"
          @click="goToBatch"
        >批量推送入段库</el-button>
      </el-col>

      <el-col :span="12">
        <el-pagination
          style="margin-top:25px;"
          :current-page="currentPage"
          :page-sizes="[6, 50, 100, 200, 300, 400, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </div>
    
  </el-card>

   <!-- 软件段推送 -->
      <el-dialog
        title="软件段推送"
        width="30%"
        :visible.sync="dialogSoftVisible"
        :close-on-click-modal="false"
        >
        <el-form
        ref="dataPushSoftForm"
        :model="dataPushSoftForm"
        label-width="100px"
        size="small"
        style="text-align:left;"
        >
          <el-form-item label="段库名称" prop="name" style = "margin-bottom:10px">
            <el-select  ref = "selectSoft" value-key = "id" v-model="dataPushSoftForm.options" style="width:400px" placeholder="请选择段库名称" clearable size="small" @change="getSelectNode">
                    <el-option 
                      v-for = "option in selectNodeOptions"
                      @click.native = "pushAddress"
                      :key = "option.id"
                      :value = "option"
                      :label = "option.name"
                    />                         
            </el-select>
          </el-form-item> 
          <el-form-item label="段库地址" prop="address" style = "margin-bottom:10px">
            <el-input style="width:400px" v-model="dataPushSoftForm.address" placeholder="请输入段库地址 " />
          </el-form-item>

          <el-form-item label="软件名称" prop="softName" style = "margin-bottom:10px">
            <el-input  readonly style="width:400px;" v-model="dataPushSoftForm.softName" placeholder="你好" />
          </el-form-item>

          <el-form-item label="软件版本" prop="softVersion">
             <el-select  ref = "selectVersionSoft" value-key = "id" v-model="dataPushSoftForm.softVersion" style="width:400px" placeholder="请选择软件版本" clearable size="small" @change="getSelectVersionNode">
                    <el-option 
                      v-for = "option in selectSoftVersionOptions"
                      @click.native = "pushSoftVersion"
                      :key = "option.id"
                      :value = "option"
                      :label = "option.version"
                    />                         
            </el-select>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogSoftVisible = false">取消</el-button>
          <el-button  size="small" type="primary" @click="pushSoftConfirm">确认</el-button>
        </span>
      </el-dialog>  

</div>
</template>
<script>
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as user from "@/api/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SoftwareType from "../category/software-type";
import mixin from "@/styles/mixin.scss";
import dayjs from "dayjs";
import { parseTime } from "@/utils/common";
import { listSoftwareTaskAll } from "@/api/software-task";
import * as deployPosture from '@/api/deploy-posture';
// import * as appConfig from "/public/config";
export default {
  components: {
    SoftwareType,
    Treeselect,
    mixin
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 6,
      totalPage: 0,
      imgSource: require("@/assets/index/software.png"),
      defaultImg: 'this.src="' + require("@/assets/index/software.png") + '"',
      search: {
        offerUnit: null,
        devUnit: null,
        keyword: null,
        type: null,
        system: null
      },
      offerUnits: [],
      reviewData: [],
      devUnitList: [],
      offerUnitList: [],
      searchRecordList: [],
      userInfo: {},
      dialogSoftVisible:false,
      backupLoading: false,
      selectNodeOptions:[],
      selectSoftVersionOptions:[],
      pushItem:[],
      dataPushSoftForm:{
          id:1,
          name: "",
          address: "",
          softName:"",
          softVersion:"",
          softVersions:[],
          options:[],

      },
      // softwareTopInfo: {
      //   unStart: 10,
      //   unExamine: 10,
      //   unDetection: 10,
      //   unTest: 10,
      //   unPublish: 10,
      //   hasPublish: 10
      // },
      softwareOptions: [],
      sysData: [],
      logoAndPicUrl: appConfig.config.urlFilePrefix
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.getSoftwareList();
    this.getSoftwareTypeList();
    this.getTaskDataList();
    // this.getSoftwareDevUnitList()
    // this.getSoftwareOfferUnitList()
    // this.getSearchRecord()
    // this.getAllSoftwareSource()
    // this.getSelectNode();
  },
  methods: {
    getAllSoftwareSource() {
      user.getAllSoftwareSource(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.offerUnits = response.data;
        }
      });
    },
    sourceNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.name,
        label: node.name,
        children: node.children
      };
    },
    getSoftwareList() {
      software
        .getSoftwareList({
          ...this.search,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(response => {
          if (response.code === 200) {
            // debugger
            this.reviewData = response.data.list;
            this.totalPage = response.data.total;
          }
        });
    },
    // getSoftwareDevUnitList() {
    //   software.getSoftwareDevUnit().then(response => {
    //     if (response.code === 200) {
    //       this.devUnitList = response.data
    //     }
    //   })
    // },
    // getSoftwareOfferUnitList() {
    //   software.getSoftwareOfferUnit().then(response => {
    //     if (response.code === 200) {
    //       this.offerUnitList = response.data
    //     }
    //   })
    // },
    getSoftwareTypeList() {
      category.getCategoryList("service").then(response => {
        if (response.code === 200) {
          //  let res = this.handleTree(response.data.list)
          //   this.softwareOptions = res;
          this.softwareOptions = response.data.list;
        }
      });
    },
    getTaskDataList() {
      listSoftwareTaskAll().then(response => {
        if (response.code == 200) {
          this.sysData = response.data;
        }
      });
    },
    normalizer(node) {
      // console.log(node, 1)
      if (node.children && !node.children.length) {
        delete node.children;
        // console.log(node, 2)
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    selectChange(val) {
      console.log(val);
    },
    getVersionIndex(version, item) {
      item.versionData = version;
      
    },
    // handleVersionChange(item) {

    //   item.versions.forEach(i => {
    //     if (i.version === item.version) {
    //       item.uname = i.uname
    //       item.ctime = i.ctime
    //       item.ifBackup = !!i.backup
    //     }
    //   })
    // },
    formatDate(time) {},
    querySearch(queryString, cb) {
      const restaurants = this.searchRecordList;
      const searchRecords = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      const results = searchRecords.map(item => ({ value: item }));
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    addSearchRecord(keyword) {
      software
        .addSearchRecord(keyword, this.userInfo.userId)
        .then(response => {});
    },
    getSearchRecord() {
      software.getSearchRecord(this.userInfo.userId, 30).then(response => {
        if (response.code === 200) {
          this.searchRecordList = response.data;
        }
      });
    },
    handleReset() {
      (this.search = {
        offerUnit: null,
        devUnit: null,
        keyWord: null,
        type: null
      }),
        this.getSoftwareList();
    },
    goToSoftwareUpload() {
      this.$router.push({ path: "/admin/software/upload" });
    },
    goToFragmentUpload() {
      this.$router.push({ path: "/admin/software/fragmentupload" });
    },
    goToBatch() {
      this.$router.push({ path: "/admin/software/batchupload" });
    },
    // bakSoftware(item) {
    //   this.$confirm('确定备份软件 ' + item.name + ' 的 ' + item.version + ' 版本吗？', '提示', {
    //     type: 'warning'
    //   }).then((e) => {
    //     this.backupLoading = true
    //     software.bakSoftware(item.versionId).then(response => {
    //       if (response.code === 200) {
    //         this.$message.success('备份成功')
    //         this.getSoftwareList()
    //       } else {
    //         this.$message.error('备份失败')
    //       }
    //       this.backupLoading = false
    //     })
    //   })
    // },
    editSoftware(item) {
      if (item.softwareType == 2) {
        this.$router.push(
          //软件段
          {
            path: "/admin/software/fragmentedit",
            query: {
              id: item.id,
              version: item.versionData.id
            }
          }
        );
      } else {
        this.$router.push({
          path: "/admin/software/edit",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      }
    },
    upgradeSoftware(item) {
      if (item.softwareType == 2) {
        //软件段
        this.$router.push({
          path: "/admin/software/fragmentUpgrade",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      } else {
        this.$router.push({
          path: "/admin/software/upgrade",
          query: {
            id: item.id,
            version: item.versionData.id
          }
        });
      }
    },

    // 添加
    addSoftware(item){
      this.cleanDialog(); 

      this.dialogSoftVisible = true;      
      this.dataPushSoftForm.softName = item.name
      // this.selectSoftVersionOptions = item.versions
      this.dataPushSoftForm.softVersions = item.versions
      this.pushItem = item;
      this.getSelectNode();
      this.getSelectVersionNode();

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
    //获取版本节点
    getSelectVersionNode(){

      this.selectSoftVersionOptions = this.pushItem.versions

    },
     //段库option点击 名称点击有bug。
    pushAddress(){  
      // this.dataPushSoftForm.id = this.$refs.selectSoft.selectedLabel
      this.dataPushSoftForm.id = this.dataPushSoftForm.options.id;
      this.dataPushSoftForm.address = this.dataPushSoftForm.options.address;
      this.dataPushSoftForm.name = this.dataPushSoftForm.options.name;
    },
    //版本option点击
    pushSoftVersion(){
      console.log("版本option点击");
      console.log(this.dataPushSoftForm.softVersion);
      this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersion.version;
      // this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersions.version;
      // this.dataPushSoftForm.softVersion = this.dataPushSoftForm.softVersions.version;
    },
    //推送
    pushSoftConfirm(){
 
      console.log("段库名称");
      console.log(this.dataPushSoftForm.name);
      console.log(this.dataPushSoftForm.address);
      console.log(this.dataPushSoftForm.softName);
      console.log(this.dataPushSoftForm.softVersion);

      console.log("段库id");
      console.log(this.dataPushSoftForm.id);
      console.log(this.pushItem.id);
      console.log(this.pushItem.versionData.id);

      deployPosture.sendFragmentOne(this.dataPushSoftForm.id,this.pushItem.id,this.pushItem.versionData.id).then(response => {
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
   
    //清空表单
    cleanDialog(){
      this.dataPushSoftForm = {}; 
    //   this.dataPushSoftForm.name = "";
    //   this.dataPushSoftForm.address = "";

    //  this.dataPushSoftForm.softVersion = "";

      // this.$refs['dataPushSoftForm'].resetFields();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getSoftwareList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSoftwareList();
    },
    deleteItem(item) {
      this.$confirm(
        "确定删除软件 " +
          item.name +
          " 的 " +
          item.versionData.version +
          " 版本吗？",
        "提示",
        {
          type: "warning"
        }
      ).then(e => {
        software.deleteSoftwareVersion(item.versionData.id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.getSoftwareList();
          } else {
            this.$message.success("删除失败");
          }
        });
      });
    }
  }
};
</script>

<style scoped>
/* .title {
  border-left: 4px #409eff solid;
  line-height: 40px;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  background: #c5d7e9;
  margin-top: 40px;
} */
.subTitle {
  height: 12px;
  line-height: 12px;
  /* border-left: 4px solid #1890ff; */
  margin-left: 50px;
  font-size: 12px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: gray;
}
.subContent {
  height: 12px;
  line-height: 12px;
  /* border-left: 4px solid #1890ff; */
  margin-left: 50px;
  font-size: 12px;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.description {
  word-break: break-all;
  font-size: 12px;
  color: rgba(116, 121, 140, 1);
  overflow: hidden;
  margin-top: 10px;
}
el-card {
  border-radius: 4px;
  border: 0px solid #e6ebf5;
}
/deep/ .el-input--small .el-input__inner {
  height: 36px;
  line-height: 36px;
}
/deep/ .el-table {
  /* overflow: visible !important; */
}
/deep/ .el-table .cell {
  /*overflow: visible !important;*/
}

/deep/ .el-table__body-wrapper {
  overflow: visible !important;
}
.version >>> .el-input__inner {
  border: 0px solid white;
  /* background: white !important; */
}
.el-form {
  padding: 0px;
}
.el-form-item {
  margin-bottom: 0;
}
.softwareUpgradeIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareUpgrade.png');
  background-size: cover;
  border: transparent;
}
.softwareEditIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareEdit.png');
  background-size: cover;
  border: transparent;
}
.softwareDeleteIcon {
  width: 20px;
  height: 20px;
  background: url('~@/assets/index/softwareDelete.jpg');
  background-size: cover;
  border: transparent;
}
</style>

