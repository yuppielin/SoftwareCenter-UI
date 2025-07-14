<template>
  <el-row id="message" :gutter="10">
    <el-col :span="18" style="overflow:hidden">
      <el-tooltip 
        class="item" 
        effect="dark" 
        :content="item.title" 
        placement="top" 
        :disabled="!isContentOverflow"
        popper-class="notice-tooltip"
      >
        <div class="notice-container">
          <div class="software-line" v-if="item.softwareName">
            <i v-if="item.isTop==1" style="color:red;font-size: 14px;" class="el-icon-s-flag"></i>
            <span class="software-name-tag">{{ item.softwareName }}</span>
          </div>
          <div class="content-line">
            <i v-if="item.isTop==1 && !item.softwareName" style="color:red;font-size: 14px;" class="el-icon-s-flag"></i>
            <span class="content-text">{{ item.title }}</span>
          </div>
        </div>
      </el-tooltip>
    </el-col>
    <el-col :span="6">
      <span class="title"> {{ parseTime(item.ctime, '{y}-{m}-{d}') }}</span>
    </el-col>
  </el-row>
</template>
<script>
import { parseTime } from "@/utils/common";

export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isContentOverflow: false
    }
  },
  methods: {
    parseTime,
    checkOverflow() {
      this.$nextTick(() => {
        const contentEl = this.$el.querySelector('.content-text');
        if (contentEl) {
          this.isContentOverflow = contentEl.scrollWidth > contentEl.clientWidth;
        }
      });
    }
  },
  watch: {
    item: {
      handler() {
        this.checkOverflow();
      },
      immediate: true
    }
  },
  mounted() {
    this.checkOverflow();
    window.addEventListener('resize', this.checkOverflow);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkOverflow);
  }
}
</script>
<style scoped lang="scss">
#message{
    height: 50px;
    line-height: normal;
    cursor: pointer;
    margin-bottom: 5px;
    
    .type{
        width: 60px;
        height: 20px;
        line-height: 16px;
        border-radius: 0 6px;
        color: white;
        margin-top:7px;
        padding: 2px;
        text-align: center;
        span{
          font-size: 4px;
        }
    }
    
    .notice-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }
    
    .software-line {
      height: 16px;
      line-height: 16px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
    }
    
    .content-line {
      height: 20px;
      line-height: 20px;
      display: flex;
      align-items: center;
    }
    
    .content-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 13px;
      width: 100%;
    }
    
    .title{
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 100%;
    }
    
    .date{
        color: rgba(149,149,163,1);
        font-size: 10px;
    }
    
    .software-name-tag {
        position: relative;
        margin-right: 5px;
        font-size: 10px;
        padding: 0 5px;
        border-radius: 4px;
        color: #fff;
        white-space: nowrap;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        background-color: #1890ff;
        border-color: #1890ff;
    }

  // .ribbon_notice {
  //   background: red;
  //   overflow: hidden;
  //   white-space: nowrap;
  //   position: absolute;
  //   left: -30px;
  //   top: 10px;
  //   transform: rotate(-45deg);
  //   /* box-shadow: 0 0 10px #888; */
  // }

  // .ribbon_notice span {
  //   /* border: 1px solid #54CBFF; */
  //   color: #fff;
  //   display: block;
  //   margin: 1px 0;
  //   padding: 0 10px;
  //   text-align: center;
  //   /* text-shadow: 0 0 5px #444; */
  //   font-size: 10px;
  // }
}
</style>
<style>
.notice-tooltip {
  max-width: 400px !important;
  line-height: 1.5;
  padding: 8px 12px;
  word-break: break-word;
}
</style>
