/*
 * @Date: 2024-07-09 11:00:18
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-08 15:14:07
 * @LastEditors: guojiecheng
 */
// #ifdef MP-WEIXIN
import baseForm from "./base-form-mp";
// #endif

// #ifndef MP-WEIXIN
import baseForm from "./base-form";
// #endif


import baseUploader from "./base-uploader"
import baseList from "./base-list"
import baseDialog from "./base-dialog"
import baseLookupCode from "./base-lookupCode.vue"
import baseRegions from "./base-regions.vue"

export {
    baseForm,
    baseUploader,
    baseList,
    baseDialog,
    baseLookupCode,
    baseRegions
}