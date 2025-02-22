/*
 * @Date: 2024-12-19 15:22:27
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-23 11:09:27
 * @LastEditors: guojiecheng
 */
export const webViewNavigateTo = (path, params = {}) => {
    uni.navigateTo({ url: '/pages_components/webView/webView?path=' + JSON.stringify(path) + '&params=' + JSON.stringify(params) })
}