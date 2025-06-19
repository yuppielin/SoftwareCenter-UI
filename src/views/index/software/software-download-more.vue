<template>
  <div class="app-container">
    <el-card class="custome custome-height">
      <div style="margin-left:10px;">
        <el-row :gutter="20">
          <el-col :span="4">
            <!--          <treeselect-->
            <!--            id="treeselect"-->
            <!--            v-model="filter.type == 0?undefined:filter.type"-->
            <!--            :options="treeData"-->
            <!--            :normalizer="normalizer"-->
            <!--            :show-count="true"-->
            <!--            placeholder="选择软件分类"-->
            <!--            @select="changeParent"-->
            <!--          />-->
            <!-- <el-cascader v-model="filter.category" style="width: 100%" clearable placeholder="请选择软件分类" :props="categoryProps" /> -->
          </el-col>
          <el-col :span="4">
            <!--          <el-input-->
            <!--            v-model="filter.keyword"-->
            <!--            suffix-icon="el-icon-search"-->
            <!--            placeholder="关键字"-->
            <!--          />-->
            <el-autocomplete
              class="inline-input"
              v-model="filter.keyword"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              style="width: 100%"
              @select="getSoftwareList"
              @change="getSoftwareList"
            ></el-autocomplete>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" @click="getSoftwareList">搜索</el-button>
            <el-button size="small" type="info" @click="handleRest">重置</el-button>
          </el-col>
          <el-col :span="14" style="text-align:right">
            <el-button size="small" type="primary" icon="el-icon-back" onclick="history.go(-1)">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div style="margin:10px;">
        <el-button type="primary" size="mini" @click="batchDownload" :loading="loading">批量下载</el-button>
        <el-button type="primary" size="mini" @click="batchByDownlader" :loading="loading">添加至下载器</el-button>
        <el-button type="primary" size="mini" v-if = "type !== 'common'" @click="jumpToSoftwareDownloadList">导入下载</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="softwareData"
        size="mini"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#2BB56E',height:'30px'}"
        style="margin:10px;"
      >
        <el-table-column width="60" type="index" align="center" header-align="center" label="序号" />
        <el-table-column
          width="50"
          type="selection"
          align="center"
          header-align="center"
          label="全选"
          :selectable="checkSelectable"
        />
        <el-table-column min-width="100px" label="软件名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="软件描述" prop="description" width="300px" show-overflow-tooltip />
        <el-table-column align="center" header-align="center" prop="type" label="软件类型">
          <template slot-scope="{row}">
            <span v-if="row.softwareType==1">通用软件</span>
            <div v-else>
              <span
                v-text="row.fragmentType==1?'数据库段':row.fragmentType==2?'镜像段':row.fragmentType==3?'客户端段':row.fragmentType==4?'服务段':'数据段'"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="软件版本" prop="version">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.version"
              @change="handleVersionChange(scope.$index, scope.row)"
            >
              <el-option
                v-for="item in scope.row.versions"
                :key="item.id"
                :label="item.version"
                :value="item.version"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="软件大小" prop="size">
          <template slot-scope="{row}">{{showSizes(row.size)}}</template>
        </el-table-column>
        <el-table-column prop="devUnit" label="研制单位" show-overflow-tooltip />
        <el-table-column
          align="center"
          header-align="center"
          prop="offerUnit"
          label="提供单位"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">{{row.offerUnit?row.offerUnit:'-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="downloadSoftware(row)"
              v-if="row.permission == 1"
            >下载</el-button>
            <el-button
              type="info"
              size="small"
              @click="addSoftwareDownloadApply(row.versionId)"
              v-else
            >申请下载</el-button>
            <!-- <el-button
              type="danger"
              size="small"
              @click="downloadSoftware(row)"
              v-else
              disabled
            >暂无权限</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        hide-on-single-page
        style="margin-top:20px;text-align:right;clear:both"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next,jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import download from "download-1.4.7";
import * as category from "@/api/category";
import * as software from "@/api/software";
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      activeName: "first",
      pageSize: 10,
      currentPage: 1,
      total: 0,
      filter: {
        category: null,
        keyword: null
      },
      loading: false,
      softwareData: [],
      // 组织列表控制
      treeData: [],
      downloadDataList: [],
      categoryProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          level + 1;
          category.getCategoryList(node.value, null, null).then(response => {
            const data = response.data.list;
            for (var i = 0; i < data.length; i++) {
              if (data[i].children == null || data[i].children.length === 0) {
                data[i].children = undefined;
              }
            }
            const nodes = data.map(item => {
              return {
                label: item.name,
                value: item.id.toString(),
                leaf: level >= 1
              };
            });
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        }
      },
      type: null, //common or service
      category: null
    };
  },
  mounted() {
    debugger
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.type = this.$route.query.type;
    this.category = this.$route.query.category;
    this.getSoftwareList();
    this.getSearchRecord();
  },
  methods: {
    jumpToSoftwareDownloadList() {
      this.$router.push({
        path: "/index/software-download-list"
      });
    },
    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    async getSoftwareList() {
      if (this.filter.keyword) {
        this.addSearchRecord(this.filter.keyword);
      }
      // let category = null
      // if (this.filter.category && this.filter.category.length > 0) {
      //   category = this.filter.category.toString()
      // }
      await software
        .getSoftwareListByCategory(
          this.userInfo.userId,
          this.type,
          this.category,
          this.filter.keyword,
          1,
          1,
          this.currentPage,
          this.pageSize
        )
        .then(response => {
          if (response.code === 200) {
            this.softwareData = response.data.list;
            this.total = response.data.total;
            this.getSearchRecord();
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    handleVersionChange(index, item) {
      const versionInfo = item.versions.find(i => i.version === item.version);
      this.softwareData[index].verisonId = versionInfo.id;
      this.softwareData[index].description = versionInfo.description;
      this.softwareData[index].size = versionInfo.sizes;
      this.softwareData[index].softwareVersionVolumes = versionInfo.softwareVersionVolumes;
      // console.log(versionInfo, "versionInfo");
      this.$refs.multipleTable.toggleRowSelection(item, false)
    },
    batchDownload() {
      this.loading = true;
      if (this.downloadDataList.length > 0) {
        // const zipFileName = '软件资源包'
        // software.downloadSoftwareBatch(this.downloadDataList).then(response => {
        //   const blob = new Blob([response], { type: 'application/zip' })
        //   const downloadUrl = window.URL.createObjectURL(blob)
        //   // window.location.href = url;
        //   const link = document.createElement('a')
        //   link.href = downloadUrl
        //   link.download = zipFileName
        //   link.click()
        //   URL.revokeObjectURL(downloadUrl)
        // })
        // console.log(this.downloadDataList);
        this.downloadDataList.forEach((item, index) => {
          // this.downloadSoftware({id:item.versionId})
          software.downloadSoftwareFile(
            this.userInfo.userId,
            item.versionId,
            1
          );

          // 下载软件分卷
          if(item.softwareVersionVolumes) {
            item.softwareVersionVolumes.forEach(element => {
                software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
            });
          }

        });
      } else {
        this.$message.warning("没有选择软件");
      }
      this.loading = false;
      // this.downloadDataList = []
    },
    batchByDownlader(){
      console.log(this.downloadDataList, "this.downloadDataList");
       if (this.downloadDataList.length > 0) {
        let  items = [];
        this.downloadDataList.forEach((item, index) => {
          console.log(item,666);
          let itemObj = {};
           let url = software.downloadSoftwareFileUrl(
                        this.userInfo.userId,
                        item.versionId
                      );
           itemObj = {
                name: item.name,
                url:url,
                // size: item.size
            }
          items.push(itemObj);

          // 下载软件分卷
          
          if(item.softwareVersionVolumes) {
            item.softwareVersionVolumes.forEach(element => {
                let volumeUrl = software.downloadSoftwareVolumeFileUrl(this.userInfo.userId, element.versionId, element.id)
                itemObj = {
                      name: element.fileName,
                      url:volumeUrl,
                  }
                items.push(itemObj);
            });
          }
        });
        // console.log(items, "items");
        if(items.length==0) {
            this.$message.warning("没有选择软件");
            return false;
        }
        if (this.socket.readyState!=1) {
          alert('下载器未安装或未打开！');
        
          return false;
      }

      var json = {items:items};
      console.log(json,'999999999999');
      this.socket.send(JSON.stringify(json));

      } else {
        this.$message.warning("没有选择软件");
      }
    },
    handleSelectionChange(val) {
      this.downloadDataList = [];
      if (val.length > 0) {
        val.forEach(item => {
          this.downloadDataList.push({
            softwareId: item.id,
            versionId: item.versionId,
            name: item.fileName,
            size: item.size,
            type: 1,
            uid: this.userInfo.userId,
            softwareVersionVolumes: item.softwareVersionVolumes
          });
        });
      }
    },
    downloadSoftware(data) {
      // if (data.permission === 0) {
      //   this.$message.error('无下载权限')
      // } else if (data.permission === 1) {
      //   this.$confirm('确认提交下载申请' + data.name + '吗?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     this.addSoftwareDownloadApply(data.versionId)
      //   }).catch(() => {
      //     // eslint-disable-next-line no-undef
      //     console.log(error)
      //   })
      // } else if (data.permission === 2) {
      //   software.downloadSoftware(this.userInfo.userId, data.versionId).then(response => {
      //     if (response.code === 200) {
      //       window.location.href = response.data
      //     }
      //   })
      // }
      software.downloadSoftwareFile(this.userInfo.userId, data.versionId);

      // 下载软件分卷
      if(data.softwareVersionVolumes) {
        data.softwareVersionVolumes.forEach(element => {
            software.downloadSoftwareVolumeFile(this.userInfo.userId, element.versionId, element.id)
        });
        
      }
    },
    addSoftwareDownloadApply(versionId) {
      software
        .downloadSoftwareApply(
          versionId,
          this.userInfo.userId,
          this.userInfo.realName
        )
        .then(response => {
          if (response.code === 200) {
            this.$message.success("下载申请已提交");
          }
        });
    },
    checkSelectable(row, index) {
      if (row.permission === 1) {
        return true;
      } else {
        return false;
      }
    },
    handleRest() {
      this.filter = {
        category: null,
        keyword: null
      };
      this.currentPage = 1;
      this.getSoftwareList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getSoftwareList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSoftwareList();
    },
    cancelEdit(row) {
      row.name = row.originalName;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the original value",
        type: "warning"
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalName = row.name;
      this.$message({
        message: "The title has been edited",
        type: "success"
      });
    },
    changeParent() {},
    // 转换菜单数据结构
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.typeName,
        children: node.children
      };
    }
  }
};
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
