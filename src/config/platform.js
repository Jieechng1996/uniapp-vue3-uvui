/*
 * @Date: 2023-07-17 14:23:52
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-17 15:18:09
 * @LastEditors: guojiecheng
 */

console.log(import.meta.env)
export const baseURL = import.meta.env.VITE_BASE_URL || window.location.origin + window.location.pathname;
export const env = import.meta.env.ENV
export const host = baseURL
export const pictrueHost =  import.meta.env.VITE_PICTRUE_URL
export default {
    host: baseURL
}