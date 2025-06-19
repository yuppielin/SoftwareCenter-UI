<template>
  <div>
    <el-card class="custome custome-height">
      <div style="position: absolute;">
        <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
      </div>
      
      <div style="position: fixed;right: 35px;top: 100px;">
        <el-button
          class="stepButton"
          v-if="activeStep!==0&&activeStep!==4"
          @click="prev"
          type="warning"
          size="small"
        >上一步</el-button>
        <el-button
          class="stepButton"
          :disabled="userName!=='applicationUser' && userName!=='SHUser' "
          v-if="activeStep!==3&&activeStep!==4"
          @click="next"
          type="warning"
          size="small"
        >下一步</el-button>
        <!-- <el-button v-else-if="activeStep===3" @click="next" type="primary" size="small">提交</el-button> -->
        <el-button
          v-else-if="activeStep===3"
          @click="openReviewerDialog"
          type="primary"
          size="small"
        >提交</el-button>
      </div>
      <div class="inCardDiv">
        <el-row>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
          <el-col :span="22" style="position:relative">
            <div style="position: absolute;left: 89%;top: -15px;z-index: 9999;">
              <el-popover placement="bottom" width="1000" trigger="hover">
                <el-card style="text-align: center;border: 1px solid gray;" title="软件发布流程">
                  <h3>软件发布流程</h3>
                  <el-image :src="require('@/assets/fragment.png')" fit="fill"></el-image>
                </el-card>
                <span
                  style="font-size: 20px;margin-top: 20px;"
                  slot="reference"
                  class="el-icon-question"
                ></span>
              </el-popover>
            </div>
            <el-steps
              :active="activeStep"
              finish-status="success"
              style="margin: 20px 0"
              align-center
            >
              <el-step title="上传软件实体"></el-step>
              <el-step title="上传软件资料"></el-step>
              <el-step title="上传杀毒证明"></el-step>
              <el-step title="软件申请提交"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="1" style="border: 1px solid transparent;"></el-col>
        </el-row>
        <div v-show="activeStep === 0">
          <el-form id="systemNameForm">
            <el-form-item
              :rules="[{required:true,message:'系统名称不能为空',trigger:'blur'}]"
              label="系统名称："
              label-width="100px"
            >
              <el-input style="width: 50%;" v-model="taskForm.name" size="small"></el-input>
            </el-form-item>
            <el-form-item
              :rules="[{required:true,message:'软件分类不能为空',trigger:'blur'}]"
              label="软件分类："
              label-width="100px"
            >
              <treeselect
                :normalizer="normalizer"
                v-model="taskForm.service"
                noResultsText="暂无数据"
                :multiple="true"
                value-consists-of="ALL_WITH_INDETERMINATE"
                sort-value-by="INDEX"
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :options="softwareOptions"
                :show-count="true"
                :appendToBody="true"
                z-index="9999"
                placeholder="请选软件分类 "
                clearable
                :style="{ width: '50%' }"
                @select="selectChange"
              ></treeselect>
            </el-form-item>
          </el-form>
          <el-row class="headerTitle" style="margin-bottom:-20px;">
            <el-col :span="12" style="height: 40px;" class="uploadRow">
              <span style="margin-left: 20px;">软件列表</span>
            </el-col>
            <el-col :span="12" style="height: 40px;justify-content: flex-end;" class="uploadRow">
              <!-- 将上传组件全局注册 -->
              <global-uploader ref="globalUploader" />
              <el-button
                style="margin-right: 10px;"
                icon="el-icon-upload"
                type="primary"
                size="small"
                @click="basicSoftwareUpload"
              >上传软件</el-button>
            </el-col>
          </el-row>
          <el-table
            :header-cell-style="{height:'30px'}"
            :data="softwareData"
            :key="softwareTableKey"
            max-height="500px"
          >

            <el-table-column  type="expand">
              <template slot-scope="scoped">
                <el-table
                  :header-show="false"
                  :data="scoped.row.softwareVersionVolumes"
                  size="mini"
                  :header-cell-style="{height:'30px', padding:'0'}"
                  :cell-style="{height:'30px', padding:'0'}"
                >
                  <el-table-column label="分卷文件名称" prop="fileName" align="center"></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scopedSplit">
                        <el-button
                        type="text"
                        @click="deleteSoftwareFileSplit(scoped.row, scopedSplit.$index)"
                      ><span style="color: red;font-size: 15px;">删除</span></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>

            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="软件名称" prop="name" align="center">
              <template slot-scope="scoped">
                <span :title="scoped.row.fileName">{{ scoped.row.name }} <i v-if="scoped.row.softwareVersionVolumes && scoped.row.softwareVersionVolumes.length>0" style="font-size:12px">（分卷数:{{scoped.row.softwareVersionVolumes.length}}）</i> </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="软件分类" align="center"></el-table-column> -->
            <el-table-column label="软件版本" prop="version" align="center"></el-table-column>
            <el-table-column label="研制单位" prop="devUnit" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scoped">
                <el-button
                  type="text"
                  @click="getSoftwareInfo(scoped.row, scoped.$index)"
                ><span style="color: orange;font-size: 15px;">详情</span></el-button>
                <el-button
                  type="text"
                  @click="deleteSoftwareFile(scoped.row, scoped.$index)"
                ><span style="color: red;font-size: 15px;">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="activeStep === 1">
          <div style="border:1px solid lightgray">
            <el-row class="headerTitle" style="margin-bottom:0">
              <el-col :span="12" style="height: 40px;" class="uploadRow">
                <span>软件列表</span>
              </el-col>
              <el-col :span="12" style="height: 40px;justify-content: flex-end;" class="uploadRow">
                <el-button
                  style="margin-right: 10px;"
                  size="small"
                  icon="el-icon-upload"
                  type="primary"
                  @click="openUploadSoftwareData"
                >上传资料</el-button>
              </el-col>
            </el-row>
            <el-table
              :data="softwareDocumentData"
              max-height="500px"
              @selection-change="handleTableSelectionChange"
              @select="selectChangeData"
              ref="dataTable"
              :header-cell-style="{height:'30px'}"
            >
              <el-table-column
                type="expand"
                width="80"
                label="文档"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scopeExpand">
                  <el-table
                    :data="scopeExpand.row.softwareDatas"
                    size="mini"
                    :header-cell-style="{height:'30px'}"
                  >
                    <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                    <el-table-column
                      label="文件名称"
                      prop="name"
                      align="center"
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
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
                          style="width:200px;"
                          :multiple="false"
                          :appendToBody="true"
                          :options="dataTypeList"
                          :disable-branch-nodes="false"
                          :normalizer="normalizer"
                          :show-count="true"
                          placeholder="请选择资料类型"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="文件大小" prop="sizes" align="center">
                      <template slot-scope="scope">
                        <span v-text="showSizes(scope.row.sizes)"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scoped">
                        <!-- <el-button icon="el-icon-download" size="small">下载</el-button> -->
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteSoftwareDataFile(scopeExpand.row,scoped.$index)"
                        ><span style="color: red;font-size: 12px;">删除</span></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                label="序号"
                width="100"
                type="index"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                label="软件名称"
                prop="name"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                label="软件版本"
                prop="version"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column label="研制单位" prop="devUnit" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <div v-show="activeStep === 2">
          <el-form
            :model="softwareCertificateData[0]"
            ref="uploadCertificateForm"
            id="uploadCertificateForm"
            style="width: 80%;margin: 0 auto;"
          >
            <div style="border:1px solid lightgray">
              <div class="headerTitle">杀毒证明（系统）</div>
              <el-row class="uploadRow">
                <el-form-item
                  :rules="[{required:true,message:'未上传杀毒证明',trigger:'blur'}]"
                  prop="fileName"
                  label="杀毒证明："
                  style="width: 70%;"
                  label-width="100px"
                >
                  <el-input
                    size="small"
                    class="notClick"
                    v-model="softwareCertificateData[0].fileName"
                  ></el-input>
                </el-form-item>
                <el-button
                  @click="uploadSoftwareCertificate"
                  icon="el-icon-upload"
                  style="margin-left: 20px;"
                  size="small"
                  type="primary"
                >上传杀毒证明</el-button>
                <el-upload
                  accept=".gif, .bmp, .jpg, .png, .pdf, .docx"
                  style="display: none"
                  :multiple="false"
                  :action="uploadURL"
                  :http-request="uploadApplicationSoftwareCertificate"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="beforeApplicationSoftwareCertificateUpload"
                >
                  <el-button
                    slot="trigger"
                    id="softwareCertificateButton"
                    icon="el-icon-upload"
                    type="warning"
                    size="small"
                  >上传杀毒证明</el-button>
                </el-upload>
              </el-row>
              <el-form-item label=" " label-width="100px">
                <div class="el-upload__tip">支持格式：.gif, .bmp, .jpg, .png, .pdf,.docx</div>
              </el-form-item>
            </div>

            <div style="border:1px solid lightgray; margin-top:10px">
              <div class="headerTitle">安防证明（系统）</div>
              <el-row class="uploadRow">
                <el-form-item
                 
                  prop="fileNameAf"
                  label="安防证明："
                  style="width: 70%;"
                  label-width="100px"
                >
                  <el-input
                    size="small"
                    class="notClick"
                    v-model="afReport.fileName"
                  ></el-input>
                </el-form-item>
                <el-button
                  @click="uploadSoftwareAf"
                  icon="el-icon-upload"
                  style="margin-left: 20px;"
                  size="small"
                  type="primary"
                >上传安防证明</el-button>
                <el-upload
                  accept=".gif, .bmp, .jpg, .png, .pdf"
                  style="display: none"
                  :multiple="false"
                  :action="uploadURL"
                  :http-request="uploadApplicationSoftwareAf"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="beforeApplicationSoftwareAfUpload"
                >
                  <el-button
                    slot="trigger"
                    id="softwareAfButton"
                    icon="el-icon-upload"
                    type="warning"
                    size="small"
                  >上传杀毒证明</el-button>
                </el-upload>
              </el-row>
              <el-form-item label=" " label-width="100px">
                <div class="el-upload__tip">支持格式：.gif, .bmp, .jpg, .png, .pdf</div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-show="activeStep === 3">
          <el-form
            ref="taskThirdform"
            :model="taskThirdform"
            style="width:80%;margin: 0 auto;padding:0px"
            label-position="right"
            label-width="120px"
          >
            <div style="border:1px solid lightgray">
              <div class="headerTitle">选择试用单位</div>
              <el-form-item style="width: 70%;" label="试用单位：" prop="testDepartment" :rules="[{required:true, message: '请选择试用单位'}]">
                <treeselect
                  value-consists-of="LEAF_PRIORITY"
                  size="small"
                  :normalizer="normalizer"
                  v-model="testDepartment"
                  :multiple="true"
                  :limit="2"
                  :limitText="count => `及其它${count}项`"
                  :show-count="true"
                  :options="testDepartmentList"
                  placeholder="请选择试用单位"
                  :appendToBody="true"
                  :default-expand-level="1"
                ></treeselect>
              </el-form-item>
            </div>
            <div style="border:1px solid lightgray;margin-top:20px;">
              <div class="headerTitle">系统权限</div>
              <el-form-item style="width: 70%;" label="浏览权限：" prop="isView" :rules="[{required:true, message: '请选择浏览单位'}]">
                <treeselect
                  value-consists-of="ALL_WITH_INDETERMINATE"
                  sort-value-by="INDEX"
                  size="small"
                  :normalizer="normalizer"
                  v-model="isView"
                  :multiple="true"
                  :options="testDepartmentList"
                  placeholder="请选择可浏览单位"
                  :appendToBody="true"
                  :limit="2"
                  :limitText="count => `及其它${count}项`"
                  :show-count="true"
                  :default-expand-level="1"
                ></treeselect>
              </el-form-item>
              <el-form-item style="width: 70%;" label="下载权限：" prop="isDownload" :rules="[{required:true, message: '请选择下载单位'}]">
                <treeselect
                  value-consists-of="ALL_WITH_INDETERMINATE"
                  sort-value-by="INDEX"
                  size="small"
                  :normalizer="normalizer"
                  v-model="isDownload"
                  :multiple="true"
                  :options="testDepartmentList"
                  placeholder="请选择可下载单位"
                  :appendToBody="true"
                  :limit="2"
                  :limitText="count => `及其它${count}项`"
                  :show-count="true"
                  :default-expand-level="1"
                ></treeselect>
              </el-form-item>
            </div>
            </el-form>

            <el-form
              ref="announcementForm"
              :model="announcementForm"
              style="width:80%;margin: 0 auto;padding:0px"
              label-position="right"
              label-width="120px"
            >
            <div style="border:1px solid lightgray;margin-top:20px;">
              <div class="headerTitle">发布公告（系统）</div>
              <el-form-item :rules="[{required:true}]" label="发布公告：" style="width: 70%;">
                <el-row>
                  <el-radio v-model="announcementForm.judge" label="yes">是</el-radio>
                  <el-radio v-model="announcementForm.judge" label="no">否</el-radio>
                </el-row>
              </el-form-item>
              <el-form-item
                prop="title"
                :rules="[{required:announcementForm.judge === 'yes', message: '公告标题不能为空'}]"
                style="width: 70%;"
                v-show="announcementForm.judge === 'yes'"
                label="公告标题："
              >
                <el-input size="small" v-model="announcementForm.title" placeholder="请输入公告标题"></el-input>
              </el-form-item>
              <el-form-item
                prop="info"
                :rules="[{required:announcementForm.judge === 'yes', message: '请填写公告内容'}]"
                style="width: 70%;"
                v-show="announcementForm.judge === 'yes'"
                label="公告内容："
              >
                <el-input
                  size="small"
                  type="textarea"
                  :rows="5"
                  v-model="announcementForm.info"
                  placeholder="请输入公告内容"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="showAll"
                :rules="[{required:announcementForm.judge === 'yes', message: '请选择公告范围'}]"
                style="width: 70%;"
                label="公告范围："
                v-show="announcementForm.judge === 'yes'"
              >
                <el-radio v-model="announcementForm.showAll" :label="1">全部</el-radio>
                <el-radio v-model="announcementForm.showAll" :label="0">部分</el-radio>
              </el-form-item>
              <el-form-item
                prop="announcementUnit"
                :rules="[{required:announcementForm.judge === 'yes' && announcementForm.showAll == 0, message: '请选择公告组织'}]"
                style="width: 70%;"
                label="公告组织："
                v-show="announcementForm.judge === 'yes'&&announcementForm.showAll == 0"
              >
                <treeselect
                  size="small"
                  v-model="announcementForm.announcementUnit"
                  :multiple="true"
                  value-consists-of="ALL_WITH_INDETERMINATE"
                  sort-value-by="INDEX"
                  :normalizer="normalizer"
                  :options="testDepartmentList"
                  placeholder="请选择公告单位"
                  :appendToBody="true"
                  :limit="2"
                  :limitText="count => `及其它${count}项`"
                  :show-count="true"
                  :default-expand-level="1"
                ></treeselect>
              </el-form-item>
              <el-form-item
                prop="releaseDate"
                :rules="[{required:announcementForm.judge === 'yes', message: '请选择发布时间'}]"
                label="发布时间："
                v-show="announcementForm.judge === 'yes'"
              >
                <el-date-picker
                  style="width: 250px;"
                  v-model="announcementForm.releaseDate"
                  size="small"
                  type="datetime"
                  align="right"
                  format="yyyy-MM-dd  HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="公告日期"
                />
              </el-form-item>
              <el-form-item
                prop="linkman"
                :rules="[{required:announcementForm.judge === 'yes', message: '请填写联系人'}]"
                label="联系人："
                v-show="announcementForm.judge === 'yes'"
              >
                <el-input
                  style="width: 250px;"
                  v-model="announcementForm.linkman"
                  auto-complete="off"
                  maxlength="10"
                />
              </el-form-item>
              <el-form-item
                prop="linkmantel"
                :rules="[{required:announcementForm.judge === 'yes', message: '请填写联系方式'}]"
                label="联系方式："
                v-show="announcementForm.judge === 'yes'"
              >
                <el-input
                  style="width: 250px;"
                  v-model="announcementForm.linkmantel"
                  auto-complete="off"
                  maxlength="11"
                />
              </el-form-item>
              <el-form-item
                prop="publishDept"
                :rules="[{required:announcementForm.judge === 'yes', message: '请填写发布单位'}]"
                label="发布单位："
                v-show="announcementForm.judge === 'yes'"
              >
                <el-select
                  v-model="announcementForm.publishDept"
                  size="small"
                  style="width: 250px;"
                  filterable
                  reserve-keyword
                >
                  <el-option
                    v-for="(item,index) in publishDeptList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!--        <div class="dialog-footer" style="margin-top: 10px;">-->
        <!--          <el-row type="flex" justify="center">-->
        <!--            <el-button-->
        <!--              v-if="activeStep!==0&&activeStep!==4"-->
        <!--              @click="prev"-->
        <!--              type="warning"-->
        <!--              size="small"-->
        <!--            >上一步</el-button>-->
        <!--            <el-button-->
        <!--              :disabled="userName!=='applicationUser'"-->
        <!--              v-if="activeStep!==3&&activeStep!==4"-->
        <!--              @click="next"-->
        <!--              type="warning"-->
        <!--              size="small"-->
        <!--            >下一步</el-button>-->
        <!--            &lt;!&ndash; <el-button v-else-if="activeStep===3" @click="next" type="primary" size="small">提交</el-button> &ndash;&gt;-->
        <!--            <el-button v-else-if="activeStep===3" @click="openReviewerDialog" type="primary" size="small">提交</el-button>-->
        <!--          </el-row>-->
        <!--        </div>-->
      </div>
      <el-dialog title="软件详情" :visible.sync="softwareInfoVisible" :close-on-click-modal="false">
        <el-form
          style="width: 80%;margin: 0 auto;"
          :model="softwareForm"
          ref="softwareFormRef"
          label-position="right"
          label-width="110px"
        >
          <el-form-item label="软件名称：" prop="name" :rules="[{required:true,message:'系统名称不能为空',trigger:'blur'}]">
            <el-input size="small" style="width: 100%;" v-model="softwareForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item
            :rules="[{required:true,message:'软件分类不能为空',trigger:'change'}]"
            label="软件分类："
            prop="service"
          >
            <treeselect
              :normalizer="normalizer"
              v-model="softwareForm.service"
              noResultsText="暂无数据"
              :multiple="true"
              value-consists-of="ALL_WITH_INDETERMINATE"
              sort-value-by="INDEX"
              :limit="2"
              :limitText="count => `及其它${count}项`"
              :options="softwareOptions"
              :show-count="true"
              :appendToBody="true"
              z-index="9999"
              placeholder="请选软件分类 "
              clearable
              :style="{ width: '100%' }"
              @select="selectChange"
            ></treeselect>
          </el-form-item> -->
          <el-form-item prop="version" :rules="[{required:true,message:'软件版本不能为空',trigger:'blur'}]" label="软件版本：">
            <el-input size="small" style="width: 100%;" v-model="softwareForm.version"></el-input>
          </el-form-item>
          <el-form-item label="软件校验码：">
            <span>{{softwareForm.md5}}</span>
            <!-- <el-input class="notClick" v-model="softwareForm.md5" style="width: 80%;"></el-input> -->
          </el-form-item>
          <el-form-item prop="devUnit" :rules="[{required:true,message:'研制单位不能为空',trigger:'blur'}]" label="研制单位：">
            <el-input size="small" style="width: 100%;" v-model="softwareForm.devUnit"></el-input>
          </el-form-item>
          <el-form-item prop="offerUnitId" :rules="[{required:true,message:'提供单位不能为空',trigger:'blur'}]" label="提供单位：">
            <treeselect
              size="small"
              v-model="softwareForm.offerUnitId"
              :multiple="false"
              :normalizer="normalizer"
              :options="testDepartmentList"
              placeholder="请选择提供单位"
              :disable-branch-nodes="true"
              @select="getSelectOfferUnit"
            ></treeselect>
          </el-form-item>
          <!-- <el-form-item :rules="[{required:true,message:'描述不能为空',trigger:'blur'}]" label="软件Logo："> -->
          <el-form-item label="软件Logo：">
            <el-upload
              :auto-upload="true"
              class="upload-demo"
              action
              :show-file-list="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeUploadSoftwareLogoAndCover"
              :http-request="uploadSoftwareLogo"
              :multiple="false"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
            <el-image
              :key="logoKey"
              style="width: 80px;height: 80px;"
              v-if="softwareForm.logo!=null"
              :src="urlFilePrefix+softwareForm.logo"
              fit="fill"
            />
          </el-form-item>
          <el-form-item label="软件封面：">
            <el-upload
              :auto-upload="true"
              list-type="picture"
              action="#"
              :show-file-list="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeUploadSoftwareLogoAndCover"
              :http-request="uploadSoftwarePic"
              :multiple="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
            <el-image
              :key="picKey"
              v-if="softwareForm.pic!=null"
              :src="urlFilePrefix+softwareForm.pic"
              fit="cover"
            />
          </el-form-item>
          <el-form-item :rules="[{required:true,message:'软件描述不能为空',trigger:'blur'}]" label="软件描述：">
            <el-input
              size="small"
              type="textarea"
              :rows="5"
              style="width: 100%;"
              v-model="softwareForm.description"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center" style="margin-top: 10px">
          <el-button type="info" size="small" @click="softwareInfoVisible=false">取消</el-button>
          <el-button type="primary" size="small" @click="editSoftwareInfo">确定</el-button>
        </el-row>
      </el-dialog>
      <el-dialog title="资料上传" :visible.sync="uploadSoftwareDataVisible" width="40%">
        <el-form :model="uploadSoftwareDataForm" label-width="150px" label-position="right">
          <el-row>
            <el-form-item
              :rules="[{required:true,message:'软件不能为空',trigger:'blur'}]"
              label="选择软件："
              prop="softwareName"
            >
              <el-select
                v-model="uploadSoftwareDataForm.selectedSoftwareId"
                @change="changeSelectedSoftware"
                filterable
                placeholder="请选择软件"
                style="width: 200px;"
              >
                <el-option
                  v-for="(item, index) in softwareDocumentData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :rules="[{required:true,message:'类型不能为空',trigger:'change'}]"
              label="文件类型："
              prop="softwareUploadDataType"
            >
              <treeselect
                v-model="uploadSoftwareDataForm.softwareUploadDataType"
                style="width:200px;float:left"
                :multiple="false"
                :appendToBody="true"
                :options="dataTypeList"
                :disable-branch-nodes="false"
                :normalizer="normalizer"
                z-index="9999"
                :show-count="true"
                placeholder="请选择资料类型"
                @select="changeSelectedDataType"
                :style="{ width: '200px' }"
              />
            </el-form-item>
          </el-row>
          <el-row class="uploadRow" style="align-items: normal;">
            <el-form-item
              :rules="[{required:true,message:'软件不能为空',trigger:'blur'}]"
              style="width: 70%;"
              label="上传资料："
              prop="softwareName"
            >
              <el-upload
                :disabled="judgeUploadSoftwareData()"
                ref="dataUpload"
                action="#"
                :multiple="true"
                :file-list="dataFileList"
                :show-file-list="true"
                :auto-upload="true"
                :on-change="dataFileListChange"
                :on-remove="dataFileListRemove"
                :before-upload="beforeApplicationSoftwareDocumentUpload"
                :http-request="uploadApplicationSoftwareDocument"
                :accept="dataBeforeUploadCheck"
              >
                <el-button
                  :disabled="judgeUploadSoftwareData()"
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
          </el-row>
          <el-row style="text-align: center;">
            <el-button size="small" type="primary" @click="uploadSoftwareDataVisible=false">完成上传</el-button>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog :title="reviewerForm.title" :visible.sync="reviewerForm.dialogVisible">
        <el-form
          :model="reviewerForm"
          ref="reviewerFormRef"
          label-width="100px"
          label-position="right"
        >
          <el-form-item
            label="上传人："
            prop="reviewerName"
            :rules="[{required:true,message:'上传人姓名不能为空',trigger:'blur'}]"
          >
            <el-input
              style="width: 80%;"
              maxlength="10"
              v-model="reviewerForm.reviewerName"
              placeholder="请输入上传人真实姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系方式："
            prop="telphone"
            :rules="[{required:true,message:'联系方式不能为空',trigger:'blur'}]"
          >
            <el-input
              style="width: 80%;"
              maxlength="11"
              v-model="reviewerForm.telphone"
              placeholder="请输入上传人联系方式"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row style="text-align:center">
          <el-button size="small" type="primary" @click="clickReviewButton('pass')">通过</el-button>
          <el-button
            size="small"
            style="background-color: white;border: 1px solid gray;"
            @click="clickReviewButton('cancel')"
          >取消</el-button>
        </el-row>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as category from "@/api/category";
import * as organization from "@/api/organization";
import * as softwareTaskApi from "@/api/software-task"; //软件任务接口
import * as softwareApi from "@/api/software";
// 软件上传
import globaluploader from "@/components/VueSimpleUploader/GlobalUploader";
import Bus from "@/components/VueSimpleUploader/js/bus";
import * as application from "@/api/application";
// import * as appConfig from "/public/config";
import { constantRoutes } from "../../../router";
import { isArray } from '../../../utils/validate';

export default {
  components: {
    Treeselect: Treeselect,
    "global-uploader": globaluploader
  },
  data() {
    return {
      userInfo: {},
      taskForm: {
        id: null,
        name: "",
        service: []
      },
      testDepartment: [],
      testDepartmentList: [],
      announcementForm: {
        judge: "yes",
        title: "xxx软件发布公告",
        info: "xxx软件发布，请下载使用",
        announcementUnit: [],
        releaseDate: "",
        showAll: 1
      },
      publishDeptList: [],
      uploadSoftwareVisible: false,
      uploadSoftwareForm: {
        JSONFileId: 0,
        JSONFileName: "",
        softwareId: 0,
        softwareName: ""
      },
      softwareData: [],
      clickIndex: 0,
      softwareTableKey: 0,
      softwareInfoVisible: false,
      softwareForm: {
        id: null,
        name: "",
        service: [],
        version: "",
        md5: "",
        devUnit: "",
        offerUnit: "",
        offerUnitId: 0,
        logo: null,
        pic: null,
        description: "",
        fileName: "",
        path: "",
        size: null,
        versionId: null
      },
      softwareDetailShow: false,
      selectedSoft: {},
      feedbackData: {
        unreadCount: 0,
        feedbackInfoTable: []
      },
      userName: "user",
      activeStep: 0,
      softwareSearchForm: {
        softwareName: "",
        version: "",
        fragmentType: "",
        prefix: "",
        devUnit: "",
        service: null,
        description: ""
      },
      softwareOptions: [],
      dataTypeList: [],
      softwareDocumentData: [],
      selectedSoftwareList: [],
      softwareCertificateData: [
        {
          path: null,
          fileName: ""
        }
      ],
      uploadURL: "127.0.0.1",

      uploadSoftwareDataVisible: false,
      uploadSoftwareDataForm: {
        selectedSoftwareId: null,
        softwareUploadDataType: []
      },
      dataFileList: [],
      systemId: null,
      systemStep: 0,

      logoKey: 0,
      picKey: 0,
      urlFilePrefix: config.urlFilePrefix,

      isView: [],
      isDownload: [],

      reviewerForm: {
        title: null,
        dialogVisible: false,
        reviewerName: "",
        telphone: null
      },
      dataBeforeUploadCheck: appConfig.config.softwareDataUploadCheckType,
      afReport: {
        path: '',
        fileName: ""
      },
      taskThirdform:{},
    };
  },
  created() {
    var splitFile = {}
    var selectedFiles = []
    Bus.addedFiles = []
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
      
      // 给子组件验证文件重复数据开始
      let filesList = [];
      this.softwareData.forEach((item, index) => {
        filesList.push(item.fileName);
        if(item.softwareVersionVolumes) {
          item.softwareVersionVolumes.forEach((volume, indexVol) => {
            filesList.push(volume.fileName)
          })
        }
      })
      Bus.addedFiles = filesList;
      // 给子组件验证文件重复数据结束

    });
    // 文件上传成功后的回调
    Bus.$on("successFile", file => {
      console.log("文件上传成功！！", file);
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let softwareInfo = file;
      softwareInfo.offerUnitId = this.userInfo.organizationId;
      softwareInfo.offerUnit = this.userInfo.organization;
      // this.softwareData.push(JSON.parse(JSON.stringify(softwareInfo)));

      // 根据文件名、文件后缀 组合 分卷压缩的文件
      var baseFileName = file.fileName.slice(0, file.fileName.lastIndexOf("."));
      if(/^.*\.[z|Z]\d+$/.test(file.fileName)) { // 分片
        //  console.log(file.fileName, 99999)
        if (splitFile[baseFileName] == undefined) {
          splitFile[baseFileName] = [];
        }
        splitFile[baseFileName].push({
          fileName: file.fileName,
          paths: file.path,
          sizes: file.size,
          md5: file.md5
        })
      }else{
        this.softwareData.push(JSON.parse(JSON.stringify(softwareInfo)));
      }
      this.softwareData.forEach((item, index) => {
        var baseFileName = item.fileName.slice(0, item.fileName.lastIndexOf("."));
        if (splitFile[baseFileName] !== undefined) {
          let assignObj = [];
         
          if(this.softwareData[index].softwareVersionVolumes){
            assignObj= this.softwareData[index].softwareVersionVolumes.concat(splitFile[baseFileName]);
            delete splitFile[baseFileName];
          }else{
            assignObj= [].concat(splitFile[baseFileName]);
            delete splitFile[baseFileName];
          }
          //  console.log("===========", this.softwareData[index].softwareVersionVolumes,"====",splitFile[baseFileName],"====",assignObj);
          this.$set(this.softwareData[index], "softwareVersionVolumes", assignObj)
        }
      })
    });
  },
  beforeDestroy() {
    Bus.$off("fileAdded");
    Bus.$off("successFile");
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    await this.getSoftwareDataTypeList();
    await this.getTestDepartmentList();
    await this.getSoftwareTypeList();
    await this.getPublishDeptList();
    this.userName = localStorage.getItem("userType");
    if (this.userName === undefined || this.userName === null) {
      this.userName = "user";
    }
    this.systemId = localStorage.getItem("systemId");
    console.log("this.systemId", this.systemId);
    if (this.systemId != 0 && this.systemId != "0") {
      await this.getSoftwareTaskDetail(this.systemId);
      this.activeStep = this.systemStep;
    }
  },
  methods: {
    getSoftwareInfo(item, index) {
      console.log(item);
      this.softwareForm = null;
      this.clickIndex = index;
      // item.logo = null
      // item.pic = null
      this.softwareForm = JSON.parse(JSON.stringify(item));
      this.softwareInfoVisible = true;
    },
    editSoftwareInfo() {
      this.$confirm("要保存修改后的软件信息吗", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$refs["softwareFormRef"].validate(valid => {
            if (valid) {
              // if (
              //   this.softwareForm.logo == null ||
              //   this.softwareForm.logo == undefined ||
              //   this.softwareForm.logo.trim() == ""
              // ) {
              //   this.$message.info("请上传logo！！");
              // } else {
                this.softwareData[this.clickIndex] = JSON.parse(
                  JSON.stringify(this.softwareForm)
                );
                this.softwareInfoVisible = false;
                this.softwareTableKey = this.softwareTableKey + 1;
                console.log(this.softwareData, "softwareData");
              // }
            }
          });
        })
        .catch((err) => {
          console.log(err)
          this.$message({
            type: "info",
            message: "继续修改"
          });
        });
    },
    deleteSoftwareFile(item, index) {
      let data = {
        softwareId: item.id,
        id: item.versionId,
        paths: item.paths
      };
      softwareTaskApi.deleteUploadSoftware(data).then(response => {
        if (response.code === 200) {
          this.softwareData.splice(index, 1);
        }
      });
    },
    deleteSoftwareFileSplit(item, index) {
      let data = {
        id: item.softwareVersionVolumes[index].id,
        versionId: item.versionId,
        paths: item.softwareVersionVolumes[index].paths
      };
      softwareTaskApi.deleteUploadSoftwareVolumes(data).then(response => {
        if (response.code === 200) {
          item.softwareVersionVolumes.splice(index, 1)
        }
      });
    },
    clickReviewButton(sign) {
      if (sign === "pass") {
        this.$refs.reviewerFormRef.validate(valid => {
          if (valid) {
            this.next();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.reviewerForm.dialogVisible = false;
      }
    },
    openReviewerDialog() {
      this.$set(this.taskThirdform,'testDepartment',this.testDepartment)
      this.$set(this.taskThirdform,'isView',this.isView)
      this.$set(this.taskThirdform,'isDownload',this.isDownload)
      
      this.$refs.taskThirdform.validate((valid) => {
        if(valid) {
            this.$refs.announcementForm.validate((valid) => {
              if(valid) {
                this.reviewerForm = {
                  title: "软件上传阶段上传人信息填写",
                  dialogVisible: true,
                  reviewerName: "",
                  telphone: null
                };
              }
            })  
        }
      })  
      
    },
    beforeUploadSoftwareLogoAndCover(file) {
      let fileSize = file.size / 1024 / 1024;
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const acceptType = ["gif", "jpg", "png"];
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("当前允许上传类型为gif,jpg,png!");
        return Promise.reject(false);
      } else if (fileSize > 10) {
        this.$message.error("当前允许上传大小为10M!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    uploadSoftwareLogo(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          // this.softwareForm.logo = response.data.fileName;
          this.$set(this.softwareForm, 'logo', response.data.fileName)
          // console.log(this.softwareForm, this.softwareForm.logo);
          this.logoKey = this.logoKey + 1;
        }
      });
    },
    uploadSoftwarePic(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        console.log(response);
        if (response.code === 200) {
          // this.softwareForm.pic = response.data.fileName;
          this.$set(this.softwareForm, 'pic', response.data.fileName)
          // console.log(this.softwareForm, this.softwareForm.pic);
          this.picKey = this.picKey + 1;
        }
      });
    },
    judgeUploadSoftwareData() {
      if (
        this.uploadSoftwareDataForm.selectedSoftwareId == null ||
        this.uploadSoftwareDataForm.selectedSoftwareId == undefined
      ) {
        return true;
      } else if (
        this.uploadSoftwareDataForm.softwareUploadDataType == null ||
        this.uploadSoftwareDataForm.softwareUploadDataType == undefined
      ) {
        return true;
      } else {
        return false;
      }
    },
    changeSelectedSoftware() {
      this.dataFileList = [];
      this.uploadSoftwareDataForm.softwareUploadDataType = null;
    },
    changeSelectedDataType() {
      this.dataFileList = [];
    },
    clickUploadSoftwareData() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("uploadSoftwareButton").dispatchEvent(e);
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
    getSoftwareDataTypeList() {
      category.getCategoryList("data_type", null, null).then(response => {
        if (response.code === 200) {
          this.dataTypeList = response.data.list;
        }
      });
    },
    getTestDepartmentList() {
      organization.getOrganization().then(response => {
        if (response.code === 200) {
          let softwareTypeArray = response.data;
          this.testDepartmentList = [];
          if (softwareTypeArray.length > 0) {
            softwareTypeArray.forEach(element => {
              let item = this.buildTreeOptions(element);
              // console.log(item);
              this.testDepartmentList.push(item);
            });
          }
        }
      });
    },
    buildTreeOptions(item) {
      console.log("sss");
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
      console.log(node);
      return node;
    },
    getSelectOfferUnit(item) {
      console.log("getSelectOfferUnit", item);
      this.softwareForm.offerUnit = item.name;
    },
    getSoftwareTypeList() {
      category.getCategoryList("service", null, null).then(response => {
        if (response.code === 200) {
          this.softwareOptions = response.data.list;
          // this.softwareOptions = [];
          // if (softwareTypeArray.length > 0) {
          //   softwareTypeArray.forEach(element => {
          //     let item = this.buildTreeOptions(element);
          //     console.log(item);
          //     this.softwareOptions.push(item);
          //   });
          // }
          console.log(this.softwareOptions, "this.softwareOptions");
        }
      });
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: [],
        selectable: false
      };
      if (item.children.length > 0) {
        node.selectable = true;
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      return node;
    },
    getPublishDeptList() {
      category
        .getCategoryList("notice_publish_dept", null, null)
        .then(response => {
          this.publishDeptList = response.data.list;
        });
    },
    uploadSoftwareCertificate() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("softwareCertificateButton").dispatchEvent(e);
    },
    handlePreview(file) {},
    handleRemove(file) {},
    handleFileUpload() {},
    handleFileBeforeUpload() {},
    uploadBasicSoftware(item) {
      debugger;
      // this.uploadSoftwareVisible = !this.uploadSoftwareVisible;
      // 打开文件选择框
      Bus.$emit("openUploader", {
        // 给服务端的额外参数
        params: {
          // page: 'home'
        },
        options: {
          target: config.url + "/appstore/upload/fileUpload",
          singleFile: true,
          accept: [".zip", ".tar", ".rar", ".iso"]
        }
      });
    },
    handleTableSelectionChange(val) {
      this.selectedSoftwareList = val;
    },
    selectChange(val) {
      console.log(val);
    },
    selectChangeData(selection) {
      this.selectedSoftwareList = [];
      console.log(selection);
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.dataTable.toggleRowSelection(del_row, false);
      }
      console.log(this.selectedSoftwareList, this.softwareDocumentData);
    },
    dataFileListChange(file, fileList) {
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name);
      if (existFile) {
        this.$message.error("文件已存在");
        fileList.pop();
      }
      this.dataFileList = fileList;
    },
    dataFileListRemove(file, fileList) {
      let tempFileList = [];
      for (var index = 0; index < this.dataFileList.length; index++) {
        if (this.dataFileList[index].name !== file.name) {
          tempFileList.push(this.dataFileList[index]);
        }
      }
      this.dataFileList = tempFileList;
    },
    showSoftInfo(item, index) {
      console.log(item, index);
      this.selectedSoft = item;
      this.clickIndex = index;
      this.softwareDetailShow = !this.softwareDetailShow;
    },
    basicSoftwareUpload() {
      // 打开文件选择框
      Bus.$emit("openUploader", {
        // 给服务端的额外参数
        params: {
          // page: 'home'
        },
        options: {
          target: config.url + "/appstore/upload/fileUpload",
          accept: [".zip",".z*", ".tar"]
        }
      });
    },
    deleteSoftwareDataFile(softwareItem, index) {
      softwareItem.softwareDatas.splice(index, 1);
    },
    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    openUploadSoftwareData() {
      this.dataFileList = [];
      this.uploadSoftwareDataForm = {
        selectedSoftwareId: null,
        softwareUploadDataType: null
      };
      console.log(this.dataTypeList, "dataTypeList");
      this.uploadSoftwareDataVisible = true;
    },
    beforeApplicationSoftwareDocumentUpload(file) {
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
    uploadApplicationSoftwareDocument(params) {
      console.log("application", params);
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          for (let num = 0; num < this.softwareDocumentData.length; num++) {
            if (
              this.softwareDocumentData[num].id ===
              this.uploadSoftwareDataForm.selectedSoftwareId
            ) {
              this.softwareDocumentData[num].softwareDatas.push({
                paths: response.data.fileName,
                name: response.data.originalFilename,
                sizes: file.size,
                category: this.uploadSoftwareDataForm.softwareUploadDataType
              });
              break;
            }
          }
        }
      });
    },
    beforeApplicationSoftwareCertificateUpload(file) {
      console.log("aaaaa", file);
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const acceptType = ["gif", "bmp", "jpg", "png", "pdf", "docx"];
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    uploadApplicationSoftwareCertificate(params) {
      console.log("application", params);
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.softwareCertificateData[0].fileName =
            response.data.originalFilename;
          this.softwareCertificateData[0].path = response.data.fileName;
        }
      });
    },
    deleteSoftwareCertificate(id) {},
    uploadSoftwareAf() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("softwareAfButton").dispatchEvent(e);
    },
    uploadApplicationSoftwareAf(params) {
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          this.afReport.fileName = response.data.originalFilename;
          this.afReport.path = response.data.fileName;
        }
      });
    },
    beforeApplicationSoftwareAfUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const acceptType = ["gif", "bmp", "jpg", "png", "pdf"];
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    prev() {
      if (this.activeStep == 1) {
        this.activeStep = 0;
      } else if (this.activeStep == 2) {
        this.activeStep = 1;
      } else if (this.activeStep == 3) {
        this.activeStep = 2;
      }
    },
    next() {
      if (this.activeStep == 0) {
        // console.log(this.softwareForm);
        if (
          this.taskForm.name === null ||
          this.taskForm.name === undefined ||
          this.taskForm.name.trim() === ""
        ) {
          return this.$message.info("请输入系统名称");
        }
        if (this.softwareData.length === 0) {
          return this.$message.info("请上传软件");
        }
        if (this.taskForm.service === 0) {
          return this.$message.info("请选择软件分类");
        }
        for (let i = 0; i < this.softwareData.length; i++) {
          console.log(this.softwareData[i]);
          if (
            this.softwareData[i].name === null ||
            this.softwareData[i].name === undefined ||
            this.softwareData[i].name.trim() === ""
          ) {
            return this.$message.info("第" + (i + 1) + "个软件名称未填写，请点击详情填写");
          }
          if (
            this.softwareData[i].devUnit === null ||
            this.softwareData[i].devUnit === undefined ||
            this.softwareData[i].devUnit.trim() === ""
          ) {
            return this.$message.info(
              "软件" + this.softwareData[i].name + "研制单位信息未填写，请点击详情填写"
            );
          }
          if (
            this.softwareData[i].version === null ||
            this.softwareData[i].version === undefined ||
            this.softwareData[i].version.trim() === ""
          ) {
            return this.$message.info(
              "软件" + this.softwareData[i].name + "版本信息未填写，请点击详情填写"
            );
          }
          if (
            this.softwareData[i].offerUnitId === null ||
            this.softwareData[i].offerUnitId === undefined ||
            this.softwareData[i].offerUnitId === ""
          ) {
            return this.$message.info(
              "软件" + this.softwareData[i].name + "提供单位未填写，请点击详情填写"
            );
          }
          if (
            this.softwareData[i].description === null ||
            this.softwareData[i].description === undefined ||
            this.softwareData[i].description.trim() === ""
          ) {
            return this.$message.info(
              "软件" + this.softwareData[i].name + "描述信息未填写，请点击详情填写"
            );
          }
        }
        console.log(
          JSON.parse(JSON.stringify(this.softwareData)),
          "this.softwareData"
        );
        let data = JSON.parse(JSON.stringify(this.softwareData));
        let softwareList = data.map(function(item) {
          // console.log(item.cpu, "item.cpu");
          // item.service = item.service.join(",");
          // if(typeof item.cpu === "")
          item.cpu = isArray(item.cpu) ? item.cpu.join(",") : '';
          return item;
        });
        // console.log(this.softwareData, this.taskForm);
        let judgeTask = this.taskForm.id !== null ? false : true;
        console.log(this.taskForm, 9999999);
        let taskData = {
          id: this.taskForm.id !== null ? this.taskForm.id : null,
          name: this.taskForm.name,
          taskUploadType: 1,
          service: this.taskForm.service.join(","),
          softwareVoList: softwareList
        };
        this.$modal.loading();
        softwareTaskApi.addTaskWithSoftware(taskData).then(async response => {
          // console.log(response);
          if (response.code === 200) {
            await this.getSoftwareTaskDetail(response.data.id); // 任务信息
            this.activeStep = 1;
          }
          this.$modal.closeLoading();
        }).catch(err => {
          this.$modal.closeLoading();
        })
        // } else {
        //   console.log("error submit!!");
        //   return this.$message.info("请输入系统信息");;
        // }
        // })
      } else if (this.activeStep == 1) {
        let documentData = {
          id: this.taskForm.id,
          softwareVersionList: []
        };
        for (let num = 0; num < this.softwareDocumentData.length; num++) {
          documentData.softwareVersionList.push({
            id: this.softwareDocumentData[num].versionId,
            softwareId: this.softwareDocumentData[num].id,
            softwareDataList: JSON.parse(
              JSON.stringify(this.softwareDocumentData[num].softwareDatas)
            )
          });
        }
        softwareTaskApi
          .uploadSoftwareData(documentData)
          .then(async response => {
            console.log(response);
            if (response.code === 200) {
              await this.getSoftwareTaskDetail(this.taskForm.id);
              this.activeStep = 2;
            }
          });
      } else if (this.activeStep == 2) {
        this.$refs["uploadCertificateForm"].validate(valid => {
          if (valid) {
            let data = {
              id: this.taskForm.id,
              sdCertificate: JSON.stringify(this.softwareCertificateData[0])
            };

            if(this.afReport.path!=null && this.afReport.path!="") {
              data.afReport =  JSON.stringify(this.afReport)
            }
            softwareTaskApi.addSoftwareAntivirus(data).then(async response => {
              console.log(response);

              if (response.code === 200) {
                await this.getSoftwareTaskDetail(this.taskForm.id);
                this.activeStep = 3;
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.activeStep == 3) {
        this.$confirm("请确认本次提交已包含全部待审批的软件", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let data = {
              id: this.taskForm.id, //任务ID
              stage: 2,
              status: 0,
              isNotice: this.announcementForm.judge === "yes" ? "1" : "0", // 是否接收公告 0 否 1是
              isView: this.isView.join(","),
              isDownload: this.isDownload.join(","),
              syUnitId: this.testDepartment.join(","),
              notice: {
                title: this.announcementForm.title,
                source: this.userInfo.realName,
                reciever: this.announcementForm.announcementUnit.join(","), //接收单位
                content: this.announcementForm.info,
                releaseDate: this.announcementForm.releaseDate,
                showAll: this.announcementForm.showAll,
                linkman: this.announcementForm.linkman,
                linkmantel: this.announcementForm.linkmantel,
                publishDept: this.announcementForm.publishDept
              },
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            };
            softwareTaskApi.addSoftwareApply(data).then(async response => {
              if (response.code === 200) {
                await this.getSoftwareTaskDetail(this.taskForm.id);
                this.activeStep = 4;
                this.$router.push({ path: "/admin/softwareUpload/showStatus" });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    addSoftwareTask() {},
    showCollapse() {},
    async getSoftwareTaskDetail(taskId) {
      await softwareTaskApi.getSoftwareTaskDetail(taskId).then(response => {
        console.log("getSoftwareTaskDetail", response);
        if (response.code == 200) {
          let systemData = JSON.parse(JSON.stringify(response.data));
          this.systemStep = systemData.uploadStep;
          let service = systemData.service;
          this.taskForm = {
            id: systemData.id,
            name: systemData.name,
            service: systemData.service.split(",")
          };
          this.softwareData = JSON.parse(
            JSON.stringify(systemData.softwareVoList)
          );

          let softwareDocumentDataList = JSON.parse(
            JSON.stringify(systemData.softwareVoList)
          );
          for (let i = 0; i < softwareDocumentDataList.length; i++) {
            let dataList = JSON.parse(
              JSON.stringify(softwareDocumentDataList[i].softwareDatas)
            );
            softwareDocumentDataList[i].softwareDatas = [];
            if (dataList != null && dataList != undefined) {
              for (let n = 0; n < dataList.length; n++) {
                softwareDocumentDataList[i].softwareDatas.push({
                  id: dataList[n].id,
                  name: dataList[n].name,
                  sizes: dataList[n].sizes,
                  paths: dataList[n].paths,
                  category: dataList[n].category
                });
              }
            }
          }
          this.softwareDocumentData = JSON.parse(
            JSON.stringify(softwareDocumentDataList)
          );

          let sdCertificate = systemData.sdCertificate;
          if (sdCertificate === null) {
            this.softwareCertificateData = [
              {
                path: null,
                fileName: ""
              }
            ];
          } else {
            this.softwareCertificateData = [];
            this.softwareCertificateData.push(JSON.parse(sdCertificate));
          }

          let afCertificate = systemData.afReport;
          if (afCertificate === null) {
            this.afReport = {
                path: "",
                fileName: ""
              };
          } else {
            this.afReport = JSON.parse(afCertificate);
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.headerTitle {
  border-left: 4px #409eff solid;
  line-height: 40px;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  background: #c5d7e9;
  margin-bottom: 20px;
}
.uploadRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.inCardDiv {
  margin: 20px;
}
.notClick {
  pointer-events: none;
}
#uploadCertificateForm .el-form-item {
  margin-bottom: 0;
}
#softwareSearchForm .el-form-item {
  margin-bottom: 0;
}
// #systemNameForm .el-form-item {
//   margin-bottom: 10px;
// }
/* ::v-deep .el-form-item--medium .el-form-item__content{
  line-height: 16px;
} */
::v-deep .el-step__head.is-process .el-step__icon-inner {
  color: #fff !important;
}
::v-deep .el-step__head.is-success .el-step__icon-inner {
  color: #fff !important;
}
::v-deep .el-step__head.is-process .el-step__icon {
  background: rgba(23, 138, 227, 1) !important;
}
::v-deep .el-step__head.is-success .el-step__icon {
  background: rgba(23, 138, 227, 1) !important;
}
::v-deep .el-step__icon-inner {
  color: rgba(52, 55, 74, 1) !important;
  font-weight: normal;
}
::v-deep .el-step__icon {
  border-color: rgba(23, 138, 227, 1) !important;
}
::v-deep .el-step__title {
  font-size: 15px;
  // font-family: "思源黑体";
}
::v-deep .el-step__title.is-process {
  color: rgba(23, 138, 227, 1);
}
::v-deep .el-step__title.is-success {
  color: rgba(23, 138, 227, 1);
}
::v-deep .upload-circle {
  width: 200px;
  height: 150px;
  line-height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  text-align: center;
  margin-left: 50px;
}
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
  border-top: 1px dashed rgba(166, 166, 166, 1);
  width: 120%;
}
.stepButton .el-button,
.stepButton .el-button:hover {
  background: rgba(23, 138, 227, 1);
  border: none;
}
::v-deep .el-form-item--medium .el-form-item__label {
  font-size: 15px;
  // font-family: "思源黑体";
}
// :v-deep .el-table th > .cell{
//   font-size: 15px;
//   font-family: "黑体";
// } 
</style>
<style scoped>
::v-deep .el-button--text {
  font-size: 15px !important;
}
</style>
