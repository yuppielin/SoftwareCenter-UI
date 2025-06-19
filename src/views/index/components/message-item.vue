<template>
  <el-row id="message" :gutter="0">
    <el-col :xs="5" :sm="5" :md="4" :lg="4" class="type-col">
      <div class="type" :class="[
        item.messageType==1?'software-release':
        item.messageType==2?'software-change':
        item.messageType==3?'software-apply':
        item.messageType==4?'demand-report':
        item.messageType==5?'tech-support':
        'other'
      ]">
        <span v-text="item.messageType==1?'软件发布':item.messageType==2?'软件变更':item.messageType==3?'软件申请':item.messageType==4?'需求提报':item.messageType==5?'技术支持':item.messageType==6?'软件推送':'其他'"></span>
      </div>
    </el-col>
    <el-col :xs="12" :sm="13" :md="14" :lg="14" class="content-col">
      <el-tooltip 
        class="item" 
        effect="dark" 
        :content="item.content" 
        placement="top" 
        :disabled="!isContentOverflow"
        popper-class="message-tooltip"
      >
        <div class="title-container">
          <span class="title">{{ item.content }}</span>
        </div>
      </el-tooltip>
    </el-col>
    <el-col :xs="7" :sm="6" :md="6" :lg="6" class="date-col">
      <span class="date">{{ parseTime(item.ctime, '{y}-{m}-{d}') }}</span>
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
    padding: 5px 0;
    margin-bottom: 10px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    width: 100%;
    
    &:hover {
      background-color: #f5f7fa;
    }
  
    .type-col {
      padding-right: 8px;
    }
    
    .content-col {
      padding-left: 8px;
    }
    
    .date-col {
      text-align: right;
      padding-right: 5px;
    }
    
    .type{
        width: 100%;
        max-width: 75px;
        min-width: 60px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px 6px 6px 6px;
        color: white;
        margin-top: 3px;
        margin-left: 0px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0px;
        padding-right: 0px;
        
        &.demand-report {
          background: #5bbdb6;
        }
        &.tech-support {
          background: #f19149;
        }
        &.software-release {
          background: #5e9de6;
        }
        &.software-change {
          background: #4c85e6;
        }
        &.software-apply {
          background: #67b356;
        }
        &.other {
          background: #a77bc2;
        }
        
        span{
          font-size: 12px;
          white-space: nowrap;
          display: inline-block;
          transform: scale(0.9);
          padding: 0 2px;
          text-align: center;
          width: 100%;
        }
    }
    
    .title-container {
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      width: 100%;
      padding-left: 2px;
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
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #606266;
        font-size: 13px;
        text-align: right;
        min-width: max-content;
        flex-shrink: 0;
        z-index: 2;
        font-weight: 500;
        width: 100%;
    }
}

@media screen and (max-width: 1200px) {
  #message {
    .type {
      max-width: 70px;
      min-width: 60px;
      
      span {
        font-size: 11px;
        transform: scale(0.85);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  #message {
    .type {
      max-width: 65px;
      min-width: 55px;
    }
    
    .date {
      font-size: 12px;
    }
  }
}
</style>
<style>
.message-tooltip {
  max-width: 400px !important;
  line-height: 1.5;
  padding: 8px 12px;
  word-break: break-word;
}
</style>
