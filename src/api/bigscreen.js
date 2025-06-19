import request from '@/utils/request'


// 软件下载量排行
export function getSoftwareDownload() {
    return request({
      url: '/bigscreen/getSoftwareDownload',
      method: 'get',
    })
}

// 软件分类数量
export function getSoftwareTypeNum() {
    return request({
      url: '/bigscreen/getSoftwareTypeNum',
      method: 'get',
    })
}

// 需求分类数量
export function getDemandCateNum() {
    return request({
      url: '/bigscreen/getDemandCateNum',
      method: 'get',
    })
}


// 软件需求数量排行
export function getSoftwareDemandNumSort() {
    return request({
      url: '/bigscreen/getSoftwareDemandNumSort',
      method: 'get',
    })
}

// 软件评价排行
export function getSoftwareScoreSort() {
    return request({
      url: '/bigscreen/getSoftwareScoreSort',
      method: 'get',
    })
}

// 软件技术支持量排行
export function getSoftwareQuestionSort() {
    return request({
      url: '/bigscreen/getSoftwareQuestionSort',
      method: 'get',
    })
}


// 各个软件分类软件的数量
export function getSoftwareCateNum() {
    return request({
      url: '/bigscreen/getSoftwareCateNum',
      method: 'get',
    })
}

// 用户登录次数部门排行
export function getUserLoginNumSort() {
    return request({
        url: '/bigscreen/getUserLoginNumSort',
        method: 'get',
    })
}

// 用户登录次数部门排行
export function getSoftwareDownloadUploadNum() {
    return request({
        url: '/bigscreen/getSoftwareDownloadUploadNum',
        method: 'get',
    })
}