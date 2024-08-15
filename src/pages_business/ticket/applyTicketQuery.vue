<!--
 * @Date: 2024-08-09 15:21:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 10:22:09
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<view class="px-3">
			<base-form
				:legend="[
					{ label: '单据日期', key: 'creationDate', type: 'dateRange', startDateKey: 'startDate', endDateKey: 'endDate' },
					{ label: '采购组织', key: 'orgId' , type: 'romoteSelect' , keys: { key: 'orgId' , value: 'orgName' } , api: api.baseOrgV6_findPaginationCompany},
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
			<base-list :url="api.mall_customerTickets_findPagination" :params="params" v-model="list" @onLoad="array => (list = array)">
				<template #default>
					<view class="p-3">
						<view v-for="(item, index) in list" :key="index" class="bg-white rounded-xl border-b border-solid p-3 mb-2">
							<view class="leading-6">申请号：{{ item.applyNumber }}</view>
							<view class="leading-6">申请时间：{{ item.applyDate }} </view>
							<view class="leading-6">开票组织：{{ item.billingOrgName }} </view>
							<view class="leading-6">取票方式：{{ item.receiveTypeName }}</view>
							<view class="leading-6">状态：{{ item.statusName }} </view>
							<view class="leading-6">操作时间：{{ item.lastUpdateDate }} </view>
							<view class="leading-6 flex justify-end">
								<uv-button type="primaty" :color="skin.primaryColor" size="small" @click="() => simpleNavigateTo('/pages_business/ticket/applyTicketQueryDetail', { id: item.id })">查看</uv-button>
							</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>
		<!-- <view class="p-2">
			<uv-button :color="skin.primaryColor" @click="() => btnApplyTicket()">预约开票</uv-button>
		</view> -->
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
		height: calc(100% - 174px);
	}
</style>
