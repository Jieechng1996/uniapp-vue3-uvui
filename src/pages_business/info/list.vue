<!--
 * @Date: 2024-08-06 16:08:20
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 17:06:20
 * @LastEditors: guojiecheng
-->
<template>
    <view class="bg-gray-100 h100p">
        <base-list :url="api.saafNotificationNotice_findPagination" :params="formData" ref="list">
            <template #default="{ list }">
                <uv-cell-group class="bg-white">
                    <uv-cell v-for="(item,index) in list" :key="index" is-link :label="item.pubtime" @click="() => simpleNavigateTo('/pages_business/info/detail', { id: item.id })">
                        <template #title>
                            <view class="gold">{{ item.title }}</view>
                        </template>
                    </uv-cell>
                </uv-cell-group>
            </template>
        </base-list>
    </view>
</template>
<script setup>
import api from '@/config/api'
import { simpleNavigateTo } from '../../common/util'
import { baseList } from '../../components'
</script>
<style lang="scss" scoped></style>