/*
 * @Date: 2024-07-04 14:46:12
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 14:35:41
 * @LastEditors: guojiecheng
 */
import { baseRequest, bufferRequest } from '@/common/httpServer'
import api, { mockApi } from "./api"

import result from "../mock/result";
import { uploadData } from '../common/httpServer';

let fetch = {}

for(let i in api){
    fetch[i] = (params) =>  baseRequest({params, url : api[i]})
}

fetch.ecDriverWorkFlowController_transOrderDownloadPDF = (params) => bufferRequest({params, url :api.ecDriverWorkFlowController_transOrderDownloadPDF})

fetch.ecexOrderLineController_doExport = (params) =>  bufferRequest({params, url : api.ecexOrderLineController_doExport})

fetch.fileUploadService_pictureUpload = (filePath) => uploadData(api.fileUploadService_pictureUpload, filePath)

if (import.meta.env.MODE === 'demo') {

    Object.entries(mockApi).forEach(([key, value]) => {
        fetch[key] = (params) => new Promise((resolve, reject) => {
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            resolve({
                success: true,
                msg: "操作成功",
                status: "S",
                code: "S",
                count: 0,
                data: result[key]
            })
            setTimeout(() => {
                uni.hideLoading()
            }, 2000);
        })
    })
    // android 的mock会有问题
    // #ifdef APP-ANDROID || APP || APP-PLUS 
    // Object.entries(mockApi).forEach(([key, value]) => {
    //     fetch[key] = (params) => new Promise((resolve, reject) => {
    //         resolve({
    //             success: true,
    //             msg: "操作成功",
    //             status: "S",
    //             code: "S",
    //             count: 0,
    //             data: result[key]
    //         })
    //     })
    // })
    // #endif

    // #ifdef H5 || MP-WEIXIN
    // Object.entries(mockApi).forEach(([key, value]) => {
    //     fetch[key] = (params) => new Promise((resolve, reject) => {
    //         fetch[key] = (params) => httpServer.postV1(value, params)
    //     })
    // })
    // #endif
}

export default fetch