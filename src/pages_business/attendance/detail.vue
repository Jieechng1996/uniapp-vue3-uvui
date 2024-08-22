<!--
 * @Date: 2024-07-12 15:47:22
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 16:06:49
 * @LastEditors: guojiecheng
-->
<template>
    <view class="w100p" style="height: 35vh;">
        <view class="w100p h100p flex justify-center items-center" v-if="loading">
            <uv-loading-icon></uv-loading-icon>
        </view>
        <view v-else class="w100p h100p">
            <map :longitude="formData.longitude" :latitude="formData.latitude" show-compass enable-3D show-location :markers="markers"
                class="w100p h100p" id="map" />
        </view>
    </view>
    <scroll-view scroll-y style="height: 35vh;" v-if="!disabled">
        <uv-cell-group>
            <uv-radio-group v-model="chooseAddress" placement="column" @change="onChange">
                <uv-cell v-for="(item, index) in addressList" :key="index">
                    <template v-slot:title>
                        <uv-radio :name="item.title">{{ item.title }}</uv-radio>
                    </template>
                    <template v-slot:label>
                        <text class="text-xs mt-1" style="color: #666;">{{ item.address }}</text>
                    </template>
                </uv-cell>
            </uv-radio-group>
        </uv-cell-group>
        <uv-empty mode="list" v-if="addressList.length === 0"></uv-empty>
    </scroll-view>
    <view v-else class="pl-2 text-sm mt-2 leading-7">
        <view>出差时间：{{ formData.attendanceDate }}</view>
        <view>客户名称：{{ formData.createdByText }}</view>
        <view>定位地址：{{ chooseAddress }}</view>
        <view>说明：{{ formData.description }}</view>
    </view>
    <view class="pl-2 text-sm mt-2 flex">
        <view class="mb-2">考勤照片：</view>
        <base-uploader v-model="formData.locationPics" :limit="1"  :disabled="disabled"
            @success="(({filesPath}) => formData.locationPic = filesPath)"
            @delete="() => formData.locationPic = ''"
            :props="{ capture: 'camera' }" 
        ></base-uploader>
    </view>
    <view class="p-3" v-if="!disabled">
        <uv-button type="primary" text="完成" @click="btnSave"></uv-button>
    </view>

</template>

<script setup>
import { baseUploader } from '@/components'
import { computed, getCurrentInstance, onMounted, ref } from "vue"
import location from './img/location.png'
import { getCurrentLocationByBmap } from '@/common/map'
import fetch from '@/config/fetch';
import store from '@/store';
import dayjs from 'dayjs';
import { error, success, toast } from '@/common/message';
import { onLoad } from '@dcloudio/uni-app';

const formData = ref({}) 

const latitude = ref('37.581767')

const longitude = ref('120.30717')

const disabled = ref(false)

const chooseAddress = ref()

const loading = ref(false)

const markers = ref([{
    latitude: 37.581767,
    longitude: 120.30717,
    id: 0,
    iconPath: location
}])

const addressList = ref([])

const userInfo = computed(() => store.state.userInfo)

const onChange = (value) => {
    loading.value = true
    let current = addressList.value.find(item => item.title === value)
    markers.value[0].latitude = current.point.lat
    markers.value[0].longitude = current.point.lng
    formData.value.latitude = current.point.lat
    formData.value.longitude = current.point.lng
    // 编译为h5的时候，markers的清除有bug，暂时使用强制刷新从新渲染
    setTimeout(() => {
        loading.value = false
    }, 500);
}

const btnSave = async () => {
    let current = addressList.value.find(item => item.title === chooseAddress.value)
    if (!current) {
        error('请选择签到地址')
        return
    }
    if(!formData.value.locationPic){
        error('请选择图片')
        return
    }
    let { msg } = await fetch.ecpExUserAttendance_save({
        ...formData.value,
        userLocation: current.address || current.title,
        userId: userInfo.userId,
        attendanceDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    // success(msg)
    toast(msg)
    setTimeout(() => {
        uni.navigateBack()
    }, 1500);
}

onLoad(async (options) => {
    loading.value = true
    if (options.id) {
        disabled.value = true
        let { data } =  await fetch.ecpExUserAttendance_findById({
            id: options.id
        })
        markers.value[0].latitude = data.latitude
        markers.value[0].longitude = data.longitude
        chooseAddress.value = data.userLocation
        formData.value = {
            latitude: data.latitude,
            longitude: data.longitude,
            locationPics: [{ filesPath : data.locationPic }],
            ...data
        }
    } else {
        let { surroundingPois, point } = await getCurrentLocationByBmap()
        formData.value = {
            latitude: surroundingPois[0].point.lat,
            longitude: surroundingPois[0].point.lng,
            locationPic: '',
            locationPics: []
        }
        addressList.value = surroundingPois
        chooseAddress.value = surroundingPois[0].title
        markers.value[0].latitude = surroundingPois[0].point.lat
        markers.value[0].longitude = surroundingPois[0].point.lng
        // latitude.value = surroundingPois[0].point.lat
        // longitude.value = surroundingPois[0].point.lng
    }
    setTimeout(() => {
        loading.value = false
    }, 500);
    // markers.value = [{
    //     latitude: surroundingPois[0].point.lat,
    //     longitude: surroundingPois[0].point.lng,
    //     iconPath: location,
    //     id: '0'
    // }]
})



</script>

<style lang="scss" scoped>
.map {
    width: 100%;
    height: 35vh;
}
</style>