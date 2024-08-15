<!--
 * @Date: 2024-08-06 14:07:23
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 16:36:42
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<view class="bg-gray-100 h100p">
			<base-list :url="api.getMyPrizeDetail" :params="formData" ref="list">
				<template #default="{ list }">
					<view class="p-3">
						<view v-for="(item, index) in list" :key="index" class="item bg-white text-black mb-3 rounded-lg" @click="simpleNavigateTo('/pages_business/lottery/logisticsInfo', { id: item.id })">
							<view class="leading-6">活动名称：{{ item.activityName }}</view>
							<view class="leading-6">奖品名称：{{ item.prizeName }}</view>
							<view class="leading-6">中奖日期：{{ item.detailDate }}</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>
	</view>
</template>
<script setup>
import { inject } from "vue";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";

const skin = inject("skin");
</script>
<style lang="scss" scoped>
</style>
