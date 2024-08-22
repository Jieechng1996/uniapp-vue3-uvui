<!--
 * @Date: 2
  components: { uvButton },
  components: { uvButton },
  components: { uvButton },024-08-16 16:16:36
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-21 15:31:14
 * @LastEditors: guojiecheng
-->
<template>
	<view class="p-2 h-full bg-gray-100">
			<view class="p-3 rounded-xl bg-white text-black">
				<view class="text-base font-bold mb-1">车辆认领信息</view>
				<view class="px-1">
					<base-form
						:disabled="disabled"
						:legend="[
							{ label: '订单号', key: 'deliveryNumber', type: 'text' },
							{ label: '结算时间', key: 'outTime', type: 'text' },
							{ label: '认领时间', key: 'claimTransDate', type: 'text' },
							{ label: '实发数量', key: 'attribute12', type: 'text' },
							{ label: '车牌号', key: 'plateNumber', type: 'text' },
							{ label: '提货组织', key: 'orgmeaning', type: 'text' },
							{ label: '开票组织', key: 'orgbilling', type: 'text' },
							{ label: '预发数量', key: 'packQuantity', type: 'text' },
							{
								label: '认领经理',
								key: 'attribute31',
								type: 'lov',
								api: api.ecpExCustomer_findNewListByPagination,
								params: { status: 'APPROVED' },
								searchKey: { key: 'customerName', placeholder: '请输入客户名称' },
								keys: { key: 'customerId', value: 'customerName' },
								required: true,
							},
							{
								label: '客户名称',
								key: 'customerId',
								type: 'lov',
								api: api.ecpExCustomer_findNewListByPagination,
								params: { status: 'APPROVED' },
								searchKey: { key: 'customerName', placeholder: '请输入客户名称' },
								keys: { key: 'customerId', value: 'customerName' },
								required: true,
							},
						]"
						v-model="form"
						ref="orderForm"
						:form-props="{ labelWidth: 110 }">
					</base-form>
				</view>
			</view>
			<view class="mt-3">
				<uv-button :color="skin.primaryColor"  @click="btnSubmit">认领</uv-button>
			</view>
		</view>
</template>
<script setup>
import { baseForm, baseDialog } from "@/components";
import { onLoad } from "@dcloudio/uni-app";
import { computed, inject, ref, toRaw } from "vue";
import api from "@/config/api";
import fetch from "@/config/fetch";
import { confirm } from "@/common/message";
import { toast, alert } from "../../common/message";
const skin = inject("skin");
const orderForm = ref();
const formData = ref({});
const salesContractNo = ref();
const ruleId = ref();
const lineData = ref([]);
const productCode = ref();
const productCodeIndex = ref(-1);
const disabled = computed(() => formData.value.status === "APPROVAL");
onLoad(async options => {
	uni.setNavigationBarTitle({ title: !options.id ? "车辆认领" : "订单详情" });
	if (!options.id) {
		formData.value = {
			status: "MAKING",
			statusText: "制作中",
			businessType: "ORDINARY_ORDER",
			businessTypeText: "零散订单",
			voucherSource: "ECMOBOFFICE",
			voucherSourceText: "移动办公",
			...options,
		};
	} else {
		await getDetail(orderHeaderId);
		await getLineData();
	}
});
const contractChange = value => {
	formData.value.contractHeaderId = value.contractHeaderId;
	formData.value.salesContractNo = value.salesContractNo;
	//关闭弹窗
	//给销售组织  提货组织赋值
	formData.value.ruleId = value.ruleId;
	formData.value.companyId = value.companyId;
	formData.value.factoryId = value.factoryId;
	formData.value.invId = value.invId;
	formData.value.ruleIdText = value.ruleIdText;
	formData.value.companyIdText = value.companyIdText;
	formData.value.factoryIdText = value.factoryIdText;
	formData.value.invIdText = value.invIdText;

	//给业务员赋值 空值则不重新赋值
	if (!!value.salesId) {
		formData.value.salesId = value.salesId;
		formData.value.salesIdText = value.salesIdText;
	}

	//给客户赋值
	formData.value.customerId = value.customerId;
	formData.value.customerCode = value.customerCode;
	formData.value.customerName = value.customerCodeText;
	formData.value.customerCodeText = value.customerCodeText;

	formData.value.deliveryMode = value.deliveryMethod;
};

const lineDataRef = ref([]);

const btnSaveLine = async index => {
	await lineDataRef.value[index].validate().catch(err => {
		console.log(err);
		toast(err[0].message);
		return Promise.reject(err);
	});

	let { msg } = await fetch.ecOrderLine_saveOrUpdateOrderLineList({
		lan: "CN",
		lineList: [toRaw(lineData.value[index])],
	});

	toast(msg);

	setTimeout(() => {
		getLineData();
	}, 1500);
};

const btnDelLine = item => {
	confirm("确定删除该行数据？", async () => {
		if (item.contractLineId) {
			let { msg } = await fetch.ecOrderLine_delOrderLineList({
				lineList: [item],
			});
			toast(msg);
			setTimeout(() => {
				getLineData();
			}, 1500);
		} else {
			lineData.value.splice(index, 1);
		}
	});
};

const btnSave = async () => {
	let { data, msg } = await fetch.ecOrderHeader_saveOrUpdateOrderHeader({
		...formData.value,
	});

	alert(msg);

	setTimeout(async () => {
		await getDetail(data?.orderHeaderId);
		await getLineData();
	}, 1500);
};

const btnSubmit = async () => {
	let flowKey = "DD-TEST";
	let orgId = 261; //可根据实际的组织进行动态获取

	let flow = {
		saveonly: false,
		auditStatus: "APPROVAL",
		processDefinitionKey: flowKey + "." + orgId,
		businessKey: options.id || options.orderId || null,
		orgId: orgId, // OU组织
		menuId: "101440919", // 菜单id
		taskId: null, // 代办传入流程Id
	};

	let { msg } = await fetch.ecOrderHeader_submitOrderHeader({
		...formData.data,
		...flow,
	});
	alert(msg);

	setTimeout(async () => {
		await getDetail(data?.orderHeaderId);
		await getLineData();
	}, 1500);
};

const getLineData = async () => {
	let { data } = await fetch.ecOrderLine_findPagination({
		orderHeaderId: formData.value.orderHeaderId,
		pageRows: 1000,
		pageIndex: 1,
	});
	lineData.value = data;
};
const getDetail = async orderHeaderId => {
	let { data } = await fetch.ecOrderHeader_findVoById({
		orderHeaderId,
	});
	formData.value = data;
};
</script>
<style lang="scss" scoped></style>
