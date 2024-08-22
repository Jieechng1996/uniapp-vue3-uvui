<!--
 * @Date: 2024-08-21 16:06:28
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-21 17:18:33
 * @LastEditors: guojiecheng
-->
<template>
	<view class="px-3 bg-white">
		<base-form :legend="[
			{ key: 'customerName', label: '客户名称', type: 'slot' },
			{ key: 'searchTime', label: '结算日期', type: 'date' },
			]" v-model="params" ref="searchForm" :formProps="{ labelWidth: 80 }">
			<template #customerName>
				<view class="flex items-center">
					<view class="flex-1 ">
						<uv-input  v-model="params.customerName" placeholder="请选择" clearable border="surround" suffixIcon="search" @click="() => customerName.showModal()"></uv-input>
						<base-dialog
							:search-key="{ key: 'customerName', placeholder: '请输入客户名称' }"
							ref="customerName"
							:api="api.ecpExCustomer_findNewListByPagination"
							:keys="{ key: 'customerId', value: 'customerName' }"
							:params="{ status: 'APPROVED' }"
							@callback="
								value => {
									params.customerId = value.customerId;
									params.customerName = value.customerName;
								}
							">
						</base-dialog>
					</view>
					<view><uv-button type="primary" size="small" @click="() => list.refresherList()" class="ml-2">搜索</uv-button></view>
				</view>
			</template>
		</base-form>
	</view>
	<view class="bg-gray-100" style="height: calc(100% - 116px);">
		<base-list :url="api.ecpExCustomer_findPaginationNoCompanyControl" :params="params" ref="list" :pageRows="20">
			<template #default="{ list: listData }">
				<view class="px-3">
					<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in listData" :key="item.customerId">
						<view class="leading-6">
                            <view>经营组织：{{ item.billingOrg }}</view>
                            <view>产品名称：{{ item.productName }}</view>
							<view>车号：{{ item.plateNumber }}</view>
							<view>实发吨数：{{ item.attribute12 }}</view>
							<view>执行价：{{ item.executionPrice }}</view>
							<view>结算日期：{{ item.outTime }}</view>
						</view>

					</view>
				</view>
			</template>
		</base-list>
	</view>
</template>
<script setup>
import { computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import { toast, alert, confirm } from "@/common/message";
import api from "../../config/api";
import fetch from "@/config/fetch";

const params = ref({});

const customerName = ref()
</script>
<style lang="scss" scoped></style>
