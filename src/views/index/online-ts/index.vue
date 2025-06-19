<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12">
        <div style="display: flex;align-items: center;height: 40px;">
          <img style="height:20px;width:20px;" src="@/assets/index/tsQuestion.png" />
          <span style="font-size:16px;font-weight:bold;margin-left:10px;">技术支持</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div
          style="display: flex;align-items: center;height: 40px;justify-content: right;justify-content: flex-end;"
        >
          <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <el-card style="height:calc(100vh - 160px)">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- <el-tab-pane label="全部技术支持" name="first">
            <div style="margin-bottom:10px;">
              <el-row :gutter="10">
                  <el-col :span="16">
                      <el-select v-model="search.status" size="small"
                          style="width:200px;"
                          placeholder="技术支持状态"
                          filterable remote reserve-keyword >
                          <el-option label="已解决" value="1"></el-option>
                          <el-option label="处理中" value="2"></el-option>
                          <el-option label="未解决" value="3"></el-option>
                      </el-select>
                      <el-select v-model="search.status" size="small"
                          style="width:200px;margin:0 10px"
                          placeholder="软件名称"
                          filterable remote reserve-keyword >
                          <el-option label="软件1" value="1"></el-option>
                          <el-option label="软件2" value="2"></el-option>
                          <el-option label="软件3" value="3"></el-option>
                      </el-select>
                      <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;" placeholder="关键字"></el-input>
                      <el-button size="small" style="margin-left:10px" type="primary" >搜索</el-button>
                      <el-button size="small" style="background:gray;color:white" >重置</el-button>
                  </el-col>
                  <el-col  :span="8" style="text-align:right">
                        <el-button size="small" type="primary" @click="tsVisible=true" >技术支持提报</el-button>
                    </el-col>
              </el-row>
                提报技术支持
                <el-dialog v-el-drag-dialog :visible.sync="tsVisible" title="提报技术支持" @dragDialog="handleDrag" width="50%">
                  <el-form name="tsForm" ref="tsForm" :model="tsForm" label-position="right" label-width="100">
                      <el-form-item label="表单标题" :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]">
                          <el-input v-model="tsForm.name" size="small" style="width:80%"></el-input>
                      </el-form-item>
                      <el-form-item label="关联软件" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]">
                          <el-select v-model="tsForm.type" size="small" style="width:80%">
                              <el-option value="1" label="培训材料"></el-option>
                              <el-option value="2" label="故障案例"></el-option>
                              <el-option value="3" label="视频课件"></el-option>
                              <el-option value="4" label="专家答疑"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="支持类型" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]">
                          <el-select v-model="tsForm.type" size="small" style="width:80%">
                              <el-option value="1" label="培训材料"></el-option>
                              <el-option value="2" label="故障案例"></el-option>
                              <el-option value="3" label="视频课件"></el-option>
                              <el-option value="4" label="专家答疑"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="表单内容" :rules="[{required:true,message:'请选择技术支持项',trigger:'blur'}]">
                        <markdown-editor ref="markdownEditor" v-model="tsForm.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="300px"   />
                      </el-form-item>
                  </el-form>
                    <span slot="footer">
                        <el-button size="small" type="primary">提交</el-button>
                        <el-button size="small" type="info" @click="tsVisible=false">取消</el-button>
                    </span>
                </el-dialog>
            </div>
          <TsItem v-for="(item,index) in questionData" :data="item" :flag="flag" :key="index" @getSoftwareQuestion="getSoftwareQuestion" />
        </el-tab-pane>-->
        <el-tab-pane label="我的技术支持" name="second">
          <!--          <div style="margin-bottom:10px;">-->
          <!--            <el-row :gutter="10">-->
          <!--              <el-col :span="16">-->
          <!--                <el-select-->
          <!--                  v-model="search.status"-->
          <!--                  size="small"-->
          <!--                  style="width:200px;"-->
          <!--                  placeholder="技术支持状态"-->
          <!--                  filterable-->
          <!--                  remote-->
          <!--                  reserve-keyword-->
          <!--                >-->
          <!--                  <el-option label="已解决" value="2" />-->
          <!--                  <el-option label="处理中" value="1" />-->
          <!--                  <el-option label="未解决" value="0" />-->
          <!--                </el-select>-->
          <!--                &lt;!&ndash; <el-select v-model="search.status" size="small"-->
          <!--                          style="width:200px;margin:0 10px"-->
          <!--                          placeholder="软件名称"-->
          <!--                          filterable remote reserve-keyword >-->
          <!--                          <el-option label="软件1" value="1"></el-option>-->
          <!--                          <el-option label="软件2" value="2"></el-option>-->
          <!--                          <el-option label="软件3" value="3"></el-option>-->
          <!--                      </el-select> &ndash;&gt;-->
          <!--                <el-input v-model="search.keyword" size="small" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字" />-->
          <!--                <el-button size="small" class="my-btn-color" style="margin-left:10px" @click="searchSupport">搜索</el-button>-->
          <!--                <el-button size="small" type="info" @click="searchSupportReset">重置</el-button>-->
          <!--              </el-col>-->

          <!--              <el-col :span="8" style="text-align:right">-->
          <!--                <el-button size="small" type="primary" @click="handleAdd()">技术支持提报</el-button>-->
          <!--              </el-col>-->
          <!--            </el-row>-->

          <!--            &lt;!&ndash; 提报技术支持 &ndash;&gt;-->
          <el-dialog
            :visible.sync="tsVisible"
            title="提报技术支持"
            width="800px"
            @dragDialog="handleDrag"
          >
            <el-form
              ref="tsFormSupport"
              name="tsFormSupport"
              :model="tsFormSupport"
              label-position="top"
              label-width="100px"
            >
              <el-form-item
                label="问题标题"
                :rules="[{required:true,message:'标题不能为空',trigger:'blur'}]"
                prop="title"
              >
                <el-input v-model="tsFormSupport.title" size="small" style="width:100%" />
              </el-form-item>
              <el-form-item
                name="softwareId"
                label="关联软件"
                :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]"
                prop="softwareId"
              >
                <el-select
                  v-model="tsFormSupport.softwareId"
                  filterable
                  placeholder="请选择关联的软件"
                  style="width:100%"
                  @change="selectSoftwareChange"
                >
                  <el-option
                    v-for="item in softwareList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item name="tsFormSupport" label="关联版本" :rules="[{required:true,message:'请选择软件的版本',trigger:'blur'}]" prop="software_id"> -->
              <el-form-item name="softwareVersionId" :rules="[{required:true,message:'请选择软件版本',trigger:'change'}]" label="关联版本" prop="softwareVersionId">
                <el-select
                  v-model="tsFormSupport.softwareVersionId"
                  filterable
                  placeholder="请选择软件的版本"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in softwareVersionList"
                    :key="item.value"
                    :label="item.version"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="关联软件" :rules="[{required:true,message:'请选择关联的软件',trigger:'blur'}]" prop="software_id">
                    <el-input  v-model="tsForm.softwareName" size="small" style="width:90%">
                        <template slot="append">
                            <el-button type="primary">选择软件</el-button>
                        </template>
                    </el-input>
              </el-form-item>-->
              <el-form-item
                label="问题内容"
                name="content"
                prop="content"
                :rules="[{required:true,message:'请填写问题内容',trigger:'blur'}]"
              >
                <!-- <markdown-editor ref="markdownEditor" v-model="tsFormSupport.content" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="300px" /> -->
                <el-input
                  type="textarea"
                  v-model="tsFormSupport.content"
                  show-word-limit
                  maxlength="200"
                  :rows="5"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer">
              <el-button size="small" type="primary" @click="submitSupport">提交</el-button>
              <el-button size="small" type="info" @click="tsVisible=false">取消</el-button>
            </span>
          </el-dialog>
          <!--          </div>-->
          <el-row>
            <el-col :span="12" style="border-right:1px solid rgba(154,159,161,0.5);">
              <div calss="status-btn" style="text-align:right;margin-right: 10px;margin-top: 15px">
                <el-row>
                  <el-col :span="10" style="text-align: left">
                    <el-button size="small" type="primary" @click="handleAdd()">技术支持提报</el-button>
                  </el-col>
                  <el-col :span="14">
                    <el-radio-group v-model="search.status" @change="searchSupport()">
                      <el-radio-button :label="0">未解决</el-radio-button>
                      <el-radio-button :label="1">处理中</el-radio-button>
                      <el-radio-button :label="2">已处理</el-radio-button>
                    </el-radio-group>
                    <!-- <el-input
                      v-model="search.keyword"
                      size="small"
                      suffix-icon="el-icon-search"
                      style="width:200px;margin-left:10px;"
                      placeholder="关键字"
                    /> -->
                  </el-col>
                </el-row>
              </div>
              <el-collapse
                v-model="activeTsQusetion"
                accordion
                style="margin-top: 10px;height: calc(100vh - 400px);overflow-y:auto;"
              >
                <el-collapse-item
                  v-for="(item, index) in tsQuestionData"
                  :key="index"
                  :name="index"
                >
                  <span
                    slot="title"
                    class="collapse-title"
                    size="mini"
                    type="text"
                    @click="handleTsClick(item)"
                  >
                    <el-row>
                      <el-col :span="18">
                        <div style="font-weight:bold;font-size:16px">
                          {{ item.title }}
                          <el-tag
                            size="mini"
                            style="height: 20px;line-height: 20px;"
                          >{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="6" style="text-align:right;padding-right:20px" class="btn-ts">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-s-comment"
                        >回复（{{ item.answerTotal }}）</el-button>
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          @click="deleteSoftwareQuestion(item)"
                        >删除</el-button>
                        <!--                  <el-button v-if="item.status!=2" size="mini" icon="el-icon-circle-check" type="text" @click="closeDemand(item)">关闭</el-button>-->
                      </el-col>
                    </el-row>
                  </span>
                  <el-row>
                    <el-col
                      :span="24"
                      style="padding-left: 25px;color: rgba(86,86,86,1)"
                    >{{ item.content }}</el-col>
                    <el-col :span="24" style="padding-left: 25px;margin-top:5px">
                      <el-row>
                        <el-col :span="6" class="ts-col-label">
                          软件名称：
                          <span>{{ item.softwareName }}</span>
                        </el-col>
                        <el-col :span="4" class="ts-col-label">
                          软件版本:
                          <span>{{ item.softwareVersion }}</span>
                        </el-col>
                        <el-col :span="6" class="ts-col-label">
                          研发单位:
                          <!--                          <span>{{ item.status==0?'未解决':(item.status==1?'处理中':'已解决') }}</span>-->
                          <span>{{ item.devUnit }}</span>
                        </el-col>
                        <el-col :span="4" class="ts-col-label">
                          提报人员:
                          <span>{{ item.cname}}</span>
                        </el-col>
                        <el-col :span="4" class="ts-col-label">
                          提报时间：
                          <span>{{ item.ctime| parseTime('{y}-{m}-{d}') }}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <el-pagination
                style="margin-top:15px;"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
              ></el-pagination>
            </el-col>
            <el-col :span="12">
              <el-row style="margin-top: 15px">
                <el-col :span="2" style="text-align: right">
                  <img :src="avatar+'?imgSource'" class="user-avatar" :onerror="defaultA" />
                </el-col>
                <el-col :span="22" style="padding-left: 20px">
                  <el-input :disabled="judgeEmptyObject()" placeholder="点击可回复" style="width: 80%" v-model="replyMessage">
                    <el-button :disabled="judgeEmptyObject()" slot="append" size="small" @click="replyAnswer">回复</el-button>
                  </el-input>
                </el-col>
              </el-row>
              <el-divider />
              <el-timeline style="padding-right: 10px;padding-top: 5px;height: calc(100vh - 440px);overflow-y:auto;">
                <el-timeline-item
                  v-for="(item1,index) in this.softwareQuestionAnswers"
                  :key="index"
                  :timestamp="item1.cname"
                  icon="el-icon-user-solid"
                  placement="top"
                >
                  <el-card style="border: none">
                    <div class="title">
                      <div style="color: rgba(63,63,63,1);word-break: break-all;">{{ item1.description }}</div>
                      <div
                        v-if="item1.tsDataVo && item1.tsDataVo.path"
                        style="font-size:12px;color:#3478d4;"
                      >
                        <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                        <el-button
                          @click="downloadData(item1.tsDataVo)"
                          style="color:#3478d4"
                          type="text"
                          size="mini"
                        >{{item1.tsDataVo.name}}</el-button>
                      </div>
                      <span
                        style="color: rgba(149,149,163,1);font-size: 12px;"
                      >{{ item1.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      <!-- <el-link icon="el-icon-chat-square" @click="replyDemand(item1)">回复</el-link> -->
                      <span class="btn-ts">
                        <el-button
                          icon="el-icon-s-comment"
                          size="small"
                          type="text"
                          title="回复"
                          style="margin-left:6px"
                          @click="replyTwo(item1)"
                        >（{{ item1.childrenPage.total }}）</el-button>
                        <el-button
                          icon="el-icon-delete"
                          size="small"
                          type="text"
                          style="margin-left:6px"
                          title="删除"
                          @click="deleteSoftwareQuestionAnswer(item1)"
                        />
                        <el-button
                          v-if="!item1.open"
                          icon="el-icon-arrow-down"
                          size="small"
                          type="text"
                          title="展开"
                          v-show="item1.childrenPage.total>0"
                          @click="item1.open=!item1.open"
                        ></el-button>
                        <el-button
                          v-else
                          icon="el-icon-arrow-up"
                          size="small"
                          type="text"
                          title="收起"
                          v-show="item1.childrenPage.total>0"
                          @click="item1.open=!item1.open"
                        ></el-button>
                      </span>
                    </div>
                  </el-card>
                  <el-timeline
                    v-show="item1.open == true"
                    style="padding-right: 40px;padding-top: 5px"
                  >
                    <el-timeline-item
                      v-for="(replyItem,index) in item1.childrenPage.list"
                      :key="index"
                      :timestamp="replyItem.cname"
                      icon="el-icon-user-solid"
                      placement="top"
                    >
                      <!-- <div class="replay"> -->
                      <el-card style="border: none">
                        <div class="title">
                          <div>{{ replyItem.description }}</div>
                          <div
                            v-if="replyItem.tsDataVo && replyItem.tsDataVo.path"
                            style="font-size:12px;color:#3478d4;"
                          >
                            <i class="el-icon-files" style="font-size:12px;color:#3478d4;"></i> &nbsp;&nbsp;
                            <el-button
                              @click="downloadData(replyItem.tsDataVo)"
                              style="color:#3478d4"
                              type="text"
                              size="mini"
                            >{{replyItem.tsDataVo.name}}</el-button>
                          </div>
                          <span
                            style="color: rgba(149,149,163,1);font-size: 12px;"
                          >{{ replyItem.ctime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                          <el-button
                            icon="el-icon-s-comment"
                            size="small"
                            type="text"
                            title="回复"
                            style="margin-left:6px"
                            @click="replyTwo(replyItem)"
                          ></el-button>
                        </div>
                      </el-card>
                      <!-- </div> -->
                    </el-timeline-item>

                    <el-pagination
                      style="margin-top:15px;"
                      v-if="item1.childrenPage.totalPage>1"
                      :page-size="item1.childrenPage.pageSize"
                      layout=" prev, pager, next"
                      :current-page="rightPageNumOne"
                      :total="item1.childrenPage.total"
                      @current-change="answerHleCurrentChange($event,item1)"
                    />
                  </el-timeline>
                </el-timeline-item>
              </el-timeline>
              <el-pagination
                style="margin-top:15px;"
                v-if="softwareQuestionAnswer.totalPage>1"
                :page-size="softwareQuestionAnswer.pageSize"
                layout="prev, pager, next,jumper"
                :current-page="rightPageNumTwo"
                :total="softwareQuestionAnswer.total"
                @current-change="answerHandleCurrent($event)"
              />
            </el-col>
          </el-row>

          <!--          <TsItem v-for="(item,index) in tsQuestionData" :key="index" :data="item" :typeData="typeData" @getSoftwareQuestion="getTsQuestionList" />-->
          <!--          <div v-if="tsQuestionData.length==0" style="text-align:center;">-->
          <!--            <el-image :src="require('@/assets/index/nodata.png')"  style="height:600px"></el-image>-->
          <!--          </div>-->
          <!--          <el-pagination-->
          <!--            style="margin-top:15px;"-->
          <!--            v-if="total>0"-->
          <!--            :current-page="pageNum"-->
          <!--            :page-size= pageSize-->
          <!--            layout="total, sizes, prev, pager, next, jumper"-->
          <!--            :total= total-->
          <!--            @size-change="handleSizeChange"-->
          <!--            @current-change="handleCurrentChange"-->
          <!--          />-->
        </el-tab-pane>
        <el-tab-pane label="技术支持资料" name="third">
          <TsResource />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--问题回答-->
    <el-dialog :visible.sync="dialogVisible" title="回复">
      <el-form
        ref="questionForm"
        name="questionForm"
        :model="questionForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="回复内容：" prop="content" :rules="[{required:true,message:'内容不能为空',trigger:'blur'}]">
          <el-input
            v-model="questionForm.content"
            size="small"
            :rows="7"
            type="textarea"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="附件上传：">
          <el-upload
            style="display:inline-block;"
            action="#"
            :multiple="false"
            :file-list="fileList"
            :show-file-list="false"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :http-request="
            (file) => {
              return uploadFile(file)
            }"
            :on-change="handleChangeFile"
            accept=".mp4, .docx, .pdf"
            class="editor-slide-upload"
          >
            <div>
              <el-button class="file-btn" size="small" type="primary">附件上传</el-button>
            </div>
          </el-upload>
        </el-form-item>
        <el-table
          v-if="tsDataVoList.length>0"
          :data="tsDataVoList"
          size="mini"
          style="margin:10px;"
        >
          <el-table-column min-width="200px" label="资料名称">
            <template slot-scope="{row}">
              <template>
                <el-input v-model="row.name" class="edit-input" size="small" />
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料类型" prop="category">
            <template slot-scope="scope">
              <el-select v-model="scope.row.typeId" @change="changeTsDataTypeName(scope.$index)" size="small" style="width:80%">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item,index) in typeData"
                  :key="index"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color:red;"
                @click="handleRemoveDataFile(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="replyConfirm">确定</el-button>
        <el-button size="small" type="info" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as question from "@/api/question";

import * as software from "@/api/software";
import Treeselect from "@riophae/vue-treeselect";
import elDragDialog from "@/directive/el-drag-dialog";
import MarkdownEditor from "@/components/MarkdownEditor";
import * as category from "@/api/category";
import * as ts from "@/api/ts";
import { parseTime } from "@/utils";
export default {
  components: {
    TsItem: () => import("./software-ts-item.vue"),
    TsResource: () => import("./software-ts-resource.vue"),
    MarkdownEditor
  },
  data() {
    return {
      activeTsQusetion: 0,
      devUnitList: [],
      activeName: "second",
      dialogVisible: false,
      fileData: {},
      questionForm: {
        content: "",
        tsDataVo: {
          name: ""
        }
      },
      tsDataVoList: [],
      fileList: [],
      uploadDialogVisible: false,
      tsVisible: false,
      infoDlgVisible: false,
      avatar: "",
      defaultA: 'this.src="' + require("@/assets/index/avatar.png") + '"',
      replyMessage: "",
      search: {
        typeId: "",
        status: 0,
        keyword: ""
      },
      infoData: {},
      tsQuestionData: [],
      tsData: [],
      zpForm: {},
      tsForm: {
        name: "",
        type: "",
        typeId: ""
      },
      tsFormSupport: {
        cid: "",
        title: "",
        content: "",
        softwareId: "",
        softwareName: "",
        softwareVersionId: "",
        softwareVersion: "",
        devUnit: "",
        status: 0
      },
      fileData: {},
      fileData1: {},
      typeData: [],
      pageNum: 1,
      pageSize: 10,
      totalData: 0,
      totalPageData: 0,
      total: 0,
      totalPage: 0,
      softwareList: [],
      softwareVersionList: [],
      userInfo: {},
      currentTsQuestion: {},
      softwareQuestionAnswers: {},
      softwareQuestionAnswer: {},
      rightPageNumOne: 1,
      rightPageNumTwo: 1
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.getCategoryList();
    this.getTsQuestionList();
    this.getAllSoftware();
  },
  methods: {
    judgeEmptyObject() {
      if(Object.keys(this.currentTsQuestion).length == 0) {
        return true
      }else{
        return false
      }
    },
    //下载技术支持资料
    downloadData(row){
      console.log(row)
      this.$download.dowanlodByPathHerf(row.path, row.name)
    },
    changeTsDataTypeName(index) {
      for(let num = 0;num < this.typeData.length;num++){
        if(this.typeData[num].id === this.tsDataVoList[index].typeId){
          this.tsDataVoList[index].typeName = this.typeData[num].name
        }
      }
    },
    answerHandleCurrent(current, item) {
      this.rightPageNumTwo = current;
      // let questionItem = this.tsQuestionList[this.activeTsName];
      let questionItem = this.currentTsQuestion;
      this.getSupportAnswer(questionItem.id);
    },
    answerHleCurrentChange(current, item) {
      let params = {
        questionId: item.tsQuestionId,
        answerId: item.id,
        pageNum: current,
        pageSize: item.childrenPage.pageSize
      };
      // this.answerPageNum
      ts.getSupportAnswerPage(params).then(response => {
        if (response.code === 200) {
          let result = response.data;
          item.childrenPage = result;
        }
      });
    },
    async uploadFile(param) {
      this.fileData = param.file;
      // this.questionForm.tsDataVo.name = param.file.name
      this.tsDataVoList = [
        {
          name: param.file.name,
          typeId: this.typeData[0].id,
          typeName: this.typeData[0].name
        }
      ];
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess() {},
    beforeUpload() {},
    handleChangeFile(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [file];
    },
    handleRemoveDataFile(index, item) {
      delete this.fileData;
      this.tsDataVoList.splice(index, 1);
    },
    replyTwo(answer) {
      // debugger
      let question = this.currentTsQuestion;

      this.dialogVisible = true;
      // 重置表单
      // this.resetForm('questionForm');
      this.questionForm = {};
      // 重置文件列表
      this.tsDataVoList = [];
      this.fileData = null;
      // console.log(this.$route)
      console.log(answer, 9999);
      if (answer != null) {
        this.questionForm.pid = answer.id;
        this.questionForm.receiveId = answer.cid;
        this.questionForm.receiver = answer.cname;
        this.questionForm.firstLevelPid =
          answer.firstLevelPid == 0 ? answer.id : answer.firstLevelPid;
      } else {
        // this.questionForm.receiveId = this.data.cid
        // this.questionForm.receiver = this.data.cname
      }
    },
    replyConfirm() {
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          this.$modal.loading();
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let formData = new FormData();
          formData.append("files", this.fileData);
          formData.append("tsQuestionId", this.currentTsQuestion.id);
          formData.append("description", this.questionForm.content);
          formData.append("cid", userInfo.userId);
          formData.append("pid", this.questionForm.pid ? this.questionForm.pid : 0);
          formData.append(
            "firstLevelPid",
            this.questionForm.firstLevelPid ? this.questionForm.firstLevelPid : 0
          );
          if (this.questionForm.receiveId) {
            formData.append("receiveId", this.questionForm.receiveId);
          }
          if (this.questionForm.receiver) {
            formData.append("receiver", this.questionForm.receiver);
          }

          if (this.tsDataVoList.length > 0) {
            this.tsDataVoList.forEach((obj, index) => {
              for (var item in obj) {
                formData.append("tsDataVoList[" + index + "]." + item, obj[item]);
              }
            });
          }
          ts.reply(formData).then(response => {
            this.$modal.closeLoading();
            if (response.code === 200) {
              this.$message.success("回复成功");
              this.dialogVisible = false;
              // this.handleTsClick(this.currentTsQuestion);
              this.getTsQuestionList();
            }
          });
        }
      });
    },
    replyAnswer() {
      if (this.currentTsQuestion) {
        // console.log(this.currentTsQuestion, "this.currentTsQuestion");
        if(this.parseStrEmpty(this.replyMessage)=="") {
          this.$message.error("请输入回复内容");
          return false;
        }
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let formData = new FormData();
        formData.append("files", null);
        formData.append("tsQuestionId", this.currentTsQuestion.id);
        formData.append("description", this.replyMessage);
        formData.append("cid", userInfo.userId);
        formData.append("pid", 0);
        formData.append("firstLevelPid", 0);
        ts.reply(formData).then(response => {
          if (response.code === 200) {
            this.$message.success("回复成功");
            this.dialogVisible = false;
            // this.searchSupport();
            // this.handleTsClick(this.currentTsQuestion);
            this.replyMessage=''
            this.getTsQuestionList(); 
          }
        });
      }
    },
    handleTsClick(item) {
      this.rightPageNumOne = 1
      this.rightPageNumTwo = 1
      this.currentTsQuestion = item;
      this.getSupportAnswer(item.id);
    },
    deleteSoftwareQuestion(item) {
      this.$confirm("确定删除该评论吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delTsQuestion(item.id).then(response => {
          if (response.code === 200) {
            this.$emit("getSoftwareQuestion", this.flag);
            this.$message.success("删除成功");
            this.getTsQuestionList();
          }
        });
      });
    },
    deleteSoftwareQuestionAnswer(item) {
      this.$confirm("确定删除该评论吗？", "提示", {
        type: "warning"
      }).then(e => {
        ts.delQuestionAnswer(item.id).then(response => {
          if (response.code === 200) {
            this.$emit("getSoftwareQuestion", this.flag);
            this.$message.success("删除成功");
            this.getTsQuestionList();
          }
        });
      });
    },
    getSupportAnswer(questionId) {
      let params = {
        questionId: questionId,
        pageNum:this.rightPageNumTwo,
        pageSize:this.softwareQuestionAnswer.pageSize,
      };
      ts.getSupportAnswer(params).then(response => {
        if (response.code === 200) {
          let result = response.data;
          console.log(result, 999);
          this.softwareQuestionAnswers = [];
          if (result.data.list.length > 0) {
            result.data.list.forEach(item => {
              let info = JSON.parse(JSON.stringify(item));
              info.open = false;
              this.softwareQuestionAnswers.push(info);
            });
          }
          this.softwareQuestionAnswer = result.data;
        }
      });
    },
    handleDrag() {},
    // 选择关联软件版本
    selectSoftwareChange() {
      this.getSoftwareVersionById();
    },
    // 提交技术支持
    async submitSupport() {
      this.$refs.tsFormSupport.validate(async valid => {
        if(valid) {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          this.tsFormSupport.cid = userInfo.userId;
          for (let i = 0; i < this.softwareList.length; i++) {
            if (this.tsFormSupport.softwareId == this.softwareList[i].id) {
              this.tsFormSupport.softwareName = this.softwareList[i].name;
            }
          }
          for (let i = 0; i < this.softwareVersionList.length; i++) {
            if (
              this.tsFormSupport.softwareVersionId == this.softwareVersionList[i].id
            ) {
              this.tsFormSupport.softwareVersion = this.softwareVersionList[
                i
              ].version;
            }
          }
          const res = await ts.addTsQuestion(this.tsFormSupport);
          this.getCategoryList();
          this.getTsQuestionList();
          this.tsVisible = false;
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取分类列表
    getCategoryList() {
      category.getCategoryList("data_type").then(response => {
        if (response.code === 200) {
          this.typeData = response.data.list;
        }
      });
    },
    // 获取技术支持问题
    getTsQuestionList() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      ts.getTsQuestion(
        userInfo.userId,
        this.search.keyword,
        this.search.status,
        this.pageNum,
        this.pageSize
      ).then(response => {
        if (response.code === 200) {
          this.tsQuestionData = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          if (this.tsQuestionData.length > 0) {
            this.currentTsQuestion = JSON.parse(JSON.stringify(this.tsQuestionData[this.activeTsQusetion]))
            this.handleTsClick(this.currentTsQuestion);
            // this.activeTsQusetion = 0;
          }else{
            this.currentTsQuestion = {}
            // this.activeTsQusetion = 0;
          }
        }
      });
    },
    // 获取所有软件
    getAllSoftware() {
      ts.getAllSoftware().then(response => {
        if (response.code === 200) {
          this.softwareList = response.data;
        }
      });
    },
    getSoftwareVersionById() {
      ts.getSoftwareVersion(this.tsFormSupport.softwareId).then(response => {
        if (response.code === 200) {
          this.softwareVersionList = response.data;
        }
      });
    },
    // 软件研制单位
    getSoftwareDevUnitList() {
      software.getSoftwareDevUnit().then(response => {
        if (response.code === 200) {
          this.devUnitList = response.data;
        }
      });
    },
    searchSupport() {
      this.pageNum = 1;
      this.replyMessage = "";
      this.softwareQuestionAnswers = [];
      this.activeTsQusetion = 0;
      this.getTsQuestionList();
    },
    searchSupportReset() {
      this.search.keyword = "";
      this.search.status = "";
      this.search.typeId = "";
      this.pageNum = 1;
      this.getTsQuestionList();
    },

    // getSoftwareQuestion(flag) {
    //   ts.getTsQuestion(this.userInfo.userId,this.search.keyword,this.search.status,this.currentPage,this.pageSize).then(response=>{
    //     if(response.code==200){
    //       this.tsQuestionData=response.data.list;
    //       this.total=response.data.total;
    //       this.totalPage=response.data.totalPage;
    //     }
    //   })
    // },
    handleTabClick(tab) {
      switch (tab.name) {
        case "first":
          this.flag = 0;
          // this.getSoftwareQuestion(0)
          break;
        case "second":
          this.flag = 1;
          // this.getSoftwareQuestion(1)
          break;
        default:
          break;
      }
    },
    handleAdd() {
      this.tsVisible = true;
      this.tsFormSupport.content = "";
      this.resetForm("tsFormSupport");
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
    }
  }
};
</script>
<style scoped>
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
}
.ts-col-label {
  color: rgba(149, 149, 163, 1);
  font-size: 12px;
}
.ts-col-label > span {
  color: rgba(63, 63, 63, 1);
  font-size: 12px;
}
/deep/ .el-collapse-item__content {
  padding-bottom: 0px !important;
}
/deep/ .el-collapse .is-active .el-collapse-item__header,
/deep/ .el-collapse .is-active .el-collapse-item__content {
  background: rgba(23, 138, 227, 0.05);
}
/deep/ .el-collapse > .is-active {
  border-left: 2px solid rgba(23, 138, 227, 1);
}
.user-avatar {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
/deep/ .el-card__body {
  padding-bottom: 0px !important;
}
/deep/ .el-timeline-item__timestamp {
  color: rgba(23, 138, 227, 1);
}
/deep/ .el-timeline-item__node--normal {
  width: 20px;
  height: 20px;
  left: -5px;
}
/deep/ .el-button span {
  /*color: rgba(23,138,227,1);*/
}
.el-button--primary:active,
/deep/ .el-button--primary.is-active {
  color: #fff;
}
/deep/ .el-collapse {
  border-top: none;
  border-bottom: none;
}
/deep/ .btn-ts .el-button--text {
  color: rgba(86, 86, 86, 1);
}
</style>
