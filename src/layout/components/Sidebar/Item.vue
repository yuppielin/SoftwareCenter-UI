<script>
import store from '@/store'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      // 要加计数器的侧边栏名称
      if( title === '申请审核' && store.getters.applyTotal !== undefined && store.getters.applyTotal !==0 ) {
        let num = store.getters.applyTotal
        vnodes.push(
          <span slot='title'>
            {(title)}
            <el-badge  value={(num)}></el-badge>
          </span>
        )
      }else if( title === '用户审核' && store.getters.userApplyTotal !== undefined && store.getters.userApplyTotal !==0 ) {
        let num = store.getters.userApplyTotal
        vnodes.push(
          <span slot='title'>
            {(title)}
            <el-badge  value={(num)}></el-badge>
          </span>
        )
      }else if( title === '权限申请' && store.getters.softwareDownloadApplyTotal !== undefined && store.getters.softwareDownloadApplyTotal !==0 ) {
        let num = store.getters.softwareDownloadApplyTotal;
        vnodes.push(
          <span slot='title'>
            {(title)}
            <el-badge  value={(num)}></el-badge>
          </span>
        )
      }else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>

<style scoped lang="scss">
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}

::v-deep .el-badge {
  left: 3px;
  .el-badge__content {
    border-color: #ff4949;
  }
}
</style>
