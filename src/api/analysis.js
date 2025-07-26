import request from '@/utils/request'

export function getSystemData(params) {
    return request({
        url: '/statistic/systemData',
        method: 'get',
        params: params
    })
}

export function hotDownload(size) {
    return request({
        url: '/statistic/hotDownload',
        method: 'get',
        params: {
            size:size
        }
    })
}

export function hotDiscuss(size) {
    return request({
        url: '/statistic/hotDiscuss',
        method: 'get',
        params: {
            size:size
        }
    })
}

export function getDataSituation() {
    return request({
        url: '/statistic/getDataSituation',
        method: 'get'
    })
}

export function uploadTrend(startTime, endTime) {
    return request({
        url: '/statistic/uploadTrend',
        method: 'get',
        params:{
            startTime:startTime,
            endTime:endTime
        }
    })
}

export function uploadTrendNull() {
    return request({
        url: '/statistic/uploadTrend',
        method: 'get'
    })
}

export function downloadTrend(startTime, endTime) {
    return request({
        url: '/statistic/downloadTrend',
        method: 'get',
        params:{
            startTime:startTime,
            endTime:endTime
        }
    })
}

export function downloadTrendNull() {
    return request({
        url: '/statistic/downloadTrend',
        method: 'get'
    })
}

export function softwareProportion(startTime, endTime) {
    return request({
        url: '/statistic/softwareProportion',
        method: 'get',
        params:{
            startTime:startTime,
            endTime:endTime
        }
    })
}

export function softwareProportionNull() {
    return request({
        url: '/statistic/softwareProportion',
        method: 'get'
    })
}

export function listStatisticsPic12() {
    return request({
        url: '/statistic/listStatisticsPic12',
        method: 'get'
    })
}

export function listStatisticsPic3456() {
    return request({
        url: '/statistic/listStatisticsPic3456',
        method: 'get'
    })
}

export function listStatisticsPic78() {
    return request({
        url: '/statistic/listStatisticsPic78',
        method: 'get'
    })
}

export function getMapInfo() {
    return request({
        url: '/statistic/getSoftwareByMap',
        method: 'get'
    })
}

// 获取月上传趋势数据
export function getMonthlyUploadTrend(params) {
    return request({
        url: '/statistic/monthlyUploadTrend',
        method: 'get',
        params: params
    })
}

// 获取上传软件进度分类占比数据
export function getUploadStatusDistribution(params) {
    return request({
        url: '/statistic/uploadStatusDistribution',
        method: 'get',
        params: params
    })
}



/**
 * 获取运行生态数据分析报告
 * @param {string} startDate 开始日期，格式为 yyyy-MM-dd
 * @param {string} endDate 结束日期，格式为 yyyy-MM-dd
 * @returns {Promise} 返回数据分析报告
 */
export function getReport(startDate, endDate) {
    return request({
      url: '/statistic/getReport',
      method: 'get',
      header: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
      responseType: "blob",
      params: {
        startDate,
        endDate
      }
    })
  }