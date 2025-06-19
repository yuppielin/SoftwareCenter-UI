
<template>
  <div class="swiperBox">
    <img
      class="imgLeft"
      @click.passive="clickLeft"
      src="@/assets/imgs/arrow-left.png"
      alt=""
    />
    <img
      class="imgRight"
      @click.passive="clickRight"
      src="@/assets/imgs/arrow-right.png"
      alt=""
    />
    <div class="swiper">
      <div class="imgBox">
        <div class="imgDiv" v-for="(item, index) in imgList" :key="index">
          <span style="display:block;font-size:10px;color:gray;margin-bottom:-5px;">{{item.name}}</span>
           <img :src="item+'?imgSource'"  :onerror="defaultS" />
           <span style="display:block;font-size:5px;color:gray;">{{data.name}} </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getRecommendSoftwareList} from '@/api/software'
export default {
  props: {
    speed: Number,
    direction: String,
    data:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      dataList:[],
      imgList: [
        require("@/assets/imgs/1.png"),
        require("@/assets/imgs/2.png"),
        require("@/assets/imgs/3.png"),
        require("@/assets/imgs/4.png"),
        require("@/assets/imgs/5.png"),
      ],
      imgSource:require("@/assets/index/software.png"),
      defaultS:'this.src="'+require('@/assets/index/software.png')+'"',
      timer: null,
      theSpeed: this.speed,
      imgWidth: 60,
      theDirection: this.direction,
    };
  },
  methods: {
    clickLeft() {
      this.theDirection = 'left'
    },
    clickRight() {
      this.theDirection = 'right'
    },
     //获取推荐成果
    getRecommendSoftware(){
        getRecommendSoftwareList().then(response=>{
          this.dataList=response.data;
        }).catch(err =>{
          console.log(err);
        })
    }
  },
  created(){
    this.getRecommendSoftware();
  },
  mounted() {
    let imgBox = document.getElementsByClassName("imgBox")[0];
    //将imgBox下的图片进行拼接 循环展示图片
    imgBox.innerHTML += imgBox.innerHTML;
    let imgDiv = document.getElementsByClassName("imgDiv");
    //设置div的宽度使图片可以放下
    imgBox.style.width = imgDiv.length * this.imgWidth + "px"; 
    let self = this;
    function autoScroll() {
      if (imgBox.offsetLeft < -(imgBox.offsetWidth / 2)) {
        //提前更新left值，实现循环展示
        imgBox.style.left = 0;
      }
      if (imgBox.offsetLeft > 0) {
        //向右滚动 提前更新left值，实现循环展示
        imgBox.style.left = -(imgBox.offsetWidth / 2) + "px";
      }
      if (self.theDirection === 'left') {
        //向左滚动,值为负
        self.theSpeed = -Math.abs(self.theSpeed);
      } else {
        //向右滚动
        self.theSpeed = Math.abs(self.theSpeed);
      }
      // 求出总的left值，等于left值加上移动的速度（px值）
      imgBox.style.left = imgBox.offsetLeft + self.theSpeed + "px";
    }
    this.timer = setInterval(autoScroll, 30);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
<style scoped lang='scss'>
.swiperBox {
  height: 100%;
  width: 100%;
  position: relative;
  .imgLeft {
    left: 0;
    top: 40%;
  }
  .imgLeft,
  .imgRight {
    width: 30px;
    height: 30px;
    position: absolute;
    cursor: pointer;
    top: 15px;
  }
  .imgRight {
    right: 0;
    top: 40%;
    top: 15px;
  }
  .directionIcon:hover {
    opacity: 1;
  }
  .swiper {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    .imgBox {
      height: 100%;
      position: relative;
      left: 0;
      top: 0;
      overflow: hidden;
      display: flex;
      .imgDiv {
        width:60px;
        margin-left: 15px;
        text-align: center;
        img {
          height: 100%;
          width: 50px;
          object-fit: contain ;
        }
      }
    }
  }
}
</style>