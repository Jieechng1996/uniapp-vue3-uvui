<!--
 * @Date: 2024-08-22 16:15:47
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 17:03:31
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p overflow-auto">
		<view class="flex flex-col p-6 items-center" style="background-color: #225ca0">
			<uv-image :src="userPic" width="80px" height="80px" class="mb-2"></uv-image>
			<view class="relative py-4 w-full flex justify-center">
				<view class="text-white">
					<view class="text-sm">账号：{{ userInfo.userName }}</view>
					<view class="text-sm mt-2">客户名称：{{ userInfo.customerName }}</view>
					<view class="text-sm mt-2">手机：{{ userInfo.mobilePhone }}</view>
				</view>
				<view class="border-t-4 border-l-4 w-5 h-5 absolute left-0 top-0 border-gray-400"></view>
				<view class="border-t-4 border-r-4 w-5 h-5 absolute right-0 top-0 border-gray-400"></view>
				<view class="border-b-4 border-l-4 w-5 h-5 absolute left-0 bottom-0 border-gray-400"></view>
				<view class="border-b-4 border-r-4 w-5 h-5 absolute right-0 bottom-0 border-gray-400"></view>
			</view>
		</view>
		<view class="relative">
			<uv-image :src="bg" width="100%" mode="widthFix"></uv-image>
			<view class="absolute z-10 w-full h-full top-0 left-0">
				<view class="text-white flex">
					<view class="flex-1 flex justify-center pt-10" v-for="(item, index) in [{ title: '出差日志' , color:'#bc0700' }, { title: '客户评估' , color:'#96c209'}]" :key="index">
						<view class="flex justify-center items-center w-24 h-24 rounded-full border-4 border-white " :style="{ background: item.color }">
							<view class="flex flex-col items-center" >
                                <text class="iconfont icon-rizhi text-3xl"></text>
							    <text>{{ item.title }}</text>
                            </view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import userPic from "../img/userPic.png";
import bg from "../img/bg.jpg";
import store from "../../store";
import { computed, ref } from "vue";
import { simpleNavigateTo } from "@/common/util";
import { toast } from "@/common/message";

const userInfo = computed(() => store.state.userInfo);
</script>
<style lang="scss" scoped></style>
