<template>
  <div id="theme">
    <router-link :to="'/m/app/theme/' + data.id">
      <img width="100%" height="150" :src="data.picPath == null?defaultS:logoAndPicUrl+data.picPath" :onerror="defaultS">
      <div class="theme-title">
        <div>{{ data.name }}</div>
        <div class="theme-btn">
          查看软件
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
// import * as appConfig from "/public/config";
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      defaultS: 'this.src="' + require('@/assets/index/theme.png') + '"',
      logoAndPicUrl: appConfig.config.urlFilePrefix
    }
  },
  methods: {
    goToSoftwareList() {
      this.$router.push({
        path: '/m/app/list/'
      })
    }
  }
}
</script>
 <style lang="scss">
     #theme{
         position: relative;
         height: 150px;
     }
      #theme img{
          object-fit: fill;
      }
     #theme:hover {
         font-size: 22px;
         font-weight: bold;
         height: 150px;
     }
     .theme-btn{
         display: none;
         position: relative;
         font-size: 14px;
         font-weight: 500;
         width: 100%;
         border-radius: 2px;
         background:rgb(42, 130, 228) ;
         color: white;
     }
     .theme-title{
             font-size: 14px;
             height: 25px;
             width: 100%;
             line-height: 25px;
             color: white;
             position:absolute;
             left: 0;
             bottom: 0;
             background: rgba(0,0,0,0.5);
             text-align: center;
     }
     #theme:hover .theme-title{
         height: 150px;
         width: 100%;
         line-height: 30px;
         font-size: 22px;
         font-weight: bold;
         border: 3px solid #1b8fd8;
         padding-top:45px;
     }
     #theme:hover .theme-btn{
         display: block;
     }
 </style>
