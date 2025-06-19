<template>
  <div id="app" style="overflow:hidden;">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang='scss'>
  // *{font-size: 16px;}
  .el-dialog__body{
    /* padding: 10px 20px; */
  }
  .el-dialog__header{
    background: #aebfcf; 
    /* padding: 10px; */
    span{
      font-size: 16px;
    }
  }
  .el-dialog__title{
    color: #000;
  }
  .el-dialog__headerbtn .el-dialog__close {
    /* color: white; */
  }
  .el-dialog__headerbtn{
     top:22px;
  }
  .el-card {
    /* background-color: #F2F5F7;
    color: #ffffff;
    border: none; */
    background-color: white;
    color: black;
    border: none;
  }
</style>
