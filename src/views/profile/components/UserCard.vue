<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix" style="padding:20px;">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar?user.avatar:defaultS" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          <span v-if="user.roles">{{ user.roles.toString()}}</span>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.realname }}</div>
<!--        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>-->
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section" style="color: black">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <el-row :gutter="10" style="line-height:30px;color: black">
              <el-col :span="10">
                <div>
                  <i class="el-icon-phone"></i>
                  <span>座机电话</span>
                </div>
                <!-- <div>
                  <i class="el-icon-message"></i>
                  <span>电子邮箱</span>
                </div> -->
                <div>
                  <i class="el-icon-postcard"></i>
                  <span>所属单位</span>
                </div>
                <div>
                  <i class="el-icon-time"></i>
                  <span>创建日期</span>
                </div>
              </el-col>
              <el-col :span="14" style="text-align:right">
                <div>
                  <span v-if="user.tel">{{ user.tel }}</span>
                  <span v-else>无</span>
                </div>
                <!-- <div>
                  <span v-if="user.tel">{{ user.email }}</span>
                  <span v-else>无</span>
                </div> -->
                <div>
                  <span>{{ user.organization }}</span>
                </div>
                <div>
                  <span>{{ user.ctime|parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <!-- <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div> -->
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
export { parseTime, formatTime } from '@/utils'
export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      defaultS: require('@/assets/imgs/avatar.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
