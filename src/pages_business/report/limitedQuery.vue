<!--
 * @Date: 2024-08-21 16:06:28
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 15:57:25
 * @LastEditors: guojiecheng
-->
<template>
	<view class="px-3 bg-white">
		<base-form
			:legend="[
				{key: 'customerName', label: '客户名称',  type: 'lov', api: api.ecpExCustomer_findNewListByPagination, params: { status: 'APPROVED' }, searchKey: { key: 'customerName', placeholder: '请输入客户名称' }, keys: { key: 'customerId', value: 'customerName' }, required: true },
				{ key: 'searchTime', label: '产品名称', type: 'lov', api: api.ecContractLine_ecinFindProByContract, params: { enableFlag: 'Y', customerId: params.customerId }, keys: { key: 'productCode', value: 'productName' }, required: true },
				{ key: 'businessType', label: '订单类型', type: 'lookup', lookupType: 'EC_ORDER_TYPE', systemCode: 'BASE', required: true },
				{ key: 'productQuantity', label: '产品数量', props: { type: 'number' }, required: true },
				{ key: 'productCode', label: '是否销售协议', type: 'switch' },
			]"
			v-model="params"
			ref="searchForm"
			:formProps="{ labelWidth: 80 }">
		</base-form>
		<view class="mt-3">
			<uv-button :color="skin.primaryColor" @click="btnSearch">搜索</uv-button>
		</view>
	</view>
</template>
<script setup>
import { computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import { toast, alert, confirm } from "@/common/message";
import api from "../../config/api";
import fetch from "@/config/fetch";
const skin = inject("skin");
const params = ref({
	searchTime: ''
});

const customerName = ref();

const searchForm = ref()

const btnSearch	= async () => {
	 await searchForm.value.validate().catch( err => toast(err[0].message) && Promise.reject( err) )
};
</script>
<style lang="scss" scoped></style>
