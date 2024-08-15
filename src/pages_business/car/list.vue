<!--
 * @Date: 2
  components: { uvButton },
  components: { uvImage },024-07-19 17:14:49
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 16:01:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="flex justify-between py-2 px-3 items-center">
        <view>
            车辆总数：2辆
        </view>
        <uv-button size="small" :color="skin.primaryColor" plain @click="btnNew()">新增</uv-button>
    </view>
    <view class="list">
        <base-list :url="api.ecExDriverTruckBizRela_findPagination" :params="formData" ref="list">
            <template #default="{ list }">
                <view class="p-3 box">
                    <view v-for="(item, index) in list" :key="index" class="rounded-xl py-2 px-3 bg-white text-black mb-3 ">
                        <view class="flex justify-between items-center mb-1">
                            <view class="font-bold text-base">{{ item.licensePlateNumber }}</view>
                            <uv-button size="small" color="#333" plain @click="btnDel(item)">删除</uv-button>
                        </view>
                        <view class="leading-6">司机姓名：{{ item.driverName }}</view>
                        <view class="leading-6">身份证号码：{{ item.driverNumber }}</view>
                        <view class="leading-6">手机号码{{ item.driverPhoneNumber }}</view>
                        <view class="leading-6">备注：{{ item.remark }}</view>
                    </view>
                </view>
            </template>
        </base-list>
    </view>

</template>
<script setup>
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import api from '@/config/api'
import { inject, ref, toRaw } from "vue";
import uvButton from "../../uni_modules/uv-button/components/uv-button/uv-button.vue";
import uvImage from "../../uni_modules/uv-image/components/uv-image/uv-image.vue";
import { simpleNavigateTo } from '@/common/util'
import fetch from "../../config/fetch";
import { confirm, success, toast } from "../../common/message";

const skin = inject('skin')
const formData = ref({})

const btnNew = () => {
    simpleNavigateTo('/pages_business/car/detail')
}

const btnDel = ({ relaId }) => {

    confirm('是否确认删除车辆', async () => {
        let { msg } = await fetch.ecExDriverTruckBizRela_delete({
            id: relaId
        })

        toast(msg)

        list.value?.refresh()

    })

}
</script>
<style lang="scss" scoped>
.list {
    height: 100%;
    background: #efefef;
}

:deep(.uv-button--info) {
    border-color: #333;
}
</style>