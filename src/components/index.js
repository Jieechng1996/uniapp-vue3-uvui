/*
 * @Date: 2024-07-09 11:00:18
 * @Author: guojiecheng
 * @LastEditTime: 2025-04-03 13:45:10
 * @LastEditors: guojiecheng
 */
// #ifdef MP
import baseForm from "./base-form-mp";
// #endif

// #ifndef MP
import baseForm from "./base-form";
// #endif


import baseUploader from "./base-uploader"
import baseList from "./base-list"
import baseDialog from "./base-dialog"
import baseLookupCode from "./base-lookupCode.vue"
import baseRegions from "./base-regions.vue"
import baseApprovalBtns from "./base-approval-btns.vue"
import baseFlowRecord from "./base-flow-record.vue"

export {
    baseForm,
    baseUploader,
    baseList,
    baseDialog,
    baseLookupCode,
    baseRegions,
    baseApprovalBtns,
    baseFlowRecord
}