<!--
 * @Date: 2024-08-06 14:50:03
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 15:18:57
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-3">
        <base-form :legend="[
            { label: '标题', key: 'title', required: true },
            { label: '手机号', key: 'mobilePhone', required: true, type: 'phone' },
            { label: '电子邮箱', key: 'email', required: true, type: 'email' },
            { label: '反馈内容', key: 'addressSuffix',required: true, type: 'textarea' ,placeholder: '请输入', },
        ]" v-model="formData" ref="form" :form-props="{ labelWidth: 110 }" :disabled="formData.serveId"></base-form>
        <view class="mt-3" v-if="!formData.serveId">
            <uv-button type="primary" color="#cc3e3e" @click="() => btnSubmit()">提交信息</uv-button>
        </view>
    </view>

</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { error, toast } from "../../common/message";
import { baseForm } from "../../components";
import fetch from "../../config/fetch";
const formData = ref({
    title: ''
})

const form = ref(null)

const btnSubmit = async () => {

    await form.value.validate().catch(e => {
        error(e[0].message)
            ; return Promise.reject(e)
            
    })

    let { msg } = await fetch.ecpExCustomerServe_save({ ...formData.value })

    toast(msg || '提交成功')

    uni.navigateBack()
}

onLoad(async (options) => {
    if(options.id) {
        let { data } = await fetch.ecpInCustomerServe_findVoById({ id: options.id })
        formData.value = data
    }
})
</script>
<style lang="scss" scoped></style>