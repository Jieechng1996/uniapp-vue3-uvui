<!--
 * @Date: 2024-07-05 17:49:24
 * @Author: guojiecheng
 * @LastEditTime: 2025-11-10 11:16:49
 * @LastEditors: guojiecheng
 * @Description:
    1、常规使用的话可以直接使用作用域插槽内的变量
    2、如果说遇到需要修改返回数据的值得话，请调用onLoad函数并配合v-model食用
-->
<template>
	<view class="h100p">
		<scroll-view
			scroll-y
			scroll-with-animation
			class="h100p"
			:refresher-enabled="props.autoScroll"
			@refresherrefresh="() => {
					if (props.autoScroll) {
						refreshList();
					}
				}
			"
			:refresher-triggered="refreshType"
			@scrolltolower="
				() => {
					if (props.autoScroll) {
						getNextList();
					}
				}
			">
			<slot name="default" :list="list"></slot>
			<view v-if="list.length !== 0 && list.length === count">
				<uv-divider text="我也是有底线的"></uv-divider>
			</view>
			<view v-else>
				<view v-if="!props.autoScroll">
					<uni-load-more :status="status" @clickLoadMore="getNextList()" :contentText="contentText"></uni-load-more>
				</view>
			</view>
			<view v-if="list.length === 0" class="py-20">
				<uv-empty mode="list"></uv-empty>
			</view>
		</scroll-view>
	</view>
</template>
<script setup>
const props = defineProps({
	params: {
		type: Object,
		default: () => ({}),
	},
	pageSize: {
		type: Number,
		default: 30,
	},
	autoRequest: {
		type: Boolean,
		default: true,
	},
	url: {
		type: String,
		default: "",
		required: true,
	},
	modelValue: {
		type: Array,
		default: [],
	},
	autoScroll: {
		type: Boolean,
		default: true,
	},
});

const list = ref([]);

import { onMounted, ref, defineExpose, defineEmits, watch } from "vue";
import httpServer from "../common/httpServer";

const refreshType = ref(false);

const status = ref("more");

const contentText = ref({ contentdown: "点击显示更多", contentrefresh: "正在加载...", contentnomore: "没有更多数据了" });

const refreshList = async refresh => {
	status.value = "loading";
	refresh && (refreshType.value = true);
	let { data, page } = await httpServer
		.postV1(props.url, {
			pageIndex: 1,
			pageRows: props.pageSize,
			...props.params,
		})
		.catch(err => {
			list.value = [];
			refresh &&
				setTimeout(() => {
					refreshType.value = false;
				}, 1000);
			return Promise.reject(err);
		});
	console.log(data);
	list.value = data || [];
	nextIndex.value = page?.nextIndex;
	count.value = page?.count;
	if (page.count && list.value.length === page.count) {
		status.value = "noMore";
	} else {
		status.value = "more";
	}
	emit("onLoad", list.value);
	setTimeout(() => {
		refreshType.value = false;
	}, 1000);
};

const nextIndex = ref(0);

const count = ref();

const getNextList = async () => {
	if (list.value.length !== 0 && count.value === list.value.length) {
		return;
	}
	let { data, page } = await httpServer.postV1(props.url, {
		pageIndex: nextIndex.value,
		pageRows: props.pageSize,
		...props.params,
	});
	list.value = [...list.value, ...data];
	nextIndex.value = page?.nextIndex;
	count.value = page?.count;
	if (page.count && list.value.length === page.count) {
		status.value = "noMore";
	} else {
		status.value = "more";
	}
	emit("onLoad", list.value);
};

const emit = defineEmits(["onLoad", "update:modelValue"]);

watch(
	() => props.modelValue,
	value => {
		if (value) {
			list.value = value;
		}
	},
	{ deep: true, immediate: true }
);

watch(
	() => list.value,
	value => {
		if (value) {
			emit("update:modelValue", value);
		}
	},
	{ deep: true, immediate: true }
);

defineExpose({
	refreshList,
	getNextList,
	claerList: () => (list.value = []),
});

onMounted(() => {
	props.autoRequest && refreshList();
});
</script>
<style lang="scss"></style>
