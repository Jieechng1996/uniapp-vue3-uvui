<!--
 * @Date: 2024-08-09 15:21:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-09 17:35:11
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<view class="px-3">
			<base-form
				:legend="[
					{ label: '单据日期', key: 'creationDate', type: 'dateRange', startDateKey: 'startDate', endDateKey: 'endDate' },
					{ label: '采购组织', key: 'orgId' },
					{ label: '油品名称', key: 'productName', type: 'slot' },
				]"
				v-model="params"
				ref="companyForm"
				:form-props="{ labelWidth: 110 }">
				<template #productName>
					<view class="flex items-center">
						<uv-input v-model="params.productName" placeholder="请选择" clearable></uv-input>
						<uv-button type="primary" size="small" @click="() => refresh()" class="ml-2">搜索</uv-button>
					</view>
				</template>
			</base-form>
		</view>
		<view class="bg-gray-100 baseList">
			<base-list :url="api.tickets_deliveryFromErp_findPagination" :params="params" v-model="list" @onLoad="array => (list = array)">
				<template #default>
					<view class="p-3">
						<view v-for="(item, index) in list" :key="index" class="bg-white rounded-xl border-b border-solid p-3 mb-2" @click="item.checked = !item.checked">
							<view class="leading-6 flex justify-between items-center">
								<view>油品名称：{{ item.productName }}</view>
								<view>
									<checkbox :checked="item.checked" disabled />
								</view>
							</view>
							<view class="leading-6">数量：{{ item.amount }}</view>
							<view class="leading-6">单价(含税)：{{ item.executionPrice + "￥" }} </view>
							<view class="leading-6">金额(含税)/吨：{{ item.totalPrice + "￥" }} </view>
							<view class="leading-6">税率：{{ item.taxRate }}</view>
							<view class="leading-6">税额：{{ item.taxTotal + "￥" }} </view>
							<view class="leading-6">已开金额：{{ item.appliedAmount + "￥" }} </view>
							<view class="leading-6">单据日期：{{ item.deliveryNumber }}</view>
							<view class="leading-6">状态：{{ item.deliveryStatus }}</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>
		<view class="p-2">
			<uv-button :color="skin.primaryColor" @click="() => btnApplyTicket()">预约开票</uv-button>
		</view>
	</view>
</template>
<script setup>
	import { baseForm, baseList } from "@/components";
	import { ref, inject } from "vue";
	import api from "@/config/api";
	import fetch from "@/config/fetch";
	import { toast } from "../../common/message";
	import { simpleNavigateTo } from "../../common/util";
	const skin = inject("skin");
	const params = ref();
	const list = ref([]);
	const btnApplyTicket = async () => {
		let arr = list.value.filter(item => item.checked);
		if (arr.length === 0) {
			toast("请勾选至少一条数据");
		}
		await fetch.mall_customerTickets_check({
			listEcpCustomerTicketsDetailBo: arr,
		});
		simpleNavigateTo("/pages_business/ticket/applyTicketDetail");
	};
</script>
<style lang="scss" scope>
	:deep(.uni-checkbox-input-disabled) {
		background: #fff !important;

		svg path {
			color: #007aff;
			fill: #007aff;
		}
	}
	.baseList {
		height: calc(100% - 174px - 58px);
	}
</style>
