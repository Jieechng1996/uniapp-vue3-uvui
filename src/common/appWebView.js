/*
 * @Date: 2024-12-19 15:22:27
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-19 16:50:05
 * @LastEditors: guojiecheng
 */
export const webViewNavigateTo = (path, params = {}) => {
    uni.navigateTo({ url: '/pages/webView?path=' + JSON.stringify(path) + '&params=' + JSON.stringify(params) })
}