import request from '@/utils/request'

export function commonFileUpload(data) {
    return request({
        url: '/common/upload',
        method: 'post',
        data
    })
}