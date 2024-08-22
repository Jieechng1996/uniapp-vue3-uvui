<!--
 * @Date: 2024-07-04 10:32:31
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 14:23:31
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p overflow-auto">
		<view class="header flex p-6 items-center">
			<uv-image :src="userPic" width="80px" height="80px" class="mr-6"></uv-image>
			<view class="text-white" >
				<view class="text-sm">账号：{{ userInfo.userName }}</view>
				<view class="text-sm mt-2">客户名称：{{ userInfo.customerName }}</view>
				<view class="text-sm mt-2">手机：{{ userInfo.mobilePhone }}</view>
			</view>
		</view>
		<uv-cell-group>
			<uv-cell title="单元格"   is-link v-for="(item, index) in baseList" :key="index" @click="() => item.path && simpleNavigateTo(item.path)">
				<template v-slot:title>
					<view class="flex items-center">
						<text :class="['text-2xl', 'icon', 'mr-2' ,item['icon']]" :style="{ color: item.color }" ></text>
                        <view class="flex items-end">
                            <text>{{ item.title }}</text>
                            <text v-if="item.desc" class="text-xs text-gray-500">{{ '（' + item.desc + ')' }}</text>
                        </view>
					</view>
				</template>
			</uv-cell>
		</uv-cell-group>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import userPic from "../img/userPic.png";
import { simpleNavigateTo } from "@/common/util";
import store from "../../store";
import { toast } from "../../common/message";

const userInfo = computed(() => store.state.userInfo);

console.log(userInfo);

const deviceInfo = uni.getDeviceInfo()

console.log(deviceInfo)

const baseList = ref([
	{ title: "修改信息", icon: "ion-android-contact", color: "#c63030", path: "/pages_business/person/info" },
	{ title: "更换手机", icon: "ion-android-phone-portrait", color: "#996600", path: "/pages_business/person/modifyPhone" },
	{ title: "修改密码", icon: "ion-ios-locked", color: "#00913d", path: "/pages_business/person/resetPassword" },
    { title: "版本信息", icon: "ion-ios-gear-outline", color: "#00913d" , desc: deviceInfo.system},
]);

const btnGo = path => {
	path ? simpleNavigateTo(path) : toast("暂未开发");
};
</script>

<style lang="scss" scoped>
.header {
	background: #225ca0;
}
</style>
