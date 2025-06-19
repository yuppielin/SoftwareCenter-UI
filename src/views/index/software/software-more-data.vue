<template>
  <div>
    <el-row style="margin-bottom:10px;padding:0 20px">
      <el-col style="text-align: right;width: calc(100% - 120px) ">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入资料名称"
          size="small"
          style="max-width:400px;"
        />
      </el-col>
      <el-col style="text-align: right;width: 120px;">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" title="重置" @click="handleReset" type="info"></el-button>
      </el-col>
    </el-row>
    <div style="clear:both"></div>
    <el-row :gutter="10" style="padding:0 20px">
      <el-col
        :span="12"
        v-for="(data, index) in softwareDataList"
        style="margin-bottom:10px"
        :key="index"
      >
        <el-card style="padding-bottom:20px;">
          <el-image :src="fileIcon(data.paths)" style="width:60px;height:60px;float:left"></el-image>
          <el-row style="float:left;margin-left:10px;margin-top:10px;width:calc(100% - 80px)">
            <div style="margin-bottom:10px;">
              <div
                style="margin-top:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100%"
              >
                {{ data.name }}
                <el-tag
                  class="notFirstTag"
                  style="border-radius: 10px;font-size:8px;color: rgba(23,138,227,1);height: 16px;line-height: 16px"
                >{{selectDictLabels(softwareDataTypes, data.category)}}</el-tag>
              </div>
            </div>
            <div :gutter="10" style="margin-top:10x;font-size:12px;">
              <span style="font-size:12px;">{{ data.ctime | parseTime('{y}-{m}-{d}') }}创建</span>
              &nbsp;
              <span
                style="font-size:12px;color:#05994e;cursor: pointer;"
                @click="downloadSoftwareData(data)"
              >下载</span>
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      hide-on-single-page
      style="margin-top:20px;text-align:right;clear:both"
      :current-page.sync="searchForm.pageNum"
      :page-size="searchForm.pageSize"
      background
      layout="total, prev, pager, next"
      :total="searchForm.total"
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <div v-if="softwareDataList.length==0" style="text-align:center;">
      <el-image :src="require('@/assets/index/nodata.png')" style="width:300px"></el-image>
    </div>
  </div>
</template>
<script>
import * as software from "@/api/software";
import { parseTime } from "@/utils/common";
import * as category from "@/api/category";
import download from "download-1.4.7";
export default {
  name: "SoftwareMoreData",
  components: {},
  data() {
    return {
      searchForm: {
        name: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      softwareDataList: [],
      softwareDataTypes: [],
      userInfo: {}
    };
  },

  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

    this.listDataByView();
    this.getSoftwareDataTypeList();
  },
  methods: {
    /**
     *
     */
    listDataByView() {
      software.listDataByView({ ...this.searchForm }).then(res => {
        this.softwareDataList = res.data.list;
        this.searchForm.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNum = 1;
      this.listDataByView();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.listDataByView();
    },
    search() {
      this.searchForm.pageNum = 1;
      this.listDataByView();
    },
    handleReset() {
      this.searchForm.name = "";
      this.searchForm.pageNum = 1;
      this.listDataByView();
    },
    /**
     * 下载软件资料
     */
    downloadSoftwareData(row) {
      this.$modal.loading("下载中...");
      software
        .downloadSoftwareData(this.userInfo.userId, row.id)
        .then(response => {
          const blob = new Blob([response]);
          download(blob, row.name, row.name.lastIndexOf(".") + 1);
          this.$modal.closeLoading();
        })
        .catch(err => {
          this.$modal.closeLoading();
        });
    },
    // 资料类型
    getSoftwareDataTypeList() {
      category.getCategoryList("data_type").then(response => {
        if (response.code === 200) {
          // debugger
          this.softwareDataTypes = response.data.list;
        }
      });
    },

  }
};
</script>

<style scoped lang="scss">
#software-item {
  margin: 5px 0;
  line-height: 20px;
  ::v-deep .el-card__body {
    // padding: 10px !important;
    padding-bottom: 4px;
  }
  span {
    color: rgb(161, 161, 161);
  }
  ::v-deep .el-select .el-input .el-select__caret {
    color: #c0c4cc;
  }
  ::v-deep .el-input__inner {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  .software-desc {
    line-height: 20px;
    // margin: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
  }
  .el-divider--horizontal {
    margin: 0;
  }
  //下拉框样式设置
  ::v-deep .el-input--mini .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
  ::v-deep .el-input--mini .el-input__icon {
    line-height: 20px;
  }
}
#software-item ::v-deep .el-select-dropdown__list {
  background-color: #0a76a4;
}
</style>
<style scoped>
/deep/ .el-select-dropdown__list {
  background-color: #0a76a4;
}
/deep/ .el-rate__icon {
  font-size: 14px;
}
.notFirstTag {
  margin-left: 3px;
}
</style>
