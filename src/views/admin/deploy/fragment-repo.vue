<template>
  <el-card style="margin-top:40px;">
    <!--    <div style="margin-bottom:10px;">-->
    <!--      <el-button size="small" style="background:#05994e;color:white;" @click="dialogVisible=true">添加段库</el-button>-->
    <!--      <el-input v-model="search.keyword" size="small" suffix-icon="el-icon-search" style="width:200px;margin-left:10px;" placeholder="关键字" />-->
    <!--      <el-button size="small" style="background:#05994e;color:white;margin-left:10px">搜索</el-button>-->
    <!--      <el-button size="small" style="background:gray;color:white">重置</el-button>-->
    <!--    </div>-->
    <!--添加分类---->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-table
          size="mini"
          ref="sceneTable"
          :data="sceneData.filter(data => !queryStr || data.name.toLowerCase().includes(queryStr.toLowerCase()))"
          style="height:calc(100vh - 138px);overflow-y:auto;"
          :tree-props="{children:'children',hasChildren:'hasChildren'}"
          row-key="id"
          :span-method="arraySpanMethod"
          highlight-current-row
          @row-click="handleRowClick"
          :cell-style="{height:'50px'}"
          :header-cell-style="{background:'#2BB56E',color:'white',height:'50px',fontSize:'16px'}"
        >
          <el-table-column align="left" header-align="left" label="场景列表" prop="name" show-overflow-tooltip />
          <el-table-column
            align="right">
            <template slot="header">
              <el-input
                v-model="queryStr"
                size="mini"
                style="border: none;background-color: #0a76a4!important;width:100%;color: white"
                placeholder="输入关键字搜索"/>
            </template>
<!--            <template slot="empty">-->
<!--            </template>-->
          </el-table-column>
<!--          <el-table-column align="left" header-align="left" width="50">1/1</el-table-column>-->
        </el-table>
      </el-col>
      <el-col :span="20">
        <el-card>
          <div slot="header" class="clearfix" style="font-size: 20px">
            <span>服务列表</span>
          </div>
          <el-table
            :data="serviceData"
            size="mini"
            style="height:calc(100vh - 238px);overflow-y:auto;"
            :tree-props="{children:'children',hasChildren:'hasChildren'}"
            row-key="id"
            ref="serviceTable"
            :cell-style="{height:'40px'}"
            :header-cell-style="{background:'#2BB56E',color:'white',height:'40px'}"
          >
            <el-table-column align="center" header-align="center" :key="Math.random()" width="50" type="index" label="序号" />
            <el-table-column align="left" header-align="left" label="服务名称" prop="ChName" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.chName}}</div>
                <div>{{scope.row.deployName}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="描述" prop="description" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="接口标识" prop="namespaceNew" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="服务包" prop="chName" width="100" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="地址" prop="host" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.host != null" style="color:#389038;">
                  <div>{{scope.row.host}}</div>
                  <div v-if="scope.row.dns">{{scope.row.dns}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="依赖" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>依赖个数：{{scope.row.depends}}/
                  <span v-if="scope.row.deps != null">{{scope.row.deps}}</span>
                  <span v-else>0</span>
                </div>
                <div>被引用数：{{scope.row.reference != null ? scope.row.reference.length : 0}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="研发单位" prop="company" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="创建时间" width="90" prop="createTime" />
            <el-table-column align="center" header-align="center" label="资源" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.cpu">
                  <div>CPU: <span style="color:#389038;">{{scope.row.realtimeCpu}}</span>/<span>{{scope.row.cpu}}</span></div>
                  <div>Mem: <span style="color:#389038;">{{scope.row.realtimeMem}}</span>/<span>{{scope.row.memory}}</span></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :style="{'color':scope.row.status == 'RUNNING'?'#389038':scope.row.status == 'ERROR'?'red':scope.row.status == 'STOP'?'yellow':'grey'}" v-if="scope.row.status != undefined">{{ scope.row.status == 'RUNNING'? '运行':scope.row.status == 'STOP'? '停止':scope.row.status == 'ERROR'? '异常':'未部署'}}</div>
                <div v-else style="color:grey;">未部署</div>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="部署类型" prop="deploytype" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="集群" prop="clusterId" show-overflow-tooltip />
            <el-table-column align="center" header-align="center" label="命名空间" width="70" prop="k8snamespace" show-overflow-tooltip />
          </el-table>
        </el-card>
        <!--        <el-pagination-->
        <!--          style="margin-top:15px;"-->
        <!--          :current-page="currentPage"-->
        <!--          :page-sizes="[100, 200, 300, 400]"-->
        <!--          :page-size="100"-->
        <!--          layout="total, sizes, prev, pager, next, jumper"-->
        <!--          :total="400"-->
        <!--          @size-change="handleSizeChange"-->
        <!--          @current-change="handleCurrentChange"-->
        <!--        />-->
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import * as deploy from '@/api/deploy'
export default {
  directives: { elDragDialog },
  data() {
    return {
      currentPage: 1,
      title: '添加段库',
      dialogVisible: false,
      unitForm: {
        name: '',
        tag: '',
        chager: '',
        phone: '',
        email: '',
        address: ''
      },
      queryStr: '',
      search: {
        offerUnit: '',
        devUnit: '',
        keyWord: '',
        type: ''
      },
      typeData: [
        {
          id: 1,
          name: '资料类',
          tag: 'Platform',
          sort: 1
        },
        {
          id: 5,
          name: '培训类',
          tag: 'Service',
          sort: 1
        },
        {
          id: 9,
          name: '视频类',
          tag: 'App',
          sort: 1
        }
      ],
      serviceData: [
        // {
        //   createTime: '2022-10-28 06:06:42',
        //   ChName: '中文名称测试',
        //   DeployName: 'yiusrsws.aservice.bz.jw',
        //   description: 'teses',
        //   namespace: 'S1.aservice.JW',
        //   clusterId: 'local',
        //   Type: 'NonContainerService',
        //   Company: 'xasca',
        //   deployType: 'DEPLOYMENT'
        // }
      ],
      sceneData: [],
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '分类标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  activated() {
    this.doLayout()
  },
  mounted() {
    this.getDeployScene()
  },
  methods: {
    doLayout() {
      const that = this
      this.$nextTick(() => {
        that.$refs.serviceTable.doLayout()
      })
    },
    /**
     * 获取部署场景列表
     */
    getDeployScene() {
      deploy.getDeployScene().then(response => {
        if (response.code === 200) {
          this.sceneData = response.data
          if (this.sceneData) {
            this.$nextTick(function() {
              this.$refs.sceneTable.setCurrentRow(this.sceneData[0], true)
            })
            this.getDeployService(this.sceneData[0].id)
          }
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      return [1, 2]
      // if (rowIndex % 2 === 0) {
      //   if (columnIndex === 0) {
      //
      //   } else if (columnIndex === 1) {
      //     return [0, 0]
      //   }
      // }
    },
    /**
     * 处理行点击事件
     * @param row 当前行数据
     */
    handleRowClick(row) {
      this.getDeployService(row.id)
    },
    /**
     * 根据场景id获取服务列表
     * @param sceneId 场景id
     */
    getDeployService(sceneId) {
      deploy.getDeployService(sceneId).then(response => {
        if (response.code === 200) {
          this.serviceData = response.data
        }
      })
    },
    /**
     * 编辑用户信息
     * @param item
     */
    editUserInfo(item) {
      this.$router.push({
        path: '/admin/system/unit/' + item.id + '/edit'
      })
    }
    /**
     * 处理分页改变事件
     * @param val
     */
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`)
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`)
    // },
    /**
     * 删除数据
     * @param item
     */
    // deleteItem(item) {
    //   this.$confirm('确定删除该成果吗？', '提示', {
    //     type: 'warning'
    //   }).then((e) => {
    //     console.log(e)
    //   })
    // },
    // handleDrag() {
    //
    // }
  }
}
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
</style>
