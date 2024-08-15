<!--
 * @Date: 2024-07-04 10:32:31
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 16:43:22
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p overflow-auto">
		<view class="header flex p-6 items-center">
			<uv-image :src="userPic" width="80px" height="80px" class="mr-6"></uv-image>
			<view class="text-white" v-if="userInfo">
				<view class="text-sm">账号：{{ userInfo.userName }}</view>
				<view class="text-sm mt-2">客户名称：{{ userInfo.customerName }}</view>
			</view>
			<view class="text-white" v-else> <text @click="() => simpleNavigateTo('/pages/person/login')">点击登录</text> | <text @click="() => simpleNavigateTo('/pages/person/register')">立刻注册</text> </view>
		</view>
		<view>
			<uv-grid :border="true">
				<uv-grid-item v-for="(item, index) in baseList" :key="index" class="py-6" @click="() => btnGo(item.path)">
					<text class="icon iconfont text-2xl" :style="{ color: item.color }" v-if="item.icon">
						<rich-text :nodes="item.icon"></rich-text>
					</text>
					<uv-icon size="28" :name="item.name" :color="item.color" v-if="item.name"></uv-icon>
					<text :class="['text-2xl', item.ion]" :style="{ color: item.color }" v-if="item.ion"></text>
					<text class="grid-text">{{ item.title }}</text>
				</uv-grid-item>
			</uv-grid>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import userPic from "./img/userPic.png";
import { simpleNavigateTo } from "@/common/util";
import store from "../../store";
import { toast } from "../../common/message";

const userInfo = computed(() => store.state.userInfo);

console.log(userInfo);

const baseList = ref([
	{ title: "我的订单", icon: "&#xe655;", color: "#c63030", path: "/pages_business/order/list" },
	{ title: "我的协议", icon: "&#xe630;", color: "#cc9900", path: "/pages_business/protocol/list" },
	{ title: "我的车辆", icon: "&#xe60e;", color: "#996600", path: "/pages_business/car/list" },
	{ title: "我的账户", icon: "&#xe634;", color: "#00913d;", path: "/pages_business/other/account" },
	{ title: "资金占款", name: "arrow-down", color: "#cc3333", path: "/pages_business/other/fundOccupation" },
	{ title: "客服中心", icon: "&#xe63e;", color: "#0c98af", path: "/pages_business/other/customerService" },
	{ title: "活动订单", icon: "&#xe60d;", color: "#cc3333", path: "/pages_business/activity/orders" },
	{ title: "系统设置", icon: "&#xe623;", color: "#00913d", path: "/pages_business/system/setting" },
	{ title: "客户反馈", icon: "&#xe619;", color: "#47912e", path: "/pages_business/feedback/list" },
	{ title: "邀请记录", ion: "ion-ios-paper-outline", color: "#cc3333", path: "/pages_business/other/invitationRecord" },
	{ title: "资讯", name: "arrow-down", color: "#cc3333", path: "/pages_business/info/list" },
	{ title: "在途下单", icon: "&#xe64e;", color: "#cc3333", path: "/pages_business/other/orderInTransit" },
	{ title: "预约开票", ion: "ion-bag", color: "#cc3333", path: "/pages_business/ticket/applyTicket" },
	{ title: "开票申请查询", ion: "ion-email", color: "#cc3333", path: "/pages_business/ticket/applyTicketQuery" },
	{ title: "转盘抽奖", ion: "ion-help-buoy", color: "#cc3333", path: "/pages_business/lottery/lottery" },
	{ title: "抽奖记录", ion: "ion-ios-paper-outline", color: "#cc3333", path: "/pages_business/lottery/record" },
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
