<!--
 * @Date: 2024-08-21 16:06:28
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 15:54:57
 * @LastEditors: guojiecheng
-->
<template>
	<uv-navbar title="单独放量" :fixed="false" @leftClick="leftClick" :bgColor="skin.primaryColor" leftIconColor="#fff" rightIcon="plus-circle" @rightClick="() => simpleNavigateTo('/pages_business/individualVolumeIncrease/detail')">
		<template v-slot:right>
			<uv-icon size="20" name="plus-circle" color="#fff"></uv-icon>
		</template>
	</uv-navbar>
	<view class="px-3 bg-white">
		<base-form
			:legend="[
				{ key: 'orgId', label: '销售组织', type: 'lov', api: api.baseOrgV6_findPaginationCompany, params: { enterpriseStatus: 'APPROVED' }, searchKey: { key: 'orgId', placeholder: '请输入销售组织' }, keys: { key: 'orgId', value: 'orgName' }, required: true },
				{ key: 'productName', label: '产品简称' },
				{ key: 'YZ', label: 'YZ标识', type: 'switch' },
				{ key: 'customerName', label: '客户名称', type: 'slot' },
			]"
			v-model="params"
			ref="searchForm"
			:formProps="{ labelWidth: 80 }">
			<template #customerName>
				<view class="flex items-center">
					<view class="flex-1">
						<uv-input v-model="params.customerName" placeholder="请选择" clearable border="surround"></uv-input>
					</view>
					<view><uv-button type="primary" size="small" @click="() => list.refresherList()" class="ml-2">搜索</uv-button></view>
				</view>
			</template>
		</base-form>
	</view>
	<view class="bg-gray-100" style="height: calc(100% - 174px - 44px)">
		<base-list :url="api.ecpInvoiceApply_findPagination" :params="params" ref="list" :pageRows="20">
			<template #default="{ list: listData }">
				<view class="px-3">
					<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in listData" :key="item.customerId">
						<view class="leading-6">
							<view>销售组织：{{ item.companyIdText }}</view>
							<view>客户名称：{{ item.customerName }}</view>
							<view>产品简称：{{ item.productName }}</view>
							<view>YZ标识：{{ item.invoicingTax }}</view>
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
import { simpleNavigateTo } from "@/common/util";
const skin = inject("skin");
const leftClick = () => uni.navigateBack()

const params = ref({});

const customerName = ref();
</script>
<style lang="scss" scoped>
:deep(.uv-navbar__content__title){
    color: #fff;
}
:deep(.uv-icon__icon){
    color: #fff;
}

</style>
