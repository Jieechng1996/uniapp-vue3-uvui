<!--
 * @Date: 2024-07-19 17:14:49
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-09 15:22:40
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p">
        <view>
            <uv-tabs :list="[
                { name: '全部' },
                { name: '制作中', status: 'MAKING' },
                { name: '待支付', status: 'APPROVED' },
                { name: '已关闭', status: 'CLOSED' }
            ]" lineColor="#e42112" itemStyle="padding-left: 20px; padding-right: 20px; height: 44px;"></uv-tabs>
        </view>
        <view class="list">
            <base-list :url="api.ecexOrderHeaderController_findHeaderAndLineCustomPage" :params="formData">
                <template #default="{ list }">
                    <view class="p-3 box">
                        <view v-for="(item, index) in list" :key="index" class="item bg-white text-black mb-3">
                            <view class="flex justify-between items-center">
                                <view class="font-bold text-base">订单编号：{{ item.contractHeaderCode }}</view>
                                <view class="text-sm text-gray-500">{{ item.businessTypeText }}</view>
                            </view>
                            <view v-for="(line, subscript) in item.ecOrderLineListVo" :key="subscript"
                                class="flex items-center py-2">
                                <uv-image :src="line.shortPicUrl" width="80" height="80"></uv-image>
                                <view class="ml-3 text-gray-600 text-sm">
                                    <view>产品名称：{{ line.productName }}</view>
                                    <view>执行量：{{ line.actualOrderQuantity }}</view>
                                    <view>价格：{{ line.executionPrice }}</view>
                                    <view>订单数量：{{ line.orderQuantity }}{{ line.uomCodeText }}</view>
                                </view>
                            </view>
                            <view class="leading-6">销售组织：{{ item.companyIdText }}</view>
                            <view class="leading-6">有效日期至：{{ item.orderDate }}</view>

                            <view class="flex items-center justify-between leading-8">
                                <view>状态：{{ item.statusText }}</view>
                                <view class="flex items-center">
                                    <uv-button class="ml-2" @click="btnCommitPay(toRaw(item))"
                                        v-if="item.status === 'APPROVED'" type="primary" :plain="true"
                                        size="small">立刻付款</uv-button>
                                    <uv-button class="ml-2" @click="btnGoDetail(toRaw(item))"
                                        v-if="item.status === 'EFFECT' || item.status === 'CLOSED'" type="success"
                                        :plain="true" size="small">详情</uv-button>
                                    <uv-button class="ml-2" @click="btnCancelOrder(toRaw(item))"
                                        v-if="item.status === 'APPROVED'" size="small">取消</uv-button>
                                    <uv-button class="ml-2" @click="btnCloseOrder(toRaw(item))"
                                        v-if="item.status === 'EFFECT'" size="small">关闭</uv-button>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </base-list>
        </view>
    </view>
</template>
<script setup>
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import api from '@/config/api'
import { ref, toRaw } from "vue";
import uvButton from "../../uni_modules/uv-button/components/uv-button/uv-button.vue";
import uvImage from "../../uni_modules/uv-image/components/uv-image/uv-image.vue";
import { simpleNavigateTo } from '@/common/util'
import fetch from "../../config/fetch";
import { confirm, success, toast } from "../../common/message";
const formData = ref({})

const btnCommitPay = ({ orderHeaderId }) => {
    simpleNavigateTo('/pages_business/order/pay', { orderHeaderId })
}

const btnGoDetail = ({ orderHeaderId }) => {
    simpleNavigateTo('/pages_business/order/detail', { orderHeaderId })
}

const btnCancelOrder = ({ orderHeaderId }) => {

    confirm('是否确认取消订单', async () => {
        let { msg } = await fetch.ecexOrderFlowController_updateOrderStatus({
            status: "CANCELED",
            orderHeaderId
        })

        toast(msg)

        list.value?.refresh()

    })
}

const btnCloseOrder = ({ orderHeaderId }) => {

    confirm('是否确认关闭订单', async () => {
        let { msg } = await fetch.ecexOrderFlowController_updateOrderStatus({
            status: "CLOSED",
            orderHeaderId
        })

        toast(msg)

        list.value?.refresh()

    })

}
</script>
<style lang="scss" scoped>
.list {
    height: calc(100% - 50px);
    background: #efefef;
}

.item {
    border-radius: 10px;
}

:deep(.uv-button--info) {
    border-color: #333;
}
</style>