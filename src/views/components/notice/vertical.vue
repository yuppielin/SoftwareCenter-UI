<!-- 公告栏组件 -->
<template>
    <div style=""  class="notice-bar-container" :class="{'closed':isClose}">
         <div class="notice-bar" @click="tipClick" >
            <div class="notice-bar__icon">
                <!-- <img src="@/assets/icons/notice.png"/> -->
                <i class="el-icon-message-solid"></i>
                <span> 通知 </span>
                <el-divider direction="vertical"></el-divider>
            </div>
            <div class="notice-bar__wrap">
                <div
                class="notice-bar__content"
                @click="openTip(item)"
                v-for="(item, index) in noticeList"
                :key="index"
                :class="!index && play ? 'toUp' : ''"
                >
                <span v-show="item.releaseDate!=''">[{{item.releaseDate}}]</span>
                {{ item.title }}</div>
            </div>
            <div class="notice-bar__close" @click.stop="closed">
                <i class="el-icon-close"></i>
            </div>
            <noticeDetail :noticeVisibleFlag.sync="noticeVisibleFlag" :data="notice" />
        </div>
    </div>



</template>

<script>
import {getNoticeList} from "@/api/notice"
export default {
  name: "NoticeBarVertical",
  components: {
    noticeDetail: () => import("@/views/index/notice/show") // 查看通知
  },
  props: {},
  data() {
    return {
      userInfo:'',
      noticeVisibleFlag: false,
      notice: {},
      isClose: false,

      noticeList: [
        { id: 1, title: "暂无公告" , releaseDate:''},
      ],

      play: false,
      timer: null
    };
  },
  created() {},
  mounted() {
    this.userInfo=JSON.parse(localStorage.getItem('userInfo'))
    setInterval(this.startPlay, 4000);
    this.getNoticeList();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {},
  methods: {
    getNoticeList(){
      getNoticeList(this.userInfo.userId).then(res=>{
        if(res.code==200){
          this.noticeList=res.data.list;
          if(this.noticeList.length==0){
            this.noticeList.push({
              id:1,
              title:'暂无公告！',
              releaseDate:''
            })
          }
        }
      })
    },
    startPlay() {
      let that = this;
      this.play = true; //开始播放
      this.timer = setTimeout(() => {
        //创建并执行定时器
        that.noticeList.push(this.noticeList[0]); //第一条数据塞到最后一个
        that.noticeList.shift(); //删除第一条数据
        that.play = false; //暂停播放
      }, 500);
    },
    openTip(item) {
      // this.notice = item;
      // this.noticeVisibleFlag = true;

      this.$router.push({
        path:'/notice/index'
      })
    },
    tipClick() {
      this.$emit("click");
    },
    closed() {
      this.isClose = true;
    }
  }
};
</script>
<style scoped lang='scss'>
.notice-bar-container{
    height:40px;
    margin:20px 20px 0px 20px;
    &.closed {
        display: none;
    }
}
.notice-bar {
  position: fixed;
  width: calc(100% - 40px);
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000;
  display: flex;
  height: 40px;
  line-height: 40px;
  padding: 0 20px 0 20px;
  // background-color: rgba(0, 0, 0, 0.1);
  background-color:rgb(230,230,230);
  overflow: hidden;
  z-index: 999;
//   &.active {
//     position: fixed;
//     top: 70px;
//   }
  .sub_title {
    font-weight: 600;
  }
  .notice-bar__icon {
    span {
      font-weight: 600;
    }
    img {
      width: 20px;
      margin-right: 10px;
    }
  }
  &.closed {
    display: none;
  }

  .el-icon-message-solid {
    color: #3b5975;
  }
  .notice-bar__wrap {
    height: 100%;
    width: 90%;
    overflow: hidden;
    .toUp {
      margin-top: -60px;
      transition: all 1s;
    }
    .notice-bar__content {
      color: #000;
      white-space: nowrap;
      margin-left: 6px;
      width: 100%;
      cursor: pointer;
    }
  }

  .notice-bar__close {
    position: fixed;
    // top: 70px;
    right: 30px;
    width: 30px;
    text-align: center;
    cursor: pointer;
  }
}

// .active {
//     .notice-bar{
//         position: fixed;
//         top: 70px;
//     }
//   }
</style>
