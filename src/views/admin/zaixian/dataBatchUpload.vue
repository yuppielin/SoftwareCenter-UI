<template>
    <div>
        <el-card class="custome custome-height">
            <div>
                <el-button icon="el-icon-back" size="small" onclick="history.go(-1)">返回</el-button>
            </div>
            <div>
                <el-form :model="dataUploadForm" label-position="right" label-width="100px" style="margin: 0 10px;">
                    <el-form-item label="资料类型：" prop="dataType">
                        <treeselect
                            v-model="dataUploadForm.dataType"
                            style="width:400px;float:left"
                            :multiple="false"
                            :appendToBody="true"
                            :options="typeData"
                            :disable-branch-nodes="false"
                            :normalizer="normalizer"
                            :show-count="true"
                            placeholder="请选择资料类型"
                            z-index="9999"
                            @select="selectModuleAdd"
                        ></treeselect>
                    </el-form-item>
                    <el-form-item
                    prop="isView"
                    label="可浏览:"
                    :rules="[{ required: true, message: '请选择对象', trigger: 'change' }]"
                    >
                        <treeselect
                            v-model="dataUploadForm.isView"
                            style="width:400px;float:left"
                            size="small"
                            value-consists-of="ALL_WITH_INDETERMINATE"
                            :normalizer="normalizer"
                            :multiple="true"
                            :limit="2"
                            :limit-text="count => `及其它${count}项`"
                            :show-count="true"
                            :options="testDepartmentList"
                            placeholder="请选择可浏览单位"
                    />
                    </el-form-item>
                    <el-form-item label="资料上传：">
                        <el-upload
                        :disabled="dataUploadForm.dataType==null||dataUploadForm.dataType==''"
                        action="#"
                        multiple
                        :auto-upload="true"
                        :show-file-list="false"
                        :before-upload="beforeUploadData"
                        :http-request="uploadData"
                        :accept="dataBeforeUploadCheck"
                        >
                            <el-button
                            :disabled="dataUploadForm.dataType==null||dataUploadForm.dataType==''"
                            slot="trigger"
                            icon="el-icon-upload"
                            type="primary"
                            size="small"
                            >上传资料</el-button>
                            <!-- <div slot="tip" class="el-upload__tip" style="display: flex;">
                                <div style="font-size: 12px;height: 60px;line-height: 30px;min-width: 60px;">支持格式：</div>
                                <div style="font-size: 12px;height: 60px;line-height: 30px;">{{dataBeforeUploadCheck}}</div>
                            </div> -->
                            <div slot="tip" class="el-upload__tip">
                                <div style="font-size: 12px;line-height: 30px;">支持格式：{{dataBeforeUploadCheck}}</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                    <!-- <el-form-item label="资料列表："> -->
                <el-row class="headerTitle" style="margin-bottom:-20px;">
                    <el-col :span="12" style="height: 40px;" class="uploadRow">
                        <span style="margin-left: 20px;">资料列表</span>
                    </el-col>
                </el-row>
                <el-table 
                    :header-cell-style="{height:'30px'}"
                    size="mini"
                    stripe
                    :data="dataUploadForm.dataFileList" 
                    max-height="500px"
                    :key="dataBatchUploadTable"
                    style="margin: 0 110px;width: calc(100% - 220px);">
                    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                    <el-table-column label="文件名称" prop="name" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column
                    label="文件类型"
                    prop="category"
                    align="center"
                    width="250px"
                    :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <treeselect
                            v-model="scope.row.category"
                            :multiple="false"
                            :appendToBody="true"
                            :options="typeData"
                            :disable-branch-nodes="false"
                            :normalizer="normalizer"
                            :show-count="true"
                            placeholder="请选择资料类型"
                            z-index="9999"
                            @select="selectModuleAdd"
                            ></treeselect>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                            icon="el-icon-delete"
                            title="删除"
                            size="small"
                            type="danger"
                            @click="deleteUploadFile(scope.$index)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="text-align: center;">
                    <el-button size="small" @click="cancelUploadData">取消</el-button>
                    <el-button
                    :disabled="dataUploadForm.dataFileList.length==0"
                    type="primary"
                    size="small"
                    @click="makeSureUploadData"
                    >确定</el-button>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
import * as software from "@/api/software";
import * as category from "@/api/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as application from "@/api/application";
import * as organization from '@/api/organization'
export default {
    components: {
        Treeselect
    },
    data() {
        return {
            dataUploadForm: {
                dataType: null,
                dataFileList: []
            },
            typeData: [],
            dataBeforeUploadCheck: config.softwareDataUploadCheckType,
            dataBatchUploadTable: 0,
            testDepartmentList: []
        }
    },
    mounted() {
        this.getCategoryList();
        this.getDeptTree();
    },
    methods: {
        selectModuleAdd() {},
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
        deleteUploadFile(index) {
            this.dataUploadForm.dataFileList.splice(index, 1);
        },
        /**
         * 获取分类列表
         */
        getCategoryList() {
            category.getCategoryList("data_type").then(response => {
                if (response.code === 200) {
                    // this.$message.success('added successfully')
                    this.typeData = response.data.list;
                }
            });
        },
         // 获取部门导航树
        getDeptTree() {
            organization
                .getOrganization()
                .then(response => {
                if (response.code === 200) {
                    const softwareTypeArray = response.data
                    this.testDepartmentList = []
                    if (softwareTypeArray.length > 0) {
                    softwareTypeArray.forEach(element => {
                        const item = this.buildTreeOptions(element)
                        this.testDepartmentList.push(item)
                    })
                    }
                }
                })
                .catch(function(error) {
                console.log(error)
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
        buildTreeOptions(item) {
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
            return node;
        },

        beforeUploadData(file) {
            let fileSize = file.size / 1024 / 1024;
            const fileType = file.name.substring(file.name.lastIndexOf("."));
            const acceptType = this.dataBeforeUploadCheck.split(",");
            if (acceptType.indexOf(fileType) === -1) {
                this.$message.error("该文件类型不符合当前允许上传类型!");
                return Promise.reject(false);
            } else if (fileSize > 100) {
                this.$message.error("该文件大小不符合当前允许上传大小!");
                return Promise.reject(false);
            } else {
                return true;
            }
        },
        uploadData(params) {
            console.log("application", params);
            let file = params.file;
            let formData = new FormData();
            formData.append("file", file);
            application.commonFileUpload(formData).then(response => {
                if (response.code === 200) {
                    this.dataUploadForm.dataFileList.push({
                        paths: response.data.fileName,
                        name: response.data.originalFilename,
                        sizes: file.size,
                        category: this.dataUploadForm.dataType,
                        // isView: this.dataUploadForm.isView
                    });
                }
            });
        },
        makeSureUploadData() {
            let dataList = [];
            this.dataUploadForm.dataFileList.forEach((item) => {
                item.isView = this.dataUploadForm.isView.join(',');
                dataList.push(item)
            })

            let data = {
                softwareDataModelList: JSON.parse(
                    JSON.stringify(dataList)
                )
            };
            software.uploadMore(data).then(response => {
                if (response.code === 200) {
                    this.$message.success("资料上传成功。");
                    this.$router.push({ 
                        path: "/admin/document/management",
                        query: { activeTab: 'second' }
                    });
                } else {
                    this.$message.error("资料上传失败，请进行检查。");
                }
            });
        },
        cancelUploadData() {
            this.$router.push({ path: "/admin/softwareUpload/showStatus" });
        }
    }
}
</script>
<style scoped>
.headerTitle {
    border-left: 4px #409eff solid;
    line-height: 40px;
    height: 40px;
    padding-left: 10px;
    font-size: 16px;
    background: #c5d7e9;
    margin: 0 110px;
}
.uploadRow {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>