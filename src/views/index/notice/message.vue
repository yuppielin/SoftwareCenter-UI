<template>
    <el-card style="height: calc(100vh - 160px);overflow-y: auto;">
      <div>
        <el-button size="mini" type="warning"  style="float:right;margin-right: -10px;" @click="setReadAll">全部已读</el-button>
      </div>
      <div style="clear:both"></div>
      <div>
        <el-row v-for="(item, index) in data" :key="index" :gutter="20">
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
      </div>
      <el-pagination
        v-if="totalPage>0"
        style="margin-top:15px;"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
</template>

<script>
import * as sysMessages from '@/api/sys-messages'

export default {

  data() {
    return {
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      data: []
    }
  },
  mounted() {
    this.listSysMessagesByUser()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.listSysMessagesByUser()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.listSysMessagesByUser()
    },
    listSysMessagesByUser() {
      sysMessages.listSysMessagesByUser({ pageNum: this.currentPage, pageSize: this.pageSize }).then(response => {
        if (response.code === 200) {
          this.data = response.data.list
          this.totalPage = response.data.total
        }
      })
    },
    setRead(item) {
      if (item.id == null) {
        this.$modal.msgError('参数不正确')
        return
      }
      sysMessages.read({ messageId: item.id }).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('设置成功')

          this.listSysMessagesByUser()
        }
      })
    },
    setReadAll() {
       sysMessages.readAll().then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('设置成功')

          this.listSysMessagesByUser()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  font-size: 14px;
  border-bottom: 1px solid rgba(227, 227, 227, 1);
//   cursor: pointer;
  .title {
    font-weight: normal;
  }
  .time {
    // float: right;
  }
  .read-btn{
    float: right;
  }
  .read-status{
    // color: #337ab7;
    font-size: 14px;
    &.is-read{
      color:gray;
    }
  }
}
</style>
