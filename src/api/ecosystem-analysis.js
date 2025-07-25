import request from '@/utils/request'

/**
 * 获取开发语言使用情况
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回各种编程语言的使用占比
 */
export function getLanguageUsage(startDate, endDate) {
  return request({
    url: '/ecosystem/getLanguageUsage',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

/**
 * 获取技术栈使用情况
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回各种技术栈的使用情况
 */
export function getTechStackUsage(startDate, endDate) {
  return request({
    url: '/ecosystem/getTechStackUsage',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

/**
 * 获取数据分析报告
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回数据分析报告
 */
export function getReport(startDate, endDate) {
  return request({
    url: '/ecosystem/getReport',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}


/**
 * 获取数据概况
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回数据概况，包括研发项目总数、完成项目数、开发人员总数、本月代码提交量
 */
export function getDataOverview(startDate, endDate) {
  return request({
    url: '/ecosystem/getDevDataOverview',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}
