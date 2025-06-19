import request from '@/utils/request'

export function getMaCode() {
  return request({
    url: '/license/getMaCode',
    method: 'get',
    params: {}
  })
}

export function setLicense(data) {
    return request({
        url: '/license/setLicense/',
        method: 'post',
        params: {
            license: data
        }
    })
}