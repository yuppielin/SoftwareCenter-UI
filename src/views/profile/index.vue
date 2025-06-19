<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" style="height:450px;" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card style="height:450px;">
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane> -->
              <el-tab-pane label="基本信息" name="account">
                <!-- <timeline /> -->
                <account :user="user" @getUserInfo="getUser" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="password"  v-if="user.userId == null">
                <password :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
import Account from './components/Account'
import Password from './components/Password.vue'
import * as user from '@/api/user'
export default {
  name: 'Profile',
  components: { UserCard, Password, Account },
  data() {
    return {
      user: {},
      activeTab: 'account',
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.getUser()
  },
  methods: {
    getUser() {
      user.getUserInfo(this.userInfo.userId).then(response => {
        if (response.code === 200) {
          this.user = response.data
        }
      })
    }
  }
}
</script>
