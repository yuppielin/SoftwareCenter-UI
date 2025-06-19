<template>
  <el-dialog :visible.sync="visible" title="依赖添加" @close="close">
    <el-autocomplete
      v-model="state"
      clearable
      style="width:100%"
      popper-class="my-autocomplete"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
    >
      <i slot="suffix" class="el-icon-edit el-input__icon" @click="handleIconClick" />
      <template slot-scope="{ item }">
        <div class="name">【{{ item.name }} <{{ item.identity }}>】- {{ item.version }}
        <i class="el-icon-circle-check" style="margin-left:15px;font-size:16px;color: #2ac06d" v-if="item.isSelected"></i></div>
        <span class="addr">{{ item.description }}</span>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>
<script>
import * as software from '@/api/software'
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    selectedDependency: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      state: '',
      userInfo: {},
      softwareData: []
    }
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getSoftwareList()
  },
  mounted() {
  },
  methods: {
    close() {
      this.$emit('close', false)
    },
    // 获取成果清单
    getSoftwareList() {
      software.getDependencySoftwareList(this.userInfo.userId, 1).then(response => {
        const softwareData = response.data
        if (this.selectedDependency != null) {
          const selectedDependency = this.selectedDependency
          softwareData.forEach(item => {
            if (selectedDependency.indexOf(item.identity.toString()) !== -1) {
              item.isSelected = true
              this.$emit('addDependency', item)
            }
          })
        }
        this.softwareData = softwareData
      }).catch(err => {
        console.log(err)
      })
    },
    querySearch(queryString, cb) {
      var results = queryString
        ? this.softwareData.filter(this.createFilter(queryString))
        : this.softwareData
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return item => {
        return (
          item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      this.state = '【' + item.name + '】- ' + item.version
      if (item.isSelected) {
        item.isSelected = false
      } else {
        item.isSelected = true
      }
      this.$emit('addDependency', item)
    },
    handleIconClick(ev) {
      console.log(ev)
      this.state = ''
    }
  }
}
</script>
<style lang="scss" scoped>
    .my-autocomplete {
    li {
        line-height: normal;
        padding: 7px;
        width: 100%;
        .name {
        text-overflow: ellipsis;
        overflow: hidden;
        }
        .addr {
        font-size: 12px;
        color: #b4b4b4;
        }
        .highlighted .addr {
        color: #ddd;
        }
    }
    }
</style>
