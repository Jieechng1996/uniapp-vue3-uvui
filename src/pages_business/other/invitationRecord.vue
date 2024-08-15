<!--
 * @Date: 2024-08-06 15:56:10
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 16:09:12
 * @LastEditors: guojiecheng
-->
<template>
    <view class="bg-gray-100 h100p">
        <base-list :url="api.ecExCustomerBalance_findOrderDetail" :params="formData" ref="list">
            <template #default="{ list }">
                <view class="p-3 box">
                    <view v-for="(item, index) in list" :key="index"
                        class="bg-white rounded-xl border-b border-solid p-3 mb-2 ">
                        <view class="leading-6">受邀客户：
                            <text class="gold">{{ item.customerName }}</text>
                        </view>
                        <view class="leading-6">邀请日期：{{ item.startDate }}</view>
                        <view class="leading-6">活动名称：
                            <text class="gold">{{ item.activityName }}</text>
                        </view>
                        <view class="leading-6">优惠编码：
                            <text class="gold">{{ item.couponCode }}</text>
                        </view>
                        <view class="leading-6">优惠数量：
                            <text class="red">{{ item.discountNum }}</text>
                        </view>
                        <view class="leading-6">是否使用：
                            <text class="green">{{ item.meaning }}</text>
                        </view>
                        <view class="leading-6">失效日期：{{ item.endDateActive }}</view>
                    </view>
                </view>
            </template>
        </base-list>
    </view>
</template>
<script setup>
import api from '@/config/api'
import { baseList } from '../../components'

</script>
<style lang="scss" scoped></style>