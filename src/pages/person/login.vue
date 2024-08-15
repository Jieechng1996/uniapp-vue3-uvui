<!--
 * @Date: 2024-07-18 17:29:53
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 10:38:25
 * @LastEditors: guojiecheng
-->
<template>
    <view class="contain h100p">
        <view class="w100p px-3 py-2">
            <base-form :legend="[
                { key: 'userName', required: true, formItemProps: { required: false }, type: 'slot' },
                { key: 'password', required: true, formItemProps: { required: false }, type: 'slot' }
            ]" v-model="formData" ref="loginForm">
                <template #userName>
                    <uv-input placeholder="输入用户名" border="none" v-model="formData.userName">
                        <template #prefix>
                            <uv-image :src="loginUser" width="16" height="16"></uv-image>
                        </template>
                    </uv-input>
                </template>
                <template #password>
                    <uv-input placeholder="输入密码" border="none" v-model="formData.password" type="password">
                        <template #prefix>
                            <uv-image :src="loginPwd" width="16" height="16"></uv-image>
                        </template>
                    </uv-input>
                </template>
            </base-form>
        </view>
        <view class="w100p px-2">
            <uv-button type="primary" text="登录" color="#cc3e3e"  @click="btnLogin()"></uv-button>
        </view>
        <view class="p-4 flex justify-between w100p">
            <text class="flex-1 text-center" style="color: #cc3e3e;" @click="() => simpleNavigateTo('/pages/person/register')">免费注册</text>
            <text class="flex-1 text-center" @click="() => simpleNavigateTo('/pages_business/person/resetPassword')">密码找回</text>
        </view>
    </view>
</template>

<script setup>
import loginUser from './img/login-user.png'
import loginPwd from './img/login-pwd.png'
import { baseForm } from '../../components';
import { ref, toRaw } from 'vue';
import { toast, warning } from '../../common/message';
import fetch from '../../config/fetch';
import { Base64 } from "js-base64";
import store from '../../store';
import { onLoad } from '@dcloudio/uni-app';
import { simpleNavigateTo } from '@/common/util'

const loginForm = ref()

const formData = ref({
    userName: '',
    password: ''
})

const btnLogin = async () => {

    await loginForm.value.validate().catch(e => { toast('请检查必填项'); return Promise.reject(e) })

    const { userName, password } = formData.value


    let { data } = await fetch.authentication_login({
        userName,
        pwd: Base64.encode(password),
        actionType: 'PURE_UAP',
    })

    store.commit('SET_LOGIN_INFO', formData.value)

    store.commit('SET_USER_INFO', data)

    uni.switchTab({
        url: '/pages/person/center'
    })
}

onLoad(() => {
    formData.value = toRaw(uni.getStorageSync('loginInfo')) || { userName: '' , password: '' }
})


</script>

<style lang="scss" scoped>
.contain {
    background: linear-gradient(to bottom, #FCFDFF 0%, #EBF2FA 50%, #E6F1FA 100%);
    transition: background 1s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
}

:deep(.uv-form-item) {
    margin-bottom: 23px;
}

:deep(.uv-line) {
    border-color: #ccc;
}

:deep(.uni-input-placeholder) {
    color: #808080 !important;
}
</style>