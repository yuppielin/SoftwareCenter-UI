import request from '@/utils/request'
export function mergeSimpleUpload(data) {
    // return Promise.resolve()

    return request({
        url: '/upload/merge',
        method: 'post',
        data
      })
}
