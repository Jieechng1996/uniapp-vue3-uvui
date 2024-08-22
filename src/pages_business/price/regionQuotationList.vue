<!--
 * @Date: 2024-08-20 16:05:39
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-20 17:53:54
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h-full">
		<uv-navbar title="区域报价" :fixed="false" @leftClick="leftClick" :bgColor="skin.primaryColor" leftIconColor="#fff" rightIcon="plus-circle" @rightClick="() => simpleNavigateTo('/pages_business/price/regionQuotationDetail')">
			<template v-slot:right>
				<uv-icon size="20" name="plus-circle" color="#fff"></uv-icon>
			</template>
		</uv-navbar>
		<view class="px-2">
			<base-form :legend="[{ key: 'customerName', label: '客户名称', type: 'slot' }]" v-model="params" ref="searchForm" :formProps="{ labelWidth: 120 }">
				<template #customerName>
					<view class="flex">
						<uv-input v-model="params.searchTime" placeholder="请选择" readonly clearable border="none" suffixIcon="arrow-down"></uv-input>
						<uv-calendars
							ref="range"
							mode="range"
							@confirm="
								({ range }) => {
									params.searchTime = range.before + ' ~ ' + range.after;
									params.searchStartTime = range.before;
									params.searchEndTime = range.after;
								}
							"></uv-calendars>
						<uv-button type="primary" size="small" @click="() => list.refreshList()" class="ml-2">搜索</uv-button>
					</view>
				</template>
			</base-form>
		</view>
		<view class="bg-gray-100" style="height: calc(100% - 48px - 44px)">
			<base-list :url="api.ecpInProductPriceH_findPagination" ref="list">
				<template #default="{ list: dataList }">
					<view class="px-3">
						<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in dataList" :key="item.transNumber">
							<view>
								<view class="leading-6">业务员：{{ item.saleIdText }}</view>
								<view class="leading-6">报价状态：{{ item.statusText }}</view>
								<view class="leading-6">报价区域：{{ item.salesmanArea }}</view>
								<view class="leading-6">提交时间：{{ item.commitDate }}</view>
								<view class="mt-2">
									<view class="border border-slate-400">
										<view class="border-b border-slate-400">
											<view class="flex text-center">
												<view class="w-1/4 border-r border-slate-400 p-1">产品名称</view>
												<view class="w-1/4 border-r border-slate-400 p-1">主营挂牌价</view>
												<view class="w-1/4 border-r border-slate-400 p-1">主营成交价</view>
												<view class="w-1/4 p-1">建议挂牌价</view>
											</view>
										</view>
										<view v-for="(line, subscript) in item.list" :key="subscript">
											<view class="flex text-center border-b border-slate-400 text-xs text-gray-700" :class="subscript === item?.list?.length - 1 ? 'border-b-0' : ''">
												<view class="w-1/4 p-1 border-r border-slate-400">{{ line.productIdText }}</view>
												<view class="w-1/4 p-1 border-r border-slate-400">{{ line.mainPrice }}</view>
												<view class="w-1/4 p-1 border-r border-slate-400">{{ line.bargainPrice }}</view>
												<view class="w-1/4 p-1">{{ line.sugestPrice }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>
	</view>
</template>
<script setup>
import { baseList, baseForm } from "@/components";
import { computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import api from "@/config/api";
import { simpleNavigateTo } from "@/common/util";
const skin = inject("skin");
const params = ref({});
const leftClick = () => {
    uni.navigateBack()
}
</script>
<style lang="scss" scoped>
:deep(.uv-navbar__content__title){
    color: #fff;
}
:deep(.uv-icon__icon){
    color: #fff;
}

</style>
