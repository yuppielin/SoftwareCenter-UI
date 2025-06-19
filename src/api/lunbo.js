import request from '@/utils/request'

export function getBZType() {
    return request({
        url: '/software/poll/getBZType',
        method: 'get'
    })
}

export function getLYType() {
    return request({
        url: '/software/poll/getLYType',
        method: 'get'
    })
}

export function addLunbo(data) {
    return request({
        url: '/software/poll',
        method: 'post',
        data
    })
}

export function getLunbo() {
    return request({
        url: '/software/poll',
        method: 'get'
    })
}

export function getPollByType(type) {
    return request({
        url: '/software/poll/getPollByType',
        method: 'get',
        params: {
            type: type
        }
    })
}