<!--
 * @Date: 2024-07-04 10:31:06
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 17:02:25
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p overflow-auto">
		<uv-swiper :list="list" indicator indicatorMode="line" circular height="180" interval="5000"></uv-swiper>
		<view class="p-1 mb-3">
			<uv-grid :col="5">
				<uv-grid-item v-for="(item, index) in baseList" :key="index" @click="btnGoProduct(item)">
					<uv-image :src="item.img" width="66" height="66"></uv-image>
					<text class="text-sm" style="color: #666;">{{ item.middleCategoryName }}</text>
				</uv-grid-item>
			</uv-grid>
		</view>
		<uv-image
			src="http://fhshmall.com/message_images/SourceFigure/3479e68e073de5a1c1de0bc505c7dba4_20210323095514.jpg"
			width="100%" height="60" mode="scaleToFill"></uv-image>
		<view class="flex-warp py-5 px-1 btn-box">
			<uv-button type="primary" color="#666" size="mini" plain :custom-style="customStyle"
				v-for="(item, index) in btnList" :key="index" @click="btnGo(item.path)">
				<uv-image :src="item.image" width="12" height="12" v-if="item.image" />
				<text :class="item.icon" style="color: #cc3333;" v-if="item.icon"></text>
				<text class="text-xs" style="padding-left: 2px;">{{ item.text }}</text>
			</uv-button>
		</view>
		<product-warp title="油品产品" class="mb-3" :tabs="[
			{ name: '华联' },
			{ name: '联合' },
			{ name: '威联' },
			{ name: '富海化学' },
			{ name: '海旺' },
			{ name: '富地' }
		]" @click="btnJoinCart"></product-warp>
		<product-warp title="化工品产品" :tabs="[
			{ name: '华联' },
			{ name: '联合' },
			{ name: '威联' },
			{ name: '富海化学' },
			{ name: '海旺' }
		]" @click="btnJoinCart"></product-warp>
		<product-warp title="气体产品" :tabs="[
			{ name: '华联' },
			{ name: '联合' },
			{ name: '威联' },
			{ name: '富海化学' },
			{ name: '海旺' }
		]" @click="btnJoinCart"></product-warp>

	</view>
</template>



<script setup>
import { computed, onMounted, ref } from "vue";
import { chaiyou, huagong, liqing, oil, qiti, qiyou, ranliaoyou, shengchang, shiyoujiao, headerPosIconEx, headerPosIconCar } from './img/index'
import { onLoad, onShow } from "@dcloudio/uni-app";
import fetch from '../../config/fetch'
import productWarp from "./comp/product-warp.vue";
import { toast } from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
import store from "../../store";

const userInfo = computed(() => store.state.userInfo)

const list = ref([])

const middleCategoryNameMap = {
	'汽油': qiyou,
	'柴油': chaiyou,
	'化工原料': huagong,
	'气体': qiti,
	'燃料油': ranliaoyou,
	'原油': shengchang,
	'沥青': liqing,
	'石油焦': shiyoujiao,
	'生产原料': oil,
	'溶剂油': oil,
	'其他类': shengchang
}

const baseList = ref([])

const btnList = ref([
	{ image: headerPosIconEx, text: '我的协议', path: '/pages_business/protocol/list' },
	{ icon: 'ion-ios-pricetag', text: '所有订单', path: '/pages_business/order/list' },
	{ icon: 'ion-disc', text: '交易记录', path: '/pages_business/other/account' },
	{ image: headerPosIconCar, text: '我的车辆', path: '/pages_business/car/list' },
	{ image: headerPosIconEx, text: '协议制作', path: '/pages_business/protocol/products'},
])

const btnGoProduct = (item) => {
	simpleNavigateTo('/pages_business/product/list', { title: item.middleCategoryName })
}

const btnGo = (path) => {
	path ? simpleNavigateTo(path) : toast('暂未开发')
}

const btnJoinCart = async ({ productId }) => {
	let { msg } = await fetch.ecpExShoppingCart_save({
		productId,
		userId: userInfo.value.userId,
	})
	toast(msg)
}

const customStyle = ref({
	paddingLeft: '5px',
	paddingRight: '5px'
})

onLoad(async () => {
	// #ifdef APP
	uni.createPushMessage({
		title: '这是标题',
		content: '这是内容'
	})
	uni.createPushMessage({
		title: '这是标题2',
		content: '这是内容2'
	})
	plus.runtime.setBadgeNumber(5)
	// #endif



})

onMounted(async () => {
	let { data: pics } = await fetch.ecpExAdPictures_findPagination({})
	list.value = pics.map(item => item.pictureUrl)
	let { data } = await fetch.categoryNumberService_getProductMiddleCategory({})
	baseList.value = data.map(item => {
		item.img = middleCategoryNameMap[item.middleCategoryName] || shengchang
		return item
	})

})

</script>

<style lang="scss" scoped>
.btn-box {
	justify-content: space-between;
}
</style>
