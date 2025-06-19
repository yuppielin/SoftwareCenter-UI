<template>
  <div>
    <el-card class="custome custome-height">
      <div class="inCardDiv">
        <el-row>
          <el-col :span="18">
            <div
              style="width:240px;font-size:10px;margin:10px 0;background:lightgray;padding:2px 5px;text-align:center;border-radius:4px;"
            >
              <span style="font-size:10px;">图示：</span>
              <div style="display:inline-block;margin-left:10px;">
                <div
                  style="height:10px;width:10px;background: green;border-radius: 50%;display:inline-block;"
                ></div>
                <span style="font-size:10px;margin-left:5px;">通过</span>
              </div>
              <div style="display:inline-block;margin-left:20px;">
                <div
                  style="height:10px;width:10px;background: #ff5a5a;border-radius: 50%;display:inline-block;"
                ></div>
                <span style="font-size:10px;margin-left:5px;">未通过</span>
              </div>
              <div style="display:inline-block;margin-left:20px;">
                <div
                  style="height:10px;width:10px;background: #ffe000;border-radius: 50%;display:inline-block;"
                ></div>
                <span style="font-size:10px;margin-left:5px;">进行中</span>
              </div>
            </div>
            <el-row>
              <div
                style="height: 40px;width: 450px;display: flex;background:url(jietu.PNG) no-repeat;background-size: contain;"
              >
                <el-tooltip placement="bottom" effect="light" style="margin-top:-5px;">
                  <div slot="content">
                    <div style="text-align: right;margin-bottom: 10px;display: flex;">
                      <div style="width: 120px;">软件上传：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[0].item[0]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                    <div style="text-align: right;margin-bottom: 10px;display: flex;">
                      <div style="width: 120px;">检测申请审核：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[0].item[1]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                    <div style="text-align: right;margin-bottom: 10px;display: flex;">
                      <div style="width: 120px;">检测任务下达：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[0].item[2]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                    <div style="text-align: right;display: flex;">
                      <div style="width: 120px;">安防检测：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[0].item[3]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                  </div>
                  <div style="width: 150px;text-align: center;">
                    <div
                      :class="showStageStatus[stageStatusProcess[0].status]"
                      style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      class="bigStagePass"
                    ></div>
                    <div style="height: 20px;">入网检测</div>
                  </div>
                </el-tooltip>
                <el-tooltip placement="bottom" effect="light" style="margin-top:-5px;">
                  <div slot="content">
                    <div style="text-align: right;margin-bottom: 10px;display: flex;">
                      <div style="width: 120px;">试用任务审核：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[1].item[0]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                    <div style="text-align: right;display: flex;">
                      <div style="width: 120px;">软件试用：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[1].item[1]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                  </div>
                  <div style="width: 150px;text-align: center;">
                    <div
                      :class="showStageStatus[stageStatusProcess[1].status]"
                      style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                    ></div>
                    <div style="height: 20px;">软件试用</div>
                  </div>
                </el-tooltip>
                <el-tooltip placement="bottom" effect="light" style="margin-top:-5px;">
                  <div slot="content">
                    <div style="text-align: right;display: flex;">
                      <div style="width: 120px;">软件审核发布：</div>
                      <div
                        :class="showStageStatus[stageStatusProcess[2].item[0]]"
                        style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                      ></div>
                    </div>
                  </div>
                  <div style="width: 150px;text-align: center;">
                    <div
                      :class="showStageStatus[stageStatusProcess[2].status]"
                      style="margin: 0 auto;width: 20px;height: 20px;border-radius: 50%;"
                    ></div>
                    <div style="height: 20px;">软件发布</div>
                  </div>
                </el-tooltip>
              </div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row style="text-align: end;">
              <!-- <el-button
            size="small"
            style="margin-right: 10px;"
            @click="showTaskProcess"
            type="primary"
            icon="el-icon-share"
              >流程图</el-button>-->
              <el-button
                size="small"
                @click="showTaskHistory"
                icon="el-icon-s-data"
                type="info"
                style="margin-right: 10px;"
              >审核历史</el-button>
              <el-button @click="goBack" size="small" icon="el-icon-back">返回</el-button>
            </el-row>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-form
            id="taskInfoForm"
            v-model="taskInfoForm"
            label-position="right"
            label-width="150px"
          >
            <div class="headerTitle">系统信息</div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="系统名称：" prop="name">
                  <span>{{taskInfoForm.name}}</span>
                </el-form-item>
                <el-form-item label="上传人：" prop="cname">
                  <span>{{taskInfoForm.cname}}</span>
                </el-form-item>
                <el-form-item label="流程阶段：" prop="stage">
                  <span>{{showSystemStage(taskInfoForm.stage)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上传单位：" prop="cunit">
                  <span
                    v-text="taskInfoForm.cunit!=null?taskInfoForm.cunit:selectDictLabels(testDepartmentList, taskInfoForm.cunitId)"
                  />
                </el-form-item>
                <el-form-item label="上传时间：" prop="ctime">
                  <span>{{ parseTime(taskInfoForm.ctime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </el-form-item>
                <el-form-item label="阶段状态：" prop="status">
                  <span>{{stageStatusList[taskInfoForm.status]}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="试用单位："
              prop="syUnitId"
              v-show="(parseInt(taskInfoForm.stage)-1)>=4"
            >
              <!-- <span v-text="selectDictLabels(testDepartmentList, taskInfoForm.syUnitId)"/> -->
              <span v-text="taskInfoForm.syUnitId" />
            </el-form-item>
            <el-form-item label="安防检测单位：" prop="afUnitId" v-show="parseInt(taskInfoForm.stage)>=4">
              <!-- <span v-text="selectDictLabels(testDepartmentList, taskInfoForm.afUnitId)" /> -->
              <span v-text="taskInfoForm.afUnitId" />
            </el-form-item>
            <el-form-item label="浏览权限：" v-show="parseInt(taskInfoForm.stage)>4">
              <treeselect
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :show-count="true"
                v-if="(taskInfoForm.stage=='7'&&userRole=='XTUser'&&taskInfoForm.status==0)||userRole=='admin'"
                :normalizer="normalizer"
                size="small"
                v-model="isView"
                :multiple="true"
                :options="testDepartmentList"
                placeholder="请选择浏览单位"
              ></treeselect>
              <span v-else v-text="selectDictLabels(testDepartmentList, isView)" />
            </el-form-item>
            <el-form-item label="下载权限：" v-show="parseInt(taskInfoForm.stage)>4">
              <treeselect
                :limit="2"
                :limitText="count => `及其它${count}项`"
                :show-count="true"
                v-if="(taskInfoForm.stage=='7'&&userRole=='XTUser'&&taskInfoForm.status==0)||userRole=='admin'"
                :normalizer="normalizer"
                size="small"
                v-model="isDownload"
                :multiple="true"
                :options="testDepartmentList"
                placeholder="请选择下载单位"
              ></treeselect>
              <span v-else v-text="selectDictLabels(testDepartmentList, isDownload)" />
            </el-form-item>
            <div
              v-show="(showSystemStage(taskInfoForm.stage)=='软件审核发布'&&userRole=='XTUser')||(userRole=='applicationUser')"
            >
              <el-form-item label="发布公告：">
                <span v-if="noticeEditControl()">{{taskInfoForm.isNotice=='1'?"是":"否"}}</span>
                <div v-else>
                  <el-radio v-model="taskInfoForm.isNotice" label="1">是</el-radio>
                  <el-radio v-model="taskInfoForm.isNotice" label="0">否</el-radio>
                </div>
              </el-form-item>
              <el-form-item v-show="taskInfoForm.isNotice == '1'" label="公告标题：">
                <span v-if="noticeEditControl()">{{taskInfoForm.notice.title}}</span>
                <el-input
                  v-else
                  size="small"
                  v-model="taskInfoForm.notice.title"
                  placeholder="请输入公告标题"
                ></el-input>
              </el-form-item>
              <el-form-item v-show="taskInfoForm.isNotice == '1'" label="公告内容：">
                <span v-if="noticeEditControl()">{{taskInfoForm.notice.content}}</span>
                <el-input
                  v-else
                  size="small"
                  type="textarea"
                  :rows="5"
                  v-model="taskInfoForm.notice.content"
                  placeholder="请输入公告内容"
                ></el-input>
              </el-form-item>
              <el-form-item v-show="taskInfoForm.isNotice == '1'" label="公告范围：">
                <span v-if="noticeEditControl()">{{taskInfoForm.isNotice==1?"全部":"部分"}}</span>
                <div v-else>
                  <el-radio v-model="taskInfoForm.notice.showAll" :label="1">全部</el-radio>
                  <el-radio v-model="taskInfoForm.notice.showAll" :label="0">部分</el-radio>
                </div>
              </el-form-item>
              <el-form-item
                label="公告组织："
                v-show="taskInfoForm.isNotice == '1'&&taskInfoForm.notice.showAll == 0"
              >
                <span
                  v-if="noticeEditControl()"
                  v-text="selectDictLabels(testDepartmentList,taskInfoForm.notice.reciever)"
                ></span>
                <treeselect
                  :limit="2"
                  :limitText="count => `及其它${count}项`"
                  :show-count="true"
                  v-else
                  :normalizer="normalizer"
                  size="small"
                  v-model="taskInfoForm.notice.reciever"
                  :multiple="true"
                  value-consists-of="ALL_WITH_INDETERMINATE"
                  sort-value-by="INDEX"
                  :options="testDepartmentList"
                  placeholder="请选择公告接收单位"
                ></treeselect>
              </el-form-item>
              <el-form-item
                style="margin-top:10px;"
                label="公告时间："
                v-show="taskInfoForm.isNotice == '1'"
              >
                <span v-if="noticeEditControl()" v-text="taskInfoForm.notice.releaseDate"></span>
                <el-date-picker
                  v-else
                  v-model="taskInfoForm.notice.releaseDate"
                  size="small"
                  type="datetime"
                  align="right"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="公告日期"
                />
              </el-form-item>
            </div>
          </el-form>
        </el-row>
        <el-row class="headerTitle">
          <el-col :span="4" style="height: 40px;" class="uploadRow">
            <span>软件</span>
            <span v-show="taskInfoForm.taskUploadType==2">列表</span>
          </el-col>
          <el-col :span="20" style="height: 40px;justify-content: flex-end;" class="uploadRow">
            <el-button
              type="primary"
              style="margin-right: 10px;"
              @click="changeSoftwareAFSYStatus(1)"
              v-show="(userRole==='AFUser'&&showSystemStage(taskInfoForm.stage)==='安防检测'&&taskInfoForm.status===0)"
              :disabled="selectedSoftwareList.length==0"
              size="mini"
              icon="el-icon-check"
            >通过</el-button>
            <el-button
              type="danger"
              style="margin-right: 10px;"
              @click="changeSoftwareAFSYStatus(2)"
              v-show="(userRole==='AFUser'&&showSystemStage(taskInfoForm.stage)==='安防检测'&&taskInfoForm.status===0)"
              :disabled="selectedSoftwareList.length==0"
              size="mini"
              icon="el-icon-close"
            >未通过</el-button>
            <el-button
              v-show="taskInfoForm.taskUploadType==2"
              type="primary"
              style="margin-right: 10px;"
              :disabled="selectedSoftwareList.length==0"
              size="mini"
              icon="el-icon-download"
              @click="batchDownload"
            >批量下载</el-button>
          </el-col>
        </el-row>
        <el-table
          size="mini"
          ref="softwareDocumentTable"
          :border="false"
          max-height="500px"
          :data="softwareVoList"
          @selection-change="handleTableSelectionChange"
          :key="softwareDataKey"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column
            label="软件名称"
            width="200"
            prop="name"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="软件版本"
            width="200"
            align="center"
            prop="version"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            v-if="taskInfoForm.taskUploadType==2"
            label="软件类型"
            width="150"
            align="center"
            prop="fragmentType"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.fragmentType" disabled>
                <el-option
                  v-for="(item,index) in softwareTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.val"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-if="taskInfoForm.taskUploadType==2"
            label="软件前缀"
            width="150"
            align="center"
            prop="prefix"
          ></el-table-column>
          <el-table-column
            label="研制单位"
            width="150"
            align="center"
            prop="devUnit"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="检测状态" width="100" align="center">
            <template slot-scope="scopeAf">
              <span
                style="padding:2px 5px;color:white;border-radius:2px;font-size:12px;"
                :style="{background:scopeAf.row.afStatus==0?'orange':scopeAf.row.afStatus==1?'#67C23A':'#F56C6C'}"
              >{{showAFAndTestStatus(scopeAf.row.afStatus, "af")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="试用状态" width="100" align="center">
            <template slot-scope="scopeTest">
              <span
                style="padding:2px 5px;color:white;border-radius:2px;font-size:12px;"
                :style="{background:scopeTest.row.systatus==0?'orange':scopeTest.row.systatus==1?'#67C23A':'#F56C6C'}"
              >{{showAFAndTestStatus(scopeTest.row.systatus, "test")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-row class="uploadRow" style="justify-content: center;">
                <el-button
                  style="margin-right: 10px;"
                  size="mini"
                  icon="el-icon-download"
                  type="primary"
                  @click="downloadFileByNameAndPath(scope.row.name, scope.row.paths)"
                >下载</el-button>
                <el-button
                  icon="el-icon-upload"
                  v-show="taskInfoForm.stage=='4'&&scope.row.afStatus==2&&taskInfoForm.status==2&&userRole==='applicationUser'"
                  style="margin-right: 10px;"
                  @click="openReuploadSoftwareDialog(scope.row)"
                  type="primary"
                  size="mini"
                >修改</el-button>
                <el-popover placement="left" width="400" trigger="click">
                  <el-table :data="scope.row.softwareDatas" :show-header="false" max-height="200px">
                    <el-table-column
                      label="文件名称"
                      prop="name"
                      align="center"
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scoped">
                        <el-link
                          @click="downloadFileByNameAndPath(scoped.row.name, scoped.row.paths)"
                        >{{scoped.row.name}}</el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" size="small" icon="el-icon-files">查看材料</el-button>
                </el-popover>
                <!-- <el-button
                  size="small"
                  icon="el-icon-files"
                  @click="openTableExpand(scope.row)"
                  type="info"
                >查看材料</el-button>-->
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div class="headerTitle">证明&报告</div>
          <el-form id="certificateAFForm" label-width="150px" label-position="right">
            <el-row class="uploadRow">
              <el-form-item label="系统杀毒证明：">
                <el-link
                  @click="downloadFileByNameAndPath(sdCertificate.fileName, sdCertificate.path)"
                  :underline="false"
                >{{sdCertificate.fileName}}</el-link>
                <el-button
                  style="margin-left: 20px;"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="openPreviewDialog(sdCertificate.fileName, sdCertificate.path)"
                >预览</el-button>
                <!-- <el-button
                  style="margin-left: 20px;"
                  size="mini"
                  type="primary"
                  icon="el-icon-download"
                  @click="downloadFileByNameAndPath(sdCertificate.fileName, sdCertificate.path)"
                >下载</el-button>-->
              </el-form-item>
            </el-row>
            <el-row class="uploadRow" v-show="parseInt(taskInfoForm.stage)>=4">
              <el-form-item label="安防检测报告：" style="width: 70%;">
                <el-link
                  @click="downloadFileByNameAndPath(afReport.fileName, afReport.path)"
                  :underline="false"
                >{{afReport.fileName}}</el-link>
                <el-button
                  v-show="userRole==='AFUser'&&showSystemStage(taskInfoForm.stage)==='安防检测'&&taskInfoForm.status===0"
                  @click="clickTestReportButton"
                  icon="el-icon-upload"
                  size="mini"
                  type="primary"
                >上传</el-button>
                <el-button
                  v-show="afReport.fileName!=null&&afReport.fileName.trim()!=''"
                  style="margin-left: 20px;"
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="openPreviewDialog(afReport.fileName, afReport.path)"
                >预览</el-button>
                <el-button
                  style="margin-left: 20px;"
                  size="mini"
                  type="text"
                  icon="el-icon-download"
                  @click="downloadTemplateFile"
                >模板下载</el-button>
              </el-form-item>
              <el-upload
                style="display: none"
                multiple
                :action="uploadURL"
                :http-request="uploadTestReport"
                :before-upload="beforeUploadImageAndPdf"
                :show-file-list="false"
                :auto-upload="true"
              >
                <el-button
                  slot="trigger"
                  id="testReportButton"
                  icon="el-icon-upload"
                  type="warning"
                  size="small"
                >上传安防检测报告</el-button>
              </el-upload>
            </el-row>
            <el-row v-show="parseInt(taskInfoForm.stage)>=6">
              <el-form-item label="软件试用报告：">
                <el-row>
                  <el-col :span="20">
                    <!-- <el-row v-for="(item, index) in syReport" :key="index">
                      <el-col :span="9">
                        <span v-text="item.fileName"></span>
                      </el-col>
                      <el-col :span="9">
                        <span v-text="item.syUnit"></span>
                      </el-col>
                      <el-col :span="6">
                        <el-button size="mini" icon="el-icon-delete"></el-button>
                      </el-col>
                    </el-row>-->
                    <el-table
                      id="syTableId"
                      :data="syReport"
                      max-height="500px"
                      :show-header="false"
                      size="mini"
                    >
                      <el-table-column label="报告名称" prop="fileName">
                        <template slot-scope="{row}">
                          <el-link
                            @click="downloadFileByNameAndPath(row.fileName, row.path)"
                            :underline="false"
                          >
                            <i class="el-icon-document"></i>
                            {{row.fileName}}
                          </el-link>
                        </template>
                      </el-table-column>
                      <el-table-column label="试用单位" prop="syUnit">
                        <template slot-scope="{row}">
                          <i class="el-icon-school"></i>
                          <span
                            v-text="row.syUnit!=null?row.syUnit:selectDictLabels(testDepartmentList,row.syUnitId)"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        v-if="showSystemStage(taskInfoForm.stage)=='软件试用'&&userRole=='SYUser'&&taskInfoForm.status===0&&taskInfoForm.unitSyStatus==0"
                        label="操作"
                        width="300"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="danger"
                            @click="deleteSYReport(scope.$index)"
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                  <el-col :span="4">
                    <el-upload
                      v-show="userRole==='SYUser'&&showSystemStage(taskInfoForm.stage)==='软件试用'&&taskInfoForm.status===0&&taskInfoForm.unitSyStatus==0"
                      multiple
                      :action="uploadURL"
                      :http-request="uploadSoftwareTrialReport"
                      :before-upload="beforeUploadImageAndPdf"
                      :show-file-list="false"
                      :auto-upload="true"
                    >
                      <el-button
                        slot="trigger"
                        icon="el-icon-upload"
                        type="primary"
                        size="small"
                      >上传软件试用报告</el-button>
                    </el-upload>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <!-- <div v-show="(parseInt(taskInfoForm.stage)-1)>=6">
          <el-row style="background: #d4d6d8;">
            <el-col :span="12" style="height: 40px;" class="uploadRow">
              <span style="margin-left: 20px;">软件试用报告列表</span>
            </el-col>
            <el-col :span="12" style="height: 40px;justify-content: flex-end;" class="uploadRow">
              <el-upload
                v-show="userRole==='SYUser'&&showSystemStage(taskInfoForm.stage)==='软件试用'&&taskInfoForm.status===0&&taskInfoForm.unitSyStatus==0"
                style="margin-right: 20px;"
                multiple
                :action="uploadURL"
                :http-request="uploadSoftwareTrialReport"
                :show-file-list="false"
                :auto-upload="true"
              >
                <el-button slot="trigger" icon="el-icon-upload" type="primary" size="small">上传软件试用报告</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-table :data="syReport" max-height="500px" :show-header="false">
            <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
            <el-table-column label="报告名称" prop="fileName" header-align="center"></el-table-column>
            <el-table-column label="试用单位" prop="syUnit" header-align="center"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-row>
                  <el-button
                    style="margin-right: 10px;"
                    size="small"
                    type="primary"
                    icon="el-icon-download"
                    @click="downloadFileByNameAndPath(scope.row.fileName, scope.row.path)"
                  >软件试用报告下载</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>-->
        <div class="dialog-footer" style="margin-top: 10px;">
          <el-row type="flex" justify="center">
            <el-button
              v-show="(showSystemStage(taskInfoForm.stage)=='安防检测'&&userRole=='AFUser'&&taskInfoForm.status===0)||(showSystemStage(taskInfoForm.stage)=='软件试用'&&userRole=='SYUser'&&taskInfoForm.status===0&&taskInfoForm.unitSyStatus==0)"
              @click="saveTaskDetail('save')"
              type="primary"
            >保存</el-button>
            <el-button
              v-show="(showSystemStage(taskInfoForm.stage)=='安防检测'&&userRole=='AFUser'&&taskInfoForm.status===0)||(showSystemStage(taskInfoForm.stage)=='软件试用'&&userRole=='SYUser'&&taskInfoForm.status===0&&taskInfoForm.unitSyStatus==0)"
              @click="openReviewerDialog"
              type="primary"
            >提交</el-button>
            <el-button
              v-show="showSystemStage(taskInfoForm.stage)=='检测申请审核'&&userRole=='SHUser'&&taskInfoForm.status===0"
              @click="openReviewerDialog"
              type="primary"
            >审核通过</el-button>
            <el-button
              v-show="showSystemStage(taskInfoForm.stage)=='检测任务下达'&&userRole=='XTUser'&&taskInfoForm.status===0"
              @click="openAFDialog"
              type="primary"
            >任务下达</el-button>
            <el-button
              v-show="showSystemStage(taskInfoForm.stage)=='试用任务审核'&&userRole=='XTUser'&&taskInfoForm.status===0"
              @click="openReviewerDialog"
              type="primary"
            >软件试用</el-button>
            <el-button
              v-show="showSystemStage(taskInfoForm.stage)=='软件审核发布'&&userRole=='XTUser'&&taskInfoForm.status===0"
              @click="openReviewerDialog"
              type="primary"
            >审核通过并发布</el-button>
            <el-button
              v-show="userRole=='applicationUser'&&taskInfoForm.stage!='7'"
              @click="saveNoticeEdit"
              type="primary"
            >保存</el-button>
            <el-button
              v-show="(showSystemStage(taskInfoForm.stage)=='安防检测'&&userRole=='applicationUser'&&taskInfoForm.status===2)"
              @click="updateSoftwareChange"
              type="primary"
            >提交</el-button>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-dialog title="审核历史" :visible.sync="taskHistoryVisible">
      <el-table
        :data="showTaskHistoryList"
        max-height="500px"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        <el-table-column label="阶段名称" align="center">
          <template slot-scope="scope">
            <span>{{showSystemStage(scope.row.stage)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="阶段状态" width="100" align="center">
          <template slot-scope="scope">
            <span>{{stageStatusList[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="负责人" prop="cname"></el-table-column> -->
        <el-table-column label="负责人" prop="contactUser"></el-table-column>
        <el-table-column label="联系方式" prop="contactInfor"></el-table-column>
        <el-table-column label="审核时间" prop="ctime"></el-table-column>
      </el-table>
    </el-dialog>
    <AFUnitSelectDialog
      :visible="afSelectVisible"
      :data="afInfo"
      @close="closeAFDialog"
      @closeOut="closeAFDialogOut"
    ></AFUnitSelectDialog>
    <reuploadSoftwareDialog
      :visible="reuploadDialogVisible"
      :taskType="taskInfoForm.taskUploadType"
      :data="selectedSoft"
      @edit="editRefuseSoftware"
      @close="closeRefuseSoftware"
    ></reuploadSoftwareDialog>
    <el-dialog :title="reviewerForm.title" :visible.sync="reviewerForm.dialogVisible">
      <el-form
        :model="reviewerForm"
        ref="reviewerFormRef"
        label-width="110px"
        label-position="right"
      >
        <el-form-item
          label="审核人："
          prop="reviewerName"
          :rules="[{required:true,message:'审核人姓名不能为空',trigger:'blur'}]"
        >
          <el-input
            style="width: 80%;"
            v-model="reviewerForm.reviewerName"
            placeholder="请输入审核人真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系方式："
          prop="telphone"
          :rules="[{required:true,message:'联系方式不能为空',trigger:'blur'}]"
        >
          <el-input style="width: 80%;" v-model="reviewerForm.telphone" placeholder="请输入审核人联系方式"></el-input>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;">
        <el-button size="small" type="primary" @click="clickReviewButton('pass')">提交</el-button>
        <el-button size="small" @click="clickReviewButton('cancel')">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="文件预览" :visible.sync="previewVisible" width="600px">
      <div style="text-align: center">
        <iframe
          v-if="previewSign === 1"
          :src="previewUrl"
          type="application/x-google-chrome-pdf"
          width="100%"
          frameborder="0"
          scrolling="auto"
          height="500px"
        />
        <el-image
          style="height: 500px;width: 500px;"
          v-if="previewSign === 2"
          :src="previewUrl"
          fit="fill"
        ></el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as organization from "@/api/organization";
import * as softwareTaskApi from "@/api/software-task"; //软件任务接口
import * as softwareTaskRecordApi from "@/api/software-task-record"; //软件审核历史接口
import * as category from "@/api/category";
import * as application from "@/api/application";
export default {
  components: {
    Treeselect: Treeselect,
    AFUnitSelectDialog: () => import("./AFUnitSelectDialog.vue"),
    reuploadSoftwareDialog: () => import("./reuploadSoftwareDialog.vue")
  },
  data() {
    return {
      isView: [],
      isDownload: [],
      afSelectVisible: false,
      afInfo: {},
      feedbackData: {
        unreadCount: 0,
        feedbackInfoTable: []
      },
      afreportVisible: false,
      taskInfoForm: {
        taskId: 1,
        name: "",
        cunit: "",
        cname: "",
        ctime: "",
        taskEndTime: "",
        stage: "",
        status: "",
        isNotice: "0",
        notice: {
          title: "",
          content: "",
          reciever: []
        },
        syUnitId: []
      },
      softwareTypeList: [],
      sdCertificate: {
        path: null,
        fileName: ""
      },
      afReport: {
        path: 1,
        fileName: ""
      },
      syReport: [],
      taskHistoryVisible: false,
      stageNameList: [
        "软件上传", //申请人
        "检测申请审核", //部门主管 zhijiedian
        "检测任务下达", //xt zhijiedian
        "安防检测", //af
        "试用任务审核", //xt zhijiedian
        "软件试用", //试用
        "软件审核发布" // xt zhijiedian
      ],
      taskHistoryList: [],
      showTaskHistoryList: [],
      testDepartmentList: [],
      uploadURL: "127.0.0.1",
      userRole: "user",
      timer: "",
      selectedSoftwareList: [],
      stageStatusList: ["进行中", "已通过", "未通过"],
      dataTypeList: [],
      softwareVoList: [],
      userInfo: {},
      stageShowStatusList: ["undo", "pass", "refuse"],
      systemId: null,
      updateRefuseUpload: [],

      reuploadDialogVisible: false,
      selectedSoft: {},
      selectedSoftForm: {
        id: 0,
        softwareId: 0,
        versionId: 0
      },
      softwareDataKey: 0,

      reviewerForm: {
        title: null,
        dialogVisible: false,
        reviewerName: "",
        telphone: null
      },

      previewVisible: false,
      previewUrl: null,
      previewSign: null,

      stageStatusProcess: [
        {
          status: 0,
          item: [0, 0, 0, 0]
        },
        {
          status: 0,
          item: [0, 0]
        },
        {
          status: 0,
          item: [0]
        }
      ],
      showStageStatus: ["bigStageDoing", "bigStagePass", "bigStageRefuse"]
    };
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userRole = this.userName;
    this.systemId = localStorage.getItem("systemId");
    await this.getSoftwareDataTypeList();
    await this.getDeptTree();
    await this.getFragmentTypeList();
    await this.getSoftwareTaskDetail();
    await this.setStageProcessByStageAndStatus();
  },
  computed: {
    userName() {
      return localStorage.getItem("userType");
    }
  },
  watch: {
    userName(newVal, oldVal) {
      console.log(newVal, "newVal");
      this.userRole = newVal;
    }
  },
  methods: {
    setStageProcessByStageAndStatus() {
      this.stageStatusProcess = [
        {
          status: 0,
          item: [0, 0, 0, 0]
        },
        {
          status: 0,
          item: [0, 0]
        },
        {
          status: 0,
          item: [0]
        }
      ];
      let num = parseInt(this.taskInfoForm.stage);
      let status = this.taskInfoForm.status;
      if (num == 7) {
        console.log("way 7");
        this.stageStatusProcess[0].item = [1, 1, 1, 1];
        this.stageStatusProcess[0].status = 1;
        this.stageStatusProcess[1].item = [1, 1];
        this.stageStatusProcess[1].status = 1;
        this.stageStatusProcess[2].item = [status];
        this.stageStatusProcess[2].status = status;
      } else if (num > 4 && num <= 6) {
        console.log("way 5-6");
        this.stageStatusProcess[0].item = [1, 1, 1, 1];
        this.stageStatusProcess[0].status = 1;
        for (let i = 0; i < num - 5; i++) {
          if (i < num - 5) {
            this.stageStatusProcess[1].item[i] = 1;
          } else {
            this.stageStatusProcess[1].item[i] = status;
          }
        }
        if (status == 2) {
          this.stageStatusProcess[1].status = 2;
        } else {
          this.stageStatusProcess[1].status = 0;
        }
      } else if (num <= 4) {
        console.log("way 4");
        for (let i = 0; i <= num - 1; i++) {
          if (i < num - 1) {
            this.stageStatusProcess[0].item[i] = 1;
          } else {
            this.stageStatusProcess[0].item[i] = status;
          }
        }
        if (status == 2) {
          this.stageStatusProcess[0].status = 2;
        } else {
          this.stageStatusProcess[0].status = 0;
        }
      }

      console.log(
        this.stageStatusProcess,
        this.taskInfoForm.stage,
        this.taskInfoForm.status,
        "this.stageStatusProcess"
      );
    },
    beforeUploadImageAndPdf(file) {
      console.log("aaaaa", file);
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const acceptType = ["gif", "bmp", "jpg", "png", "pdf"];
      if (acceptType.indexOf(fileType) === -1) {
        this.$message.error("该文件类型不符合当前允许上传类型!");
        return Promise.reject(false);
      } else {
        return true;
      }
    },
    deleteSYReport(index) {
      this.syReport.splice(index, 1);
    },
    downloadTemplateFile() {
      const a = document.createElement("a");
      a.href = "./security_test_report.docx";
      a.download = "安防检测报告模板.docx";

      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    openPreviewDialog(fileName, path) {
      let fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
      if (fileType === "pdf" || fileType === "PDF") {
        this.previewUrl = config.urlFilePrefix + path;
        this.previewSign = 1;
      } else {
        const acceptType = ["gif", "bmp", "jpg", "png"];
        if (acceptType.indexOf(fileType) !== -1) {
          this.previewSign = 2;
          this.previewUrl = config.urlFilePrefix + path;
        }
      }

      this.previewVisible = true;
      // this.previewUrl = config.urlFilePrefix + path
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
    openReviewerDialog() {
      if (
        this.showSystemStage(this.taskInfoForm.stage) == "安防检测" &&
        this.userRole == "AFUser" &&
        this.taskInfoForm.status === 0
      ) {
        let afSoftStatus = true;
        let afReportStatus = true;
        for (let i = 0; i < this.softwareVoList.length; i++) {
          if (this.softwareVoList[i].afStatus === 0) {
            afSoftStatus = false;
            break;
          }
        }
        if (
          this.afReport.fileName === null ||
          this.afReport.fileName === undefined ||
          this.afReport.fileName.trim() === ""
        ) {
          afReportStatus = false;
        }
        if (!afSoftStatus && !afReportStatus) {
          this.$message.info("请选择软件检测状态并上传软件安防检测报告。");
        } else if (!afSoftStatus) {
          this.$message.info("请选择软件检测状态。");
        } else if (!afReportStatus) {
          this.$message.info("请上传软件安防检测报告。");
        } else {
          this.reviewerForm = {
            title:
              this.showSystemStage(this.taskInfoForm.stage) +
              "阶段审核人信息填写",
            dialogVisible: true,
            reviewerName: "",
            telphone: null
          };
        }
      } else if (
        this.showSystemStage(this.taskInfoForm.stage) == "软件试用" &&
        this.userRole == "SYUser" &&
        this.taskInfoForm.status === 0 &&
        this.taskInfoForm.unitSyStatus == 0
      ) {
        console.log("sy");
        let judgeUploadReport = false;
        for (let n = 0; n < this.syReport.length; n++) {
          if (this.syReport[n].syUnitId === this.userInfo.organizationId) {
            judgeUploadReport = true;
          }
        }
        console.log(judgeUploadReport, "judgeUploadReport");
        if (!judgeUploadReport) {
          console.log("enter");
          this.$message.info("请上传软件试用报告");
        } else {
          this.reviewerForm = {
            title:
              this.showSystemStage(this.taskInfoForm.stage) +
              "阶段审核人信息填写",
            dialogVisible: true,
            reviewerName: "",
            telphone: null
          };
        }
      } else {
        this.reviewerForm = {
          title:
            this.showSystemStage(this.taskInfoForm.stage) +
            "阶段审核人信息填写",
          dialogVisible: true,
          reviewerName: "",
          telphone: null
        };
      }
    },
    clickReviewButton(sign) {
      if (sign == "pass") {
        if (
          this.showSystemStage(this.taskInfoForm.stage) == "安防检测" &&
          this.userRole == "AFUser" &&
          this.taskInfoForm.status === 0
        ) {
          this.saveTaskDetail("pass");
          this.reviewerForm.dialogVisible = false;
        } else if (
          this.showSystemStage(this.taskInfoForm.stage) == "软件试用" &&
          this.userRole == "SYUser" &&
          this.taskInfoForm.status === 0 &&
          this.taskInfoForm.unitSyStatus == 0
        ) {
          this.saveTaskDetail("pass");
          this.reviewerForm.dialogVisible = false;
        } else if (
          this.showSystemStage(this.taskInfoForm.stage) == "检测申请审核" &&
          this.userRole == "SHUser" &&
          this.taskInfoForm.status === 0
        ) {
          this.passProcess();
          this.reviewerForm.dialogVisible = false;
        } else if (
          this.showSystemStage(this.taskInfoForm.stage) == "试用任务审核" &&
          this.userRole == "XTUser" &&
          this.taskInfoForm.status === 0
        ) {
          this.passProcess();
          this.reviewerForm.dialogVisible = false;
        } else if (
          this.showSystemStage(this.taskInfoForm.stage) == "软件审核发布" &&
          this.userRole == "XTUser" &&
          this.taskInfoForm.status === 0
        ) {
          this.saveTaskDetail("pass");
          this.reviewerForm.dialogVisible = false;
        }
      } else {
        this.reviewerForm.dialogVisible = false;
      }
    },
    noticeEditControl() {
      if (
        this.userRole == "applicationUser" &&
        this.taskInfoForm.stage != "7"
      ) {
        return false;
      } else if (
        this.userRole == "XTUser" &&
        this.taskInfoForm.stage == "7" &&
        this.taskInfoForm.status == 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    openReuploadSoftwareDialog(item) {
      this.reuploadDialogVisible = true;
      this.selectedSoftForm.id = this.taskInfoForm.id;
      this.selectedSoftForm.softwareId = item.id;
      this.selectedSoftForm.versionId = item.versionId;
      this.selectedSoft = JSON.parse(JSON.stringify(item));
    },
    editRefuseSoftware(item) {
      console.log(this.taskInfoForm, item);
      if (item != null && this.taskInfoForm.taskUploadType == 2) {
        let updataInfo = {};
        // JSON.parse(JSON.stringify(item))
        updataInfo.id = this.selectedSoftForm.softwareId;
        updataInfo.versionId = this.selectedSoftForm.versionId;
        updataInfo.cpu = item.cpu.join(",");
        updataInfo.afStatus = 0;
        let data = {
          id: this.selectedSoftForm.id,
          softwareVo: JSON.parse(JSON.stringify(updataInfo))
        };
        softwareTaskApi.updateUploadSoftware(data).then(response => {
          if (response.code === 200) {
            this.$message.info("修改成功");
            this.getSoftwareTaskDetail();
          }
        });
      } else if (item != null && this.taskInfoForm.taskUploadType == 1) {
        let updataInfo = {
          id: this.selectedSoftForm.softwareId,
          versionId: this.selectedSoftForm.versionId,
          afStatus: 0,
          description: item.description,
          devUnit: item.devUnit,
          fileName: item.fileName,
          logo: item.logo,
          md5: item.md5,
          name: item.name,
          offerUnit: item.offerUnit,
          offerUnitId: item.offerUnitId,
          path: item.path,
          pic: item.pic,
          size: item.size + "",
          version: item.version
        };

        let service = item.service.join(",");
        let data = {
          id: this.selectedSoftForm.id,
          service: service,
          softwareVo: JSON.parse(JSON.stringify(updataInfo))
        };
        softwareTaskApi.updateUploadSoftware(data).then(response => {
          if (response.code === 200) {
            this.$message.info("修改成功");
            // this.getSoftwareTaskDetail();
          }
        });
      }
    },
    closeRefuseSoftware() {
      console.log("close");
      this.reuploadDialogVisible = false;
    },
    async batchDownload() {
      console.log(this.selectedSoftwareList, "this.selectedSoftwareList");
      for (let num = 0; num < this.selectedSoftwareList.length; num++) {
        await this.downloadFileByNameAndPath(
          this.selectedSoftwareList[num].name,
          this.selectedSoftwareList[num].paths
        );
      }
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
        let url = config.url + "/appstore" + path;
        this.$download.downloadSoftwareByUrlAndEditName(url, filename);
      }
    },
    saveNoticeEdit() {
      this.$confirm("是否修改公告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let notice = JSON.parse(JSON.stringify(this.taskInfoForm.notice));
          notice.reciever = notice.reciever.join(",");
          let stageNum = parseInt(this.taskInfoForm.stage);
          let data = {
            id: this.taskInfoForm.id,
            isNotice: this.taskInfoForm.isNotice,
            notice: notice
          };
          softwareTaskApi.saveTaskNotice(data).then(async response => {
            if (response.code === 200) {
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
    },
    showSizes(val) {
      if (val === 0) return "0B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    showSoftwareDataType(value) {
      for (let num = 0; num < this.dataTypeList.length; num++) {
        if (this.dataTypeList[num].id == value) {
          return this.dataTypeList[num].name;
        }
      }
    },
    getSoftwareDataTypeList() {
      category.getCategoryList("data_type", null, null).then(response => {
        if (response.code === 200) {
          this.dataTypeList = response.data.list;
        }
      });
    },
    getFragmentTypeList() {
      category.getCategoryList("fragment_type", null, null).then(response => {
        let res = this.handleTree(response.data.list);
        this.softwareTypeList = res;
      });
    },
    returnSoftwareType(val) {
      for (let i; i < this.softwareTypeList.length; i++) {
        if (val === this.softwareTypeList[i].val) {
          return this.softwareTypeList[i].label;
        }
      }
    },
    showSystemStage(value) {
      if (value != null && value != undefined && value.trim() != "") {
        let num = parseInt(value) - 1;
        return this.stageNameList[num];
      }
    },
    openAFDialog() {
      this.afInfo = this.taskInfoForm;
      this.afSelectVisible = true;
      console.log(this.afInfo, this.afSelectVisible);
    },
    closeAFDialogOut() {
      this.afSelectVisible = false;
    },
    closeAFDialog(item) {
      this.afSelectVisible = false;
      if (item.afUnitId != null) {
        this.$confirm("要通过该流程吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let stageNum = parseInt(item.stage) + 1;
            let data = {
              id: item.id,
              stage: stageNum,
              status: 0,
              afUnitId: item.afUnitId,
              contactUser: item.contactUser,
              contactInfor: item.contactInfor
            };
            softwareTaskApi.afTastPublishAudit(data).then(async response => {
              if (response.code === 200) {
                this.$router.push({ path: "/admin/softwareUpload/showStatus" });
              }
            });
          })
          .catch(error => {
            console.log(error);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    // 获取部门导航树
    getDeptTree() {
      organization
        .getOrganization()
        .then(response => {
          if (response.code === 200) {
            let softwareTypeArray = response.data;
            this.testDepartmentList = [];
            if (softwareTypeArray.length > 0) {
              softwareTypeArray.forEach(element => {
                let item = this.buildTreeOptions(element);
                this.testDepartmentList.push(item);
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      };
      if (item.children.length > 0) {
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      return node;
    },
    goBack() {
      history.go(-1);
    },
    openTableExpand(row) {
      this.$refs.softwareDocumentTable.toggleRowExpansion(row);
    },
    clickTestReportButton() {
      let e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("testReportButton").dispatchEvent(e);
    },
    uploadTestReport(params) {
      console.log("application", params);
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
    handlePreview() {},
    handleRemove() {},
    async getSoftwareTaskDetail() {
      await softwareTaskApi
        .getSoftwareTaskDetail(this.systemId)
        .then(response => {
          console.log("taskData", response.data);
          if (response.code === 200) {
            this.taskInfoForm = response.data;
            if (
              this.taskInfoForm.notice.reciever != null &&
              this.taskInfoForm.notice.reciever != undefined &&
              this.taskInfoForm.notice.reciever.trim() != ""
            ) {
              let reciever = this.taskInfoForm.notice.reciever.split(",");
              this.taskInfoForm.notice.reciever = [];
              for (let n = 0; n < reciever.length; n++) {
                this.taskInfoForm.notice.reciever.push(parseInt(reciever[n]));
              }
            } else {
              this.taskInfoForm.notice.reciever = [];
            }

            // let syUnitId = this.taskInfoForm.syUnitId.split(",");
            // this.taskInfoForm.syUnitId = [];
            // for (let i = 0; i < syUnitId.length; i++) {
            //   this.taskInfoForm.syUnitId.push(parseInt(syUnitId[i]));
            // }
            this.taskInfoForm.syUnitId = this.selectDictLabels(
              this.testDepartmentList,
              this.taskInfoForm.syUnitId
            );
            console.log(this.taskInfoForm.syUnitId);
            this.softwareVoList = [];
            let softwareVoListDemo = this.taskInfoForm.softwareVoList;
            for (let num = 0; num < softwareVoListDemo.length; num++) {
              let softwareVoListItem = softwareVoListDemo[num];
              if (softwareVoListItem.softwareDatas === null) {
                softwareVoListItem.softwareDatas = [];
              }
              this.softwareVoList.push(softwareVoListItem);
            }
            this.sdCertificate = JSON.parse(this.taskInfoForm.sdCertificate);
            if (
              this.taskInfoForm.afUnitId === null ||
              this.taskInfoForm.afUnitId === ""
            ) {
              // this.taskInfoForm.afUnitId = []
            } else {
              let afUnitId = this.taskInfoForm.afUnitId;
              // this.taskInfoForm.afUnitId = [parseInt(afUnitId)]
              this.taskInfoForm.afUnitId = this.selectDictLabels(
                this.testDepartmentList,
                afUnitId
              );
              console.log(this.taskInfoForm.afUnitId);
            }
            if (
              this.taskInfoForm.afReport === null ||
              this.taskInfoForm.afReport === ""
            ) {
              this.afReport = {
                path: null,
                fileName: ""
              };
            } else {
              this.afReport = JSON.parse(this.taskInfoForm.afReport);
            }
            if (
              this.taskInfoForm.syReport === null ||
              this.taskInfoForm.syReport === ""
            ) {
              this.syReport = [];
            } else {
              this.syReport = JSON.parse(this.taskInfoForm.syReport);
            }
            this.isView = [];
            if (
              this.taskInfoForm.isView !== null &&
              this.taskInfoForm.isView !== ""
            ) {
              let isViewList = this.taskInfoForm.isView.split(",");
              for (let v = 0; v < isViewList.length; v++) {
                this.isView.push(parseInt(isViewList[v]));
              }
            }
            // console.log(this.selectDictLabels(this.testDepartmentList,this.taskInfoForm.isView), "浏览","selectDictLabels")
            this.isDownload = [];
            if (
              this.taskInfoForm.isDownload !== null &&
              this.taskInfoForm.isDownload !== ""
            ) {
              let isDownloadList = this.taskInfoForm.isDownload.split(",");
              for (let d = 0; d < isDownloadList.length; d++) {
                this.isDownload.push(parseInt(isDownloadList[d]));
              }
            }
            console.log(this.taskInfoForm, "this.taskInfoForm");
          }
        });
    },
    changeSoftwareAFSYStatus(sign) {
      if (this.showSystemStage(this.taskInfoForm.stage) === "安防检测") {
        this.selectedSoftwareList.forEach(item => {
          let num = this.softwareVoList.indexOf(item);
          this.softwareVoList[num].afStatus = sign;
        });
      } else if (this.showSystemStage(this.taskInfoForm.stage) === "软件试用") {
        this.selectedSoftwareList.forEach(item => {
          let num = this.softwareVoList.indexOf(item);
          this.softwareVoList[num].systatus = sign;
        });
      }
      let itemList = JSON.parse(JSON.stringify(this.softwareVoList));
      this.softwareVoList = JSON.parse(JSON.stringify(itemList));
      console.log(this.softwareVoList);
    },
    handleTableSelectionChange(val) {
      this.selectedSoftwareList = val;
      console.log(val);
    },
    drawProcess(item) {
      console.log(item, "item");
      this.showTaskHistoryList = [];
      for (let num = 0; num < item.length; num++) {
        let date = new Date(parseInt(item[num].ctime));
        console.log(date, item[num].ctime);
        let year = date.getFullYear();
        let month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hour =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let second =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        this.showTaskHistoryList.push({
          stage: item[num].stage,
          status: item[num].status,
          cname: item[num].cname,
          // ctime: year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second,
          ctime: year + "-" + month + "-" + day + " " + hour + ":" + minute,
          contactUser: item[num].contactUser,
          contactInfor: item[num].contactInfor
        });
      }
    },
    showTaskProcess() {
      localStorage.setItem("taskInfo", JSON.stringify(this.taskInfoForm));
      let routeUrl = this.$router.resolve({
        path: "/admin/softwareUpload/taskProcess"
      });
      window.open(routeUrl.href, "_blank");
    },
    async showTaskHistory() {
      let systemHistoryList = null;
      softwareTaskRecordApi
        .listByTask(this.taskInfoForm.id)
        .then(async response => {
          if (response.code) {
            systemHistoryList = response.data;
            console.log(response, systemHistoryList, "showTaskHistory");
            this.taskHistoryVisible = !this.taskHistoryVisible;
            await this.drawProcess(systemHistoryList);
          }
        });
    },
    showAFAndTestStatus(item, sign) {
      if (item === 0) {
        if (sign === "af") {
          return "待检测";
        } else if (sign === "test") {
          return "待试用";
        }
      } else if (item === 1) {
        return "已通过";
      } else if (item === 2) {
        return "未通过";
      }
    },
    updateSoftwareChange() {
      this.$router.push({ path: "/admin/softwareUpload/showStatus" });
    },
    saveTaskDetail(inputSign) {
      if (
        this.showSystemStage(this.taskInfoForm.stage) == "软件审核发布" &&
        this.userRole == "XTUser"
      ) {
        this.$confirm("确认发布软件", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            if (this.isView.length === 0) {
              return this.$message.info("请填写浏览权限");
            }
            if (this.isDownload.length === 0) {
              return this.$message.info("请填写下载权限");
            }
            if (this.taskInfoForm.isNotice === "1") {
              if (
                this.taskInfoForm.notice.title === null ||
                this.taskInfoForm.notice.title === undefined ||
                this.taskInfoForm.notice.title.trim() === ""
              ) {
                return this.$message.info("请填写公告标题");
              }
              if (
                this.taskInfoForm.notice.content === null ||
                this.taskInfoForm.notice.content === undefined ||
                this.taskInfoForm.notice.content.trim() === ""
              ) {
                return this.$message.info("请填写公告内容");
              }
              if (this.taskInfoForm.notice.showAll == 0) {
                if (
                  this.taskInfoForm.notice.reciever === null ||
                  this.taskInfoForm.notice.reciever === undefined ||
                  this.taskInfoForm.notice.reciever.length === 0
                ) {
                  return this.$message.info("请填写公告范围");
                }
              }
              if (
                this.taskInfoForm.notice.releaseDate === null ||
                this.taskInfoForm.notice.releaseDate === undefined ||
                this.taskInfoForm.notice.releaseDate.length === 0
              ) {
                return this.$message.info("请填写公告时间");
              }
            }
            let notice = JSON.parse(JSON.stringify(this.taskInfoForm.notice));
            notice.reciever = notice.reciever.join(",");
            let stageNum = parseInt(this.taskInfoForm.stage);
            let data = {
              id: this.taskInfoForm.id,
              status: inputSign === "pass" ? 1 : 0,
              stage: stageNum,
              isView: this.isView.join(","),
              isDownload: this.isDownload.join(","),
              notice: notice,
              isNotice: this.taskInfoForm.isNotice,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            };
            softwareTaskApi.publishApply(data).then(async response => {
              if (response.code === 200) {
                this.$router.push({ path: "/admin/softwareUpload/showStatus" });
              }
            });
          })
          .catch(error => {
            console.log(error);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (this.userRole === "AFUser") {
        this.$confirm("是否已上传软件安防检测报告并提交", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            if (inputSign === "pass") {
              // let afSoftStatus = true;
              // let afReportStatus = true;
              // for (let i = 0; i < this.softwareVoList.length; i++) {
              //   if (this.softwareVoList[i].afStatus === 0) {
              //     afSoftStatus = false;
              //     break;
              //   }
              // }
              // if (
              //   this.afReport.fileName === null ||
              //   this.afReport.fileName === undefined ||
              //   this.afReport.fileName.trim() === ""
              // ) {
              //   afReportStatus = false;
              // }
              // if (!afSoftStatus && !afReportStatus) {
              //   return this.$message.info(
              //     "请选择软件检测状态并上传软件安防检测报告。"
              //   );
              // } else if (!afSoftStatus) {
              //   return this.$message.info("请选择软件检测状态。");
              // } else if (!afReportStatus) {
              //   return this.$message.info("请上传软件安防检测报告。");
              // }
              let stageNum = parseInt(this.taskInfoForm.stage) + 1;
              let softwareVersionList = [];
              let refuseSign = false;
              for (let num = 0; num < this.softwareVoList.length; num++) {
                softwareVersionList.push({
                  id: this.softwareVoList[num].versionId,
                  // softwareId:this.softwareVoList[num].id,
                  afStatus: this.softwareVoList[num].afStatus
                });
                if (this.softwareVoList[num].afStatus === 2) {
                  refuseSign = true;
                }
              }
              let data = {
                id: this.taskInfoForm.id,
                stage:
                  refuseSign === true
                    ? parseInt(this.taskInfoForm.stage)
                    : stageNum,
                status: refuseSign === true ? 2 : 0,
                afReport: JSON.stringify(this.afReport),
                softwareVersionList: JSON.parse(
                  JSON.stringify(softwareVersionList)
                ),
                contactUser: this.reviewerForm.reviewerName,
                contactInfor: this.reviewerForm.telphone
              };
              softwareTaskApi.afTaskFinshed(data).then(response => {
                console.log(response);
                if (response.code === 200) {
                  this.$router.push({
                    path: "/admin/softwareUpload/showStatus"
                  });
                }
              });
            } else {
              let stageNum = parseInt(this.taskInfoForm.stage);
              let softwareVersionList = [];
              for (let num = 0; num < this.softwareVoList.length; num++) {
                softwareVersionList.push({
                  id: this.softwareVoList[num].versionId,
                  // softwareId:this.softwareVoList[num].id,
                  afStatus: this.softwareVoList[num].afStatus
                });
              }
              let data = {
                id: this.taskInfoForm.id,
                stage: stageNum,
                status: 0,
                afReport: JSON.stringify(this.afReport),
                softwareVersionList: JSON.parse(
                  JSON.stringify(softwareVersionList)
                )
              };
              softwareTaskApi.afTaskFinshed(data).then(response => {
                console.log(response);

                if (response.code === 200) {
                  this.$router.push({
                    path: "/admin/softwareUpload/showStatus"
                  });
                }
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (this.userRole === "SYUser") {
        this.$confirm("是否已上传软件试用报告并提交", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            // let statusAll = true;
            // for (let i = 0; i < this.softwareVoList.length; i++) {
            //   if (this.softwareVoList[i].systatus === 0) {
            //     statusAll = false;
            //     break;
            //   }
            // }
            // if (!statusAll) {
            //   return this.$message.info("请完成对软件的试用并修改软件状态。");
            // }
            // let judgeUploadReport = false;
            // for (let n = 0; n < this.syReport.length; n++) {
            //   if (this.syReport[n].syUnitId === this.userInfo.organizationId) {
            //     judgeUploadReport = true;
            //   }
            // }
            // if (!judgeUploadReport) {
            //   return this.$message.info("请上传软件试用报告");
            // }
            if (inputSign === "pass") {
              let stageNum = parseInt(this.taskInfoForm.stage) + 1;
              let softwareVersionList = [];
              let refuseSign = false;
              for (let num = 0; num < this.softwareVoList.length; num++) {
                softwareVersionList.push({
                  id: this.softwareVoList[num].versionId,
                  // softwareId:this.softwareVoList[num].id,
                  // systatus: this.softwareVoList[num].systatus
                  systatus: 1
                });
                if (this.softwareVoList[num].systatus === 2) {
                  refuseSign = true;
                }
              }
              let data = {
                id: this.taskInfoForm.id,
                stage:
                  refuseSign === true
                    ? parseInt(this.taskInfoForm.stage)
                    : stageNum,
                status: refuseSign === true ? 2 : 0,
                syReport: JSON.stringify(this.syReport),
                softwareVersionList: JSON.parse(
                  JSON.stringify(softwareVersionList)
                ),
                contactUser: this.reviewerForm.reviewerName,
                contactInfor: this.reviewerForm.telphone
              };
              softwareTaskApi.syTaskFinshed(data).then(response => {
                console.log(response);
                if (response.code === 200) {
                  this.$router.push({
                    path: "/admin/softwareUpload/showStatus"
                  });
                }
              });
            } else {
              let stageNum = parseInt(this.taskInfoForm.stage);
              let softwareVersionList = [];
              for (let num = 0; num < this.softwareVoList.length; num++) {
                softwareVersionList.push({
                  id: this.softwareVoList[num].versionId,
                  // softwareId:this.softwareVoList[num].id,
                  systatus: this.softwareVoList[num].systatus
                });
              }
              let data = {
                id: this.taskInfoForm.id,
                stage: stageNum,
                status: 0,
                syReport: JSON.stringify(this.syReport),
                softwareVersionList: JSON.parse(
                  JSON.stringify(softwareVersionList)
                )
              };
              softwareTaskApi.syTaskFinshed(data).then(response => {
                console.log(response);
                if (response.code === 200) {
                  this.$router.push({
                    path: "/admin/softwareUpload/showStatus"
                  });
                }
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    passProcess() {
      if (this.showSystemStage(this.taskInfoForm.stage) === "检测申请审核") {
        this.$confirm("要提交上级审批吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let stageNum = parseInt(this.taskInfoForm.stage) + 1;
            let data = {
              id: this.taskInfoForm.id,
              stage: stageNum,
              status: 0,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            };
            softwareTaskApi.afTaskAudit(data).then(async response => {
              if (response.code === 200) {
                this.$router.push({ path: "/admin/softwareUpload/showStatus" });
              }
            });
          })
          .catch(error => {
            console.log(error);
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$confirm("要通过该流程吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let stageNum = parseInt(this.taskInfoForm.stage) + 1;
            let data = {
              id: this.taskInfoForm.id,
              stage: stageNum,
              status: 0,
              contactUser: this.reviewerForm.reviewerName,
              contactInfor: this.reviewerForm.telphone
            };
            softwareTaskApi.afTaskAudit(data).then(async response => {
              if (response.code === 200) {
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
    uploadSecurityDetectionReport() {
      this.afreportVisible = true;
    },
    uploadSoftwareTrialReport(params) {
      console.log("application", params);
      let file = params.file;
      let formData = new FormData();
      formData.append("file", file);
      application.commonFileUpload(formData).then(response => {
        if (response.code === 200) {
          let date = new Date();
          let year = date.getFullYear();
          let month =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          let hour =
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          let minute =
            date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes();
          let second =
            date.getSeconds() < 10
              ? "0" + date.getSeconds()
              : date.getSeconds();
          this.syReport.push({
            fileName: response.data.originalFilename,
            path: response.data.fileName,
            syUnitId: this.userInfo.organizationId,
            syUnit: this.userInfo.organization,
            syUser: this.userInfo.userId,
            ctime:
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
          });
          console.log(this.syReport, this.userInfo);
        }
      });
    },
    showCollapse() {}
  }
};
</script>
<style scoped>
.headerTitle {
  border-left: 4px #409eff solid;
  line-height: 40px;
  height: 40px;
  padding-left: 10px;
  font-size: 16px;
  background: #c5d7e9;
}
.el-table th.is-leaf,
>>> .el-table td {
  border: 0px solid gray;
}
.uploadRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.inCardDiv {
  margin: 0 20px;
}
.notClick {
  pointer-events: none;
}
#taskInfoForm .el-form-item {
  margin-bottom: 0;
}
.el-form >>> .el-form-item__label {
  /* text-align: justify;
  text-align-last: justify; */
  font-size: 16px;
  font-weight: 500;
}
#certificateAFForm .el-form-item {
  margin-bottom: 0;
}
#syTableId >>> .el-table th.is-leaf,
.el-table td {
  border-bottom: 1px solid transparent;
}
.bigStagePass {
  background-color: green;
}
.bigStageRefuse {
  background-color: #ff5a5a;
}
.bigStageDoing {
  background-color: #ffe000;
}
::v-deep .el-checkbox__inner {
  border: 1px solid #9a9a9a;
}
</style>