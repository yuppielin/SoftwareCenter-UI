<template>
  <div style="margin-top: 60px; overflow-y: auto">
    <div style="font-size: 14px;font-weight:600;padding:10px 15px;">手机应用</div>
    <app-item
      v-for="(item, index) in specialData"
      :key="index"
      style="width: 44%; margin: 10px; float: left"
      :data="item"
    />
  </div>
</template>
<script>
import * as mobile from '@/api/mobile'
export default {
  components: {
    appItem: () => import('./app-item.vue')
  },
  data() {
    return {
      specialData: []
    }
  },
  mounted() {
    this.getSpecialList()
  },
  methods: {
    getSpecialList() {
      mobile.getSpecialList(null, null, null).then(response => {
        if (response.code === 200) {
          this.specialData = response.data
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
