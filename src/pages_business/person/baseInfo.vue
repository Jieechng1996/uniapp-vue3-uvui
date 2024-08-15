<!--
 * @Date: 2024-08-06 10:57:24
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 11:04:51
 * @LastEditors: guojiecheng
-->
<template>
    <uv-cell-group>
        <uv-cell :title="item.label" :value="userInfo[item.key]" v-for="(item, index) in list" :key="index">
        </uv-cell>
    </uv-cell-group>
</template>
<script setup>
import { computed, ref } from "vue";
import store from "../../store";

const userInfo = computed(() => store.state.userInfo)

const list = ref([
    { key: 'userName', label: '用户名：', type: 'text' },
    { key: 'userFullName', label: '用户全名：', type: 'text' },
    { key: 'qqNumber', label: 'QQ号码：', type: 'text' },
    { key: 'mobilePhone', label: '手机号码：', type: 'text' },
    { key: 'phoneNumber', label: '电话号码：', type: 'text' },
    { key: 'email', label: '邮箱号码：', type: 'text' },
])
</script>
<style lang="scss" scoped></style>