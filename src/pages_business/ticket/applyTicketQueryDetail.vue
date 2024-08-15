<!--
 * @Date: 2024-08-09 15:21:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 10:36:24
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<scroll-view scroll-y style="height: calc(100% - 48px)">
			<view class="bg-gray-100 p-3 overflow-auto h100p">
				<view class="p-3 rounded-xl bg-white leading-6">
					<view>1、发票申请额度华联、联合、威联为千万版，海旺、富海化学为百万版；</view>
					<view>2、每条数据最多可申请开具3张发票，最小开具数量为5吨；</view>
					<view>3、请注意备注开票要求，无备注视为无要求。</view>
				</view>

				<view class="p-3 box bg-white text-black mt-3">
					<view class="text-base font-bold">开票申请明细</view>
					<base-form
						:legend="[
							{ label: '开票组织：', key: 'billingOrgName', type: 'text' },
							{ label: '申请号：', key: 'applyNumber', type: 'text' },
							{ label: '申请时间：', key: 'applyDate', type: 'text' },
							{ label: '状态：', key: 'statusName', type: 'text' },
							{ label: '开票组织：', key: 'customerName', type: 'text' },
							{ label: '是否打印备注：', key: 'isPrintDes', type: 'text' },
							{ label: '驳回理由：', key: 'isPrintDes', type: 'text', showFunc: () => formData.status == 'REJECT' },
						]"
						v-model="formData"
						:form-props="{ labelWidth: 120 }">
					</base-form>
				</view>

				<view class="p-3 box bg-white text-black mt-3">
					<view class="text-base font-bold">取票人信息</view>
					<view class="px-1">
						<base-form
							:legend="[
								{ label: '取票方式', key: 'receiveTypeText', type: 'text' },
								{ label: '自取人姓名', key: 'customerName', type: 'text', showFunc: () => formData.receiveType == 'SELF' },
								{ label: '收件人姓名', key: 'customerName', type: 'text', showFunc: () => formData.receiveType == 'MAIL' },
								{ label: '身份证号', key: 'idCardNumber', type: 'text', props: { type: 'idCard' } },
								{ label: '手机号', key: 'phoneNumber', type: 'text', props: { type: 'number' } },
								{ label: '备注', key: 'remarks', type: 'text' },
								{ label: '邮寄地址', key: 'address', type: 'text', showFunc: () => formData.receiveType == 'MAIL' },
							]"
							v-model="formData"
							ref="form"
							:form-props="{ labelWidth: 110 }">
						</base-form>
					</view>
				</view>

				<view class="p-3 box bg-white text-black mt-3">
					<view class="text-base font-bold">开票产品详情</view>
					<view class="px-1">
						<base-form
							:legend="[
								{ label: '开票名称：', key: 'ticketsName', type: 'text' },
								{ label: '产品名称：', key: 'productName', type: 'text' },
								{ label: '数量：', key: 'deliveryAmount', type: 'text' },
								{ label: '单位：', key: 'uomCodeName', type: 'text' },
								{ label: '单价(含税)(￥)：', key: 'executionPrice', type: 'text', },
								{ label: '税率：', key: 'totalPrice', type: 'text', },
								{ label: '金额(含税)(￥)：', key: 'taxRate', type: 'text', },
								{ label: '税额(￥)：', key: 'taxTotal', type: 'text', },
								{ label: '单据日期：', key: 'deliveryDate', type: 'text', },
								{ label: '单据编号：', key: 'deliveryNumber', type: 'text', },
							]"
							v-model="formData"
							ref="form"
							:form-props="{ labelWidth: 120 }">
						</base-form>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- <view class="flex justify-end p-2 bg-white">
			<uv-button type="primaty" plain size="small" :color="skin.primaryColor" @click="btnSubmit">提交</uv-button>
		</view> -->
	</view>
</template>
<script setup>
	import { baseForm, baseList } from "@/components";
	import { ref, inject } from "vue";
	import api from "@/config/api";
	import { toast } from "../../common/message";
	const skin = inject("skin");
	// const ticketData = ref({
	// 	remark: "",
	// });
	const formData = ref({
		receiveType: "",
	});

	const getDetail = async headerId => {
		const { data } = await fetch.mall_customerTickets_findByHeaderId({ headerId });
		formData.value = data;
	};

	const ticketform = ref();

	const form = ref();

	
</script>
<style lang="scss" scope>
	
	.baseList {
		height: calc(100% - 174px - 58px);
	}
</style>
