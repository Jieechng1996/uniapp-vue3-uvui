<!--
 * @Date: 2
  components: { uvButton },024-07-12 10:45:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 15:47:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p bg-gray-100">
        <base-list :url="api.ecpExUserAttendance_findPagination" :params="formData" ref="list">
            <template #default="{ list }">
                <view class="px-3">
                    <view v-for="(item, index) in list" :key="index" class="bg-white text-black mt-3 rounded-lg px-3 py-2 leading-6" @Click="() => btnGoDetail(item)">
                        <view>出差时间：{{ item.attendanceDate }}</view>
                        <view>客户名称：{{ item.createdByText }}</view>
                        <view>定位地址：{{ item.userLocation }}</view>
                        <view>工作说明：{{ item.description }}</view>
                    </view>
                </view>
            </template>
        </base-list>
    </view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { baseList } from "@/components";
import api from "../../config/api";
import { simpleNavigateTo } from "@/common/util"

const formData = ref({})

const btnGoDetail = ({ attendanceId }) => {
    simpleNavigateTo('./detail', { id : attendanceId })
}

const list = ref()

const userName = ref()

// const popup = ref()

onMounted(() => {
    // popup.value.open()
    // datetimePicker.value.open()
})

</script>

<style lang="scss" scoped>
.list {
    height: calc(100% - 135px);
}

.line {
    padding: 10px;
    border: 1px solid #999;
    border-radius: 15px;
    font-size: 14px;
    color: #333;
    margin-top: 20px;
}
</style>