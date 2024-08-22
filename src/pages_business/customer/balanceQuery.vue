<!--
 * @Date: 2024-08-21 16:06:28
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-21 16:25:53
 * @LastEditors: guojiecheng
-->
<template>
	<view class="px-3 bg-white">
		<base-form :legend="[{ key: 'customerName', label: '客户名称', type: 'slot' }]" v-model="params" ref="searchForm" :formProps="{ labelWidth: 80 }">
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
	<view class="bg-gray-100" style="height: calc(100% - 58px);">
		<base-list :url="api.ecCustomerBalance_findPagination" :params="params" ref="list" :pageRows="20">
			<template #default="{ list: listData }">
				<view class="px-3">
					<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in listData" :key="item.customerId">
						<view class="leading-6">
                            <view class="font-bold leading-6">{{ item.orgName }}</view>
                            <view>客户余额：{{ '￥' + item.balance }}</view>
                            <view>信用额度：{{ '￥' + item.credit }}</view>
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
