<!--
 * @Date: 2
  components: { uvButton },
  components: { uvImage },024-07-19 17:14:49
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 10:06:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p">
        <view class="list">
            <base-list :url="api.ecexContractHeaderController_ecexFindPagination" :params="formData" ref="list">
                <template #default="{ list }">
                    <view class="p-3 box leading-7">
                        <view v-for="(item, index) in list" :key="index" class="item bg-white text-black mb-3 "
                            @Click="() => btnGoDetail(item)">
                            <view class="flex justify-between items-center">
                                <view class="font-bold text-base leading-7">协议编号：{{ item.contractCode }}</view>
                                <view class="text-sm text-gray-500">{{ item.contractTypeText }}</view>
                            </view>
                            <!-- <view v-for="(line, subscript) in item.ecOrderLineListVo" :key="subscript"
                                class="flex items-center py-2">
                                <uv-image :src="line.shortPicUrl" width="80" height="80"></uv-image>
                                <view class="ml-3 text-gray-600 text-sm">
                                    <view>产品名称：{{ line.productName }}</view>
                                    <view>执行量：{{ line.actualOrderQuantity }}</view>
                                    <view>价格：{{ line.executionPrice }}</view>
                                    <view>订单数量：{{ line.orderQuantity }}{{ line.uomCodeText }}</view>
                                </view>
                            </view> -->
                            <view >销售组织：{{ item.companyIdText }}</view>
                            <view >有效日期至：{{ item.orderDate }}</view>

                            <view class="flex items-center justify-between leading-8">
                                <view>状态：{{ item.statusText }}</view>
                                <view class="flex items-center">
                                    <uv-button class="ml-2" @click="btnGoDetail(toRaw(item))"
                                       type="success"
                                        :plain="true" size="small">详情</uv-button>
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

const btnGoDetail = ({ orderHeaderId }) => {
    simpleNavigateTo('/pages_business/protocol/detail', { orderHeaderId })
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