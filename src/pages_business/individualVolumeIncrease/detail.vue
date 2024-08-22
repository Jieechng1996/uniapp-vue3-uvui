<!--
 * @Date: 2
  components: { uvButton },
  components: { uvButton },
  components: { uvButton },024-08-16 16:16:36
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-22 15:57:42
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<view class="px-3">
			<base-form
				:legend="[
					{ key: 'orgId', label: '销售组织', type: 'lov', api: api.baseOrgV6_findPaginationCompany, params: { enterpriseStatus: 'APPROVED' }, searchKey: { key: 'orgId', placeholder: '请输入销售组织' }, keys: { key: 'orgId', value: 'orgName' }, required: true },
					{key: 'customerName', label: '客户名称',  type: 'lov', api: api.ecpExCustomer_findNewListByPagination, params: { status: 'APPROVED' }, searchKey: { key: 'customerName', placeholder: '请输入客户名称' }, keys: { key: 'customerId', value: 'customerName' }, required: true },
					{ key: 'searchTime', label: '产品名称', type: 'lov', api: api.ecContractLine_ecinFindProByContract, params: { enableFlag: 'Y', customerId: formData.customerId }, keys: { key: 'productCode', value: 'productName' }, required: true },
					{ key: 'YZ', label: 'YZ标识', type: 'switch' },
				]"
				v-model="formData"
				ref="orderForm"
				:form-props="{ labelWidth: 110 }">
			</base-form>
		</view>
		<view class=" py-2 px-3">
			<uv-button :color="skin.primaryColor"  @click="btnSave">保存</uv-button>
		</view>
	</view>
</template>
<script setup>
import { baseForm, baseDialog, baseApprovalBtns } from "@/components";
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

const showApprovel = ref(false);
onLoad(async options => {});
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

	let { msg } = await fetch.ecContractLine_saveOrUpdateLine({
		lan: "CN",
		...formData.value,
		contractLineBoList: lineData.value,
	});

	toast(msg);

	setTimeout(async () => {
		await getDetail(formData.value.orderHeaderId);
		await getLineData();
	}, 1500);
};

const btnDelLine = item => {
	confirm("确定删除该行数据？", async () => {
		if (item.contractLineId) {
			let { msg } = await fetch.ecContractHeader_deleteLine({
				...formData.value,
				contractLineBoList: [item],
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
	let { data, msg } = await fetch.ecContractHeader_findVoById({
		...formData.value,
	});

	alert(msg);

	setTimeout(() => {
		getDetail(data.orderHeaderId);
		getLineData();
	}, 1500);
};

const getLineData = async () => {
	let { data } = await fetch.ecContractLine_findPagination({
		orderHeaderId: formData.value.orderHeaderId,
		pageRows: 1000,
		pageIndex: 1,
	});
	lineData.value = data;
};
const getDetail = async orderHeaderId => {
	let { data } = await fetch.ecContractHeader_findVoById({
		orderHeaderId,
	});
	formData.value = data;
};

const btnSubmit = async () => {
	let flowKey = "HT-TEST";
	let orgId = 261; //可根据实际的组织进行动态获取
	let { msg } = await fetch.ecContractHeader_submitContractHeader({
		...{
			saveonly: false,
			auditStatus: "APPROVAL",
			processDefinitionKey: flowKey + "." + orgId,
			businessKey: formData.value.orderHeaderId,
			orgId: orgId, // OU组织
			menuId: "101440985", // 菜单id
			taskId: null, // 代办传入流程Id
		},
		...formData.value,
	});
	toast(msg);
	setTimeout(() => {
		uni.navigateBack();
	}, 1500);
};
</script>
<style lang="scss" scoped>
.list {
	height: calc(100% - 48px);
}
</style>
