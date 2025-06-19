<template>
    <el-card class="custome custome-height" style="position:relative">
        <div slot="header" style="text-align:center;margin:20px 0;">
            <el-image :src="require('@/assets/index/avatar.png')" style="width:100px;height:100px;"></el-image>
            <div>基本信息</div>
            <el-button type="text" icon="el-icon-error" style="position: absolute;top: 0px;right: 10px;" @click="goToPre"></el-button>
        </div>
        <el-form ref="userForm" name="userForm" :model="userForm" label-position="top" label-width="100px" style="padding:20px 40px;">
        <el-row :gutter="40">
            <el-col :span="12">
                <el-form-item label="用户名称:"> 
                    <span style="font-size:12px">{{userForm.username}}</span>
                </el-form-item>
                <el-form-item label="真实名称:" prop="realname" :rules="[{required:true,message:'真实姓名不能为空',trigger:'blur'}]"> 
                     <el-input v-model="userForm.realname" style="width:50%" ></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="idcard" :rules="[{required:true,message:'身份证号不能为空',trigger:'blur'}]"> 
                     <el-input v-model="userForm.idcard" style="width:50%" ></el-input>
                </el-form-item>
                <el-form-item label="填报单位:"> 
                    <span style="font-size:12px">{{userForm.runit}}</span>
                </el-form-item>
                <el-form-item label="注册时间:" prop="ctime"> 
                     <span style="font-size:12px">{{ parseTime(userForm.ctime, '{y}-{m}-{d} {h}:{i}') }}</span>
                </el-form-item>
            </el-col>
             <el-col :span="12">
                <el-form-item label="军官证号:" prop="officerNum" :rules="[{required:true,message:'军官证号不能为空',trigger:'blur'}]"> 
                    <el-input v-model="userForm.officerNum" style="width:50%"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:" prop="tel" :rules="[{required:true,message:'联试方式不能为空',trigger:'blur'}]"> 
                        <el-input v-model="userForm.tel"  style="width:50%"></el-input>
                </el-form-item>
                <el-form-item label="组织设置:" prop="organizationId" :rules="[{required:true,message:'请设置组织机构',trigger:'change'}]"> 
                    <treeselect style="width:50%"
                        v-model="userForm.organizationId"
                        @select="changeDept"
                        :options="deptOptions"
                        :disable-branch-nodes="true"
                        :normalizer="normalizer"
                        :show-count="true"
                        noResultsText="没有数据"
                        placeholder="请选择归属部门"
                        :default-expand-level="1"
                    />
                </el-form-item>
                <el-form-item label="角色设置" prop="roles" :rules="[{required:true,message:'请设置用户角色',trigger:'change'}]"> 
                    <el-select ref="rolesRef" size="small" v-model="userForm.roles" @blur="closeOptions('rolesRef')" style="width:50%" class="custome_select">
                        <el-option
                        v-for="(role,index) in roleData"
                        :label="role.roleName"
                        :value="role.roleCode"
                        :key="index"
                        >
                        <span style="float:left;font-size:12px;font-weight:600;">{{role.roleName}}</span>
                        <span style="float:right;color:#8492a6;font-size:12px;">{{role.roleCode}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
             </el-col>
        </el-row>
        </el-form>
        <div style="text-align:center;margin:10px;">
            <el-button size="small" type="primary" @click="checks">审核通过</el-button>
            <el-button size="small" type="info" @click="goToPre">取消</el-button>
        </div>
    </el-card>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as user from '@/api/user'
import {getOrganization} from '@/api/organization'
import {getRoles} from '@/api/role'
export default {
    components: {
        Treeselect
    },
    mounted() {
        // let userInfo = this.$route.query.user
        // this.userForm=JSON.parse(userInfo)
        this.getUserInfo(this.$route.query.user);
        this.getUserRoleList()
        this.getDeptTree()
        this.loginUser = JSON.parse(localStorage.getItem('userInfo'))
    },
    data(){
        return{
            userForm:{
                organazition:null,
                roles:null,
            },
            deptOptions: [],
            deptTreeProps: {
                label: 'name',
                children: 'children'
            },
            roleData: [], // 角色数据
            loginUser: {},
        }
    },
    methods:{
        goToPre(){
            window.history.go(-1)
        },
        //获取用户详情
        getUserInfo(uid) {
            user.getUserInfo(uid).then(response=>{
                this.userForm=response.data;
                console.log(this.userForm,"this.userForm")
                this.userForm.roles = response.data.roles[0]
            })
        },
        // 获取所有角色
        getUserRoleList() {
            getRoles(null,1).then(response=>{
                this.roleData=response.data;

                // 设置默认角色为普通用户
                this.userForm.roles = 'user';
                // this.roleData.map((item, index) => {
                //     if(item.roleCode=='user') {
                //         this.userForm.roles = item.id;
                //     }
                // })
            })
        },
        changeDept(row) {
            // console.log(row, 666);
            this.userForm.organization = row.name

        },
        // 获取部门导航树
        getDeptTree() {
            getOrganization().then(response=>{
                this.deptOptions=response.data;
            }).then(() => {
                // this.$nextTick(() => {
                //     document.querySelector('.el-tree-node__content').click()
                // })
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
        checks() {
            this.$confirm('确定审核通过吗？', '提示', {}).then((e) => {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        this.userForm.validateUser = this.loginUser.userId

                        let data = {
                            id : this.userForm.id,
                            realname : this.userForm.realname,
                            idcard : this.userForm.idcard,
                            officerNum : this.userForm.officerNum,
                            tel : this.userForm.tel,
                            organizationId : this.userForm.organizationId,
                            organization : this.userForm.organization,
                            validateUser : this.userForm.validateUser,
                            roles : this.userForm.roles,
                        }
                        user.checked(data).then(response=>{
                            this.$message.success("审核成功");
                            this.$router.push({
                                path: '/admin/system/user-review',
                                // name: 'user-review',
                            })
                        })
                    }
                })
            })
        },
    }
}
</script>
<style scoped lang="scss">
    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;
    .el-input {
        height: 40px;
        input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: black;
        height: 40px;
        caret-color: black;

        &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
        }
        }
  }
</style>