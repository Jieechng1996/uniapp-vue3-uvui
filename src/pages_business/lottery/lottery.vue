<!--
 * @Date: 2024-08-12 10:59:22
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 16:06:35
 * @LastEditors: guojiecheng
-->
<template>
	<view class="p-3">
		<view class="leading-8">您当前的抽奖次数未：{{ formData.slyderCount || 0 }}次</view>
		<view class="leading-8 flex">
			<view @click="() => (formData['checkbox'] = !formData['checkbox'])"> <checkbox :checked="formData.checkbox" disabled /> 我已阅读并同意 </view>
			<view><text class="text-blue-500" @click="simpleNavigateTo('/pages_business/lottery/protocol')">《转盘抽奖管理规范》</text></view>
		</view>
		<view class="flex justify-center items-center w100p mt-6">
			<view class="outer flex justify-center items-center">
				<view class="content flex justify-center items-center relative">
					<view v-for="(item, index) in prizelist" :key="index" :class="['absolute', 'z-20', 'prize_' + (index + 1)]">
						<uv-image :src="item.prizeImage" width="40" height="40"></uv-image>
					</view>
					<view class="btn" :style="{ transform: `rotate(${rotationAngle}deg)` }" @click="btnLottry()">
						<uv-image :src="lotteryBtn" width="100%" height="100%"></uv-image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { onMounted, ref } from "vue";
import lotteryBtn from "./img/lottery_btn.png";
import fetch from "@/config/fetch";
import { toast } from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
const formData = ref({
	checkbox: true,
});

const prizelist = ref([]);

const getPrizeList = async () => {
	let { data } = await fetch.getSlyderPrize({});
	prizelist.value = data;
};

const getLotteryCount = async () => {
	let { data } = await fetch.getSlyderCount({});
	formData.value.slyderCount = data.slyderCount;
};

const rotationAngle = ref(0);

const btnLottry = async () => {
	if (!formData.value.checkbox) {
		toast("请勾选《转盘抽奖管理规范》");
		return;
	}

	await getLotteryCount();

	if (!formData.value.slyderCount) {
		toast("抽奖次数不足");
		return;
	}

	let { data } = await fetch.lotteryRotate({});

	rotationAngle.value = rotationAngle.value + 720 + 45;

	setTimeout(() => {
		// 等待动画执行

		toast(data?.msg);

		simpleNavigateTo("/pages_business/lottery/logisticsInfo");

	}, 2000);
};

onMounted(async () => {
	getPrizeList();
	getLotteryCount();
});
</script>
<style lang="scss">
:deep(.uni-checkbox-input-disabled) {
	background: #fff !important;

	svg path {
		color: #007aff;
		fill: #007aff;
	}
}
.outer {
	background: url("./img/lottery_outer_bg.gif");
	background-size: 100% 100%;
	width: 80vw;
	height: 80vw;
}
.content {
	background: url("./img/lottery_bg.png");
	background-size: 100% 100%;
	width: 86%;
	height: 86%;
}
.btn {
	width: 50%;
	height: 50%;
	transition: all 2s cubic-bezier(0.42, 0.19, 0.57, 0.86);
}
.prize_1 {
	top: 5%;
	left: calc(50% - 20px);
}
.prize_2 {
	right: 12%;
	top: 24%;
	transform: rotate(60deg);
}
.prize_3 {
	right: 12%;
	bottom: 24%;
	transform: rotate(120deg);
}
.prize_4 {
	bottom: 5%;
	left: calc(50% - 20px);
	transform: rotate(180deg);
}
.prize_5 {
	left: 12%;
	bottom: 24%;
	transform: rotate(240deg);
}
.prize_6 {
	left: 12%;
	top: 24%;
	transform: rotate(300deg);
}
</style>
