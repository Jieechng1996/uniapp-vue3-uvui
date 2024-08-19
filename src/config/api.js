/*
 * @Date: 2024-07-04 14:45:58
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-19 17:57:18
 * @LastEditors: guojiecheng
 */
import { host } from "./platform";

const baseServer = `${host}/baseServer`

const fileServer = `${host}/fileServer`

const ecExServer = `${host}/ecExServer`

const ecInServer = `${host}/ecExServer`

const bpmServer = `${host}/bpmServer`

export const mockApi = {
    ecpExAdPictures_findPagination: `${ecInServer}/ecpExAdPictures/findPagination`,
    categoryNumberService_getProductMiddleCategory: `${ecExServer}/categoryNumberService/getProductMiddleCategory`,
    ecpExFlashPicturesService_getHomePageProducts: `${ecExServer}/ecpExFlashPicturesService/getHomePageProducts`,
    ccodeService_getImg: `${baseServer}/codeService/getImg`,
    codeService_mallSendSMS: `${baseServer}/codeService/mallSendSMS`,
    authentication_register: `${baseServer}/authentication/register`,
    authentication_login: `${baseServer}/authentication/login`,
    ecexCustomer_save: `${ecExServer}/ecexCustomer/save`,
    baseUsersService_modifyPassword: `${baseServer}/baseUsersService/modifyPassword`,
    // 定义了一个常量，用于指定查询订单头和行自定义页面的URL
    ecexOrderHeaderController_findHeaderAndLineCustomPage: `${ecExServer}/ecexOrderHeaderController/findHeaderAndLineCustomPage`,
    // 订单 取消、关闭
    ecexOrderFlowController_updateOrderStatus: `${ecExServer}/ecexOrderFlowController/updateOrderStatus`,
    ecexOrderFlowController_getOrderHeaderDetail: `${ecExServer}/ecexOrderFlowController/getOrderHeaderDetail`,
    // 用于查询订单头和订单行的自定义页面信息。
    ecexOrderFlowController_getOrderLineDetail: `${ecExServer}/ecexOrderFlowController/getOrderLineDetail`,
    // 获取订单配送交易详情的URL配置。
    ecexOrderFlowController_getOrderDeliveryTransDetail: `${ecExServer}/ecexOrderFlowController/getOrderDeliveryTransDetail`,
    ecexOrderLineController_checkTransOrderCanDownload: `${ecExServer}/ecexOrderLineController/checkTransOrderCanDownload`,
    ecDriverWorkFlowController_transOrderDownloadPDF: `${ecExServer}/ecDriverWorkFlowController/transOrderDownloadPDF`,
    ecexOrderLineController_doExport: ecExServer + "/ecexOrderLineController/doExport", //excel导出
    // 车辆列表接口
    ecExDriverTruckBizRela_findPagination: ecExServer + "/ecExDriverTruckBizRela/findPagination",
    // 确认派车 - 保存所有车
    ecexOrderFlowController_saveOrderDeliveryTransData: ecExServer + "/ecexOrderFlowController/saveOrderDeliveryTransData",
    // 合同列表接口
    ecexContractHeaderController_ecexFindPagination: ecExServer + "/ecexContractHeaderController/ecexFindPagination",
    // 订单详情
    ecexOrderFlowController_getDetailForBuildOrder: ecExServer + "/ecexOrderFlowController/getDetailForBuildOrder",
    ecContractHeader_findVoById: ecInServer + "/ecContractHeader/findVoById",
    ecContractLine_findPagination: ecInServer + "/ecContractLine/findPagination",
    // 生成订单
    ecexOrderFlowController_saveDetailForBuildOrder: ecExServer + "/ecexOrderFlowController/saveDetailForBuildOrder",
    // 获取订单详情
    ecexOrderFlowController_getDetailForCommitPay: ecExServer + "/ecexOrderFlowController/getDetailForCommitPay",
    // 确认付款
    ecexOrderFlowController_confirmPayForCommitPay: ecExServer + "/ecexOrderFlowController/confirmPayForCommitPay",
    ecExDriverTruckBizRela_findPagination: ecExServer + "/ecExDriverTruckBizRela/findPagination",
    // 车辆保存接口
    ecExDriverTruckBizRelar_save: ecExServer + "/ecExDriverTruckBizRela/save",
    // 获取公告详情
    tNewsInformationService_findById: ecExServer + "/tNewsInformationService/findById",
    // 车辆删除接口
    ecExDriverTruckBizRela_delete: ecExServer + "/ecExDriverTruckBizRela/delete",
    // 查询余额
    ecExCustomerBalance_findBalanceByCompanyId: ecExServer + "/ecExCustomerBalance/findBalanceByCompanyId",
    ecExCustomerBalance_findOrderDetail: ecExServer + "/ecExCustomerBalance/findOrderDetail",
    ecexCollectionDetails_findPagination: ecExServer + "/ecexCollectionDetails/findPagination",
    // 购物车保存
    ecpExShoppingCart_save: ecExServer + "/ecpExShoppingCart/save",
    //获取产品列表
    categoryNumberService_getProductInterface: ecExServer + "/categoryNumberService/getProductInterface",
    ecexActivity_getActivityRegion: ecExServer + "/ecexActivity/getActivityRegion",
    activity_mall_findPagination: ecExServer + "/activity/mall/findPagination",
    ecexActivity_getActivityDetail: ecExServer + "/ecexActivity/getActivityDetail",
    ecexActivity_getAuctionMaxPrice: ecExServer + "/ecexActivity/getAuctionMaxPrice",
    ecpFightAlone_getFightAloneInfo: ecExServer + "/ecpFightAlone/getFightAloneInfo",
    // 判断竞拍资格
    ecexActivity_getSatisfyStatusAuctionActivity: ecExServer + "/ecexActivity/getSatisfyStatusAuctionActivity",
    // 加价竞拍
    ecexActivity_getAuctionPurchaseContentActivity: ecExServer + "/ecexActivity/getAuctionPurchaseContentActivity",
    // 判断是否支付保证金
    ecexActivity_judgeCustomerAutionMarginActivity: ecExServer + "/ecexActivity/judgeCustomerAutionMarginActivity",
    // 参与活动并生成记录
    ecexActivity_makeFightAloneByAuctionActivity: ecExServer + "/ecexActivity/makeFightAloneByAuctionActivity",
    ecexActivity_createRecordByAuctionActivity: ecExServer + "/ecexActivity/createRecordByAuctionActivity",
    // 修改手机号，发送短信
    baseUsersService_modifyMobilePhoneBySMS: baseServer + "/baseUsersService/modifyMobilePhoneBySMS",

    ecpInCustomerServe_findPagination: ecInServer + '/ecpInCustomerServe/findPagination',
    // 保存客户服务表
    ecpExCustomerServe_save: ecExServer + '/ecpExCustomerServe/save',
    // 根据客户服务表 id 查询详细
    ecpInCustomerServe_findVoById: ecExServer + '/ecpExCustomerServe/findVoById',

    saafNotificationNotice_findPagination: ecInServer + '/saafNotificationNotice/findPagination',

    // 获取公告详情
    tNewsInformationService_findById: ecExServer + "/tNewsInformationService/findById",

    baseOrgV6_findPaginationCompany: baseServer + "/baseOrgV6/findPaginationCompany",
    
    truck_mall_findPagination4Map: ecExServer + '/truck/mall/findPagination4Map',

    tickets_deliveryFromErp_findPagination: ecExServer + '/tickets/deliveryFromErp/findPagination',

    mall_customerTickets_check: ecExServer + '/mall/customerTickets/check',

    mall_customerTickets_save: ecExServer + '/mall/customerTickets/save',

    mall_customerTickets_findPagination: ecExServer + '/mall/customerTickets/findPagination',

    mall_customerTickets_findByHeaderId: ecExServer + '/mall/customerTickets/findByHeaderId',

    getSlyderPrize: ecExServer + '/getSlyderPrize',

    getSlyderCount: ecExServer + '/getSlyderCount',

    lotteryRotate: ecExServer + '/lotteryRotate',

    fillShippingInfo: ecExServer + '/fillShippingInfo',
    
    getMyPrizeDetail: ecExServer + '/getMyPrizeDetail',

    getBpmListByParam: `${bpmServer}/bpmListService/getBpmListByParam`,

    findTasksByProcInstId: `${bpmServer}/bpmTaskService/findTasksByProcInstId`,
}



export default {
    ...mockApi
} 