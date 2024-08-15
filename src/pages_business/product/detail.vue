<!--
 * @Date: 2024-07-22 14:05:34
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 14:17:38
 * @LastEditors: guojiecheng
-->
<template>
    <view class="box">
        <scroll-view scroll-y scroll-with-animation class="h100p">
            <view class="relative">
                <uv-image :src="detailJPG" width="100%" mode="widthFix"></uv-image>
                <view class="font-bold text-2xl py-2 px-4 absolute bottom-0 w100p  z-50" style="color: #bf8500;">
                    {{ formData.productName }}
                </view>
            </view>
            <view class="warp p-2 ">
                <view class="p-3 box bg-white text-black">
                    <view class="text-base font-bold">产品详情</view>
                    <view v-for="(item, index) in [
                    { name: '产品名称', key: 'productName' },
                    { name: '经营组织', key: 'companyIdText' },
                    { name: '提货地', key: 'factoryIdText' },
                    { name: '挂牌价', key: 'unitPrice', perfix: '￥' },
                    { name: '剩余量', key: 'orderRemainNum' },
                    { name: '开售时间', key: 'startTime' },
                ]" :key="index" class="text-sm leading-7">
                        <view>
                            {{ item.name }}：{{ item.perfix }} {{ formData[item.key] }}
                        </view>
                    </view>
                </view>
                <view class="p-3 box bg-white text-black mt-3">
                    <view class="text-base font-bold">产品描述</view>
                    <view class="my-3">
                        <rich-text v-if="formData.description" :nodes="formData.description"></rich-text>
                        <uv-empty v-else mode="data"></uv-empty>
                    </view>
                </view>
                <view class="p-3 box bg-white text-black mt-3">
                    <view class="text-base font-bold">产品规格</view>
                    <view style="min-height: 300px;" class="pt-4">
                        <uv-image :src="formData.productImg" width="100%" mode="widthFix"></uv-image>
                    </view>

                </view>
            </view>
        </scroll-view>
    </view>
    <view class="flex justify-between px-4 py-2" style="box-sizing: border-box;">
        <uv-button @click="btnJoinCart(formData)" style="flex: 1;" class="mr-2" plain :color="skin.primaryColor"
            size="small">加入购物车</uv-button>
        <uv-button @click="btnBuyNow(formData)" style="flex: 1;" :color="skin.primaryColor"
            size="small">立刻购买</uv-button>
    </view>
    <uv-modal ref="modal" title="提示" :confirmColor="skin.primaryColor" showCancelButton cancelText="不用了谢谢"
        confirmText="购买推荐产品" @confirm="() => simpleNavigateTo('/pages_business/product/recommonds')"
         @cancel="() => simpleNavigateTo('/pages_business/order/create')">
        <view class="text-base text-gray-900">
            你有推荐购买的产品，是否购买?
        </view>
    </uv-modal>
</template>
<script setup>
import { computed, inject, onMounted, ref, toRaw } from "vue";
import { simpleNavigateTo } from '@/common/util'

const skin = inject("skin")

import fetch from "@/config/fetch"
import { onLoad } from "@dcloudio/uni-app";
import api from "../../config/api";
import { toast, confirm } from "../../common/message";
import detailJPG from './img/detail.jpg'
import store from "../../store";

const userInfo = computed(() => store.state.userInfo)

const formData = ref({})

const getDetail = async ({ productId }) => {
    let { data } = await fetch.categoryNumberService_getProductInterface({
        productId
    })
    for (let i in data[0]) {
        formData.value[i] = data[0][i]
    }



}

const btnJoinCart = async ({ productId }) => {
    let { msg } = await fetch.ecpExShoppingCart_save({
        productId,
        userId: userInfo.value.userId,
    })
    toast(msg)
}
const modal = ref()
const btnBuyNow = () => {
    modal.value.open()
}




onLoad((options) => {
    getDetail(options)
})
</script>
<style lang="scss" scoped>
.box {
    height: calc(100% - 48px);
}

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