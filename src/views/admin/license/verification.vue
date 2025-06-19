<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.licenseCode"
        placeholder="授权码"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.softwareId"
        placeholder="所属软件"
        filterable
        @change="changeSelectSoftware"
        style="width: 200px"
        class="filter-item"
        ref="software"
        @blur="closeOptions('software')"
      >
        <el-option
          v-for="item in softwareOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        style="width: 200px"
        placeholder="软件版本"
        v-model="listQuery.versionId"
        filterable
        ref="version"
        @blur="closeOptions('version')"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in softwareVersionOptions"
          :key="index"
          :label="item.version"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.verifyResult"
        placeholder="验证结果"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option label="成功" value="1" />
        <el-option label="失败" value="0" />
      </el-select>
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
        value-format="yyyy-MM-dd"
        @change="handleDateChange"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="reset"
        size="small"
        @click="resetSearch"
      >
        重置
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{
            scope.$index + 1 + (listQuery.page - 1) * listQuery.limit
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权码" align="center" min-width="180">
        <template slot-scope="scope">
          <div>
            <span class="copy-text">{{ formatCode(scope.row.licenseCode)  }}</span>
            <el-tooltip content="复制" placement="top" :enterable="false">
              <i
                class="el-icon-document-copy copy-icon"
                @click="copyText(scope.row.licenseCode)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="软件/软件段" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件版本" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.versionName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="验证类型" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verifyType === 1 ? 'primary' : 'success'">
            {{ scope.row.verifyType === 1 ? "在线" : "离线" }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="验证结果" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verifyResult === 1 ? 'success' : 'danger'">
            {{ scope.row.verifyResult === 1 ? "成功" : "失败" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="客户端IP" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.clientIp || "--"  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机器码" align="center" min-width="180">
        <template slot-scope="scope">
          <div>
            <span class="copy-text">{{ scope.row.machineCode || "--" }}</span>
            <el-tooltip content="复制" placement="top" :enterable="false">
              <i
                class="el-icon-document-copy copy-icon"
                @click="copyText(scope.row.machineCode)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="验证时间" align="center" width="160">
        <template slot-scope="{ row }">{{
          row.verifyTime | parseTime("{y}-{m}-{d}")
        }}</template>
      </el-table-column>
      <el-table-column label="错误信息" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.errorMessage || "--" }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getVerifyList"
    />
  </div>
</template>

<script>
import { getLicenseVerificationList } from "@/api/softwarelicense";
import * as software from "@/api/software";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

export default {
  name: "LicenseVerification",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        licenseCode: undefined,
        softwareId: undefined,
        versionId: undefined,
        verifyResult: undefined,
        dateRange: [],
      },
      softwareOptions: [],
      softwareVersionOptions: [],
    };
  },
  created() {
    this.getVerifyList();
    // 获取软件列表
    this.getSoftwareList();
  },
  methods: {
    getVerifyList() {
      this.listLoading = true;
      getLicenseVerificationList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    /**
     * 重置搜索
     */
    resetSearch() {
      (this.listQuery = {
        page: 1,
        limit: 10,
        licenseCode: undefined,
        softwareId: undefined,
        versionId: undefined,
        verifyResult: undefined,
        dateRange: [],
      }),
        this.getVerifyList();
    },
    /**
     * 获取软件列表
     */
    getSoftwareList() {
      software.getAllSoftware().then((response) => {
        if (response.code === 200) {
          this.softwareOptions = response.data;
        }
      });
    },

    changeSelectSoftware() {
      this.listQuery.versionId = null;
      this.getSoftwareVersionById();
    },
    /**
     * 获取软件版本列表
     */
    getSoftwareVersionById() {
      var softwareId = this.listQuery.softwareId;
      software.getSoftwareVersion(softwareId).then((response) => {
        if (response.code === 200) {
          this.softwareVersionOptions = response.data;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getVerifyList();
    },
    handleDateChange(val) {
      if (val) {
        this.listQuery.startTime = val[0];
        this.listQuery.endTime = val[1];
      } else {
        this.listQuery.startTime = undefined;
        this.listQuery.endTime = undefined;
      }
    },

    copyText(text) {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500,
      });
    },

    formatCode(code){
      if(!code) return '--';
      const prefix = code.substring(0,6);
      const suffix = code.substring(code.length-5);
      return prefix + '**************' + suffix;

    }
  },
};
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-bottom: 10px;
  margin-right: 10px;
}

.copy-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.copy-icon {
  margin-left: 5px;
  cursor: pointer;
  color: #409eff;
}
.copy-icon:hover {
  color: #66b1ff;
}
.copy-text{
  flex-grow: 1;
  text-align: center;
}
</style>