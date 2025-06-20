<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card style="height:600px;">
          <div slot="header" style="height:50px;line-height:50px;">
            <el-row :gutter="10">
              <el-col :span="12" style="height:50px;line-height:50px;display: flex;">
                <span style="font-weight:600">可选软件清单</span><span style="color: gray;font-size: 12px;">({{saveData.length}}/6)</span>
              </el-col>
              <!-- <el-col :span="4" style="height:50px;line-height:50px;">
                <el-select v-model="selectType" @change="changeSelectType" size="small">
                  <el-option label="领域" :value="1"></el-option>
                  <el-option label="兵种" :value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5" style="height:50px;line-height:50px;">
                <div style="display: flex;align-items: center;justify-content: center;height:50px;line-height:50px;">
                  <treeselect
                    size="small"
                    :disabled="selectType!=1&&selectType!=2"
                    :normalizer="normalizer"
                    v-model="jzarea"
                    noResultsText="暂无数据"
                    :multiple="false"
                    value-consists-of="ALL"
                    :limit="2"
                    :limitText="count => `及其它${count}项`"
                    :options="softwareOptions"
                    :show-count="true"
                    :appendToBody="true"
                    :disable-branch-nodes="true"
                    z-index="9999"
                    placeholder="请选软件分类 "
                    id="tree"
                    clearable
                    @select="changeInputAndType"
                  ></treeselect>
                </div>
              </el-col> -->
              <el-col :span="9" style="height:50px;line-height:50px;">
                <el-input
                  v-model="keyword"
                  size="small"
                  placeholder="请搜索添加软件"
                />
              </el-col>
              <el-col :span="3" style="height:50px;line-height:50px;">
                <el-button
                  style="background-color: #05994e;color: white;"
                  size="small"
                  icon="el-icon-search"
                  @click="changeInputAndType"
                >搜素</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            max-height="450px"
            :data="softwareData"
            ref="multipartTable"
            size="mini"
            :border="false"
            @select="handleCheckBox"
            @select-all="handleCheckBox"
            @selection-change="handleSelectionChange"
            class="table-lubo"
            :header-cell-class-name="leftTableCellClass"
            :header-cell-style="{height:'30px'}"
          >
            <el-table-column type="selection" :selectable="judgeLeftSelectable" width="50" align="center"></el-table-column>
            <el-table-column header-align="center" label="软件信息" show-overflow-tooltip>
              <template slot-scope="scoped">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <img
                      :src="scoped.row.logo == null||scoped.row.logo == ''? defaultImg: logoAndPicUrl+scoped.row.logo"
                      width="50"
                      height="50"
                      :onerror="defaultImg"
                      style="margin-top:5px;"
                    />
                  </el-col>
                  <el-col :span="16">
                    <div style="margin-top:20px;">
                      <span
                        class="spanWidth"
                        style="font-size:16px;font-weight:600;color:#05994e;"
                      >{{ scoped.row.name }}</span>
                      <!-- <span
                        style="font-size:14px;color: grey"
                        v-if="scoped.row.identity"
                      >< {{ scoped.row.identity }} ></span>-->
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column header-align="center" label="版本" width="120px">
              <template slot-scope="scope">
                <el-select size="mini" v-model="scope.row.versionId">
                  <el-option
                    v-for="item in scope.row.versions"
                    :key="item.id"
                    :label="item.version"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column header-align="center" label="描述" width="280px" prop="description" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            background
            style="text-align:right;margin-top:10px;"
            size="mini"
            :page-size="pageSize"
            :page-count="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="totalCount"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
      <el-col :span="2" style="height:600px;text-align: center;">
        <div>
          <el-button
            @click="saveSoftwareDataToLunbo"
            :disabled="saveData.length==0"
            title="软件选择"
            size="mini"
            type="primary"
            style="height: 40px;margin-top: 250px;"
            icon="el-icon-right"
          ></el-button>
        </div>
        <div>
          <el-button
            @click="deleteSoftwareDataFromLunbo"
            :disabled="rightData.length==0"
            title="软件移除"
            size="mini"
            type="primary"
            style="height: 40px;margin-top: 20px;"
            icon="el-icon-back"
          ></el-button>
        </div>
      </el-col>
      <el-col :span="11">
        <el-card style="height:600px;">
          <div slot="header" style="height:50px;line-height:50px;">
            <el-row :gutter="6">
              <el-col :span="10" style="height:50px;line-height:50px;">
                <span style="font-weight:600">轮播设置</span>
              </el-col>
              <el-col :span="4" style="height:50px;line-height:50px;">
                <el-select v-model="selectType" @change="changeSelectType" size="small">
                  <el-option label="领域" :value="1"></el-option>
                  <el-option label="兵种" :value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6" style="height:50px;line-height:50px;">
                <div style="display: flex;align-items: center;justify-content: center;height:55px;line-height:55px;">
                  <treeselect
                    size="small"
                    :disabled="selectType!=1&&selectType!=2"
                    :normalizer="normalizer"
                    v-model="jzarea"
                    noResultsText="暂无数据"
                    :multiple="false"
                    value-consists-of="ALL"
                    :limit="2"
                    :limitText="count => `及其它${count}项`"
                    :options="softwareOptions"
                    :show-count="true"
                    :appendToBody="true"
                    :disable-branch-nodes="true"
                    z-index="9999"
                    placeholder="请选软件分类 "
                    id="tree"
                    clearable
                    @select="changeInputAndType"
                  ></treeselect>
                </div>
              </el-col>
              <el-col :span="4" style="text-align:right;height:50px;line-height:50px;">
                <el-button size="mini" type="primary" @click="addSoftwareRollList">保存并预览</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            :data="lunboData"
            :border="false"
            @select="handleLunboCheckBox"
            @select-all="handleLunboCheckBox"
            @selection-change="handleLunboSelectionChange"
            size="mini"
            class="table-lubo"
            :header-cell-style="{height:'30px'}"
            max-height="500px"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column header-align="center" label="软件信息" show-overflow-tooltip>
              <template slot-scope="scoped">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <img
                      :src="scoped.row.logo == null||scoped.row.logo == ''? defaultImg: logoAndPicUrl+scoped.row.logo"
                      :onerror="defaultImg"
                      width="50"
                      height="50"
                      style="margin-top:5px;"
                    />
                  </el-col>
                  <el-col :span="14">
                    <div style="margin-top:20px;">
                      <span
                        class="spanWidth"
                        style="font-size:16px;font-weight:600;color:#05994e;"
                      >{{ scoped.row.name }}</span>
                    </div>
                  </el-col>
                  <!-- <el-col :span="6">
                    <el-button
                      type="text"
                      style="color:red;margin-top:15px;"
                      size="mini"
                      icon="el-icon-remove"
                      @click="removeItem(scoped.$index,scoped.row)"
                    >移除</el-button>
                    <el-button
                      type="text"
                      style="margin-top:15px;"
                      size="mini"
                      icon="el-icon-top"
                      @click="moveUp(scoped.$index,scoped.row)"
                    >上移</el-button>
                    <el-button
                      type="text"
                      style="margin-top:15px;"
                      size="mini"
                      icon="el-icon-bottom"
                      @click="moveDown(scoped.$index,scoped.row)"
                    >下移</el-button>
                  </el-col>-->
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="版本" align="center" show-overflow-tooltip width="120px" prop="version">
              <!-- <template slot-scope="scope">
                <el-select size="mini" v-model="scope.row.versionId">
                  <el-option v-for="item in scope.row.versions" :key="item.id" :label="item.version" :value="item.id" />
                </el-select>
              </template>-->
            </el-table-column>
            <el-table-column label="描述" header-align="center" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" header-align="center" width="160px" align="center">
              <template slot-scope="scoped">
                <el-button
                  :disabled="scoped.$index == 0"
                  size="small"
                  title="上移"
                  type="primary"
                  icon="el-icon-top"
                  @click="moveUp(scoped.$index,scoped.row)"
                ></el-button>
                <el-button
                  :disabled="scoped.$index == lunboData.length - 1"
                  size="small"
                  title="下移"
                  type="primary"
                  icon="el-icon-bottom"
                  @click="moveDown(scoped.$index,scoped.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top:10px;">
      <div slot="header" style="height:20px;line-height:20px;">
        <span style="font-weight:600">预览效果</span>
      </div>
      <el-carousel :interval="4000" height="250px">
        <el-carousel-item v-for="(item,index) in imgList" :key="index" style="padding:20px 100px;">
          <el-row :gutter="20">
            <el-col :span="15">
              <div
                style="margin-top:50px;font-size:28px;font-weight:600;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color: white;"
              >
                {{ item.name }}
                <el-tag type="primary" size="mini" style="margin: 0 10px;">{{ item.version }}</el-tag>
              </div>
              <div
                style="font-size:14px;margin-top:10px;"
                v-if="item.identity"
              >< {{ item.identity }} ></div>
              <div
                style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px;color: white;"
                v-if="item.description"
              >{{ item.description.length > 150 ? item.description.substring(0,100) + '......' : item.description}}</div>
              <div
                style="margin-top:10px;font-size:14px;overflow: hidden;height: 95px;color: white;"
                v-else
              >{{ item.description}}</div>
              <!--              <div style="margin-top:10px;font-size:14px;">-->
              <!--                {{ item.description }}-->
              <!--              </div>-->
              <div style="margin-top:-70px;">
              <el-button size="small" style="background:rgba(255,255,255,0);border-color:solid 1px white;color:white;" @click = "downloadSoftware(item)">立即下载</el-button>
              </div>
            </el-col>
            <el-col :span="9" style="text-align:right;">
              <img
                :src="item.pic?logoAndPicUrl+item.pic:defaultS"
                :onerror="defaultS"
                width="200"
                height="160"
                style="margin-top:30px;"
              />
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>
<script>
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as software from "@/api/software";
import * as category from "@/api/category";
import * as lunbo from "@/api/lunbo";
export default {
  components: {
    Treeselect: Treeselect
  },
  data() {
    return {
      jzarea: null,
      keyword: "",
      softwareOptions: [],
      softwareData: [],
      saveData: [],
      rightData: [],
      lunboData: [],
      userInfo:[],
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      imgList: [
        require("@/assets/imgs/banner.png"),
        require("@/assets/imgs/banner.png"),
        require("@/assets/imgs/banner.png"),
        require("@/assets/imgs/banner.png"),
        require("@/assets/imgs/banner.png")
      ],
      defaultS: 'this.src="' + require("@/assets/index/pic.png") + '"',
      imgSource: require("@/assets/index/softwareDefault.png"),
      defaultImg: 'this.src="' + require("@/assets/index/softwareDefault.png") + '"',

      selectType: null,
      logoAndPicUrl: config.urlFilePrefix
    };
  },
  created(){
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

  },
  mounted() {
    this.getSoftwareList();
    this.getSoftwareRollList();
    // this.getSoftwareTypeList()
  },
  methods: {
    leftTableCellClass() {
      if(this.jzarea!=null&&this.jzarea!='') {
        return "nullCellClass"
      }else{
        return "leftAllSelectClass"
      }
    },
    judgeLeftSelectable() {
      if(this.jzarea!=null&&this.jzarea!=''){
        return true
      }else{
        return false
      }
    },
    saveSoftwareDataToLunbo() {
      if (
        this.jzarea == null ||
        this.jzarea == "" ||
        this.jzarea == undefined
      ) {
        this.$message.info("必须选择领域或兵种");
      } else {
        this.lunboData = JSON.parse(JSON.stringify(this.saveData));
      }
    },
    deleteSoftwareDataFromLunbo() {
      if (
        this.jzarea == null ||
        this.jzarea == "" ||
        this.jzarea == undefined
      ) {
        this.$message.info("必须选择领域或兵种");
      } else {
        this.$confirm("确定移除选择条目", "移除条目", {
          type: "warning"
        }).then(() => {
          console.log(this.rightData, this.lunboData, "rightData and lunboData")
          for (let i = 0; i < this.rightData.length; i++) {
            if (this.lunboData.find(item => item.id === this.rightData[i].id)) {
              this.lunboData = this.lunboData.filter(
                item => item.id !== this.rightData[i].id
              );
            }
            if (
              this.saveData.find(item1 => item1.id === this.rightData[i].id)
            ) {
              this.saveData = this.saveData.filter(
                item1 => item1.id !== this.rightData[i].id
              );
            }
            this.softwareData.forEach((item2, index1) => {
              if (item2.id === this.rightData[i].id) {
                this.$refs.multipartTable.toggleRowSelection(
                  this.softwareData[index1]
                );
              }
            });
          }
          this.rightData = [];
        });
      }
    },
    changeInputAndType() {
      this.$nextTick(() => {
        console.log("jzarea", this.jzarea);
        this.currentPage = 1;
        this.getSoftwareList();
        this.getSoftwareRollList();
      });
    },
    changeSelectType() {
      console.log(this.selectType, "selectType");
      if (this.selectType == 1) {
        this.getLYType();
        this.jzarea = null;
      } else if (this.selectType == 2) {
        this.getBZType();
        this.jzarea = null;
      }
    },
    getBZType() {
      lunbo.getBZType().then(response => {
        if (response.code == 200) {
          console.log(response, "bz response");
          let softwareTypeArray = response.data;
          this.softwareOptions = [];
          if (softwareTypeArray.length > 0) {
            softwareTypeArray.forEach(element => {
              let item = this.buildTreeOptions(element);
              console.log(item);
              this.softwareOptions.push(item);
            });
          }
        }
      });
    },
    getLYType() {
      lunbo.getLYType().then(response => {
        if (response.code == 200) {
          console.log(response, "ly response");
          let softwareTypeArray = response.data;
          this.softwareOptions = [];
          if (softwareTypeArray.length > 0) {
            softwareTypeArray.forEach(element => {
              let item = this.buildTreeOptions(element);
              console.log(item);
              this.softwareOptions.push(item);
            });
          }
        }
      });
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    buildTreeOptions(item) {
      console.log("sss");
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: [],
        selectable: true
      };
      if (item.children.length > 0) {
        node.selectable = false;
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      console.log(node);
      return node;
    },
    getSoftwareTypeList() {
      category.getCategoryList("service", 1, 10).then(response => {
        if (response.code === 200) {
          let softwareTypeArray = response.data.list;
          this.softwareOptions = [];
          if (softwareTypeArray.length > 0) {
            softwareTypeArray.forEach(element => {
              let item = this.buildTreeOptions(element);
              console.log(item);
              this.softwareOptions.push(item);
            });
          }
        }
      });
      console.log(this.softwareOptions);
    },
    getSoftwareList() {
      software
        .searchSoftwareList(
          this.jzarea,
          this.keyword,
          1,
          this.currentPage,
          this.pageSize
        )
        .then(response => {
          if (response.code === 200) {
            this.softwareData = response.data.list;
            this.totalCount = response.data.total;
            this.$nextTick(() => {
              this.softwareData.forEach((item, index) => {
                // if (this.lunboData.findIndex(v => v.id === item.id) >= 0) {
                if (this.saveData.findIndex(v => v.id === item.id) >= 0) {
                  this.$refs.multipartTable.toggleRowSelection(
                    this.$refs.multipartTable.data[index],
                    true
                  );
                }
              });
            });
          }
        });
    },

    downloadSoftware(item) {

      software.downloadSoftwareFile(this.userInfo.userId, item.versionId);
    },

    addSoftwareRollList() {
      // const softwarePollList = []
      // this.lunboData.forEach((item, index) => {
      //   softwarePollList.push({
      //     softwareId: item.id,
      //     sort: index
      //   })
      // })
      // software.addSoftwarePollList(softwarePollList).then(response => {
      //   if (response.code === 200) {
      //     this.$message.success('保存成功')
      //     this.getSoftwareRollList()
      //   }
      // })
      if (
        this.jzarea == null ||
        this.jzarea == "" ||
        this.jzarea == undefined
      ) {
        this.$message.info("必须选择领域或兵种");
      } else if (this.lunboData.length == 0) {
        this.$message.info("必须选择要轮播显示的软件");
      } else {
        const softwarePollList = [];
        this.lunboData.forEach((item, index) => {
          softwarePollList.push({
            softwareId: item.id,
            sort: index,
            type: this.jzarea != null ? this.jzarea : 0
          });
        });
        lunbo.addLunbo(softwarePollList).then(response => {
          if (response.code === 200) {
            this.$message.success("保存成功");
            this.getSoftwareRollList();
          }
        });
      }
    },
    getSoftwareRollList() {
      // software.getSoftwarePollList().then(response => {
      //   if (response.code === 200) {
      //     if (response.data.length > 0) {
      //       this.lunboData = response.data
      //       this.imgList = response.data
      //     }
      //   }
      // })
      lunbo.getPollByType(this.jzarea).then(response => {
        if (response.code === 200) {
          if (response.data == null) {
            this.lunboData = [];
            this.saveData = [];
            this.imgList = [];
          } else if (response.data.length > 0) {
            this.lunboData = JSON.parse(JSON.stringify(response.data));
            this.saveData = JSON.parse(JSON.stringify(response.data));
            this.imgList = JSON.parse(JSON.stringify(response.data));
          } else {
            this.lunboData = [];
            this.saveData = [];
            this.imgList = [];
          }
        }
      });
    },
    handleCheckBox(rows, row) {
      console.log(rows, row, "rows and row")
      // if (this.lunboData.find(item => item.id === row.id)) {
      //   this.lunboData = this.lunboData.filter(item => item.id !== row.id);
      // } else {
      //   this.lunboData.push(row);
      // }
      if(row!=undefined){
        if (this.saveData.find(item => item.id === row.id)) {
          this.saveData = this.saveData.filter(item => item.id !== row.id);
        } else {
          if (this.saveData.length == 6) {
            this.$refs.multipartTable.toggleRowSelection(row);
            this.$message.info("当前已选软件数量已达到上限");
          } else {
            this.saveData.push(row);
          }
        }
      }else{
        this.saveData = []
        this.saveData = this.saveData.concat(rows)
      }
    },
    handleLunboCheckBox(rows, row) {
      if(row!=undefined){
        if (this.rightData.find(item => item.id === row.id)) {
          this.rightData = this.rightData.filter(item => item.id !== row.id);
        } else {
          this.rightData.push(row);
        }
      }else{
        this.rightData = []
        this.rightData = this.rightData.concat(rows)
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getSoftwareList();
    },
    handleSelectionChange(val) {},
    handleLunboSelectionChange(val) {},
    removeItem(index, row) {
      this.$confirm("确定移除该条目", "移除条目", {
        type: "warning"
      }).then(() => {
        this.lunboData.splice(index, 1);
        this.softwareData.forEach((item, index1) => {
          if (item.id === row.id) {
            this.$refs.multipartTable.toggleRowSelection(
              this.softwareData[index1]
            );
          }
        });
      });
    },
    moveUp(index, item) {
      const that = this;
      if (index > 0) {
        const upDate = that.lunboData[index - 1];
        that.lunboData.splice(index - 1, 1);
        that.lunboData.splice(index, 0, upDate);
      } else {
        this.$notify.warning("已经是第一条，不可上移");
      }
    },
    moveDown(index, item) {
      const that = this;
      if (index + 1 === that.lunboData.length) {
        this.$notify.warning("已经是最后一条，不可下移");
      } else {
        const downDate = that.lunboData[index + 1];
        that.lunboData.splice(index + 1, 1);
        that.lunboData.splice(index, 0, downDate);
      }
    }
  }
};
</script>
<style scoped>
.lb-content {
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
}
.version {
  font-size: 10px;
  color: white;
  display: inline-block;
  padding: 0px 10px;
  border-radius: 4px;
  background: rgb(170, 169, 169);
  margin-left: 10px;
}
.el-table--medium td {
  padding: 0;
}
.el-carousel__item {
  /* width: 760px; */
  background-image: url("~@/assets/index/index_picture_bg.png");
  background-size: cover;
  border-radius: 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
::v-deep .el-carousel__indicator--horizontal {
  display: inline-block;
  padding: 10px 2px;
}
.table-lubo >>> .el-table__row > td {
  border-color: rgba(211, 211, 211, 0.5);
}
.spanWidth {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: top;
}
#tree >>> .vue-treeselect__control {
  height: 32px !important;
}
::v-deep .el-card__header {
  padding: 10px 20px;
}
/* ::v-deep .el-table .leftAllSelectClass .cell .el-checkbox {
  pointer-events: none;
} */
::v-deep .leftAllSelectClass .cell .el-checkbox  {
  pointer-events: none;
}
::v-deep .nullCellClass .cell .el-checkbox {
  pointer-events: unset;
}
::v-deep .el-select__caret.el-input__icon.el-icon-arrow-up {
  height: 32px
}
::v-deep .vue-treeselect__placeholder,.vue-treeselect__single-value {
  line-height: 32px!important;
}
</style>
