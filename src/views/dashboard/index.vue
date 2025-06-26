<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import csuserDashboard from './csuser'

import softwareShowStatus from '@/views/admin/zaixian/showStatus'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, softwareShowStatus, csuserDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.hasRole(['editor',"user"])) {
      this.currentRole = 'editorDashboard'
    }else if(this.hasRole(['applicationUser', 'SHUser', 'SYUser', 'AFUser', 'XTUser'])) {
      this.currentRole = 'softwareShowStatus'
    }else if(this.hasRole(['CSUser'])) {
      this.currentRole = 'csuserDashboard'
    }
  },
  methods: {
    hasRole(role_arr) {
      return this.roles.some(role => {
        return role_arr.includes(role)
      })
    }
  }
}
</script>
