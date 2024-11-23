// import { env } from "../config/platform"
import store from "../store"
import { error, toast, warning, alert } from "./message"
import dayjs from 'dayjs'

// const pf = 'ECMOBuni_APPLET_DRIVER'

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}

let httpServer = {
    postV1: (url, params) => baseRequest({ params, url })
}

export const baseRequest = ({
    params,
    method = 'post',
    url,
    contentType = 'application/json',
    timeout = 60000,
}) => {
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: '加载中',
            mask: true
        });
        uni.request({
            url: url, //仅为示例，并非真实接口地址。
            data: params,
            header: {
                'content-type': contentType,
                certificate: store.state?.userInfo?.certificate || 'nothing',
                "pf": import.meta.env.VITE_PF
            },
            method: method,
            timeout: timeout,
            success: (res) => {
                console.log({
                    url, params , data: res.data
                })
                uni.hideLoading()
                if (res.statusCode === 200) {

                    switch (res.data.status) {
                        case 'S':
                            resolve(res.data);
                            break;
                        case 'M':
                            reject(res.data);
                            break;
                        default:
                            warning(res.data.msg || '未知错误')
                            reject(res.data)
                            break;
                    }
                } else {
                    // if (env === 'pro') {
                    //     log.warn(url)
                    //     log.warn(params)
                    //     log.warn(res.data.code, res.data.msg)
                    // }
                    // error(res.data.msg || codeMessage[res.statusCode] || '未知错误')
                    if (['4000', '4001'].some(item => item === res.data?.code)) {
                        // app.globalData.userInfo = {}
                        uni.removeStorageSync('userInfo')
                        toast(res.data.msg)
                        setTimeout(() => {
                            uni.redirectTo({ url: '/pages/login/login' })
                        }, 1500);
                    } else {
                        error(res.data.msg || codeMessage[res.statusCode] || '未知错误')
                    }
                    reject(res.data)
                }
            },
            fail: (res) => {
                uni.hideLoading()
                if (import.meta.env.MODE !== 'demo') {
                    error(res.errMsg || '未知错误')
                }

                reject(res)

                // if (env === 'pro') {
                //     log.warn(url)
                //     log.warn(params)
                //     log.warn(res.errMsg)
                // }
            }
        });


    })

}

export const simpleRequest = ({
    params,
    url,
}) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: url, //仅为示例，并非真实接口地址。
            data: params,
            header: {
                'content-type': 'application/json',
                certificate: store.state?.userInfo?.certificate || 'nothing',
                "pf": import.meta.env.VITE_PF
            },
            method: 'post',
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res.data)
                }
            },
            fail: (res) => {
                reject(res)
            }
        });


    })

}

export const bufferRequest = ({
    params,
    url,
}) => {
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: '加载中',
            mask: true
        });
        uni.request({
            url: url, //仅为示例，并非真实接口地址。
            data: params,
            header: {
                'content-type': 'application/json;charset=UTF-8',
                certificate: store.state?.userInfo?.certificate || 'nothing',
                pf: 'ECMOBuni_APPLET_DRIVER'
            },
            method: 'POST',
            responseType: 'arraybuffer',
            success: (res) => {
                uni.hideLoading()
                console.log({
                    timestamp: dayjs().format(),
                    url,
                    params,
                })
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    if (res.data?.code?.startsWith('4')) {
                        uni.removeStorageSync('userInfo')
                        toast(res.data.msg)
                        setTimeout(() => {
                            uni.redirectTo({ url: '/pages/login/login' })
                        }, 1500);
                    } else {
                        error(res.data.msg || codeMessage[res.statusCode] || '未知错误')
                    }



                    reject(res.data)
                }
            },
            fail: (res) => {
                uni.hideLoading()
                reject(res)
                error(res.errMsg || '未知错误')
            }
        });


    })

}

export const uploadData = (url, filePath) => new Promise((resolve, reject) => {
    console.log(filePath)
    uni.showLoading({ title: '上传中', mask: true, })
    uni.uploadFile({
        url,
        filePath,
        name: 'file',
        header: {
            //Token: store.state.token,
            certificate: store.state.userInfo.certificate,
            pf: 'ECMOBMALL'
        },
        success: (res) => {
            uni.hideLoading()
            let result = JSON.parse(res.data)
            if (res.statusCode === 200) {
                if (result.success) {
                    resolve(result)

                } else {
                    warning(result?.msg || '未知错误')
                    reject(result)
                }

            } else {
                warning(result?.msg || '未知错误')
                reject(result)
            }
        },
        fail: (err) => {
            error(err.errMsg)
            uni.hideLoading()
            resolve(err)
        }
    });
})


export default httpServer