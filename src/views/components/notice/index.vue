<!-- 公告栏组件 -->
<template>
  <div class="notice-bar" @click="tipClick" :class="{'closed':isClose}">
    <div class="notice-bar__icon">
      <!-- <img src="@/assets/icons/notice.png"/> -->
      <i class="el-icon-message-solid" ></i>
      <span>{{ sub_title }}</span>
    </div>
    <div ref="wrap" class="notice-bar__wrap">
      <div ref="content" class="notice-bar__content" :style="contentStyle">{{ text }}</div>
    </div>
    <div class="notice-bar__close" @click.stop="closed">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeBar',
  props: {
    sub_title: {
      type: String,
      default: '通知：'
    },
    text: {
      type: String,
      default: ''
    },
    speed: {
      type: Number,
      default: 50
    },
    defaultWidth: {
      type: Number,
      default: 375
    }
  },
  data () {
    return {
      contentStyle: {
        transitionDuration: '0s',
        transform: 'translateX(0px)'
      },
      wrapWidth: 0,
      contentWidth: 0,
      time: 0,
      timer: null,
      convertSpeed: 1,
      isClose: false
    }
  },
  created () {},
  mounted () {
    if (this.text) {
      this.init()
    }
  },
  watch: {
    text (val) {
      this.init()
    }
  },
  methods: {
    init () {
      const _width = window.innerWidth
      this.convertSpeed = _width / this.defaultWidth * this.speed;// 根据分辨率转化成不同的速度
      this.wrapWidth = this.$refs.wrap.offsetWidth
      this.contentWidth = this.$refs.content.offsetWidth
      this.startAnimate()
      this.timer = setInterval(() => {
        this.startAnimate()
      }, this.time * 1000)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer)
        this.timer = null
      })
    },
    startAnimate () {
      this.contentStyle.transitionDuration = '0s'
      this.contentStyle.transform = 'translateX(' + this.wrapWidth + 'px)'
      this.time = (this.wrapWidth + this.contentWidth) / this.convertSpeed
      setTimeout(() => {
        this.contentStyle.transitionDuration = this.time + 's'
        this.contentStyle.transform = 'translateX(-' + this.contentWidth + 'px)'
      }, 200)
    },
    tipClick () {
      this.$emit('click')
    },
    closed () {
      this.isClose = true
    }
  }
}
</script>
<style scoped lang='scss'>
    .notice-bar {
      position: relative;
      width: 100%;
      // font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000;
      display: flex;
      height: 50px;
      line-height: 50px;
      align-items: center;
      // margin-top: 25px;
      padding:0 20px 0 20px;
      z-index: 9999;
      background-color: rgba(0,0,0,0.1);
      overflow: hidden;
      // margin-bottom: -35px;
      &.active{
        position: fixed;
        top: 70px;
      }
      .sub_title{font-weight: 600;}
      .notice-bar__icon {
          display: flex;
          align-items: center;
          span {
            font-weight: 600;
          }
        img {
          width: 20px;
          margin-right: 10px;
        }
      }
      &.closed{
        display: none;
      }
     
      .el-icon-message-solid{
        color: #3b5975;
      }
      .notice-bar__wrap {
        // position: relative;
        display: flex;
        flex: 1;
        height: 100%;
        align-items: center;
        overflow: hidden;
        .notice-bar__content {
          // position: absolute;
          color: #000;
          white-space: nowrap;
          transition-timing-function: linear;
        }
      }

      .notice-bar__close {
          position: absolute;
          top: 3px;
          right: 10px;
          width: 30px;
          text-align: center;
          cursor: pointer;
      }
    }
</style>