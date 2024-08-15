<!--
 * @Date: 2024-08-09 15:21:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 10:07:46
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
					<view>4、发票领取方式目前暂时只提供自取方式。</view>
				</view>

				<view class="p-3 box bg-white text-black mt-3">
					<view class="text-base font-bold">提货信息</view>
					<base-form
						:legend="[
							{ type: 'textarea', key: 'remark', placeholder: '必填! 请输入开具方式、开票吨数、开票张数', required: true, formItemProps: { required: false } },
							{ label: '是否打印备注', key: 'isPrintDes', type: 'switch', trueValue: 'Y', falseValue: 'N' },
							{ label: '已选开票吨数(吨)', key: 'isPrintDes', type: 'text' },
						]"
						v-model="ticketData"
						ref="ticketform"
						:form-props="{ labelWidth: 120 }">
					</base-form>
					<!-- 缺一段意义不明的开票吨数代码 -->
				</view>

				<view class="p-3 box bg-white text-black mt-3">
					<view class="text-base font-bold">提货信息</view>
					<view class="px-1">
						<base-form
							:legend="[
								{
									label: '取票方式',
									key: 'receiveType',
									type: 'radio',
									required: true,
									options: [
										{ key: 'SELF', value: '自取' },
										{ key: 'MAIL', value: '邮寄' },
									],
								},
								{ label: '自取人姓名', key: 'customerName', required: true, showFunc: () => formData.receiveType == 'SELF' },
								{ label: '收件人姓名', key: 'customerName', required: true, showFunc: () => formData.receiveType == 'MAIL' },
								{ label: '身份证号', key: 'idCardNumber', required: true, props: { type: 'idCard' } },
								{ label: '手机号', key: 'phoneNumber', type: 'phone', required: true, props: { type: 'number' } },
								{ label: '备注', key: 'remarks' },
								{ label: '邮寄地址', key: 'address', required: true, showFunc: () => formData.receiveType == 'MAIL' },
							]"
							v-model="formData"
							ref="form"
							:form-props="{ labelWidth: 110 }">
						</base-form>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="flex justify-end p-2 bg-white">
			<uv-button type="primaty" plain size="small" :color="skin.primaryColor" @click="btnSubmit">提交</uv-button>
		</view>
	</view>
</template>
<script setup>
	import { baseForm, baseList } from "@/components";
	import { ref, inject } from "vue";
	import api from "@/config/api";
	import { toast } from "../../common/message";
	const skin = inject("skin");
	const ticketData = ref({
		remark: "",
	});
	const formData = ref({
		receiveType: "",
	});

	const ticketform = ref();

	const form = ref();

	const btnSubmit = async () => {
		await ticketform.value.validate().catch(err => {
			toast(err[0].message);
			return Promise.reject(err);
		});
		await form.value.validate().catch(err => {
			toast(err[0].message);
			return Promise.reject(err);
		});

		await fetch.mall_customerTickets_save({
			listEcpCustomerTicketsDetailBo: arr,
		});

		toast("提交成功");

		setTimeout(() => {
			uni.redirectTo({
				url: "/pages_business/ticket/applyTicket",
			});
		}, 1500);
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
