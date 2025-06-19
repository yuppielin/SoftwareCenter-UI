const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  main_routes:state=>state.mainroutes.routes,
  errorLogs: state => state.errorLog.logs,
  
  applyTotal: state=> state.applyMsgCount.applyTotal,
  userApplyTotal: state=> state.applyMsgCount.userApplyTotal,
  softwareDownloadApplyTotal: state=> state.applyMsgCount.softwareDownloadApplyTotal,
}
export default getters
