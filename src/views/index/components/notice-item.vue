<template>
  <el-row id="message" :gutter="10">
    <el-col :span="18" style="overflow:hidden">
      <el-tooltip 
        class="item" 
        effect="dark" 
        :content="item.content" 
        placement="top" 
        :disabled="!isContentOverflow"
        popper-class="notice-tooltip"
      >
        <div class="title">
          <!-- <img v-if="item.isTop==1" :src="require('@/assets/imgs/top4.png')" alt="" style="margin-right: -10px;" width="12px" height="12px"/> -->
          <!-- <span v-if="item.isTop==1" style="color:#fff;border-radius: 2px;background: rgb(255, 141, 26);font-size:12px;padding:0 5px;">置顶</span> -->
          <!-- <span v-else  style="color:#fff;border-radius: 2px;background: #fff;font-size:12px;padding:0 5px;">置顶</span> -->
          <!-- <div class="ribbon_notice" style="background:orange">
            <span>置顶</span>
          </div> -->
          <i v-if="item.isTop==1" style="color:red;font-size: 14px;" class="el-icon-s-flag"></i>
          {{ item.content }}
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
        const titleEl = this.$el.querySelector('.title');
        if (titleEl) {
          this.isContentOverflow = titleEl.scrollWidth > titleEl.clientWidth;
        }
      });
    }
  },
  watch: {
    item: {
      handler(newValue) {
        newValue.title = newValue.content;
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
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    
    .type{
        // width: 16px;
        width: 60px;
        height: 20px;
        line-height: 16px;
        border-radius: 0 6px;
        //  border-radius: 50%;
        color: white;
        margin-top:7px;
        padding: 2px;
        text-align: center;
        span{
          font-size: 4px;
        }
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
