<template>
  <el-dialog
    title="安防检测单位选择"
    :visible.sync="dialogVisible"
    :show-close="false"
    :before-close="beforeClose"
  >
    <el-form
      ref="afSelectFormRef"
      id="afSelectForm"
      :model="afSelectForm"
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="系统名称：">
        <span>{{afSelectForm.name}}</span>
      </el-form-item>
      <el-form-item
        label="安防检测单位名称："
        prop="afUnitId"
        :rules="[{required:true,message:'系统名称不能为空',trigger:'change'}]"
      >
        <treeselect
          size="small"
          v-model="afSelectForm.afUnitId"
          :multiple="false"
          :options="afUnitData"
          :normalizer="normalizer"
          :disable-branch-nodes="true"
          :default-expand-level="1"
          placeholder="请选择安防测试单位"
        ></treeselect>
      </el-form-item>
      <el-form-item
        label="审核人："
        prop="contactUser"
        :rules="[{required:true,message:'审核人姓名不能为空',trigger:'blur'}]"
      >
        <el-input v-model="afSelectForm.contactUser" placeholder="请输入审核人真实姓名" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item
        label="联系方式："
        prop="contactInfor"
        :rules="[{required:true,message:'联系方式不能为空',trigger:'blur'}]"
      >
        <el-input v-model="afSelectForm.contactInfor" placeholder="请输入审核人联系方式" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button size="small" @click="cancelButton">取消</el-button>
      <el-button size="small" @click="clickButton" type="primary">提交</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as organization from "@/api/organization";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  components: {
    Treeselect: Treeselect
  },
  data() {
    return {
      dialogVisible: false,
      afSelectForm: {
        systemId: 0,
        name: "",
        afUnitId: null,
        stage: null,
        id: null,
        contactUser: "",
        contactInfor: ""
      },
      afUnitData: []
    };
  },
  mounted() {
    console.log("afdialog");
    this.getDeptTree();
  },
  watch: {
    visible(newVal, oldVal) {
      console.log(newVal);
      this.dialogVisible = newVal;
    },
    data(newVal, oldVal) {
      console.log(newVal);
      this.afSelectForm.name = newVal.name;
      this.afSelectForm.stage = newVal.stage;
      this.afSelectForm.id = newVal.id;
      this.afSelectForm.contactUser = ""
      this.afSelectForm.contactInfor = ""
    }
  },
  methods: {
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
    // 获取部门导航树
    getDeptTree() {
      organization
        // .getOrganization("", null, null)
        .getSecurityOrganization()
        .then(response => {
          if (response.code === 200) {
            let afList = response.data;
            if (afList.length > 0) {
              afList.forEach(element => {
                let item = this.buildTreeOptions(element);
                this.afUnitData.push(item);
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buildTreeOptions(item) {
      let node = {
        id: item.id,
        name: item.name,
        label: item.name,
        children: []
      };
      if (item.children.length > 0) {
        for (let num = 0; num < item.children.length; num++) {
          node.children.push(this.buildTreeOptions(item.children[num]));
        }
      }
      return node;
    },
    beforeClose() {
      this.$emit("closeOut");
    },
    clickButton() {
      this.$refs["afSelectFormRef"].validate(valid => {
        if (valid) {
          this.$emit("close", this.afSelectForm);
          this.dialogVisible = false;
        } else {
          // console.log("error submit!!");
          // return this.$message.info("请选择安防检测单位");
        }
      });
    },
    cancelButton() {
      this.$confirm("要取消为系统选择安防检测单位吗", "提示", {
        confirmButtonText: "取消选择",
        cancelButtonText: "继续选择",
        type: "warning"
      })
        .then(async () => {
          this.afSelectForm.afUnitId = null;
          this.$emit("close", this.afSelectForm);
          this.dialogVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "继续选择安防检测单位"
          });
        });
    }
  }
};
</script>
<style>
</style>