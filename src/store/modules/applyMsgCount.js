import { getAuditNum } from '@/api/sys-messages'

const state = {
    applyTotal: 0 ,
    userApplyTotal : 0, //用户申请
    softwareDownloadApplyTotal : 0, //软件下载申请
}

const mutations = {
    SET_USER_APPLY_TOTAL: (state, userApplyTotal) => {
      state.userApplyTotal = userApplyTotal;
    },
    SET_SOFTWARE_DOWNLOAD_APPLY_TOTAL: (state, softwareDownloadApplyTotal) => {
        state.softwareDownloadApplyTotal = softwareDownloadApplyTotal;
    },

    SET_APPLY_TOTAL: (state) => {
        state.applyTotal = state.userApplyTotal + state.softwareDownloadApplyTotal;
    },
    
}

const actions = {
    // 
    getUserApplyTotal({ commit, state}) {
        return new Promise((resolve, reject) => {
            getAuditNum().then(response => {
              if (response.code === 200) {
                const { data } = response
                
                commit('SET_USER_APPLY_TOTAL', data.userApplyTotal)
                commit('SET_SOFTWARE_DOWNLOAD_APPLY_TOTAL', data.softwareDownloadApplyTotal)
                commit('SET_APPLY_TOTAL')
               
                resolve()
              } else if (response.code === 500) {
                reject(response.msg)
              }
            }).catch(error => {
              reject(error)
            })
        })
        
    },

    getSoftwareDownloadApplyTotal({ commit, state}) {

        
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
  