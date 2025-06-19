import { login, logout, getInfo, checkToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import qs from 'qs';
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    // state.token = getToken()
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login(qs.stringify({ username: username.trim(), password: password, code: code, uuid: uuid })).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          // commit('SET_ROLES', data.userInfo.roles)
          localStorage.setItem('roles', JSON.stringify(data.userInfo.roles))
          setToken(data.token)
          resolve()
        } else if (response.code === 500) {
          reject(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    commit('SET_TOKEN', getToken())
    return new Promise((resolve, reject) => {
      const token = getToken()
      getInfo(token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录！')
        }

        let { roles, userId, username, realName, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
      
        // if(username=='user') {  // 普通用户
        //   roles = ['editor']
        // }
        // if(username=='applicationUser') {  //业务管理人员
        //   roles = ['applicationUser']
        // }
        // if(username=='AFUser') {  //安防检测人员
        //   roles = ['AFUser']
        // }
        // if(username=='SYUser') {  //试用管理人员
        //   roles = ['SYUser']
        // }
        // if(username=='SHUser') {  //部门主管人员
        //   roles = ['SHUser']
        // }
        // if(username=='XTUser') {  //信T局管理人员
        //   roles = ['XTUser']
        // }
        // data.roles = roles;
        localStorage.setItem("userType", roles[0]);

        commit('SET_TOKEN', token)
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        // const userInfo = {
        //   userId: userId,
        //   realName: realName,
        //   username: username,
        //   roles: roles,

        // }
        localStorage.setItem('userInfo', JSON.stringify(data))
        //commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
