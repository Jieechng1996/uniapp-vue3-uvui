/*
 * @Date: 2024-07-04 14:45:58
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 15:11:53
 * @LastEditors: guojiecheng
 */
import { host } from "./platform";

const baseServer = `${host}/baseServer`

const fileServer = `${host}/fileServer`

const ecExServer = `${host}/ecExServer`

const ecInServer = `${host}/ecExServer`

const bpmServer = `${host}/bpmServer`

export const mockApi = {
    getBpmListByParam: `${bpmServer}/bpmListService/getBpmListByParam`,
    findTasksByProcInstId: `${bpmServer}/bpmTaskService/findTasksByProcInstId`,
    baseUsersService_findById: `${baseServer}/baseUsersService/findById`,
    baseUsersService_save: `${baseServer}/baseUsersService/save`,
    //图片上传
    fileUploadService_pictureUpload: fileServer + "/fileUploadService/cosfile/pictureUpload",
    // 注册用手机发送验证码
    codeService_mallSendSMS: baseServer + "/codeService/mallSendSMS",
    // 修改密码
    baseUsersService_modifyPassword: baseServer + "/baseUsersService/modifyPassword",
    ecpExUserAttendance_findPagination: `${ecExServer}/ecpExUserAttendance/findPagination`,
    ecpExUserAttendance_findById: `${ecExServer}/ecpExUserAttendance/findById`,
    ecpExCustomer_findNewListByPagination: `${ecInServer}/ecpExCustomer/findNewListByPagination`,// 获取客户表列表

    ecContractHeader_findPagination:  `${ecInServer}/ecContractHeader/findPagination`,
    ecCustomerProductGroup_findPagination: `${ecInServer}/ecCustomerProductGroup/findPagination`,
    baseDeliveryRule_findPagination: baseServer + "/baseDeliveryRule/findPagination",
    //获取快码
    baseLookupValuesService_find: baseServer + "/baseLookupValuesService/find",
    ecContractLine_ecinFindProByContract: ecInServer + '/ecContractLine/ecinFindProByContract',
    ecOrderLine_saveOrUpdateOrderLineList: `${ecInServer}ecOrderLine/saveOrUpdateOrderLineList`,
    ecOrderLine_delOrderLineList: `${ecInServer}ecOrderLine/delOrderLineList`,
    ecOrderLine_findPagination: `${ecInServer}ecOrderLine/findPagination`,
    ecOrderHeader_findVoById: `${ecInServer}ecOrderHeader/findVoById`,
    ecOrderHeader_saveOrUpdateOrderHeader: ecInServer + "/ecOrderHeader/saveOrUpdateOrderHeader",
    ecMobileContractService_findPageForMobile: ecInServer + "/ecMobileContractService/findPageForMobile",  //合同编号
    ecContractHeader_submitContractHeader: `${ecInServer}e/cContractHeader/submitContractHeader`,
    ecContractHeader_closeContractHeader: `${ecInServer}/ecContractHeader/closeContractHeader`,
    ecContractHeader_delayContractHeader: `${ecInServer}/ecContractHeader/delayContractHeader`,

    ecContractLine_saveOrUpdateLine: `${ecInServer}ecContractHeader/saveOrUpdateLine`,
    ecContractHeader_deleteLine: `${ecInServer}ecContractHeader/deleteLine`,
    ecContractHeader_findVoById: `${ecInServer}/ecContractHeader/findVoById`,
    ecContractLine_findPagination: `${ecInServer}/ecContractLine/findPagination`,
    ecOrderLine_delOrderLineList: `${ecInServer}ecOrderLine/delOrderLineList`,
    ecOrderHeader_submitOrderHeader: `${ecInServer}ecOrderHeader/submitOrderHeader`,
    ecOrderHeader_findPagination: ecInServer + "/ecOrderHeader/findPagination",
    ecpInProductPriceH_findPagination: `${ecInServer}ecpInProductPriceH/findPagination`,// 获取产品价目表头表列表
    driverInformation_findPagination: ecInServer + '/driverInformation/findPagination',

    ecCustomerBalance_findPagination: `${ecInServer}/ecCustomerBalance/findPagination`,// 获取客户余额列表

    ecpExCustomer_findPaginationNoCompanyControl: `${ecInServer}/ecpExCustomer/findPaginationNoCompanyControl`,// 获取客户余额列表

    baseOrgV6_findPaginationCompany: `${baseServer}/baseOrgV6/findPaginationCompany`,// 获取公司

    ecpInvoiceApply_findPagination: `${ecInServer}/ecpInvoiceApply/findPagination`,
    
}



export default {
    ...mockApi
} 