<!--
 * @Date: 2023-09-14 10:35:26
 * @Author: guojiecheng
 * @LastEditTime: 2025-08-08 10:52:37
 * @LastEditors: guojiecheng
-->
<template>
	<div>
		<uv-popup ref="popup" background-color="#fff" mode="right" v-bind="{ ...props.popupProps }">
			<view class="popup-content">
				<!-- <uni-search-bar @confirm="search" v-model="searchValue" @input="input"
                        :placeholder="props.searchKey.placeholder">
                    </uni-search-bar> -->
				<view v-if="props.searchKey.key" class="p-1 relative border-b">
					<uv-search class="bg-gray-100" hape="square" shape="square" bgColor="#ffffff" :placeholder="props.searchKey.placeholder" @search="search" @input="input" :showAction="false">
						<template #suffix>
							<uv-button
								type="primary"
								size="small"
								@click="
									() => {
										list.refreshList();
									}
								"
								>搜索</uv-button
							>
						</template>
						<template #prefix>
							<uv-button type="success" size="small" plain class="mr-1" v-if="props.searchList.length !== 0" @click="() => (showMore = !showMore)">
								<text>{{ `${showMore ? "收起" : "展开"}` }}</text>
							</uv-button>
							<uv-icon name="search" size="24" color="#999" />
						</template>
					</uv-search>
				</view>

				<view v-else class="text-center text-base p-2 font-bold"> 请选择 </view>
				<view class="p-2 w-full border bg-gray-100" v-if="showMore">
					<view v-for="(item, index) in props.searchList" :key="index" class="mb-1">
						<view v-if="item.type === 'lookup'" @click="() => proxy.$refs['lookup' + index][0].showModal()">
							<uv-input class="pointer-events-none bg-white" v-model="params[item.key + 'Text']" readonly :placeholder="item.placeholder || '请选择'" clearable border="surround" suffixIcon="arrow-down"></uv-input>
						</view>
						<view v-else>
							<uv-input class="bg-white" v-model="params[item.key]" clearable :placeholder="item.placeholder" border="surround"></uv-input>
						</view>
					</view>
				</view>
				<view :style="{ height: showMore ? height : height2 }">
					<base-list :url="props.api" :params="params" ref="list" :pageRows="20" v-model="currentList" :auto-request="false">
						<template #default="{ list: dataList }">
							<uv-list>
								<uv-list-item v-for="(item, index) in currentList" :key="index" :show-arrow="false" clickable @click="() => click(index)">
									<template v-slot:body>
										<view class="item">
											<checkbox disabled :checked="item.checked" style="margin-right: 4px" />
											<view v-if="props.useContent" style="width: 100%">
												<slot name="content" v-bind:item="item"></slot>
											</view>
											<view v-else style="width: 100%">
												<view>{{ item[props.keys.value] }}</view>
												<view v-for="(line, subscript) in columns" :key="subscript" class="text-xs leading-5">
													{{ `${line.label}：${item[line.value] || "-"}` }}
												</view>
											</view>
										</view>
									</template>
								</uv-list-item>
							</uv-list>
						</template>
					</base-list>
				</view>
				<view class="btnWarp flex">
					<view class="flex-1">
						<uv-button @click="clear" size="small" class="btn" style="margin-right: 10px"> 清除选择</uv-button>
					</view>
					<view class="flex-1">
						<uv-button @click="confirm" size="small" type="primary" class="btn"> 确认</uv-button>
					</view>
				</view>
			</view>
		</uv-popup>
		<view v-for="(item, index) in props.searchList" :key="index" class="bg-white mb-1">
			<base-lookup-code
				v-if="item.type === 'lookup'"
				:ref="'lookup' + index"
				:lookupType="item.lookupType"
				:systemCode="item.systemCode"
				@callback="
					value => {
						params[item.key] = value.lookupCode;
						params[item.key + 'Text'] = value.meaning;
					}
				"></base-lookup-code>
			<view v-else> </view>
		</view>
	</div>
</template>
<script setup>
import { computed, ref } from "vue";
import baseList from "./base-list";
import { watch, defineExpose, defineEmits, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const props = defineProps({
	keys: {
		type: Object,
		default: () => ({}),
	},
	searchKey: {
		type: Object,
		default: {},
	},
	searchList: {
		type: Array,
		default: () => [],
	},
	api: {
		type: String,
		default: "",
	},
	params: {
		type: Object,
		default: () => {},
	},
	useContent: {
		type: Boolean,
		default: false,
	},
	popupProps: {
		type: Object,
		default: () => ({}),
	},
	columns: {
		type: Array,
		default: [],
	},
	checkedType: {
		type: String,
		default: "radio",
	},
});

const popup = ref();

const currentList = ref([]);

const list = ref();

const searchValue = ref("");

const searchParams = ref({});

const showMore = ref(false);

const params = ref({});


const systemInfo = uni.getSystemInfoSync();

let isIOS = false;

// #ifdef APP-PLUS || MP
// isIOS =systemInfo.platform === "ios" || systemInfo.system.includes("iOS");
// #endif

const height = computed(() => `calc(100% - 104px - 17px - ${props.searchList.length * 41}px - ${isIOS ? "56" : "0"}px)`);

const height2 = computed(() => `calc( 100% - 103px  - ${isIOS ? "56" : "0"}px)`);

const input = value => {
	params.value[props.searchKey.key] = value;
};

const click = index => {
	if (props.checkedType === "radio") {
		currentList.value.forEach(item => (item.checked = false));
	}
	currentList.value[index].checked = true;
};

const emit = defineEmits(["confirm", "clear", "callback"]);

const confirm = () => {
	if (props.checkedType === "radio") {
		let item = currentList.value.find(item => item.checked) || {};
		emit("confirm", item);
		emit("callback", item);
	} else {
		let items = currentList.value.filter(item => item.checked) || [];
		emit("confirm", items);
		emit("callback", items);
	}

	hideModal();
};

const clear = () => {
	if (props.type === "radio") {
		emit("clear", {});
		emit("callback", {});
	} else {
		emit("clear", []);
		emit("callback", []);
	}

	hideModal();
};

const search = () => list.value.refreshList();

const showModal = () => {
	popup.value.open();
	params.value = {};
	for (let i in props.params) {
		params.value[i] = props.params[i];
	}
	setTimeout(() => {
		list.value.claerList();
		list.value.refreshList();
	}, 500);
};

// watch(() => props.params, (value) => {
//     if (value) {
//         debugger
//         params.value = value
//         params.value[props.searchKey.key] = searchValue.value

//     }
// })

const hideModal = () => popup.value.close();

defineExpose({
	showModal,
	hideModal,
});
</script>
<style lang="scss" scoped>
.popup-content {
	width: 300px;
	height: 100%;
}

.item {
	display: flex;
	align-items: center;
	width: 100%;
}

.btnWarp {
	align-items: center;
	padding: 10px;
	border-top: 1px solid #eee;
	padding-bottom: 20px;
}

.btn {
	width: 100%;
}

:deep(.uni-checkbox-input-disabled) {
	background: #fff !important;

	svg path {
		color: #007aff;
		fill: #007aff;
	}
}
</style>
