<template>
  <div style="margin-top:60px;">
    <theme-item v-for="(item,index) in themeData" :key="index" style="width:23.8%;margin:10px;float:left;" :data="item" />
    <div class="theme-page">
      <el-pagination
        style="margin-top:15px;"
        :current-page="currentPage"
        :page-size= pageSize
        layout="total, prev, pager, next, jumper"
        :total= totalCount
      />
    </div>
  </div>
</template>
<script>
import themeItem from '../components/software-theme-item'
import * as special from '@/api/special'
export default {
  props: {
    data: {
      type: Object,
      default: null,
      required: true
    }
  },
  components: {
    themeItem
  },
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      themeData: []
    }
  },
  mounted() {
    this.getSpecialList()
  },
  methods: {
    getSpecialList() {
      special.getSpecialList(null, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.themeData = response.data.list
          this.totalCount = response.data.total
        }
      })
    }
  }
}
</script>
<style>
.theme-page{
    position:absolute;
    bottom:0px;
    clear: both;
}
</style>
