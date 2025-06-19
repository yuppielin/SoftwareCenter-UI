<template>
    <div style="margin-bottom:20px;margin-top:-10px">
        <!-- <el-button type="text" icon="el-icon-error" onclick="history.go(-1)" ></el-button> -->
        <el-row class='close-container'>
            <el-col :span="12" style="border:1px solid rgba(255,255,255,0)">
                <slot></slot>   
            </el-col>
            <el-col :span="12" style="text-align:right;"><el-button  size="mini"  onclick="history.go(-1)" icon="el-icon-back">返回</el-button></el-col>
        </el-row>
        
        <div class='divider'></div>
    </div>
</template>

<script>

export default {
  name: 'close-back',
  data() {
    return {
     
    }
  },
  created() {
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss"  scoped>
.divider{
    margin:10px 0px 0px 0px;

    border-bottom: 1px solid #e6ebf5;
    width: 120%;
    margin-left: -20px;
    overflow: hidden;
}
.close-container{
    height: 30px;
    line-height: 30px;
}
</style>
