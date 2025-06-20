<template>
    <div style="margin:60px 20px 0 20px;">
        <el-collapse v-model="activeNames">
            <!--软件结果-->
            <el-collapse-item name="1">
                <div slot="title">
                    <i class="el-icon-s-operation"></i>
                    <span style="font-weight:600;margin-left:10px;">软件({{softwareData.length}})</span>
                </div>
                <el-card style="margin-top:10px;" v-for="(item,index) in softwareData" :key="index">
                    <el-row :gutter="10">
                        <el-col :span="16">
                            <div style="width:90px;height:90px;float:left;">
                                <img :src="item.logo" width="60" height="60" style="margin:15px;"/>
                            </div>
                            <div style="width:calc(100% - 100px);height:90px;float:left;">
                                <h3>{{item.name}}</h3>
                                <span class="content">{{item.content}}</span>
                            </div>
                        </el-col>
                        <el-col :span="4" style="text-align:right;">
                            <el-rate v-model="item.rate" show-score text-color="#ff9900" score-template="{value}" style="margin-top:35px" disabled></el-rate>
                        </el-col>
                        <el-col :span="4" style="text-align:right;">
                            <el-button size="small" style="background: #05994e;color: white;margin-top:30px;">立即下载</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-collapse-item>
            <!--需求结果-->
            <el-collapse-item name="2">
                <div slot="title">
                    <i class="el-icon-s-operation"></i>
                    <span style="font-weight:600;margin-left:10px;">需求(1)</span>
                </div>
                <el-card style="margin-top:10px;">
                        <div>
                            <el-row :gutter="10">
                                <el-col :span="16">
                                    <h3>
                                        <i class="el-icon-s-opportunity"></i>
                                        <span>
                                            软件需求标题
                                        </span>
                                    </h3>
                                    <p style="margin-left:20px;">软件需求描述</p>
                                </el-col>
                                <el-col :span="8">
                                     <div style="width:90px;height:90px;float:left;">
                                        <img src="@/assets/index/softwareDefault.png" width="60" height="60" style="margin:15px;"/>
                                    </div>
                                    <div style="width:calc(100% - 100px);height:90px;float:left;">
                                        <div style="line-height:30px;height:30px;margin-top:15px;">
                                            <span style="font-weight:600;font-size:14px;">软件名称:</span>
                                            <span style="margin-left:10px;color:gray">xxx软件</span>
                                        </div>
                                        <div style="line-height:30px;height:30px;">
                                            <span style="font-weight:600;font-size:14px;">软件版本:</span>
                                            <span style="margin-left:10px;color:gray">v12.1</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            
                        </div>
                        <el-row :gutter="10" style="border-top:1px solid lightgray;padding:10px;margin-top:10px;">
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-user"></i> 提报人：zhangs</span>
                            </el-col>
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-house"></i> 提报单位：中科酒店</span>
                            </el-col>
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-date"></i> 提报时间：2022-09-08 12:12:12</span>
                            </el-col>
                        </el-row>
                    </el-card>
            </el-collapse-item>
            <!--问题结果-->
            <el-collapse-item name="3">
                 <div slot="title">
                    <i class="el-icon-s-operation"></i>
                    <span style="font-weight:600;margin-left:10px;">问题(1)</span>
                </div>
                     <el-card style="margin-top:10px;">
                        <div>
                            <el-row :gutter="10">
                                <el-col :span="16">
                                    <h3>
                                        <i class="el-icon-s-opportunity"></i>
                                        <span>
                                            软件问题标题
                                        </span>
                                    </h3>
                                    <p style="margin-left:20px;">软件问题描述</p>
                                </el-col>
                                <el-col :span="8">
                                     <div style="width:90px;height:90px;float:left;">
                                        <img src="@/assets/index/softwareDefault.png" width="60" height="60" style="margin:15px;"/>
                                    </div>
                                    <div style="width:calc(100% - 100px);height:90px;float:left;">
                                        <div style="line-height:30px;height:30px;margin-top:15px;">
                                            <span style="font-weight:600;font-size:14px;">软件名称:</span>
                                            <span style="margin-left:10px;color:gray">xxx软件</span>
                                        </div>
                                        <div style="line-height:30px;height:30px;">
                                            <span style="font-weight:600;font-size:14px;">软件版本:</span>
                                            <span style="margin-left:10px;color:gray">v12.1</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            
                        </div>
                        <el-row :gutter="10" style="border-top:1px solid lightgray;padding:10px;margin-top:10px;">
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-user"></i> 提报人：zhangs</span>
                            </el-col>
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-house"></i> 提报单位：中科酒店</span>
                            </el-col>
                            <el-col :span="8">
                                <span style="font-weight:600"><i class="el-icon-date"></i> 提报时间：2022-09-08 12:12:12</span>
                            </el-col>
                        </el-row>
                    </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeNames:["1"],
            softwareData:[
                {
                    id:1,
                    name:"腾讯软件",
                    logo:require("@/assets/index/softwareDefault.png"),
                    version:"1.2.1",
                    content:'高清互联网电视、视频等',
                    size:'123.3M',
                    rate:4.3,
                },
                {
                    id:2,
                    name:"QQ软件",
                    logo:require("@/assets/index/softwareDefault.png"),
                    version:"1.2.1",
                    content:'高清互联网电视、视频等',
                    size:'123.3M',
                    rate:4.3,
                },
                {
                    id:3,
                    name:"安全软件",
                    logo:require("@/assets/index/softwareDefault.png"),
                    version:"1.2.1",
                    content:'高清互联网电视、视频等',
                    size:'123.3M',
                    rate:4.3,
                },
            ]
        }
    }
}
</script>