/*
 * @Date: 2024-07-04 14:37:51
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 10:38:56
 * @LastEditors: guojiecheng
 */
import Mockjs from "mockjs";

import { host } from "@/config/platform";

import result from "./result";

const baseServer = `${host}/baseServer`

const fileServer = `${host}/fileServer`

const ecExServer = `${host}/ecExServer`

const ecInServer = `${host}/ecExServer`

import { mockApi } from "@/config/api";

console.log()

Object.entries(mockApi).forEach(([key, value]) => {
    Mockjs.mock(value, "post", {
        success: true,
        msg: "操作成功",
        status: "S",
        code: "S",
        count: 0,
        data: result[key]
    })
})

if (import.meta.env.MODE === 'demo') {
    uni.addInterceptor('request', {
        invoke(args) {
            // #ifdef APP-ANDROID || APP || APP-PLUS 
            let key = Object.keys(mockApi).find(key => mockApi[key] === args.url);
            console.log(args.url)
            args.success({
                "data": {
                    "success": true,
                    "msg": "操作成功",
                    "status": "S",
                    "code": "S",
                    "count": 0,
                    "data": result[key]
                },
                "statusCode": 200,
                "header": {},
                "cookies": [],
                "errMsg": "request:ok"
            })
            // #endif
        },
        success(args) {
            //console.log(JSON.stringify(args));  
        },
        fail(err) {
            //console.log('interceptor-fail',err)  
        },
        complete(res) {
            //console.log('interceptor-complete',res)  
        }
    })
}