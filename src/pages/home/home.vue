<!--
 * @Date: 2024-07-04 10:31:06
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 16:25:32
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p overflow-auto">
		<view class="header flex p-6 items-center" style="background-color: #225ca0;">
			<uv-image :src="userPic" width="80px" height="80px" class="mr-6"></uv-image>
			<view class="text-white">
				<view class="text-sm">账号：{{ userInfo.userName }}</view>
				<view class="text-sm mt-2">客户名称：{{ userInfo.customerName }}</view>
				<view class="text-sm mt-2">手机：{{ userInfo.mobilePhone }}</view>
			</view>
		</view>
		<view>
			<uv-grid :border="true" :col="4">
				<uv-grid-item v-for="(item, index) in baseList" :key="index" class="py-6" @click="() => btnGo(item.path)">
					<text :class="['text-2xl', 'iconfont', item['icon']]" :style="{ color: item.color }" v-if="item['icon']"></text>
					<text :class="['text-2xl', item['ion']]" :style="{ color: item.color }" v-if="item['ion']"></text>
					<text class="grid-text">{{ item.title }}</text>
				</uv-grid-item>
			</uv-grid>
		</view>
	</view>
</template>

<script setup>
import userPic from "../img/userPic.png";
import store from "../../store";
import { computed, ref } from "vue";
import { simpleNavigateTo } from "@/common/util";
import { toast } from "@/common/message";

const userInfo = computed(() => store.state.userInfo);

const baseList = ref([
	{ title: "出差打卡", icon: "icon-waiqin", color: "#c63030", path: "/pages_business/attendance/list" },
	{ title: "订单制作", icon: "icon-2", color: "#96c209", path: "/pages_business/order/detail" },
	{ title: "协议制作", icon: "icon-huiyuanxieyi", color: "#bc0700", path: '/pages_business/contract/list' },
	{ title: "订单查询", icon: "icon-chaxun", color: "#ce9f0b" ,path: '/pages_business/order/list'},
	{ title: "协议审批", icon: "icon-tongyixieyi", color: "#bc0700", path : '/pages_business/contract/approvalList' },
	{ title: "价格审批", ion: "ion-social-yen", color: "#ce9f0b" , path: '/pages_business/price/priceApproval'},
	{ title: "区域报价", icon: "icon-baojia", color: "#ce9f0b", path: '/pages_business/price/regionQuotationList' },
	{ title: "车辆认领", icon: "icon-icon", color: "#c81623", path: '/pages_business/car/carClaimList' },
	{ title: "客户余额", icon: "icon-shenpi5", color: "#bd2c00" , path: '/pages_business/customer/balanceQuery'},
	{ title: "客户查询", icon: "icon-kehu-copy", color: "#bd2c00" , path: '/pages_business/customer/memberQuery' },
	{ title: "发货明细", icon: "icon-chaxun", color: "#bd2c00" , path: '/pages_business/report/deliveryDetailsQuery'},
	{ title: "限量查询", icon: "icon-chaxun", color: "#bd2c00" , path: '/pages_business/report/limitedQuery' },
	{ title: "协议查询", icon: "icon-chaxun", color: "#bd2c00" , path: '/pages_business/report/contractQuery'},
	{ title: "开票查询", icon: "icon-chaxun", color: "#bd2c00" , path: '/pages_business/report/invoiceQuery'},
	{ title: "单独放量", icon: "icon-chaxun", color: "#bd2c00" , path: '/pages_business/individualVolumeIncrease/list'},
]);
const btnGo = path => {
	path ? simpleNavigateTo(path) : toast("暂未开发");
};
</script>
<style scoped>
.header {
	background: #225ca0;
}
</style>
