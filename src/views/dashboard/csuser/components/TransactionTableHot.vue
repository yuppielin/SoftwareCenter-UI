<template>
  <el-table :data="list" style="width: 100%;" :header-cell-style="{background:'#FF005A',color:'white',height:'30px'}">
    <el-table-column type="index" width="80" align="center" header-align="center" label="序号" />
    <el-table-column label="最热软件" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="下载次数" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.downloadCon }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'
import * as software from '@/api/software'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getHotSoftware()
  },
  methods: {
    // 获取最热成果列表
    getHotSoftware() {
      software.getHotSoftwareList(1).then(response => {
        this.list = response.data.list.slice(0, 8)
      }).catch(err => {
        console.log(err)
      })
    },
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
