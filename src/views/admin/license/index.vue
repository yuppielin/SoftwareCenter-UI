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
        filterable
        @change="changeSelectSoftware"
        placeholder="所属软件"
        style="width: 200px"
        class="filter-item"
        ref="software"
        @blur="closeOptions('software')"
      >
        <el-option
          v-for="(item, index) in softwareOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
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
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-search"
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

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增授权
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        @click="handleImport"
      >
        导入许可文件
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
      <el-table-column label="授权码" align="center" width="350">
        <template slot-scope="scope">
          <div>
            <span class="copy-text">{{ formatCode(scope.row.licenseCode) }}</span>
            <el-tooltip content="复制" placement="top" :enterable="false">
              <i
                class="el-icon-document-copy copy-icon"
                @click="copyText(scope.row.licenseCode)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="软件/软件段" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件版本" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.versionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户IP" align="center" min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="授权用户" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="机器码" align="center" min-width="100">
        <template slot-scope="scope">
          <div>
            <span class="copy-text">{{ scope.row.machineCode }}</span>
            <el-tooltip content="复制" placement="top" :enterable="false">
              <i
                class="el-icon-document-copy copy-icon"
                @click="copyText(scope.row.machineCode)"
              ></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="授权时间" align="center" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime.substring(0, 10) }}</span>
          <span v-if="scope.row.endTime.substring(0, 10)">
            至 {{ scope.row.endTime.substring(0, 10) }}</span
          >
          <span v-else> 至 永久</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            size="mini"
            type="danger"
            @click="handleDisable(scope.row)"
          >
            禁用
          </el-button>
          <el-button
            v-else
            size="mini"
            type="primary"
            @click="handleEnable(scope.row)"
          >
            启用
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleDownload(scope.row)"
          >
            下载许可
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handledelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 授权编辑对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="软件/软件段" prop="softwareId">
          <el-select
            v-model="temp.softwareId"
            @change="changeSelectSoftware"
            placeholder="请选择所属软件/软件段"
            style="width: 100%"
            ref="software"
            @blur="closeOptions('software')"
          >
            <el-option
              v-for="(item, index) in softwareOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="软件版本" prop="versionId">
          <el-select
            style="width: 100%"
            placeholder="软件版本"
            v-model="temp.versionId"
            ref="version"
            @blur="closeOptions('version')"
          >
            <el-option
              v-for="(item, index) in softwareVersionOptions"
              :key="index"
              :label="item.version"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户IP" prop="ip">
          <el-input
            v-model="temp.ip"
            placeholder="请输入用户IP"
          />
        </el-form-item>
        <!-- <el-form-item label="授权用户" prop="userId">
          <el-select
            v-model="temp.userId"
            placeholder="请选择授权用户"
            style="width: 100%"
            filterable
            remote
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="机器码" prop="machineCode">
          <el-input
            v-model="temp.machineCode"
            placeholder="请输入机器码，多个用英文逗号分隔"
          />
        </el-form-item>

        <el-form-item label="授权时间" prop="authTime">
          <el-date-picker
            v-model="temp.authTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="授权范围" prop="authScope">
          <el-input
            v-model="temp.authScope"
            type="textarea"
            :rows="3"
            placeholder="请输入授权范围，JSON格式"
          />
        </el-form-item>

        <!-- <el-form-item label="容器ID" prop="containerId">
          <el-input
            v-model="temp.containerId"
            placeholder="请输入容器ID，多个用英文逗号分隔"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">
          取消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 导入许可文件对话框 -->
    <el-dialog
      title="导入许可文件"
      :visible.sync="importDialogVisible"
      width="30%"
    >
      <el-upload
      ref="licenseDataUpload"
        :show-file-list="true"
        class="upload-demo"
        style="margin-top: 5px; text-align: center"
        drag
        action="#"
        multiple
        :auto-upload="false"
        accept=".lic"
        :before-upload="beforeImportUpload"
        :on-remove="removeUpload"
        :on-change="filehandleChange"
        :http-request="
          (file) => {
            return uploadFiles(file)
          }"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.lic文件，且不超过2MB
        </div>
      </el-upload>
      <el-row :gutter="10" style="margin-top: 25px; text-align: center">
        <el-button type="primary" size="small" @click="importLicense"
          >确定</el-button
        >
        <el-button size="small" @click="importDialogVisible = false"
          >取消</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLicenseList,
  createLicense,
  updateLicense,
  deleteLicense,
  changeLicenseStatus,
  downloadLicenseFile,
  importLicenseFile
} from "@/api/softwarelicense";
import { getUserList } from "@/api/user";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
import * as software from "@/api/software";

export default {
  name: "LicenseManagement",
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
        userId: undefined,
        status: undefined,
      },
      softwareOptions: [],
      softwareVersionOptions: [],
      userOptions: [],
      dialogFormVisible: false,
      importDialogVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑授权",
        create: "新增授权",
      },
      temp: {
        id: undefined,
        softwareId: undefined,
        versionId: undefined,
        userId: undefined,
        ip:undefined,
        authTime: [],
        authScope: "",
        machineCode: "",
        // containerId: "",
      },
      rules: {
        softwareId: [
          { required: true, message: "软件/软件段不能为空", trigger: "change" },
        ],
        versionId: [
          { required: true, message: "软件版本不能为空", trigger: "change" },
        ],
        userId: [
          { required: true, message: "用户不能为空", trigger: "change" },
        ],
        machineCode: [
          { required: true, message: "机器码不能为空", trigger: "change" },
        ],
        ip: [
          { required: true, message: "用户IP不能为空", trigger: "change" },
        ],
        authTime: [
          { required: true, message: "授权时间不能为空", trigger: "change" },
        ],
      },
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
      },
      fileData:'',
    };
  },
  created() {
    this.getList();
    // 获取软件列表
    this.getSoftwareList();
    //获取用户列表
    this.remoteUserSearch();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getLicenseList(this.listQuery).then((response) => {
        
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    remoteUserSearch() {
      getUserList().then((response) => {
        this.userOptions = response.data;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
        userId: undefined,
        status: undefined,
      }),
        this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        softwareId: undefined,
        versionId: undefined,
        userId: undefined,
        ip:undefined,
        authTime: [],
        authScope: "",
        machineCode: "",
        // containerId: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleImport() {
      this.importDialogVisible = true;
    },

    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.startTime = tempData.authTime[0];
          tempData.endTime = tempData.authTime[1];
          delete tempData.authTime;
          createLicense(tempData).then((response) => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建授权成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        softwareId: row.softwareId,
        versionId: row.versionId,
        userId: row.userId,
        ip:row.ip,
        authTime: [row.startTime, row.endTime || null],
        authScope: row.authScope,
        machineCode: row.machineCode,
      };
      software.getSoftwareVersion(this.temp.softwareId).then((response) => {
        if (response.code === 200) {
          this.softwareVersionOptions = response.data;
        }
      });
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.startTime = tempData.authTime[0];
          tempData.endTime = tempData.authTime[1];
          delete tempData.authTime;
          updateLicense(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新授权成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleDisable(row) {
      this.$confirm("确认禁用该授权?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        changeLicenseStatus(row.id, 0).then(() => {
          this.$notify({
            title: "成功",
            message: "禁用授权成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      });
    },
    handleEnable(row) {
      this.$confirm("确认启用该授权?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        changeLicenseStatus(row.id, 1).then(() => {
          this.$notify({
            title: "成功",
            message: "启用授权成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      });
    },
    handleDownload(row) {
      downloadLicenseFile(row.id).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${row.licenseCode.substring(0,31)}.lic`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    handleImportSuccess(response, file, fileList) {
      this.$notify({
        title: "成功",
        message: "导入许可文件成功",
        type: "success",
        duration: 2000,
      });
      this.importDialogVisible = false;
      this.getList();
    },
    handleImportError(err, file, fileList) {
      this.$notify({
        title: "错误",
        message: "导入许可文件失败",
        type: "error",
        duration: 2000,
      });
    },
    beforeImportUpload(file) {
      const isLIC = file.name.endsWith(".lic");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLIC) {
        this.$message.error("只能上传.lic文件!");
      }
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 2MB!");
      }
      return isLIC && isLt2M;
    },

    changeSelectSoftware() {
      this.listQuery.versionId = null;
      this.temp.versionId = null;
      this.getSoftwareVersionById();
    },

    handledelete(row) {
      this.$confirm("确认删除该授权?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteLicense(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除授权成功",
            type: "success",
            duration: 2000,
          });
        });
        this.getList();
      });
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

    /**
     * 获取软件版本列表
     */
    getSoftwareVersionById() {
      var softwareId = null;
      if (this.listQuery.softwareId) {
        softwareId = this.listQuery.softwareId;
      }
      if (this.temp.softwareId) {
        softwareId = this.temp.softwareId;
      }
      software.getSoftwareVersion(softwareId).then((response) => {
        if (response.code === 200) {
          this.softwareVersionOptions = response.data;
        }
      });
    },

    uploadFiles(params) {
      this.fileData.append('file', params.file) 
    },

    // 导入许可文件
    importLicense() {
      this.fileData = new FormData()
      this.$refs.licenseDataUpload.submit()
      importLicenseFile(this.fileData).then((response) => {
        if (response.code == 200) {
          this.importDialogVisible = false;
          this.$message.success("导入许可文件成功");
          this.getList();
          this.$refs.licenseDataUpload.clearFiles();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removeUpload(file, fileList){
      for(let num=0; num<fileList.length; num++){
        if(fileList[num] == file){
          fileList.splice(num, 1)
          break
        }
      }
    },
    filehandleChange(file, fileList){
      const newListLength = new Set(fileList.map(item=>item.name)).size
      const listLength = fileList.length
      if(listLength > newListLength){
        fileList.splice(-1, 1)
        this.$message.warning("该文件已上传。")
        return false
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