<template>
  <el-card class="custome custome-height" >
    <CloseBack>批量上传</CloseBack>
    <el-form label-position="right" label-width="100px" :model="softwareForm" ref="softwareForm">
      <el-form-item label="软件分类：" prop="service" :rules="[{required:true,message:'选择软件的软件分类',trigger:'blur'}]">
        <treeselect
          size="small"
          v-model="softwareForm.service"
          noResultsText="暂无数据"
          :normalizer="normalizer"
          :multiple="true"
          value-consists-of="ALL_WITH_INDETERMINATE"
          :limit="2"
          :limitText="count => `及其它${count}项`"
          :options="serviceList"
          :show-count="true"
          :appendToBody="true"
          z-index="9999"
          placeholder="请选软件分类 "
          clearable
          :style="{ width: '50%' }"
        ></treeselect>
      </el-form-item>
      <el-form-item label="浏览权限：" prop="isView" :rules="[{required:true,message:'选择软件的可浏览单位',trigger:'change'}]">
        <treeselect
          size="small"
          :normalizer="normalizer"
          v-model="softwareForm.isView"
          :multiple="true"
          value-consists-of="ALL_WITH_INDETERMINATE"
          :options="offerUnits"
          :limit="2"
          :limitText="count => `及其它${count}项`"
          :show-count="true"
          placeholder="请选择可浏览单位"
          :style="{ width: '50%' }"
          :default-expand-level="1"
        ></treeselect>
      </el-form-item>
      <el-form-item label="下载权限：" prop="isDownload" :rules="[{required:true,message:'选择软件的可下载单位',trigger:'change'}]">
        <treeselect
          size="small"
          :normalizer="normalizer"
          v-model="softwareForm.isDownload"
          :multiple="true"
          value-consists-of="ALL_WITH_INDETERMINATE"
          :limit="2"
          :limitText="count => `及其它${count}项`"
          :show-count="true"
          :options="offerUnits"
          placeholder="请选择可下载单位"
          :style="{ width: '50%' }"
          :default-expand-level="1"
        ></treeselect>
      </el-form-item>
      <el-form-item label="提供单位：" prop="offerUnitId" :rules="[{required:true,message:'选择软件的提供单位',trigger:'change'}]">
        <treeselect
          size="small"
          v-model="softwareForm.offerUnitId"
          :multiple="false"
          :normalizer="normalizer"
          :options="offerUnits"
          placeholder="请选择提供单位"
          :appendToBody="true"
          :disable-branch-nodes="true"
          :style="{ width: '50%' }"
          :default-expand-level="1"
          @select="getSelectOfferUnit"
        ></treeselect>
      </el-form-item>
      <el-form-item label="软件上传：">
        <el-button size="small" type="primary" :disabled="parseLoading" @click="upload">点击上传</el-button>
      </el-form-item>
    </el-form>
    <div v-if="softwareData.length>0" style="margin-top:10px;">
      <div style="font-weight:600;margin-top:10px;">
        <i class="el-icon-menu" />
        软件清单(信息确认)
      </div>
      <el-table :key="tableKey" :data="softwareData" :header-cell-style="{background:'#2BB56E',height:'30px'}" style="margin-top:10px;" v-loading="parseLoading" element-loading-text="软件包解析中">
        <el-table-column label="序号" align="center" type="index" width="55" />
        <el-table-column label="软件名称" header-align="center" width="300">
          <template slot-scope="scoped">
            <el-input @change="changeTableColumn" v-model="scoped.row.name" size="small" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="接口标识" width="250">
          <template slot-scope="scoped">
            <el-input v-model="scoped.row.interfaceIdentity" size="small" :disabled="scoped.row.interfaceIdentity==null||scoped.row.interfaceIdentity==undefined||scoped.row.interfaceIdentity==''" />
          </template>
        </el-table-column> -->
        <el-table-column label="软件段类型" align="center" width="150">
          <template slot-scope="scoped">
             <el-select @change="changeTableColumn" v-model="scoped.row.fragmentType">
                <el-option
                  v-for="(item,index) in fragmentTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.val"
                ></el-option>
              </el-select>
          </template>
        </el-table-column>
        <el-table-column label="段前缀" align="center" width="150">
          <template slot-scope="scoped">
            <el-input @change="changeTableColumn" v-model="scoped.row.prefix" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="软件版本" align="center" width="150">
          <template slot-scope="scoped">
            <el-input @change="changeTableColumn" v-model="scoped.row.version" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="研制单位" header-align="center" width="200">
          <template slot-scope="scoped">
            <el-input @change="changeTableColumn" v-model="scoped.row.devUnit" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="软件描述" header-align="center">
          <template slot-scope="scoped">
            <el-input @change="changeTableColumn" v-model="scoped.row.description" size="small" type="textarea" :rows="2" />
          </template>
        </el-table-column>
        <el-table-column label="CPU架构" align="center">
          <template slot-scope="scoped">
            <el-select multiple :collapse-tags='true' v-model="scoped.row.cpu"  style="width:100%">
              <el-option v-for="(item,index) in fragmentArchList" :key="index" :label="item.name" :value="item.identities"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scoped">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delSoftware(scoped.$index,scoped.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:10px;">
        <el-button size="small" type="primary" v-if="!parseLoading" @click="uploadBatch" :loading="uploadLoading">提交</el-button>
      </div>
    </div>

     <!-- 将上传组件全局注册 -->
    <global-uploader  />
  </el-card>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as software from '@/api/software'
import * as category from '@/api/category'
// import {config} from '/public/config'
import * as application from "@/api/application"

import globaluploader from '@/components/VueSimpleUploader/GlobalUploader'
import Bus from '@/components/VueSimpleUploader/js/bus'
import * as organization from "@/api/organization";
export default {
  components: {
    Treeselect,
    "global-uploader": globaluploader
  },
  data() {
    return {
      type: null,
      parseLoading: false,
      softwareData: [],
      serviceList:[],
      fragmentTypeList:[],
      softwareForm: {},
      fileList: [],
      fileData: '',
      uploadLoading: false,
      userInfo: {},
      offerUnits: [],
      fragmentArchList: [],
      tableKey: 0
    }
  },
  mounted() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getOfferUnitList()
    this.getSoftwareServiceList();
    this.getFragmentTypeList();
    this.getFragmentArchList();
     // 文件选择后的回调
    Bus.$on('fileAdded', () => {
      console.log('文件已选择')
    })
     // 文件上传成功的回调
    Bus.$on('fileSuccess', (list) => {
      console.log('文件上传成功!!');
      console.log(list);
      let softwareTypeMap = {};
      this.fragmentTypeList.forEach(item=> {
        softwareTypeMap[item.name] = item.val
      })
      this.softwareData = list;
      this.softwareData.forEach(item => {
        item.fragmentType = softwareTypeMap[item.type]
      })
      console.log(this.softwareData,887);
    })
  },
  beforeDestroy() {
    Bus.$off('fileAdded')
    Bus.$off('fileSuccess')
  },
  methods: {
    changeTableColumn() {
      this.tableKey = this.tableKey + 1
    },
    getSelectOfferUnit(item) {
      console.log("getSelectOfferUnit",item)
      this.softwareForm.offerUnit = item.name
    },
    getOfferUnitList() {
      organization.getOrganization().then(response => {
        if (response.code === 200) {
          this.offerUnits = JSON.parse(JSON.stringify(response.data))
        }
      });
    },
    getSoftwareServiceList() {
      category.getCategoryList("service", null, null).then(response => {
        if (response.code === 200) {
          let softwareTypeArray = response.data.list;
          // this.serviceList = this.handleTree(softwareTypeArray)
          this.serviceList = softwareTypeArray
          console.log("this.serviceList===========",this.serviceList);
        }
      });
    },
    getFragmentArchList() {
      category.getCategoryList("fragment_arch", null, null).then(response => {
        if (response.code === 200) {
          this.fragmentArchList = JSON.parse(JSON.stringify(this.handleTree(response.data.list)))
        }
      });
    },
    getFragmentTypeList() {
      category.getCategoryList("fragment_type", null, null).then(response => {
        let res = this.handleTree(response.data.list)
        this.fragmentTypeList = res;
      });
    },
    upload() {
      // 打开文件选择框
      Bus.$emit('openUploader', {
        // 给服务端的额外参数
        params: {
          // page: 'home'
         
        },
        options: {
          target: appConfig.config.url+'/appstore/upload/fileUpload',
          accept: ['.zip', '.tar'],
        }
      })
    },
    // 转换菜单数据结构
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
    handleRemove(file, fileList) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(index, 1)
      this.softwareData.splice(index, 1)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.fileList = fileList
      this.$message.warning(`当前限制选择 10个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm('确定移除软件 ' + file.name + ' 吗？', '提示', {
        type: 'warning'
      })
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    selectModuleAdd() {

    },
    uploadBatch() {
      this.$refs.softwareForm.validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          // this.fileData = new FormData()
          // this.$refs.uploadBatch.submit()
          // this.fileData.append('softwareUploadModelListStr', JSON.stringify(this.softwareData))
          // this.fileData.append('username', this.userInfo.username)
          // this.fileData.append('category', this.softwareForm.category)
          let softwareList = []
          this.softwareData.forEach(item => {
            console.log(item,"softwareList")
            softwareList.push({
              softwareName: item.name,
              devUnit: item.devUnit,
              prefix: item.prefix,
              paths: item.path,
              fileName: item.fileName,
              sizes: item.size+"",
              md5: item.md5,
              description: item.description,
              cpu: item.cpu.length>0?item.cpu.join(','):"",
              fragmentType: parseInt(item.fragmentType),
              version: item.version,
              softwareType: 2,
            })
          })
          let data = {
            service: this.softwareForm.service.join(','),
            isView: this.softwareForm.isView.join(','),
            isDownload: this.softwareForm.isDownload.join(','),
            offerUnitId: this.softwareForm.offerUnitId,
            offerUnit: this.softwareForm.offerUnit,
            softwareVersionList: JSON.parse(JSON.stringify(softwareList))
          }
          software.addSoftwareBatch(data).then(response => {
            if (response.code === 200) {
              console.log("批量上传软件段成功")
              this.$message.success("软件添加成功");
              this.$router.push("/admin/software/management");
            }
            this.uploadLoading = false
          }).catch(error => {
            this.uploadLoading = false
          })
        } else {
          console.log('error submit!!')
          this.uploadLoading = false
          return false
        }
      })
    },
    // parseSoftware(data) {
    //   this.parseLoading = true
    //   software.parseSoftware(data).then(response => {
    //     if (response.code === 200) {
    //       const software = response.data
    //       this.softwareData.push({
    //         name: software.name,
    //         description: software.description,
    //         version: software.version,
    //         interfaceIdentity: software.identity,
    //         type: software.type === 'service' ? 'serviceSeg' : software.type,
    //         devUnit: software.devUnit
    //       })
    //     } else if (response.code === -1) {
    //       this.$message.warning(response.msg)
    //       // this.fileList.splice(this.fileList.length - 1, 1)
    //       this.softwareData.push({
    //         name: software.name,
    //         description: software.description,
    //         version: software.version,
    //         interfaceIdentity: software.identity,
    //         type: software.type === 'service' ? 'serviceSeg' : software.type,
    //         devUnit: software.devUnit
    //       })
    //     } else {
    //       this.$message.error(response.msg)
    //       this.fileList.splice(this.fileList.length - 1, 1)
    //     }
    //     this.parseLoading = false
    //   })
    // },
    // uploadSoftwareFile(file) {
    //   this.fileData.append('softwareFiles', file.file)
    // },
    // 上传文件
    // async handleFileChange(file, fileList) {
    //   const accessFileType = ['tar', 'zip']
    //   const type = file.name.split('.').splice(-1)[0].toLowerCase()
    //   const isType = accessFileType.includes(type)
    //   const isLt2G = file.size / 1024 / 1024 < 20480
    //   const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
    //   if (existFile) {
    //     this.$message.error('当前文件已存在！')
    //     fileList.pop()
    //   } else if (!isType) {
    //     this.$message.error('上传文件格式异常!')
    //     fileList.pop()
    //   } else if (!isLt2G) {
    //     this.$message.error('上传软件资源大小不能超过 20GB!')
    //     fileList.pop()
    //   } else {
    //     const data = new FormData()
    //     data.append('file', file.raw)
    //     await this.parseSoftware(data)
    //   }
    //   this.fileList = fileList
    //   // this.analysisForm.fileList = fileList;
    // },
    delSoftware(index, row) {
      this.$confirm('确定删除软件 ' + row.name + ' 吗？', '提示', {
        type: 'warning'
      }).then((e) => {
        this.softwareData.splice(index, 1)
        this.fileList.splice(index, 1)
      })
    },

    // fileAdded(list) {
    //   console.log(list, 888);
    // }
  }
}
</script>
<style scoped>

</style>
