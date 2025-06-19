<template>
  <el-dialog v-el-drag-dialog :visible="visible" title="添加专题软件" @close="close">
    <el-input size="mini" v-model="queryStr" placeholder="关键字" @keyup.enter.native="getSoftwareList" />
    <div v-if="selectedList.length>0" style="margin-top:10px;font-size:12px;">
      <i class="el-icon-s-grid" />
      已选择{{ selectedList.length }}个软件
    </div>
    <el-table size="mini" :data="softwareData" ref="softwareData" :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" style="margin:10px 0;" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="软件名称" show-overflow-tooltip />
      <el-table-column prop="version" label="软件版本" width="100" />
      <el-table-column prop="type" label="软件类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.type === 'serviceSeg' ? '服务端' : scope.row.type === 'mobileSeg' ? '移动端' : '应用端'}}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="软件描述" show-overflow-tooltip />
<!--      <el-table-column label="操作" width="80">-->
<!--        <template slot-scope="scoped">-->
<!--          <el-button type="text" icon="el-icon-circle-plus" />-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
      style="margin-top:20px;"
      :current-page.sync="currentPage"
      background
      :page-count="10"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
      @current-change="handleCurrentChange">
    </el-pagination>
    <span slot="footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="addSpecialSoftware">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import * as software from '@/api/software'
import * as special from '@/api/special'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    specialInfo: {
      type: Object,
    }
  },
  data() {
    return {
      softwareData: [],
      selectedList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      queryStr: null
    }
  },
  watch: {
    specialInfo() {
      this.getSoftwareList()
    }
  },
  mounted() {
  },
  methods: {
    getSoftwareList() {
      software.searchSoftwareList(null, this.queryStr, 1, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.softwareData = response.data.list
          this.totalCount = response.data.total
          this.$nextTick(function() {
            this.softwareData.forEach((item, index) => {
              this.specialInfo.softwareVos.forEach(i => {
                if (item.identity === i.identity) {
                  // this.softwareData.splice(index, 1)
                  this.$refs.softwareData.toggleRowSelection(item, true)
                }
              })
            })
          })
        }
      })
    },
    addSpecialSoftware() {
      if (this.selectedSoftwareIds) {
        special.addSpecialSoftware(this.specialInfo.id, this.selectedSoftwareIds).then(response => {
          if (response.code === 200) {
            this.visible = false
            this.$message.success('成功添加软件到专题')
          }
        })
      }
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getSoftwareList()
    },
    close() {
      this.$emit('close', false)
    },
    handleSelectionChange(val) {
      this.selectedList = val
      this.selectedSoftwareIds = val.map(item => item.id).toString()
    }
  }
}
</script>
