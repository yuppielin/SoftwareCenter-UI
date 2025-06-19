<template>
  <el-card id="software-demand">
    <div slot="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="title">
            <i class="el-icon-user-solid" />
            {{ data.realname }}
          </div>
          <div class="title">
            <i class="el-icon-s-check" />
            <span>{{ data.company }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="title">
            <i class="el-icon-date" />
            <span>{{ data.ctime }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="title">
          <i class="el-icon-s-opportunity">标题：</i>
          {{ data.title }}
        </div>
        <div class="title">
          <span>
            {{ data.description }}
          </span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="title">
          软件名称: <span>{{ data.softwareName }}</span>
        </div>
        <div class="title">
          软件版本: <span>{{ data.softwareVersion }}</span>
        </div>
        <div class="title">
          处理状态: <span>{{ data.status==0?'未解决':(data.status==1?'处理中':'已解决') }}</span>
        </div>
      </el-col>
    </el-row>
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <el-button size="mini" icon="el-icon-s-comment" type="text">回复:（{{ data.replyList == null?0:data.replyList.length }}）</el-button>
        </template>
        <el-timeline>
          <el-timeline-item v-for="(item,index) in data.replyList" :key="index" :timestamp="item.replayTime" placement="top">
            <el-card>
              <div class="title">
                <div>{{ item.description }}</div>
                <i class="el-icon-user-solid" />
                <span>{{ item.realname }} 回复于 {{ item.ctime }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<script>
import * as demand from '@/api/demand'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      demandData: {
        submitter: '张三丰',
        submitUnit: '北京信通公司',
        submitTime: '2022-11-11',
        demandTitle: '软件授权使用需求',
        demandContent: '如何获取该软件',
        softwareName: '服务支撑软件',
        softwareVersion: 'v1.0',
        demandStatus: '已处理',
        replay: [
          {
            replier: '李四',
            replayTime: '2022-11-22',
            content: '该需求已经处理'
          },
          {
            replier: '李四',
            replayTime: '2022-11-22',
            content: '该需求已经处理'
          }
        ]
      }
    }
  },
  watch: {
    data(newValue, oldValue) {
      // debugger
      // if (newValue.versionId !== oldValue.versionId) {
      //   debugger
      //   this.getSoftwareDemand(this.data.id, this.data.versionId)
      // }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
    #software-demand{
        background: rgba(197, 194, 194, 0.1);
        line-height:20px;
        ::v-deep .el-card__header{
            padding: 5px 20px;
        }
        ::v-deep .el-collapse{
            border-top: 0px solid #e6ebf5;
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__header{
            line-height: 20px;;
            height:20px;
            background-color: rgba(197, 194, 194, 0.0);
            border-bottom: 0px solid #e6ebf5;
        }
        ::v-deep .el-collapse-item__arrow{
            margin: 0;
        }
        i{
            color: #627a91;
        }
        .title{
            font-size:14px;
            font-weight: 600;
            span{
                font-size: 12px;
                color:#a1a1a1;
                font-weight: 400;
                padding-left: 5px;
            }
        }
    }
</style>
