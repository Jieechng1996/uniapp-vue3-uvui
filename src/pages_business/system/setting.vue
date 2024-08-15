<!--
 * @Date: 2024-08-06 10:15:35
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 11:38:54
 * @LastEditors: guojiecheng
-->
<template>
    <uv-cell-group>
        <uv-cell title="打开标签页" :isLink="item.isLink" v-for="(item, index) in list" :key="index" @click="() => {
            item.path && simpleNavigateTo(item.path)
            item.func && item.func()
         }">
            <template v-slot:title>
                <view class="flex items-center">
                    <text :class="['icon text-xl w-7', item['icon']]" :style="{ color: item['color'] }"></text>
                    <view class="flex items-end">
                        <text>{{ item.title }}</text>
                        <text v-if="item.desc" class="text-xs text-gray-500">{{ '（' + item.desc + ')' }}</text>
                    </view>

                </view>

            </template>
        </uv-cell>
    </uv-cell-group>
</template>
<script setup>
import { inject, ref } from "vue";
import { simpleNavigateTo } from "../../common/util";
import store from "../../store";

const deviceInfo = uni.getDeviceInfo()

console.log(deviceInfo)

const base = inject('base')

const list = ref([
    { title: '个人信息', icon: 'ion-android-contact', color: '#c63030', isLink: true , path: '/pages_business/person/baseInfo' },
    { title: '企业信息', icon: 'ion-android-contacts', color: '#cc9900', isLink: true , path: '/pages_business/person/companyInfo' },
    { title: '更换手机', icon: 'ion-android-phone-portrait', color: '#996600', isLink: true , path: '/pages_business/person/modifyPhone' },
    { title: '修改密码', icon: 'ion-ios-locked', color: '#00913d', isLink: true , path: '/pages_business/person/resetPassword' },
    { title: '帮助中心', icon: 'ion-android-contacts', color: '#0c98af', isLink: true, path: '/pages_business/other/customerService' },
    { title: '版本信息', icon: 'ion-radio-waves', color: '#0c98af', desc: deviceInfo.system },
    { title: '备案信息', icon: 'ion-information-circled', color: '#0c98af', desc: base.filingInformation },
    { title: '退出登录', icon: 'ion-power', color: '#0c98af', func: () => {
        store.dispatch("CLEAR_BASE_INFO")
        uni.redirectTo({ url: '/pages/person/login' })
    } },
])
</script>
<style lang="scss" scoped></style>