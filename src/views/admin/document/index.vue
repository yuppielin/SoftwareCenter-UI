<template>
  <el-card class="custome custome-height">
    <el-tabs type="card" v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane name="first" label="软件资料"></el-tab-pane>
      <el-tab-pane name="second" label="业务资料"></el-tab-pane>
    </el-tabs>
    <el-row style="width: 100%;">
      <el-col :span="8" style="border: 1px solid transparent;">
        <el-button @click="openAddSoftwareDataDialog" size="small" type="primary" style="background: rgba(23,138,227,1);border:0;height:32px">资料添加</el-button>
        <el-button @click="resetDataStatusDialog" v-show="dataStatus === '待审核' && $checkPermission(['admin','XTUser']) " :disabled="selectedDataList.length==0" type="primary" size="small" style="border:0;height:32px">批量审批</el-button>
      </el-col>
      <el-col :span="16" style="text-align: right;">
        <el-form id="documentIndex" :inline="true">
          <el-form-item>
            <el-radio-group v-model="dataStatus" @change="handleTabClick() ">
              <el-radio-button label="待审核" value1="待审核"></el-radio-button>
              <el-radio-button label="已通过" value2="已通过"></el-radio-button>
              <el-radio-button label="已驳回" value3="已驳回"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <treeselect
              v-model="search.category"
              style="width:200px;float:left"
              class="tree-select-medium"
              :multiple="false"
              :appendToBody="true"
              :options="typeData"
              :disable-branch-nodes="false"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择资料类型"
              @select="selectModuleAdd"
            ></treeselect>
          </el-form-item>
          <el-form-item>
            <el-input
              size="medium"
              v-model="search.keyword"
              icon="el-icon-search"
              style="width:200px;"
              placeholder="关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="searchDoc"
              style="margin-left:10px; background: rgba(23,138,227,1);border:0;height:32px"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button size="small" @click="resetSearch" type="reset" >重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="visibleDlg" width="600px" title="资料编辑" :close-on-click-modal="false">
      <el-form
        id="docFormId"
        ref="docForm"
        name="docForm"
        :model="docForm"
        label-position="right"
        label-width="105px"
      >
        <!-- <el-form-item label="资料名称">
          <el-input
            v-model="docForm.name"
            size="small"
            style="width:400px;"
            :rules="[{ required: true, message: '资料名称不能为空', trigger: 'blur' },{min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },{pattern:/^[^\s]+(\s+[^\s]+)*$/,message: '资料名称不合法', trigger: 'blur'}]"
          />
        </el-form-item>-->
        <el-form-item label="资料类型">
          <treeselect
            v-model="docForm.category"
            style="max-width:400px;display: inline-block"
            :multiple="false"
            :options="typeData"
            :disable-branch-nodes="false"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择资料类型"
            @select="selectModuleAdd"
          ></treeselect>
        </el-form-item>
        <el-form-item
          v-if="activeTab=='second'"
          prop="isView"
          label="可浏览/下载:"
          :rules="[{ required: true, message: '请选择对象', trigger: 'change' }]"
          >
          <treeselect
              v-model="docForm.isView"
              style="width:400px;display: inline-block"
              size="small"
              value-consists-of="ALL_WITH_INDETERMINATE"
              :normalizer="normalizer"
              :multiple="true"
              :limit="2"
              :limit-text="count => `及其它${count}项`"
              :show-count="true"
              :options="testDepartmentList"
              placeholder="请选择可浏览单位"
        />
        </el-form-item>
        <el-form-item label="上传资料">
          <el-row>
            <el-input size="small" style="width:310px" v-model="docForm.name"></el-input>

            <el-button
              size="small"
              style="margin-left: 8px;"
              type="primary"
              @click="selectUpdateDocument"
            >选择文件</el-button>
          </el-row>
          <el-upload
            ref="updateDocument"
            :multiple="false"
            accept=".gif, .jpg, .png, .zip, .gz, .rar, .iso, .doc, .xls, .ppt, .docx, .xlsx, .pptx, .wps, .chm, .exe, .mp4, .mp3, .pdf"
            style="display: none"
            :action="uploadURL"
            :show-file-list="false"
            :auto-upload="false"
            :file-list="updateDocumentList"
            :on-change="updateDocumentChange"
          >
            <el-button slot="trigger" id="updateDocumentButton">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;">
        <el-button size="small" type="primary" @click="updateSoftwareData">确定</el-button>
        <el-button size="small" style="background:orange;color:white;" @click="visibleDlg=false">取消</el-button>
      </el-row>
    </el-dialog>
<!--    <el-tabs type="card" v-model="documentType" @tab-click="handleTabClick">-->
<!--      <el-tab-pane name="undo" label="待审核" />-->
<!--      <el-tab-pane name="pass" label="已通过" />-->
<!--      <el-tab-pane name="refuse" label="已驳回" />-->
<!--    </el-tabs>-->
    <!-- <el-table
      max-height="600px;"
      :data="documentData"
      size="mini"
      style="overflow-y:auto;"
      :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}"
    >
      <el-table-column align="center" header-align="center" width="55" type="index" label="序号" />
      <el-table-column
        align="center"
        header-align="center"
        label="资料名称"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column align="center" header-align="center" label="资料大小" prop="size">
        <template slot-scope="scope">
          <span v-text="showSizes(scope.row.size)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="软件名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.softwareName }}</span>
          <span>( {{ row.version }} )</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="上传者" prop="uname" />
      <el-table-column align="center" header-align="center" label="上传时间" prop="ctime"></el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="280">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            v-show="judgeShowSoftwareData(row.name)"
            @click="showSoftwareDataDialog(row)"
          >查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="downloadSoftwareDocument(row)"
          >下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteItem(row)">删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-check"
            v-show="documentType==='undo'"
            @click="openExamineDialog(row)"
          >审核</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <!--    <el-row :gutter="20">-->
    <!--      <el-col :span="12" v-for="(item,index) in documentData" :key="index" style="margin:10px 0;">-->
    <!--        <el-card style="height:150px">-->
    <!--          <el-row :gutter="10">-->
    <!--            <el-col :span="4">-->
    <!--              <el-image :src="require('@/assets/index/doc.png')" width="60px" height="60px"></el-image>-->
    <!--            </el-col>-->
    <!--            <el-col :span="20">-->
    <!--              <div style="font-weight:600;font-size:16px;">{{item.name}}</div>-->
    <!--              <el-row :gutter="5" style="margin-top:10px;">-->
    <!--                <el-col :span="12">-->
    <!--                  <span class="title">上传人：{{item.uname}}</span>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12">-->
    <!--                  <span class="title">资料大小：{{showSizes(item.size)}}</span>-->
    <!--                </el-col>-->
    <!--              </el-row>-->
    <!--              <el-row :gutter="5" style="margin-top:10px;">-->
    <!--                <el-col :span="12">-->
    <!--                  <span class="title">上传时间：{{item.ctime| parseTime('{y}-{m}-{d}')}}</span>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12">-->
    <!--                  <span class="title">关联软件：{{item.softwareName}}({{ item.version }})</span>-->
    <!--                </el-col>-->
    <!--              </el-row>-->
    <!--              <div style="margin-top:10px;">-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  type="text"-->
    <!--                  icon="el-icon-edit"-->
    <!--                  @click="handleEdit(item)"-->
    <!--                  style="margin-left:0px;"-->
    <!--                >编辑</el-button>-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  type="text"-->
    <!--                  icon="el-icon-search"-->
    <!--                  v-show="judgeShowSoftwareData(item.name)"-->
    <!--                  @click="showSoftwareDataDialog(item)"-->
    <!--                >查看</el-button>-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  type="text"-->
    <!--                  icon="el-icon-download"-->
    <!--                  @click="downloadFileByNameAndPath(item.name, item.paths)"-->
    <!--                >下载</el-button>-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  type="text"-->
    <!--                  icon="el-icon-delete"-->
    <!--                  @click="deleteItem(item)"-->
    <!--                >删除</el-button>-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  type="text"-->
    <!--                  icon="el-icon-s-check"-->
    <!--                  v-if="$checkPermission(['admin','XTUser'])"-->
    <!--                  v-show="documentType==='undo'"-->
    <!--                  @click="openExamineDialog(item)"-->
    <!--                >审核</el-button>-->
    <!--              </div>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-table
      :key="tableKey"
      :data="documentData"
      size="mini"
      stripe
      :header-cell-style="{background:'#2BB56E',height:'30px'}"
      @selection-change="changeSelectedData"
      :row-key="getDocumentKey"
    >
      <el-table-column v-if="dataStatus === '待审核'" :reserve-selection="true" align="center" type="selection" width="50"></el-table-column>
      <el-table-column width="80" type="index" align="center" label="序号" />
      <el-table-column label="文件名称" header-align="center" prop="name" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-image :src="fileIcon(row.name)" style="width:16px;height:16px;"></el-image>
          <span style="margin-left:10px;">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="activeTab=='first'" label="软件名称" header-align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="color:rgb(8, 151, 151)">{{ row.softwareName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="activeTab=='first'" label="软件版本" width="100px" show-overflow-tooltip align="center">
        <template slot-scope="{row}">{{ row.version }}</template>
      </el-table-column>
      <el-table-column align="center" width="100px" header-align="center" show-overflow-tooltip label="资料类型">
        <template slot-scope="{row}">{{dataType(row.category)}}</template>
      </el-table-column>
      <el-table-column align="center" header-align="center" width="150px" label="资料大小" prop="size">
        <template slot-scope="{row}">
          <span v-text="showSizes(row.size)"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        show-overflow-tooltip
        label="上传时间"
        prop="ctime"
        width="100px"
      >
        <template slot-scope="{row}">{{row.ctime| parseTime('{y}-{m}-{d}')}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        show-overflow-tooltip
        label="上传人"
        prop="uname"
        width="120px"
      />
      <el-table-column align="center" header-align="center" label="操作" width="250">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            title="编辑"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(row)"
            circle
            style="margin-left:0px;"
          ></el-button>
          <el-button
            size="mini"
            title="查看"
            icon="el-icon-search"
            type="primary"
            circle
            :disabled="!judgeShowSoftwareData(row.name)"
            @click="showSoftwareDataDialog(row)"
          ></el-button>
          <el-button
            :disabled="dataStatus=='待审核'&&userType=='user'"
            size="mini"
            title="下载"
            type="primary"
            circle
            icon="el-icon-download"
            @click="downloadFileByNameAndPath(row.name, row.paths)"
          ></el-button>
          <el-button
            size="mini"
            title="删除"
            type="danger"
            circle
            icon="el-icon-close"
            @click="deleteItem(row)"
          ></el-button>
          <el-button
            size="mini"
            title="审核"
            type="warning"
            circle
            icon="el-icon-s-check"
            v-if="$checkPermission(['admin','XTUser'])"
            v-show="dataStatus === '待审核'"
            @click="openExamineDialog(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination
      v-if="documentData.length!=0"
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div v-if="documentData.length==0" style="text-align:center;">
      <el-image :src="require('@/assets/index/nodata.png')" style="height:600px"></el-image>
    </div>
    <el-dialog width="300px" title="资料审核" :visible.sync="examineVisible">
      <el-row style="text-align: center;">
        <el-button type="primary" size="small" @click="decideExamineResult('pass')">通过</el-button>
        <el-button
          style="margin-left: 20px;"
          type="danger"
          size="small"
          @click="decideExamineResult('refuse')"
        >驳回</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="资料查看"
      :visible.sync="showSoftwareDataVisible"
      :before-close="closeSoftwareDataDialog"
      v-if="showSoftwareDataVisible"
    >
      <div style="text-align: center;">
        <div
          v-if="typeJudge==1"
          ref="preview"
          id="preview"
          class="pdfPriview"
          v-loading="loading"
          style="height:500px;overflow-y:auto"
        />
        <iframe
          :src="previewUrl"
          v-else-if="typeJudge==2"
          type="application/x-google-chrome-pdf"
          width="100%"
          frameborder="0"
          scrolling="auto"
          height="500px"
        />
        <el-image
          style="width: 400px;height: 100%;"
          v-else-if="typeJudge==3"
          :src="previewUrl"
          fit="cover"
        />
      </div>
    </el-dialog>
    <el-dialog
      id="addDataForSoftware"
      title="资料添加"
      :visible.sync="addSoftwareDataForm.visible"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="addSoftwareDataForm"
        :model="addSoftwareDataForm"
        label-position="right"
        label-width="105px"
        style="width: 600px;margin: 10px auto;"
      >
        <el-form-item label="选择软件：" v-if="activeTab=='first'" prop="dataSoftware">
          <el-select
            style="width: 400px;"
            v-model="addSoftwareDataForm.dataSoftware"
            filterable
            @change="changeSelectSoftware"

            ref="software"
            @blur="closeOptions('software')"
          >
            <el-option
              v-for="(item, index) in softwareList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本：" v-if="activeTab=='first'">
          <el-select 
            style="width: 400px;" 
            v-model="addSoftwareDataForm.softwareVersion" 
            filterable

            ref="version"
            @blur="closeOptions('version')"
          >
            <el-option
              v-for="(item, index) in softwareVersionList"
              :key="index"
              :label="item.version"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item 
          label="资料类型："
          prop="dataType"
          >
          <treeselect
            v-model="addSoftwareDataForm.dataType"
            style="width:400px;float:left"
            :multiple="false"
            :appendToBody="true"
            :options="typeData"
            :disable-branch-nodes="false"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择资料类型"
            z-index="9999"
            @select="selectModuleAdd"
          ></treeselect>
        </el-form-item>
        <el-form-item
          v-if="activeTab=='second'"
          prop="isView"
          label="可浏览/下载:"
          :rules="[{ required: true, message: '请选择可浏览/下载部门', trigger: 'change' }]"
          >
          <treeselect
              v-model="addSoftwareDataForm.isView"
              style="width:400px;display: inline-block"
              size="small"
              value-consists-of="ALL_WITH_INDETERMINATE"
              :normalizer="normalizer"
              :multiple="true"
              :limit="2"
              :limit-text="count => `及其它${count}项`"
              :show-count="true"
              :options="testDepartmentList"
              placeholder="请选择可浏览单位"
        />
        </el-form-item>
        <el-form-item label="上传资料：">
          <el-upload
            :disabled="addSoftwareDataForm.dataType==null||addSoftwareDataForm.dataType==''"
            action="#"
            :multiple="true"
            :auto-upload="true"
            :show-file-list="false"
            :before-upload="beforeUploadSoftwareData"
            :http-request="uploadSoftwareData"
            :accept="dataBeforeUploadCheck"
          >
            <el-button
              :disabled="addSoftwareDataForm.dataType==null||addSoftwareDataForm.dataType==''"
              slot="trigger"
              icon="el-icon-upload"
              type="primary"
              size="small"
            >上传资料</el-button>
            <div slot="tip" class="el-upload__tip" style="display: flex;">
              <div style="font-size: 12px;height: 60px;line-height: 30px;min-width: 60px;">支持格式：</div>
              <div style="font-size: 12px;height: 60px;line-height: 30px;">{{dataBeforeUploadCheck}}</div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="addSoftwareDataForm.uploadList"
        style="width: 600px;margin: 10px auto;"
        max-height="300px"
      >
        <el-table-column type="index" label="序号" width="80px"></el-table-column>
        <el-table-column label="文件名称" prop="name" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
           <el-input size="small" v-model="scope.row.name" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="文件类型"
          prop="category"
          align="center"
          width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <treeselect
              v-model="scope.row.category"
              style="width:200px;float:left"
              :multiple="false"
              :appendToBody="true"
              :options="typeData"
              :disable-branch-nodes="false"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择资料类型"
              z-index="9999"
              @select="selectModuleAdd"
            ></treeselect>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              title="删除"
              size="small"
              type="danger"
              @click="deleteUploadFile(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center;">
        <el-button size="small" @click="addSoftwareDataForm.visible=false">取消</el-button>
        <el-button
          :disabled="judgeUploadDataAboutSoftware()"
          type="primary"
          size="small"
          @click="makeSureUploadData"
        >确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dataBatchVisible" title="批量审批">
      <el-form ref="batchDataFormRef" :model="batchDataForm" label-position="right" label-width="100px">
        <el-form-item prop="status" :rules="[{ required: true, message: '审核状态不能为空', trigger: 'change' }]" label="审核状态：">
          <el-select size="small" v-model="batchDataForm.status">
            <el-option label="通过" value="pass"></el-option>
            <el-option label="驳回" value="reject"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="option" :rules="[{ required: batchDataForm.status == 'reject', message: '审核描述不能为空', trigger: 'blur' }]" label="审核描述：">
          <el-input size="small" v-model="batchDataForm.option" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;">
        <el-button type="info" size="small" @click="dataBatchVisible=false">取消</el-button>
        <el-button type="primary" size="small" @click="setDataStatusBatch">确定</el-button>
      </el-row>
    </el-dialog>
  </el-card>
</template>
<script>
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as application from "@/api/application";
import * as organization from '@/api/organization';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import download from "download-1.4.7";
let docx = require("docx-preview");
window.JSZip = require("jszip");
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      tableKey: 0,
      activeTab: "first",
      dataStatus:"待审核",
      typeData: [],
      currentPage: 1,
      pageSize: 15,
      total: 0,
      visibleDlg: false,
      search: {
        keyword: "",
        category: null
      },
      docForm: {
        name: "",
        size: "",
        type: "",
        softwareName: "",
        softwareVersion: ""
      },
      documentData: [],
      userInfo: {},
      softwareDataTypes: [],
      softwareList: [],
      softwareVersionList: [],

      documentType: "undo",
      documentStatus: 0,

      uploadURL: "127.0.0.1",
      updateDocumentList: [],

      examineVisible: false,
      examineData: null,

      addSoftwareData: false,
      addSoftwareDataForm: {
        visible: false,
        dataSoftware: null,
        softwareVersion: null,
        dataType: null,
        uploadList: []
      },
      dataBeforeUploadCheck: config.softwareDataUploadCheckType,

      showSoftwareDataVisible: false,
      showSoftwareData: {
        type: null
      },

      // previewType: ["gif", "jpg", "png", "mp4", "mp3", "pdf"],
      previewType: ["docx", "doc", "png", "jpg", "pdf", "mp4"],
      typeJudge: 0,
      loading: false,
      selectedDataList: [],
      dataBatchVisible: false,
      batchDataForm: {
        status: null,
        option: ""
      },

      testDepartmentList: [],
      userType: null
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

    let activeTab = this.$route.query.activeTab;
    if(activeTab!=null && activeTab != "") {
        this.activeTab=activeTab;
    }

    this.userType = localStorage.getItem("userType")

    // 获取软件资料类型列表
    this.getCategoryList();
    // 获取软件资料列表
    this.searchDoc();
    // 获取软件列表
    this.getSoftwareList();
    // 获取部门
    this.getDeptTree();
  },
  methods: {
    getDocumentKey(row){
      return row.id;
    },
    judgeUploadDataAboutSoftware() {
      if(this.activeTab == "first"){
        if(this.addSoftwareDataForm.dataSoftware==null||this.addSoftwareDataForm.dataSoftware==''||this.addSoftwareDataForm.softwareVersion==null||this.addSoftwareDataForm.softwareVersion==''){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    changeTab() {
      if(this.activeTab == "first"){
        this.getSoftwareDataList()
      }else{
        this.getNoSoftwareData()
      }
    },
    getNoSoftwareData() {
      let userId = null;
      if (localStorage.getItem("userType") != "admin"&&localStorage.getItem("userType") != "XTUser") {
        userId = this.userInfo.userId;
      }
      software
        .listDataByNoSoftware(
          userId,
          this.documentStatus,
          this.search.keyword,
          this.search.category,
          this.currentPage,
          this.pageSize
        )
        .then(response => {
          if (response.code === 200) {
            this.documentData = response.data.list;
            this.total = response.data.total;
          }
        });
    },
    changeSelectedData(val){
      this.selectedDataList = val;
      console.log(this.selectedDataList, "this.selectedDataList")
    },
    resetDataStatusDialog() {
      this.dataBatchVisible = true;
      this.batchDataForm = {
        status: null,
        option: ""
      }
      this.$nextTick(() => {
        this.$refs.batchDataFormRef.clearValidate()
      })
    },
    setDataStatusBatch() {
      if(this.selectedDataList.length <= 0){
        return this.$message.error("存在问题，请呼叫运维人员检查。");
      }else{
        this.$refs.batchDataFormRef.validate(valid => {
          if(valid){
            let selectedData = null
            for(let i=0;i<this.selectedDataList.length;i++){
              selectedData = selectedData + this.selectedDataList[i].id
              if(i<this.selectedDataList.length - 1){
                selectedData = selectedData + ","
              }
            }
            if(this.batchDataForm.status === "pass"){
              software.batchPassDataMore(selectedData).then(response => {
                if (response.code === 200) {
                  this.dataBatchVisible = false;
                  this.changeTab();
                  return this.$message.info("审批提交成功.")
                }
              });
            }else if(this.batchDataForm.status === "reject"){
              software.batchRejectDataMore(selectedData, this.batchDataForm.option).then(response => {
                if (response.code === 200) {
                  this.dataBatchVisible = false;
                  this.changeTab();
                  return this.$message.info("审批提交成功.")
                }
              });
            }
          }else{
            return false
          }
        })
        
      }
    },
    deleteUploadFile(index) {
      this.addSoftwareDataForm.uploadList.splice(index, 1);
    },
    searchDoc() {
      (this.currentPage = 1), this.changeTab();
    },
    changeSelectSoftware() {
      this.addSoftwareDataForm.softwareVersion = null;
      this.getSoftwareVersionById();
    },
    openAddSoftwareDataDialog() {
      this.addSoftwareDataForm = {
        visible: true,
        dataSoftware: null,
        softwareVersion: null,
        dataType: null,
        uploadList: []
      };
    },
    beforeUploadSoftwareData(file) {
      let fileSize = file.size / 1024 / 1024;
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const acceptType = this.dataBeforeUploadCheck.split(",");
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else if (fileSize > 100) {
        this.$message.error("该文件大小不符合当前允许上传大小!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    uploadSoftwareData(params) {
      console.log("application", params);
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.addSoftwareDataForm.uploadList.push({
            paths: response.data.fileName,
            name: response.data.originalFilename,
            sizes: file.size,
            category: this.addSoftwareDataForm.dataType
          });
        }
      });
    },
    makeSureUploadData() {
      if(this.activeTab == "first"){
        let data = {
          softwareDataModelList: JSON.parse(
            JSON.stringify(this.addSoftwareDataForm.uploadList)
          ),
          softwareVersionId: this.addSoftwareDataForm.softwareVersion
        };
        software.uploadSoftwareData(data).then(response => {
          if (response.code === 200) {
            this.$message.success("资料上传成功。");
            this.addSoftwareDataForm.visible = false;
            // 获取软件资料类型列表
            this.getCategoryList();
            // 获取软件资料列表
            this.changeTab();
            // 获取软件列表
            this.getSoftwareList();
          } else {
            this.$message.error("资料上传失败，请进行检查。");
          }
        });
      }else{
        this.$refs['addSoftwareDataForm'].validate((valid) => {
          if (valid) {

            let dataList = [];
            this.addSoftwareDataForm.uploadList.forEach((item) => {
                item.isView = this.addSoftwareDataForm.isView.join(',');
                dataList.push(item)
            })
            let data = {
                softwareDataModelList: JSON.parse(
                    JSON.stringify(dataList)
                )
            };

            // let data = {
            //   softwareDataModelList: JSON.parse(
            //     JSON.stringify(this.addSoftwareDataForm.uploadList)
            //   )
            // };
            software.uploadMore(data).then(response => {
              if (response.code === 200) {
                this.$message.success("资料上传成功。");
                this.addSoftwareDataForm.visible = false;
                // 获取软件资料类型列表
                this.getCategoryList();
                // 获取软件资料列表
                this.changeTab();
                // 获取软件列表
                this.getSoftwareList();
              } else {
                this.$message.error("资料上传失败，请进行检查。");
              }
            });
          }
        })
        
      }
      
    },
    judgeShowSoftwareData(value) {
      let fileType = value.substring(value.lastIndexOf(".") + 1);
      if (this.previewType.indexOf(fileType) === -1) {
        return false;
      } else {
        return true;
      }
      // if(fileType==="docx"){
      //   return true
      // }else{
      //   return false
      // }
    },
    async showSoftwareDataDialog(item) {

      let isExist =  await this.$download.isExistFile(item.paths,item.name);
      if( isExist===false) {
        return false;
      }

      let fileType = item.name.substring(item.name.lastIndexOf(".") + 1);
      switch (fileType) {
        case "docx":
          this.showSoftwareDataVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "doc":
          this.showSoftwareDataVisible = true;
          this.docPreview(item.id);
          this.typeJudge = 1;
          break;
        case "pdf":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "mp4":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 2;
          break;
        case "jpg":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
        case "png":
          this.showSoftwareDataVisible = true;
          this.previewUrl = config.url + "/appstore/" + item.paths;
          this.typeJudge = 3;
          break;
        // case '.pdf':
        //     this.pdfPreview(item.url)
        //     break;
        // case ".xlsx":
        //   this.xlsxPreview(item.id);
        //   break;
        // default:
        //   this.previewUrl = config.url + "/appstore/" + item.path;
        //   this.decide = 2;
        //   break;
      }
    },
    async docPreview(id) {
      console.log("docPreview");
      software.downloadSoftwareData(this.userInfo.userId, id).then(response => {
        // let blob = new Blob([response]);
        docx.renderAsync(response, this.$refs.preview);
        this.showSoftwareDataVisible = true;
      });
    },
    closeSoftwareDataDialog() {
      this.showSoftwareDataVisible = false;
    },
    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    openExamineDialog(item) {
      this.examineData = JSON.parse(JSON.stringify(item));
      this.examineVisible = true;
    },
    showCreateDate(ctime) {
      let date = new Date(parseInt(ctime));
      console.log(ctime, date);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    updateDocumentChange(file, fileList) {
      this.updateDocumentList = [];
      this.docForm.name = file.name;
      this.updateDocumentList.push(file);
    },
    selectUpdateDocument() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("updateDocumentButton").dispatchEvent(e);
    },
    handleTabClick() {
      if (this.dataStatus === "待审核") {
        this.documentStatus = 0;
      } else if (this.dataStatus === "已通过") {
        this.documentStatus = 1;
      } else if (this.dataStatus === "已驳回") {
        this.documentStatus = 2;
      }
      this.currentPage = 1;
      this.selectedDataList = []
      this.changeTab();
      this.tableKey = Math.random() * 1000
    },
    /**
     * 获取分类列表
     */
    getCategoryList() {
      category.getCategoryList("data_type").then(response => {
        if (response.code === 200) {
          // this.$message.success('added successfully')
          this.typeData = response.data.list;
        }
      });
    },
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
      }).catch(function(error) {
        console.log(error)
      })
    },
    buildTreeOptions(item) {
        let node = {
            id: item.id,
            name: item.name,
            label: item.name,
            children: [],
            selectable: true
        };
        if (item.children.length > 0) {
            node.selectable = false;
            for (let num = 0; num < item.children.length; num++) {
            node.children.push(this.buildTreeOptions(item.children[num]));
            }
        }
        return node;
    },

    /**
     * 获取软件列表
     */
    getSoftwareList() {
      software.getAllSoftware().then(response => {
        if (response.code === 200) {
          this.softwareList = response.data;
        }
      });
    },
    getSoftwareVersionById() {
      console.log("aaa");
      software
        .getSoftwareVersion(this.addSoftwareDataForm.dataSoftware)
        .then(response => {
          if (response.code === 200) {
            this.softwareVersionList = response.data;
          }
        });
    },
    /**
     * 获取软件资料列表
     */
    getSoftwareDataList() {
      let userId = null;
      if (localStorage.getItem("userType") != "admin"&&localStorage.getItem("userType") != "XTUser") {
        userId = this.userInfo.userId;
      }
      software
        .querySoftwareDataListByUser(
          userId,
          this.documentStatus,
          this.search.keyword,
          this.search.category,
          this.currentPage,
          this.pageSize
        )
        .then(response => {
          if (response.code === 200) {
            this.documentData = response.data.list;
            this.total = response.data.total;
          }
        });
    },
    /**
     * 重置搜索
     */
    resetSearch() {
      this.currentPage = 1;
      (this.search = {
        keyword: "",
        category: null
      }),
        this.changeTab();
    },
    downloadSoftwareDocument(row) {
      console.log(row, "downloadSoftwareDocument");
      software
        .downloadSoftwareData(this.userInfo.userId, row.id)
        .then(response => {
          const blob = new Blob([response]);
          download(blob, row.name, row.name.lastIndexOf(".") + 1);
        });
    },
    downloadFileByNameAndPath(name, path) {
      if (
        name == null ||
        name == undefined ||
        name.trim() == "" ||
        path == null ||
        path == undefined ||
        path.trim() == ""
      ) {
        return this.$message.error("文件未上传，请上传文件后再下载");
      } else {
        let fileType = path.substring(path.lastIndexOf("."));
        let nameType = name.substring(name.lastIndexOf("."));
        let filename = name;
        if (fileType !== nameType) {
          filename = filename + fileType;
        }
        let url = config.urlFilePrefix + path;
        this.$download.downloadSoftwareByUrlAndEditName(url, filename);
      }
    },
    /**
     * 更新软件资料
     */
    updateSoftwareData() {
      console.log(this.updateDocumentList[0], "this.updateDocumentList[0]");
      this.$confirm("确定要修改吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let formData = new FormData();
          let documentList = [];
          let documentInfoList = [];
          delete this.docForm.ctime;
          let data = Object.assign({}, this.docForm);
          console.log(data, "data and docform", this.docForm)
          if(data.isView != null){
            data.isView = data.isView.join(',');
          }

          documentInfoList.push(data);
          // documentInfoList.push(this.docForm);
          if (
            this.updateDocumentList.length > 0 &&
            this.updateDocumentList
          ) {
            const fileType = this.updateDocumentList[0].name.substring(
              this.updateDocumentList[0].name.lastIndexOf(".")
            );
            const acceptType = this.dataBeforeUploadCheck.split(",");
            if (acceptType.indexOf(fileType) === -1) {
              this.$message.error("该文件类型不是当前允许上传类型!");
              return Promise.reject(false);
            } else {
              // return true;
              let softwareDataStr = JSON.parse(
                JSON.stringify(documentInfoList[0])
              );
              if(softwareDataStr.status == 2) {
                softwareDataStr.status = 0
              }
              softwareDataStr.sizes = this.updateDocumentList[0].size + "";
              documentList.push(this.updateDocumentList[0].raw);
              formData.append("softwareDataFiles", documentList[0]);
              formData.append(
                "softwareDataStr",
                JSON.stringify(softwareDataStr)
              );
              formData.append("userId", this.userInfo.userId);
            }
          } else {
            // formData.append("softwareDataFiles", null);
            let softwareDataStr = JSON.parse(
              JSON.stringify(documentInfoList[0])
            );
            if(softwareDataStr.status == 2) {
              softwareDataStr.status = 0
            }
            formData.append(
              "softwareDataStr",
              JSON.stringify(softwareDataStr)
            );
            formData.append("userId", this.userInfo.userId);
          }
          software.updateSoftwareData(formData).then(response => {
            if (response.code === 200) {
              this.$message.success("软件资料更新成功");
              this.visibleDlg = false;
              this.changeTab();
            }
          });
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    decideExamineResult(sign) {
      this.$confirm("确定要提交审核结果吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(e => {
          console.log("a");
          let formData = new FormData();
          // let documentInfoList = {};
          formData.append("userId", this.userInfo.userId);
          if (sign === "pass") {
            this.examineData.status = 1;
          } else {
            this.examineData.status = 2;
          }
          this.examineData.ctime = null;
          // documentInfoList=JSON.parse(JSON.stringify(this.examineData));
          // formData.append("softwareDataStr", JSON.stringify(documentInfoList));
          formData.append("softwareDataStr", JSON.stringify(this.examineData));
          software.updateSoftwareData(formData).then(response => {
            if (response.code === 200) {
              this.$message.success("软件资料更新成功");
              this.examineVisible = false;
              this.changeTab();
            }
          });
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消"
          });
          console.log(error);
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

    /**
     * 获取软件资料类型列表
     */
    getSoftwareDataTypeList() {
      category.getCategoryList("data_type").then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list;
        }
      });
    },
    selectModuleAdd() {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.changeTab();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.changeTab();
    },
    handleEdit(row) {
      console.log(row, "handleEdit");
      software.getSoftwareDataOne(row.versionId).then(response => {
        console.log(response, "handleEdit");
      });
      this.visibleDlg = true;
      this.docForm = JSON.parse(JSON.stringify(row));
      if(this.parseStrEmpty(this.docForm.isView)!='') {
        this.docForm.isView = this.docForm.isView.split(',').map(Number);
      }
    },
    deleteItem(item) {
      this.$confirm("确定删除资料文件 " + item.name + " 吗？", "提示", {
        type: "warning"
      }).then(e => {
        software.deleteSoftwareData(item.id).then(response => {
          if (response.code === 200) {
            this.$message.success("删除成功");
            this.changeTab();
          } else {
            this.$message.error(response.msg);
          }
        });
      });
    },
    
    dataType(cate) {
      let type = null;
      this.typeData.map(item => {
        if (cate == item.id) {
          type = item.name;
        }
      });
      return type;
    }
  }
};
</script>
<style lang='scss' scoped>
.title {
  font-size: 12px;
  display: inline-block;
  width: 260px;
  border-left: 4px #409eff solid;
  height: 15px;
  line-height: 15px;
  padding-left: 5px;
}
el-card {
  border-radius: 4px;
  border: 0px solid #e6ebf5;
}
#docFormId .el-form-item {
  margin-bottom: 10px;
}
#documentIndex .el-form-item {
  margin-bottom: 0;
}
#addDataForSoftware .el-dialog {
  margin-top: 10vh;
}
.el-button.is-disabled {
  color: white;
  background: #c8c9cc;
  border-color: #c8c9cc;
}
::v-deep .tree-select-medium{
  height: 36px;
  line-height: 36px;
  top: 2px;
  .vue-treeselect__control{
    height: 32px;
  }
  .vue-treeselect__placeholder, .vue-treeselect__single-value {
    line-height: 32px;
  }
}
</style>
