<!--
 * @Date: 2024-07-19 16:33:46
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 17:12:48
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-5 py-2">
        <base-form :legend="[
            { label: '用户名：', key: 'userName', required: true, props: { border: 'surround' } },
            { label: '手机号', key: 'mobilePhone', type: 'slot', required: true },
            { label: '短信验证', key: 'verificationCode', required: true, props: { type: 'number' } },
            { label: '新密码', key: 'password', type: 'phone', required: true },
            { label: '确认密码', key: 'confirmPassword', type: 'phone', required: true },
        ]" v-model="formData" ref="form" :form-props="{ labelWidth: 110 }" :rules="rules">
            <template #mobilePhone>
                <uv-input v-model="formData.mobilePhone" placeholder="请输入手机号码" type="number">
                    <template #suffix>
                        <uv-button size="small" type="primary" @click="() => getVerificationCode()"
                            :disabled="!formData.mobilePhone && !!countDown" :color="skin.primaryColor">{{ countDown ?
            `请在${countDown}s后再获取` : '获取验证码' }}</uv-button>
                    </template>
                </uv-input>
            </template>
        </base-form>

        <view class="mt-3">
            <uv-button type="primary" :color="skin.primaryColor" @click="() => btnReset()">提交</uv-button>
        </view>
    </view>

</template>
<script setup>
import { inject, ref } from "vue";
import { baseForm } from "../../components";
import { phoneNumber, password } from '@/lib/regexp'
import { toast, warning } from "../../common/message";
import fetch from "../../config/fetch";

const formData = ref({})

const skin = inject('skin')



const rules = ref({
    password: [
        { min: 6, max: 16, message: '密码必须在6-16位之间', trigger: ['change'] },
        {
            validator: (rule, value, callback) => !(value && !password.test(value)), message: '请包含大写字母、小写字母、数字', trigger: ['change']
        }
    ],
    confirmPassword: [
        { validator: (rule, value, callback) => !(value && formData.value.password !== value), message: '两个密码需要一致', trigger: ['change'] }
    ],
    mobilePhone: [
        {
            validator: (rule, value, callback) => !(value && !phoneNumber.test(value)), message: '手机号格式错误', trigger: ['change']
        }
    ],
})

const countDown = ref(0)

const getVerificationCode = async () => {
    let mobilePhone = formData.value.mobilePhone

    if (!mobilePhone) {
        warning('请输入手机号')
        return
    }

    if (!phoneNumber.test(mobilePhone)) {
        warning('手机号格式错误')
        return
    }

    let { msg } = await fetch.codeService_mallSendSMS({
        captchaCodeKey: formData.value.captchaCodeKey,
        captchaCode: formData.value.mobileYzm,
        actionType: "REGISTER_ECMALL",
        mobilePhone
    })

    toast(msg)

    countDown.value = 60

    let count = setInterval(() => {
        countDown.value = countDown.value - 1
        if (countDown.value === 0) {
            clearInterval(count)
        }
    }, 1000)

}

const form = ref()

const btnReset = async () => {
    await form.value.validate().catch(e => {
        error(e[0].message)
            ; return Promise.reject(e)
    })

    let { msg } = await fetch.baseUsersService_modifyPassword({
        ...formData.value
    })

    toast(msg)

    setTimeout(() => {
        uni.redirectTo({ url: '/pages/person/login' })
    }, 1500);

}  

</script>
<style lang="scss" scoped></style>