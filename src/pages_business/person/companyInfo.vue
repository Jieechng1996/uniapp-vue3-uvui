<!--
 * @Date: 2024-08-06 10:57:24
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 17:14:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-4">
        <base-form :legend="[
          { key: 'customerName', label: '客户名称：', type: 'text' },
          { key: 'commerceRegNo', label: '社会信用代码（或营业执照）：', type: 'text' },
          { key: 'legalRepresentative', label: '法人代表：', type: 'text' },
          { key: 'contactPeople', label: '联系人姓名：', type: 'text' },
          { key: 'contactPhone', label: '联系人电话：', type: 'text' },
          { key: 'regAddress', label: '注册地址：', type: 'text' },
          { key: 'threeinone', label: '三证合一：', type: 'slot' },
          { key: 'businessLicence', label: '企业执照：', type: 'slot' },
          { key: 'entrusted', label: '委托书', type: 'slot' },
          { key: 'bank', label: '开户行名称：', type: 'text' },
          { key: 'bankAccount', label: '银行账号：', type: 'text' },
          { key: 'billTo', label: '收单地址：', type: 'text' },
          { key: 'shipTo', label: '发货地点：', type: 'text' },
        
        ]" v-model="userInfo" ref="form" :form-props="{ labelWidth: 140 }">
          <template #threeinone>
            <base-uploader v-model="userInfo.threeinones" disabled limit="1"></base-uploader>
          </template>
          <template #businessLicence>
            <base-uploader v-model="userInfo.businessLicences" disabled limit="1"></base-uploader>
          </template>
          <template #entrusted>
            <base-uploader v-model="userInfo.entrusteds" disabled limit="1"></base-uploader>
          </template>
        </base-form>
    </view>
     
</template>
<script setup>
import { baseForm, baseUploader } from "../../components";
import { computed, ref } from "vue";
import store from "../../store";

const userInfo = computed(() => {
    let userInfo = store.state.userInfo || {}
    userInfo.threeinones = userInfo.threeinone ? [{ filesPath: userInfo.threeinone }] : []
    userInfo.businessLicences = userInfo.businessLicence ? [{ filesPath: userInfo.businessLicence }] : []
    userInfo.entrusteds = userInfo.entrusted ? [{ filesPath: userInfo.businessLicence }] : []
    return userInfo
})



</script>
<style lang="scss" scoped></style>