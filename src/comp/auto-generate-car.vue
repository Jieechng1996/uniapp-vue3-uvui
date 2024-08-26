<template>
	<uv-popup ref="popup" background-color="#fff" mode="right">
		<view class="popup-content">
			<view style="padding: 10px; text-align: center">自动识别</view>
			<view style="height: calc(100vh - 133px)">
				<textarea style="width: 100%; height: 100%; padding: 10px" maxlength="-1" placeholder="请输入文本" v-model="textarea"></textarea>
			</view>
			<view class="btnWarp flex">
				<view class="flex-1">
					<uv-button @click="hideModal()" size="small" class="btn" style="margin-right: 10px"> 取消</uv-button>
				</view>
				<view class="flex-1">
					<uv-button @click="confirm" size="small" type="primary" class="btn"> 确认</uv-button>
				</view>
			</view>
		</view>
	</uv-popup>
</template>
<script setup>
import { onMounted } from "vue";
import { ref } from "vue";

const textarea = ref("");

const popup = ref();

const emit = defineEmits(["btnConfirm", "update:modelValue"]);

const confirm = () => {
	let newStr = textarea.value.replace(/[^a-zA-Z_0-9\n\u4e00-\u9fa5·.]/g, "");
	let array = newStr.split(/[\n]{2,}/g);

	let result = array.map(item => {
		item += "\n";
		return {
			driverName: item.match(/(?:司机|司机名|司机名称)(\S*)\n/)?.[1],
			plateNumber: item.match(/(?:车牌号码|车牌号|车牌)(\S*)\n/)?.[1],
			idCardNumber: item.match(/(?:身份证|身份证号|身份证号码)(\S*)\n/)?.[1],
			phoneNumber: item.match(/(?:电话|电话号|电话号码|手机|手机号|手机号码)(\S*)\n/)?.[1],
			packQuantity: item.match(/(?:预装量|装载量)(\S*)\n/)?.[1].replace(/[^\d.]/g, ""),
		};
	});

	emit("btnConfirm", result);
	hideModal();
};

const showModal = () => {
	popup.value.open();
	textarea.value = "";
};

// watch(() => props.params, (value) => {
//     if (value) {
//         debugger
//         params.value = value
//         params.value[props.searchKey.key] = searchValue.value

//     }
// })

const hideModal = () => popup.value.close();

const clear = () => {
	hideModal();
};

defineExpose({
	showModal,
	hideModal,
});

onMounted(() => {
	//showModal()
});
</script>
<style lang="scss" scoped>
.popup-content {
	width: 300px;
	height: 100vh;
}

.item {
	display: flex;
	align-items: center;
	width: 100%;
}

.btnWarp {
	display: flex;
	align-items: center;
	padding: 10px;
	border-top: 1px solid #eee;
	padding-bottom: 20px;
}

.btn {
	width: 100%;
}
</style>
