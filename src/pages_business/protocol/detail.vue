<!--
 * @Date: 2024-07-22 14:05:34
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 10:51:44
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p warp">
        <scroll-view scroll-y style="height: calc(100% - 48px);">
            <view class="p-2 ">
                <view class="p-3 box bg-white text-black">
                    <view class="text-base font-bold">订单详情</view>
                    <view v-for="({ name, key }, index) in [
                        { name: '协议编号', key: 'contractCode' },
                        { name: '客户名称', key: 'customerCodeText' },
                        { name: '提货单位', key: 'factoryIdText' },
                        { name: '开票单位', key: 'invIdText' },
                        { name: '协议单号', key: 'salesContractNo' },
                        { name: '提货方式', key: 'deliveryMethodText' },
                        { name: '协议来源', key: 'businessTypeText' },
                        { name: '生效时间', key: 'startDateActive' },
                        { name: '失效时间', key: 'endDateActive' },
                        { name: '协议总数', key: 'orderRemainNum' },
                        { name: '已提货量', key: 'shippedQty' },
                        { name: '可下单总数', key: 'packQuantityLeft' },
                        { name: '折扣价', key: 'packQuantityLeft' },
                        { name: '备注信息', key: 'packQuantityLeft' },
                    ]" :key="index" class="text-sm leading-7">
                        <view>
                            {{ name }}：{{ formData[key] }}
                        </view>
                    </view>
                    <view class="flex justify-end">
                        <uv-button type="primaty" size="small" plain
                            :color="skin.primaryColor" @click="btnRelease">执行至90%可以失效协议、释放资金！当前：0%</uv-button>
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
            </view>
        </scroll-view>
        <view class="flex justify-end p-2 bg-white">
            <uv-button type="primaty" plain size="small" :color="skin.primaryColor" @click="btnCreateOrder">生成订单</uv-button>
        </view>
    </view>

</template>
<script setup>
import { simpleNavigateTo } from "@/common/util" 
import { inject, onMounted, ref } from "vue";

const skin = inject("skin")

import fetch from "@/config/fetch"
import { onLoad } from "@dcloudio/uni-app";
import { toast } from "../../common/message";

const formData = ref({})
const getOrderInfo = async ({ orderHeaderId }) => {

    let { data: detail } = await fetch.ecContractHeader_findVoById({
        orderHeaderId
    })
    let { data: productLine } = await fetch.ecContractLine_findPagination({
        orderHeaderId
    })
    for (let i in detail) {
        formData.value[i] = detail[i]
    }
    formData.value.productLine = productLine
}

const btnCreateOrder = () => {
    simpleNavigateTo('/pages_business/order/create')
}

const btnRelease = () => {
    toast('释放成功')
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