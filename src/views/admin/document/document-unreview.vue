  <template>
  <el-card class="custome">
    <div style="margin-bottom:10px;">
        <el-row :gutter="10">
            <el-col :span="24">
              
              <el-input size="small" v-model="search.keyword" suffix-icon="el-icon-search" style="width:200px;" placeholder="关键字"></el-input>
              <el-button size="small" type="primary" style="margin-left:10px">搜索</el-button>
              <el-button size="small" type="info" >重置</el-button>
            </el-col>
        </el-row>
    </div>
    <el-table
      :data="unReviewData"
      size="mini"
      style="height:calc(100vh - 230px);overflow-y:auto;"
    >
      <el-table-column align="center" header-align="center" width="55" type="index" label="序号" />
      <el-table-column align="center" header-align="center" label="资料名称" prop="dataName" show-overflow-tooltip />
      <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
<!--      <el-table-column align="center" header-align="center" label="资料类型" prop="category">-->
<!--        <template slot-scope="scope">-->
<!--          {{getTypeName(scope.row.category)}}-->
<!--&lt;!&ndash;          <el-select v-model="scope.row.category" style="border: none" disabled>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option&ndash;&gt;-->
<!--&lt;!&ndash;              v-for="item in softwareDataTypes"&ndash;&gt;-->
<!--&lt;!&ndash;              :key="item.id"&ndash;&gt;-->
<!--&lt;!&ndash;              :label="item.name"&ndash;&gt;-->
<!--&lt;!&ndash;              :value="item.id"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" header-align="center" label="软件名称">
        <template slot-scope="{row}">
          <span>{{ row.softwareName }}</span>
          <span style="color:#3b5975;"> ( {{ row.version }} )</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="上传者" prop="uname" />
      <el-table-column align="center" header-align="center" label="上传时间" prop="ctime" />
      <el-table-column align="center" header-align="center" label="操作" width="100">
        <template slot-scope="{row}">
          <el-button size="small" type="text" icon="el-icon-view" @click="showInfo(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:15px;"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script>
import * as software from '@/api/software'
import * as category from '@/api/category'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      unReviewData: [],
      userInfo: {},
      softwareDataTypes: [],
      search:{
                status:'',
                keyWord:'',
            },
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // 获取软件资料类型列表
    this.getSoftwareDataTypeList()
    // 获取软件资料列表
    this.getSoftwareDataList(0)
  },
  methods: {
    /**
     * 获取软件资料列表
     * @param status 状态
     */
    getSoftwareDataList(status) {
      this.unReviewData = [
        {
          softwareName: 'qq',
          version: '1.0',
          dataName: 'xxx.jpg',
          size: '10M',
          uname: '李四',
          ctime: '2023-04-12 8:00',
        },
        {
          softwareName: '飞秋',
          version: '1.0',
          dataName: 'xxx1.jpg',
          size: '10M',
          uname: '李四',
          ctime: '2023-04-12 8:00',
        }
      ];
      return;

      software.getSoftwareDataListByUser(null, status, this.currentPage, this.pageSize).then(response => {
        if (response.code === 200) {
          this.unReviewData = response.data.list
          this.total = response.data.total
        }
      })
    },
    getTypeName(typeId) {
      return this.softwareDataTypes.find(item => item.id === typeId).name
    },
    /**
     * 获取软件资料类型列表
     */
    getSoftwareDataTypeList() {
      category.getCategoryList(42, null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list
        }
      })
    },
    /**
     * 获取信息
     * @param item
     */
    showInfo(item) {
      this.$router.push({
        path: '/admin/document/unreviewed/' + item.id,
        query: { softwareDataInfo: JSON.stringify(item), softwareDataTypes: JSON.stringify(this.softwareDataTypes)}
      })
    },
    /**
     * 处理分页大小改变事件
     * @param val
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getSoftwareDataList(0)
    },
    /**
     * 处理分页改变事件
     * @param val
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSoftwareDataList(0)
    }
  }
}
</script>

<style scoped>
    el-card {
        border-radius: 4px;
        border: 0px solid #e6ebf5;
    }
  ::v-deep .el-input__inner {
    border: none;
    box-shadow: none;
  }
</style>
