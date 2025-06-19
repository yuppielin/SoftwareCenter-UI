<template>
  <div class="app-container">
  <!-- <div style="height:calc(100vh - 150px);overflow-y: auto"> -->
    <div style="margin-bottom:10px;display: flex;">
      <img style="height:20px;width:20px;" src="@/assets/index/demandManage.png" />
      <span style="font-size:16px;font-weight:bold;margin-left:10px;">我的需求</span>
    </div>
    <el-card style="calc(100vh - 170px)">
      <!--        <el-tabs v-model="activeName">-->
      <!-- <el-tab-pane label="需求提报" name="first">
          <DemandListItem v-for="(item,index) in softwareData" :data="item" :key="index"></DemandListItem>
      </el-tab-pane>-->
      <!--            <el-tab-pane label="我的需求" name="first">-->
      <MyDemandItem></MyDemandItem>
      <!--            </el-tab-pane>-->
      <!-- <el-tab-pane label="收到的需求" name="second">
          <ReviewItem></ReviewItem>
      </el-tab-pane>-->
      <!--        </el-tabs>-->
    </el-card>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-drag-dialog";
import * as demand from "@/api/demand";
import * as ts from "@/api/ts";
import axios from "axios";
export default {
  components: {
    // DemandListItem:()=>import('./software-demand-list.vue'),
    MyDemandItem: () => import("./software-my-demand.vue"),
    ReviewItem: () => import("./software-recive-demand.vue")
  },
  data() {
    return {
      activeName: "first",
      softwareData: [{}],
      softwareList: {},
      softwareVersionList: {}
    };
  },
  mounted() {
    // this.getAllSoftware()
    // this.getSoftwareVersionById()
  },
  method: {
    //获取所有软件
    // getAllSoftware(){
    //     ts.getAllSoftware().then(response =>{
    //         if(response.code === 200){
    //             this.softwareList = response.data
    //         }
    //     })
    // },
    // getSoftwareVersionById() {
    //     ts.getSoftwareVersion(this.zbForm.softwareId).then(response =>{
    //         if(response.code === 200){
    //             this.softwareVersionList = response.data
    //         }
    //     })
    // },
  }
};
</script>
<style scoped>
/deep/ .el-card__body {
  padding-top: 0px;
}
</style>
