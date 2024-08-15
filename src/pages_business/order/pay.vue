<!--
 * @Date: 2024-07-22 14:05:34
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 16:10:32
 * @LastEditors: guojiecheng
-->
<template>
    <scroll-view scroll-y style="height: calc(100% - 48px);">
        <view class="warp p-2 overflow-auto h100p">
            <view class="p-3 box bg-white text-black">
                <view class="text-base font-bold mb-1">订单支付</view>
                <view v-for="({ name, key }, index) in [
                    { name: '订单编号', key: 'orderCode' },
                    { name: '协议编号', key: 'contractHeaderCode' },
                    { name: '提货单位', key: 'companyIdText' },
                    { name: '开票单位', key: 'companyIdText' },
                    { name: '提货方式', key: 'deliveryMethodText' },
                    { name: '订单状态', key: '' },
                    { name: '订单数量', key: 'statusText' },
                    { name: '订单总价', key: 'creationDate' },
                    { name: '订单提交时间', key: 'creationDate' },
                    { name: '提货截止时间', key: 'creationDate' },
                    { name: '订单描述', key: 'creationDate' },
                ]" :key="index" class="text-sm leading-7">
                    <view>
                        {{ name }}：{{ orderData[key] }}
                    </view>
                </view>
            </view>

            <view class="p-3 box bg-white text-black mt-3">
                <view class="text-base font-bold mb-1">订单产品信息</view>
                <view v-for="(item, index) in orderData.ecOrderLineListVo" :key="index">
                    <view v-for="(line, subscript) in [
                    { name: '产品', key: 'productName' },
                    { name: '挂牌价', key: 'unitPrice' },
                    { name: '执行价', key: 'executionPrice', prefix: '￥' },
                    { name: '优惠方案', key: 'companyIdText' },
                    { name: '数量', key: 'companyIdText' },
                    { name: '单位', key: 'companyIdText' },
                    { name: '经营组织', key: 'companyIdText' },
                    { name: '提货地', key: 'factoryIdText' },
                ]" :key="subscript" class="text-sm leading-7">
                        <view>
                            {{ line.name }}：{{ line.prefix }}{{ item[line.key] }}
                        </view>
                    </view>
                </view>
            </view>

            <view class="p-3 box bg-white text-black  mt-3">
                <view class="text-base font-bold">订单支付</view>
                <base-form :legend="[
                    { label: '本单金额', key: 'count1', type: 'text' },
                    { label: '账户余额', key: 'count2', type: 'text' },
                    { label: '需付金额', key: 'count3', type: 'text' },
                    { label: '已付金额', key: 'count4', type: 'text' },
                    {
                        label: '支付单位', key: 'deliveryModeText', required: true, type: 'select', options: [
                            { value: 'SELF_DELIVERY', label: '支付单位1', },
                            { value: 'DISTRIBUTION', label: '支付单位2', }
                        ], confirmFunc: ({ value, label }) => {
                            formData.deliveryMode = value
                            formData.deliveryModeText = label
                        }, clearFunc: () => {
                            formData.deliveryMode = ''
                            formData.deliveryModeText = ''
                        }
                    },
                ]" v-model="formData" ref="formData" :form-props="{ labelWidth: 110 }"
                    :form-item-props="{ required: false, borderBottom: false }"></base-form>
            </view>
        </view>
    </scroll-view>
    <view class="flex justify-end p-2 bg-white">
        <uv-button type="primaty" plain size="small" :color="skin.primaryColor" @click="() => btnSubmit()">确认支付</uv-button>
    </view>
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import { simpleNavigateTo } from "@/common/util";
const skin = inject("skin")

import fetch from "@/config/fetch"
import { onLoad } from "@dcloudio/uni-app";
import { toast, warning } from "../../common/message";
import { baseDialog, baseForm } from "../../components";

const orderData = ref({})

const formData = ref({})

const params = ref({})

const modal = ref()

const getOrderInfo = async ({ orderHeaderId }) => {
    let { data } = await fetch.ecexOrderFlowController_getDetailForCommitPay({
        orderHeaderId
    })

    for (let i in data) {
        orderData.value[i] = data[i]
    }
}

const btnSubmit = async () => {

    const { orderHeaderId, companyId, businessType } = orderData.value

    let { msg } = await fetch.ecexOrderFlowController_confirmPayForCommitPay({
        orderHeaderId, companyId, businessType
    })

    toast(msg)

    setTimeout(() => {
        uni.redirectTo({
            url: '/pages_business/order/detail?orderHeaderId='+ orderHeaderId,
        })
    }, 1500);
}


onLoad((options) => {
    params.value = options
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