<template>
  <div style="margin:20px;" id="message">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="!$checkPermission(['admin'])" label="系统公告" name="first">
        <el-card style="height: calc(100vh - 160px)">
          <el-row style="border-bottom:none">
            <el-col
              :span="5"
              style="border-right:1px solid rgba(227, 227, 227, 1) ;height: calc(100vh - 240px )"
            >
              <el-table :data="data" :show-header="false" highlight-current-row ref="noticeTable" @row-click="show" style="height: calc(100vh - 250px)">
                <el-table-column>
                  <template slot-scope="{row}">
                    <div >
                      <div style="display:inline-block;margin:10px 10px 0 10px;float:left;">
                        <span
                          v-if="row.readTime"
                          style="display:inline-block;height:4px;width:4px;background:#05994e;border-radius:50%;"
                        ></span>
                        <span
                          v-else
                          style="display:inline-block;height:4px;width:4px;background:rgb(227,60,100);border-radius:50%;"
                        ></span>
                      </div>
                      <div style="display:inline-block;float:left;">
                        <div class="title" >{{ row.title }}</div>
                        <div class="time">{{ row.releaseDate }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:10px;text-align:center;">
                <el-pagination
                  style="margin-left:-20px;text-align:center;"
                  hide-on-single-page
                  layout="prev, pager, next"
                  :total="totalPage"
                  :pager-count="5"
                  :page.sync="currentPage"
                  :page-size.sync="pageSize"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-col>
            <el-col :span="19" style="padding:0px 20px 20px 20px;">
              <!-- <div slot="title"></div> -->
              <div v-if="!notice.id">
                <p style="text-align:center;color:rgb(149, 149, 163)">请点击左侧数据查看</p>
              </div>
              <div v-else>
                <h2
                  style="font-size:18px;font-weight: 500;color: rgba(2,6,31,1);text-align:center"
                >{{ notice.title }}</h2>
                <el-row>
                  <el-col
                    :span="6"
                    style="font-size:14px;font-weight: 400;color:rgba(149,149,163,1)"
                  >发布时间：{{ notice.releaseDate }}</el-col>
                  <el-col
                    :span="6"
                    style="font-size:14px;font-weight: 400;color:rgba(149,149,163,1)"
                  >发 布 人：{{ notice.cname }}</el-col>
                  <el-col
                    :span="6"
                    style="font-size:14px;font-weight: 400;color:rgba(149,149,163,1)"
                  >联 系 人：{{ notice.linkman}}</el-col>
                  <el-col
                    :span="6"
                    style="font-size:14px;font-weight: 400;color:rgba(149,149,163,1)"
                  >联系方式：{{ notice.linkmantel}}</el-col>
                </el-row>
                <div
                  style="height:calc(100vh - 400px);overflow-y:auto;font-size: 14px;font-weight: 400;color:rgba(86,86,86,1);margin-top:15px!important"
                >{{ notice.content }}
                </div>
                <el-row>
                </el-row>
                <div v-if="notice.path!=null"  style="margin-left: 10px">
                    <span style="font-size: 12px;font-weight: 400;color:rgba(23,138,227,1)">附件：</span>
                    <el-button icon="el-icon-download" size="small"
                      style="font-weight: 400;color:rgba(23,138,227,1)"
                      type="text"
                      @click="download"
                    >{{ JSON.parse(notice.path).fileName }}</el-button>
                  </div>
              </div>
            </el-col>
          </el-row>
          <!-- <div v-if="!notice" style="text-align:center;">
            <el-image :src="require('@/assets/index/nodata.png')" style="height:600px"></el-image>
          </div> -->
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="个人信息" :name="!$checkPermission(['admin'])?'second' :'first'">
        <!-- <el-card style="height: calc(100vh - 220px)">
          <el-row v-for="(item, index) in data" :key="index" :gutter="20" style="font-size: 16px;border-bottom: 1px solid rgba(227, 227, 227, 1);padding: 0px 10px">
            <h3 class="title">
              <i class="el-icon-chat-dot-round read-status" :class="{'is-read':item.readTime!=null}" />&nbsp;&nbsp;
              <span class="read-status" :class="{'is-read':item.readTime!=null}">{{ item.content }}</span>
              <el-button v-if="item.readTime==null" size="mini" type="primary" class="read-btn" @click="setRead(item)">设为已读</el-button>
              <el-button v-else size="mini" type="info" class="read-btn">消息已读</el-button>
              <span class="time read-status read-btn" :class="{'is-read':item.readTime!=null}" style="margin-right:20px;">
              <i class="el-icon-time" />
              {{ parseTime(item.ctime, '{y}-{m}-{d} {h}:{i}') }}
            </span>
            </h3>
            <div />
          </el-row>
         </el-card>
        <el-pagination
          v-if="totalPage>0"
          style="margin-top:15px;"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />-->
        <messageList></messageList>
      </el-tab-pane>
    </el-tabs>
    <!-- <detail :notice-visible-flag.sync="dialogVisible" :data="notice" /> -->
  </div>
</template>
<script>
import * as notice from "@/api/notice";
// import * as appConfig from "/public/config";
export default {
  components: {
    // detail: () => import("./show.vue"),
    messageList: () => import("./message.vue")
  },
  data() {
    return {
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      activeName: 'first',
      notice: {},
      dialogVisible: false,
      userInfo: {},
      data: []
    };
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    this.getNoticeList();
    let type = this.$route.query.type
    if(type!=null && type != '' && type=="message") {
      this.activeName = 'second'
    }
  },
  methods: {
    /* 分页大小改变事件
     * @param val pageSize大小
     */

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getNoticeList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getNoticeList();
    },
    getNoticeList() {
      notice
        .getNoticeList(
          this.userInfo.userId,
          null,
          this.currentPage,
          this.pageSize
        )
        .then(response => {
          if (response.code === 200) {
            this.data = response.data.list;
            this.totalPage = response.data.total;
            if (this.data.list.length > 0) {
              // this.notice=this.data[0]
              this.$refs.noticeTable.setCurrentRow(this.data[0]);
              this.notice = this.data[0];
            }
          }
        });
    },
    show(item) {
      this.notice = item;

      // 设置为已读
      let viewData = {
        tid: this.notice.id
      }
      
      if(!item.readTime) {
        notice.updateNoticeView(viewData).then(response => {
          item.readTime = response.data.time
        })
      }
    },
    download() {
      // notice.downNoticeFile(this.noticeData.id).then(response => {
      //   if (response.code === 200) {
      //     window.location.href = response.data
      //   }
      // })
      
      let pathInfo = JSON.parse(this.notice.path);
      this.$download.dowanlodByPath(pathInfo.filePath, pathInfo.fileName)
      // let url =
      //   appConfig.config.urlFilePrefix +
      //   "/" +
      //   pathInfo.filePath;
      // const a = document.createElement("a");
      // fetch(url)
      //   .then(res => res.blob())
      //   .then(blob => {
      //     a.href = URL.createObjectURL(blob);
      //     a.download = pathInfo.fileName;
      //     document.body.appendChild(a);
      //     a.click();

      //     window.URL.revokeObjectURL(a.href);
      //     document.body.removeChild(a);
      //   });
    }
  }
};
</script>

<style scoped lang="scss">
.row-selected {
  border: 2px solid rgb(23, 138, 227);
}
.read-btn {
  float: right;
}
.el-row {
  font-size: 16px;
  border-bottom: 1px solid rgba(227, 227, 227, 1);
  padding: 10px 0;
  cursor: pointer;
  .title {
    // font-weight: normal;
    font-size: 14px;
    font-weight: 500;
    color: rgb(2, 6, 31);
  }
  .time {
    font-size: 12px;
    color: rgba(116, 121, 140, 1);
    // padding-left: 18px;
    padding-bottom: 6px;
  }
  .el-icon-download:before {
    color: rgba(23, 138, 227, 1);
  }
}
::v-deep .el-tabs__header {
  background: white;
  padding: 0 20px;
}
::v-deep .el-table__body {
  tr.current-row {
    background: rgba(23, 138, 227, 0.05);
    border-left: 2px solid rgb(23, 138, 227);
    td {
      background: rgba(23, 138, 227, 0.05);
      border-left: 3px solid rgb(23, 138, 227);
    }
  }
}
</style>
