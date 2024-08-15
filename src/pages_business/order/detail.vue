<!--
 * @Date: 2024-07-22 14:05:34
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 16:09:31
 * @LastEditors: guojiecheng
-->
<template>
    <view class="warp p-2 overflow-auto h100p">
        <view class="p-3 box bg-white text-black">
            <view class="text-base font-bold">订单详情</view>
            <view v-for="({ name, key }, index) in [
                { name: '订单编号', key: 'orderCode' },
                { name: '订单状态', key: 'statusText' },
                { name: '客户名称', key: 'customerCodeText' },
                { name: '合同单号', key: 'contractHeaderCode' },
                { name: '提交时间', key: 'commitDate' },
                { name: '截止时间', key: 'orderDate' },
                { name: '订货单位', key: 'commitUserCodeText' },
                { name: '销售单位', key: 'companyIdText' },
                { name: '合同剩余量', key: 'orderRemainNum' },
                { name: '备注信息', key: 'description' },
            ]" :key="index" class="text-sm leading-7">
                <view v-if="formData[key]">
                    {{ name }}：{{ formData[key] }}
                </view>
            </view>
        </view>

        <view class="p-3 box bg-white text-black  mt-3">
            <view class="text-base font-bold">订单产品详情</view>
            <view v-for="(item, index) in formData.productLine" :key="index" class="flex items-center py-2">
                <uv-image :src="item.shortPicUrl" width="100" height="100"></uv-image>
                <view>
                    <view v-for="(line, subscript) in [
                { name: '产品', key: 'productName' },
                { name: '挂牌价', key: 'unitPrice' },
                { name: '执行价', key: 'executionPrice', prefix: '￥' },
                { name: '提货数量', key: 'orderQuantity', prefix: '￥' },
                { name: '单位', key: 'uomCodeText' },
                { name: '经营组织', key: 'companyIdText' },
                { name: '提货地', key: 'factoryIdText' },
            ]" :key="subscript" class="ml-3 text-gray-600 leading-5 ">
                        <view>
                            {{ line.name }}：{{ line.prefix }}{{ item[line.key] }}
                        </view>
                    </view>
                </view>

            </view>

        </view>
        <view class="p-3 box bg-white text-black  mt-3">
            <view class="text-base font-bold mb-2">订单车辆信息</view>
            <view class="flex flex-wrap mb-2">
                <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 mb-2"
                    @click="autoGenerate.showModal()">自动识别</uv-button>
                <auto-generate-car ref="autoGenerate" @btnConfirm="btnConfirm"></auto-generate-car>
                <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 mb-2"
                    @click="driverName.showModal()">添加常用车辆</uv-button>
                <base-dialog title="请选择人员" :search-key="{ key: 'licensePlateNumber', placeholder: '请输入车牌号' }"
                    ref="driverName" :api="api.ecExDriverTruckBizRela_findPagination"
                    :keys="{ key: 'driverId', value: 'driverName' }" use-content @confirm="selectDriverCallback"
                    @clear="selectDriverCallback">
                    <template #content="{ item }">
                        <view style="display: flex;">
                            <view style="width: 60px;"> {{ item.driverName }} </view>
                            <view> {{ item.licensePlateNumber }} </view>
                        </view>
                    </template>
                </base-dialog>
                <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 mb-2" @click="() => formData.carLine.push({
                status: 'MAKING',
                show: true
            })">新增车辆信息</uv-button>
                <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 mb-2"
                    @click="btnSaveAll()">保存车辆信息</uv-button>
                <!-- <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 mb-2"
                    @click="btnPreBatchSendCar()">批量派车</uv-button> -->
            </view>
            <view>
                <view v-for="(item, index) in formData.carLine" :key="index" class="mb-4">
                    <view class="flex justify-between mb-2">
                        <view>
                            <!-- <checkbox :checked="item.checked"
                                :disabled="!(item.orderTransLineId && item.status === 'MAKING')"
                                @click="() => { item.checked = !item.checked }" /> -->
                                {{ index + 1 }}#
                            <text>{{ item.orderTransLineId ? item.plateNumber : "" }}</text>
                            <text class="ml-2">{{ item.yktStatusText || item.statusText }}</text>
                        </view>
                        <text class="text-primary-color" @click="btnPreSendCar(item.orderTransLineId)"
                            v-if="item.orderTransLineId && item.status === 'MAKING'">
                            确认派车
                        </text>
                        <text class="text-primary-color" v-if="item.orderTransLineId"
                            @click="() => { item.show = !item.show }">
                            {{ item.show ? "收起" : "展开" }}详情</text>
                    </view>
                    <view class="p-2 car-box" v-if="item.show">
                        <view class="flex leading-8 justify-between items-center">
                            <view class="flex">
                                <text class="w-20 text-right">发货单号：</text><text>{{ item.transCode }}</text>
                            </view>
                            <view class="flex">
                                <uv-button :color="skin.primaryColor" :plain="true" size="small" class="mr-2 "
                                    @click="btnDel(index, item)">删除</uv-button>
                                <!-- <uv-button :color="skin.primaryColor" :plain="true" size="small"
                                    v-if="item.orderTransLineId" @click="btnView(item)">查看磅单</uv-button> -->
                            </view>
                        </view>
                        <view class="flex leading-8" v-for="(line, subscript) in 
                        [ { name: '实发数量', key: 'actualDeliveryQuantity' }, { name: '车辆状态', key: 'yktStatusText' }]"
                            :key="subscript">
                            <text class="w-20 text-right">{{ line.name }}：</text><text>{{ item[line.key] }}</text>
                        </view>
                        <view class="flex items-center leading-9" v-for="(line, subscript) in [
                            { name: '车牌号', key: 'plateNumber' },
                            { name: '装车数量', key: 'packQuantity', type: 'digit' },
                            { name: '司乘姓名', key: 'driverName' },
                            { name: '身份证号', key: 'idCardNumber', type: 'idcard' },
                            { name: '手机号码', key: 'phoneNumber', type: 'number' },
                            { name: '备注', key: 'description' }
                        ]" :key="subscript">
                            <text class="w-20 text-right">{{ line.name }}：</text>
                            <uv-input :placeholder="`请输入${line.name}`" v-model="item[line.key]"
                                v-if="!isDisabled && item.status == 'MAKING'" :type="item.type || 'text'"></uv-input>
                            <text v-else>{{ item[line.key] }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script setup>
import { inject, onMounted, ref , toRaw } from "vue";
import { baseForm, baseDialog } from "../../components";
import { autoGenerateCar } from "@/comp"
const autoGenerate = ref()

const skin = inject("skin")

import fetch from "@/config/fetch"
import { onLoad } from "@dcloudio/uni-app";
import api from "../../config/api";
import { toast } from "../../common/message";
import { plateNumber, idCard , phoneNumber, cash } from "../../lib/regexp";

const formData = ref({})

const isDisabled = ref(false)

const driverName = ref()

const getOrderInfo = async ({ orderHeaderId }) => {
    let { data: header } = await fetch.ecexOrderFlowController_getOrderHeaderDetail({
        orderHeaderId: orderHeaderId
    })

    let { data: productLine } = await fetch.ecexOrderFlowController_getOrderLineDetail({
        orderHeaderId: orderHeaderId
    })
    let { data: carLine } = await fetch.ecexOrderFlowController_getOrderDeliveryTransDetail({
        orderHeaderId: orderHeaderId
    })

    header.contractHeaderCode = header.contractHeaderCode || "无合同订单"
    header.orderDate = header.orderDate || "无"

    for (let i in header) {
        formData.value[i] = header[i]

    }

    isDisabled.value = formData.value.status == 'CLOSED'

    formData.value.productLine = []
    formData.value.productLine = productLine
    carLine?.map(item => item.checked = false)
    formData.value.carLine = []
    formData.value.carLine = carLine

}

const btnDel = (index, { orderTransLineId }) => {
    confirm('删除数据请谨慎，是否确认删除', async () => {
        if (orderTransLineId) {
            let { msg } = await fetch.ecexOrderLineController_ecexDelOrderTransLineList({
                transLineList: [item],
                remoteWarehouse: formData.value.remoteWarehouse
            })
            success(msg)
            getOrderInfo()

        } else {
            formData.value.carLine.splice(index, 1)
        }
    })
}



const btnView = async (orderTransLineId) => {

    await fetch.ecexOrderLineController_checkTransOrderCanDownload({ orderTransLineId })

    let data = await fetch.ecDriverWorkFlowController_transOrderDownloadPDF({ orderTransLineId })

    const filePath = uni.env.USER_DATA_PATH + '/' + new Date().valueOf() + '.pdf'

    const fs = uni.getFileSystemManager()

    fs.writeFile({
        filePath,
        data: data,
        encoding: 'binary',
        success(res) {
            uni.openDocument({
                filePath,
                fileType: 'pdf',
                showMenu: true,
                fail: (err) => {
                    warning(err.errMsg)
                }
            })
        },
        fail(err) {
            warning(err.errMsg)
        }
    })
}

const btnConfirm = async (list) => {
    list.map(item => formData.value.carLine.push(item))
}

const selectDriverCallback = (item) => {
    item.plateNumber = item.licensePlateNumber
    item.idCardNumber = item.driverNumber
    item.phoneNumber = item.driverPhoneNumber
    formData.value.carLine.push(item)
}

const btnSaveAll = async () => {

    const { orderHeaderId, productLine, carLine } = formData.value

    for (let i = 0; i < carLine.length; i++) {
        let item = carLine[i]
        if (!item.plateNumber) {
            warning(`请输入第${i + 1}行车牌号`)
            return
        }

        if (!plateNumber.test(item.plateNumber)) {
            warning(`第${i + 1}行车牌号格式错误`)
            return
        }
        if (!item.idCardNumber) {
            warning(`请输入第${i + 1}行身份证号`)
            return
        }
        if (!idCard.test(item.idCardNumber)) {
            warning(`第${i + 1}行身份证号格式错误`)
            return
        }
        if (!item.phoneNumber) {
            warning(`请输入第${i + 1}行手机号`)
            return
        }
        if (!phoneNumber.test(item.phoneNumber)) {
            warning(`第${i + 1}行手机号格式错误`)
            return
        }
        if (!item.packQuantity) {
            warning(`请输入第${i + 1}行预装量`)
            return
        }
        if (!cash.test(item.packQuantity)) {
            warning(`第${i + 1}行预装量格式错误`)
            return
        }
        if (!item.driverName) {
            warning(`请输入第${i + 1}行司机姓名`)
            return
        }
    }

    let ecOrderTransLineBoList = JSON.parse(JSON.stringify(toRaw(carLine)))

    let product = toRaw(productLine)

    ecOrderTransLineBoList.map(item => {
        if (!item.orderTransLineId) {
            for (let i in product[0]) {
                item[i] = product[0][i]
            }
            item.status = 'MAKING'
            item.statusText = '录入中'
        }
    })

    let { msg } = await fetch.ecexOrderFlowController_saveOrderDeliveryTransData({
        orderHeaderId,
        ecOrderTransLineBoList
    })

    toast(msg)

    getOrderInfo()
}

const btnPreBatchSendCar = () => {
//   const { carLine } = orderInfo.value

//   for (let i = 0; i < carLine.length; i++) {
//     let item = carLine[i]
//     if (!item.plateNumber) {
//       warning(`请输入第${i + 1}行车牌号`)
//       return
//     }

//     if (!plateNumber.test(item.plateNumber)) {
//       warning(`第${i + 1}行车牌号格式错误`)
//       return
//     }
//     if (!item.idCardNumber) {
//       warning(`请输入第${i + 1}行身份证号`)
//       return
//     }
//     if (!idCard.test(item.idCardNumber)) {
//       warning(`第${i + 1}行身份证号格式错误`)
//       return
//     }
//     if (!item.phoneNumber) {
//       warning(`请输入第${i + 1}行手机号`)
//       return
//     }
//     if (!phoneNumber.test(item.phoneNumber)) {
//       warning(`第${i + 1}行手机号格式错误`)
//       return
//     }
//     if (!item.packQuantity) {
//       warning(`请输入第${i + 1}行预装量`)
//       return
//     }
//     if (!cash.test(item.packQuantity)) {
//       warning(`第${i + 1}行预装量格式错误`)
//       return
//     }
//     if (!item.driverName) {
//       warning(`请输入第${i + 1}行司机姓名`)
//       return
//     }
//     if (!item.orderTransLineId) {
//       warning(`请先点击保存车辆信息后再派车`)
//       return
//     }
//   }
//   action.value = 'batchSendCar'
//   viewSignature.value.showModal()
}

const btnPreSendCar = (id) => {
//   orderTransLineId.value = id
//   action.value = 'sendCar'
//   viewSignature.value.showModal()
}

onLoad((options) => {
    getOrderInfo(options)
})
</script>
<style lang="scss" scoped>
.warp {
    background: #efefef;

    .box {
        border-radius: 10px;
    }

    .car-box {
        border: 1px solid #efefef;
    }
}
</style>