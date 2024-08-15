/*
 * @Date: 2024-07-04 15:02:19
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-05 18:20:37
 * @LastEditors: guojiecheng
 */
export const prompt = ({
    msg = '',
    type,
    title,
    cancelText = '取消',
    confirmText = '确认',
    callBack,
    cancelCallBack = null
}) => {
    let currentTitle = ''
    switch (type) {
        case 'confirm':
            currentTitle = '提示'
            break;
        case 'warning':
            currentTitle = '警告'
            break;
        case 'error':
            currentTitle = '错误'
            break;
    }
    switch (type) {
        case 'confirm':
        case 'warning':
        case 'error':
            uni.showModal({
                title: title || currentTitle,
                content: msg,
                confirmText: confirmText,
                showCancel: !!cancelCallBack && typeof (cancelCallBack) === 'function',
                cancelText: cancelText,
                success: function (res) {
                    if (res.confirm) {
                        if (callBack)
                            callBack()

                    } else if (res.cancel) {
                        console.log(cancelCallBack)
                        if (cancelCallBack)
                            cancelCallBack()
                    }
                }
            });
            break;
        case 'success':
            uni.showToast({
                title: msg,
                icon: 'success',
                duration: 2000,
                mask: true
            })
            break;
        default:
            uni.showToast({
                title: msg,
                icon: 'none',
                duration: 2000,
                mask: true
            })
            break;
    }

}

export const alert = (msg, callBack) => prompt({
    msg,
    type: 'confirm',
    callBack
})

export const confirm = (msg, callBack, cancelCallBack = () => { }) => {
    return prompt({
        msg,
        type: 'confirm',
        callBack,
        cancelCallBack
    })
}

export const error = (msg, callBack = () => { }) => prompt({ msg, type: 'error', callBack })

export const warning = (msg, callBack = () => { }) => prompt({ msg, type: 'warning', callBack })

export const success = (msg) => prompt({ msg, type: 'success' })

export const toast = (msg) => prompt({ msg })

export default {
    prompt,
    alert,
    confirm,
    error,
    warning,
    toast
}