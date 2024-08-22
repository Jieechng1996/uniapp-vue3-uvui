<!--
 * @Date: 2024-08-16 09:59:36
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 11:20:31
 * @LastEditors: guojiecheng
-->
<template>
    <view class="p-3">
        <view class="flex items-center" @click="uploadImg()">
            <uv-image :src="formData.userHeadImgUrl || userPic" width="56px" height="56px" class="mr-3"></uv-image>
            <text class="text-sm">修改头像</text>
        </view>
        <uv-divider></uv-divider>
        <view class="px-1">
            <base-form :legend="[
            { label: '用户名：', key: 'userName', disabled: true },
            { label: '部门：', key: 'departmentName', disabled: true },
            { label: '手机号码', key: 'mobileNumber', disabled: true },
            { label: '用户全名', key: 'userFullName'},
            { label: '电话号码', key: 'phoneNumber', type: 'phone' },
            { label: 'QQ', key: 'qq', props: { type: 'number'} },
            { label: '邮箱', key: 'email', type: 'email' },
        ]" v-model="formData" ref="companyForm" :form-props="{ labelWidth: 110 }"></base-form>
        </view>
        <view class="mt-3">
            <uv-button :color="skin.primaryColor" @click="btnSave">保存</uv-button>
        </view>
    </view>
</template>
<script setup>
import userPic from "./img/userPic.png";
import { baseForm } from "@/components";
import { inject, onMounted, ref } from "vue";
import fetch from "@/config/fetch";
import { success, toast } from "../../common/message";
import { uploadData } from '@/common/httpServer'
const skin = inject('skin')
const formData = ref({})
const getDetail = async () => {
    let { data } = await fetch.baseUsersService_findById({})
    formData.value = data?.[0] || {}
}

const btnSave = async () => {
    let { msg } = await fetch.baseUsersService_save(formData.value)

    toast(msg)

    setTimeout(() => { getDetail() }, 1500);
}

const uploadImg = async () => {
    uni.chooseImage({
        success: async (res) => {
            let { tempFilePaths } = res
            let { data } = await fetch.fileUploadService_pictureUpload(tempFilePaths[0])
            formData.value.userHeadImgUrl = data.filesPath
        },
        fail: () => {
            toast('上传失败')
        }
    })
}

onMounted(() => {
    getDetail()
})
</script>
<style lang="scss" scoped>
:deep(.uv-divider){
    margin-bottom: 0px;
}
</style>