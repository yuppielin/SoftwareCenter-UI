<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="已发布" name="first">
        <el-table :data="docData" size="mini" :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" style="margin:10px;">
          <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
          <el-table-column min-width="300px" label="资料名称" show-overflow-tooltip>
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.dataName" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.dataName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料类型" prop="category">
            <template slot-scope="scope">
<!--              <el-select v-model="scope.row.category">-->
<!--                <el-option-->
<!--                  v-for="item in softwareDataTypes"-->
<!--                  :key="item.id"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--                />-->
<!--              </el-select>-->
              <treeselect
                v-model="scope.row.category"
                style="max-width:400px;"
                :multiple="false"
                :options="softwareDataTypes"
                :appendToBody="true"
                :disabled="!scope.row.edit"
                :disable-branch-nodes="false"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择资料类型"
                @select="selectModuleAdd"></treeselect>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
          <el-table-column align="center" header-align="center" prop="softwareName" label="所属软件" show-overflow-tooltip width="300">
            <template slot-scope="{row}">
              <span>{{ row.softwareName }}</span>
              <span style="color: grey"><{{ row.identity }}></span>
<!--              <span style="color:green;"> ( {{ row.version }} )</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" prop="version" label="软件版本" />
          <el-table-column align="center" label="操作" width="280">
            <template slot-scope="{row}">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-download"
                @click="downloadSoftwareData(row)"
              >
                下载
              </el-button>
              <el-button
                v-if="row.edit"
                type="primary"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                确认
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="confirmDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="待审核" name="second">
        <el-table :data="reviewDocData" size="mini" :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" style="margin:10px;">
          <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
          <el-table-column min-width="300px" label="资料名称">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.dataName" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.dataName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料类型" prop="category">
            <template slot-scope="scope">
<!--              <el-select v-model="scope.row.category">-->
<!--                <el-option-->
<!--                  v-for="item in softwareDataTypes"-->
<!--                  :key="item.id"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--                />-->
<!--              </el-select>-->
              <treeselect
                v-model="scope.row.category"
                style="max-width:400px;"
                :multiple="false"
                :options="softwareDataTypes"
                :appendToBody="true"
                :disable-branch-nodes="false"
                :normalizer="normalizer"
                :disabled="!scope.row.edit"
                :show-count="true"
                placeholder="请选择资料类型"
                @select="selectModuleAdd"></treeselect>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
          <el-table-column align="center" header-align="center" prop="softwareName" label="所属软件" show-overflow-tooltip width="300">
            <template slot-scope="{row}">
              <span>{{ row.softwareName }}</span>
              <span style="color: grey"><{{ row.identity }}></span>
<!--              <span style="color:green;"> ( {{ row.version }} )</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" prop="version" label="软件版本" />
          <el-table-column align="center" label="操作" width="280">
            <template slot-scope="{row}">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-download"
                @click="downloadSoftwareData(row)"
              >
                下载
              </el-button>
              <el-button
                v-if="row.edit"
                type="primary"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                确认
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="confirmDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已驳回" name="third">
        <el-table :data="rejectDocData" size="mini" :header-cell-style="{background:'#2BB56E',color:'white',height:'30px'}" style="margin:10px;">
          <el-table-column width="50" type="index" align="center" header-align="center" label="序号" />
          <el-table-column min-width="300px" label="资料名称">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.dataName" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                  取消
                </el-button>
              </template>
              <span v-else>{{ row.dataName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料类型" prop="category">
            <template slot-scope="scope">
<!--              <el-select v-model="scope.row.category">-->
<!--                <el-option-->
<!--                  v-for="item in softwareDataTypes"-->
<!--                  :key="item.id"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--                />-->
<!--              </el-select>-->
              <treeselect
                v-model="scope.row.category"
                style="max-width:400px;"
                :multiple="false"
                :options="softwareDataTypes"
                :appendToBody="true"
                :disable-branch-nodes="false"
                :normalizer="normalizer"
                :disabled="!scope.row.edit"
                :show-count="true"
                placeholder="请选择资料类型"
                @select="selectModuleAdd"></treeselect>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="资料大小" prop="size" />
          <el-table-column align="center" header-align="center" prop="softwareName" label="所属软件" show-overflow-tooltip width="300">
            <template slot-scope="{row}">
              <span>{{ row.softwareName }}</span>
              <span style="color: grey"><{{ row.identity }}></span>
<!--              <span style="color:green;"> ( {{ row.version }} )</span>-->
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" prop="version" label="软件版本" />
          <el-table-column align="center" label="操作" width="280">
            <template slot-scope="{row}">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-download"
                @click="downloadSoftwareData(row)"
              >
                下载
              </el-button>
              <el-button
                v-if="row.edit"
                type="primary"
                size="small"
                icon="el-icon-circle-check-outline"
                @click="confirmEdit(row)"
              >
                确认
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="confirmDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as software from '@/api/software'
import download from 'download-1.4.7'
import * as category from '@/api/category'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      activeName: 'first',
      docData: [],
      reviewDocData: [],
      rejectDocData: [],
      softwareDataInfo: {},
      userInfo: {},
      softwareDataTypes: []
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareDataList(1)
    this.getSoftwareDataTypeList()
  },
  methods: {
    getSoftwareDataList(status) {
      software.getSoftwareDataListByUser(this.userInfo.userId, status).then(response => {
        if (response.code === 200) {
          if (status === 1) {
            this.docData = response.data
            this.docData = this.docData.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.name
              return v
            })
          } else if (status === 0) {
            this.reviewDocData = response.data
            this.reviewDocData = this.reviewDocData.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.name
              return v
            })
          } else if (status === 2) {
            this.rejectDocData = response.data
            this.rejectDocData = this.rejectDocData.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.name
              return v
            })
          }
        }
      })
    },
    getSoftwareDataTypeList() {
      category.getCategoryList(42, null, null).then(response => {
        if (response.code === 200) {
          this.softwareDataTypes = response.data.list
        }
      })
    },
    handleTabClick(tab) {
      switch (tab.name) {
        case 'first':
          this.getSoftwareDataList(1)
          break
        case 'second':
          this.getSoftwareDataList(0)
          break
        case 'third':
          this.getSoftwareDataList(2)
          break
      }
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: '取消更改成功',
        type: 'warning'
      })
    },
    confirmDelete(row) {
      this.$confirm('确定删除资料文件 ' + row.name + ' 吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        software.deleteSoftwareData(row.id).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            switch (this.activeName) {
              case 'first':
                this.getSoftwareDataList(1)
                break
              case 'second':
                this.getSoftwareDataList(0)
                break
              case 'third':
                this.getSoftwareDataList(2)
                break
            }
          } else {
            this.$message.error(response.msg)
          }
        })
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalName = row.name
      this.$message({
        message: '更新成功',
        type: 'success'
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    selectModuleAdd() {
    },
    downloadSoftwareData(row) {
      software.downloadSoftwareData(this.userInfo.userId, row.id).then(response => {
        const blob = new Blob([response])
        download(blob, row.name, row.name.lastIndexOf('.') + 1)
      })
    }
  }
}
</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
/deep/ .el-table {
  overflow: visible !important;
}
/deep/ .el-table .cell {
  overflow: visible !important;
}

/deep/ .el-table__body-wrapper {
  overflow: visible !important;
}
</style>
