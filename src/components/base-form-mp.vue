<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2025-09-17 15:48:02
 * @LastEditors: guojiecheng
-->
<template>
	<view className="w-full">
		<uv-form labelPosition="left" :model="formData" :rules="curRules" errorType="border-bottom"
			v-bind="props.formProps" ref="formRef">
			<view v-for="(item, index) in props.legend.map(item => {
				item.disabled = item.disabled ?? (item.disabledFunc && item.disabledFunc()) ?? props.disabled;
				return item;
			})" :key="index">
				<uv-form-item :label="item.label" :name="item.key" :prop="item.key" borderBottom
					:required="item.required" v-if="item.showFunc ? item.showFunc() : true"
					v-bind="{ ...props.formItemProps, ...item.formItemProps }">
					<view v-if="item.type === 'date'" class="w-full">
						<uv-datetime-picker :ref="'datetimePicker' + index" mode="date" :value="dayjs().valueOf()"
							@confirm="
								({ value, mode }) => {
									if (mode === 'date') {
										formData[item.key] = dayjs(value).format('YYYY-MM-DD');
									}
									if (mode === 'year-month') {
										formData[item.key] = dayjs(value).format('YYYY-MM')
									}
									emit('update:modelValue', toRaw(formData));
									typeof item.callbackFunc == 'function' && item.callbackFunc(value)
								}
							" cancelText="清除选择" @cancel="
								() => {
									formData[item.key] = '';
									emit('update:modelValue', toRaw(formData));
								}
							" v-bind="item.timeProps"></uv-datetime-picker>
						<view @click="() => !item.disabled && proxy.$refs['datetimePicker' + index][0].open()">
							<uv-input className="w100p" v-model="formData[item.key]" :disabled="item.disabled"
								:placeholder="item.placeholder || '请选择'" clearable readonly border="surround"
								suffixIcon="arrow-right" v-bind="{ ...item.props }"></uv-input>
						</view>
					</view>
					<view v-else-if="item.type === 'dateRange' || item.type === 'range'">
						<uv-input v-model="formData[item.key]" :placeholder="item.placeholder || '请选择'" clearable
							readonly border="surround" suffixIcon="arrow-down" :disabled="item.disabled"
							@click="() => !(item.disabled || props.disabled) && proxy.$refs['range' + index].open()"
							v-bind="{ ...item.props }"></uv-input>
						<uv-calendars :ref="'range' + index" mode="range" @confirm="
							({ range }) => {
								formData[item.key] = range.before + ' ~ ' + range.after;
								formData[item.startDateKey] = range.before;
								formData[item.endDateKey] = range.after;
								emit('update:modelValue', toRaw(formData));
							}
						" v-bind="{ ...item.calendarProps }"></uv-calendars>
					</view>
					<view v-else-if="item.type === 'slot'">
						<slot :name="item.key"> </slot>
					</view>
					<view v-else-if="item.type === 'lov'" class="w-full">
						<view
							@click="() => !(item.disabled || props.disabled) && proxy.$refs['dialog' + index][0].showModal()">
							<uv-input v-model="formData[item.value || item.key + 'Text']" :placeholder="item.placeholder || '请选择'"
								clearable readonly border="surround" suffixIcon="search" :disabled="item.disabled"
								v-bind="{ ...item.props }"></uv-input>
						</view>

						<base-dialog :search-key="item.searchKey" :ref="'dialog' + index" :params="item.params || {}"
							:api="item.api" :keys="item.keys" @confirm="
								value => {
									formData[item.value || item.key + 'Text'] = value[item.keys?.value];
									formData[item.key] = value[item.keys?.key];
									emit('update:modelValue', toRaw(formData));
									typeof item.confirmFunc == 'function' && item.confirmFunc(value);
									typeof item.callBackFunc == 'function' && item.callBackFunc(value);
								}
							" @clear="
								() => {
									formData[item.value || item.key + 'Text'] = '';
									formData[item.key] = '';
									emit('update:modelValue', toRaw(formData));
									typeof item.clearFunc == 'function' && item.clearFunc({});
									typeof item.callBackFunc == 'function' && item.callBackFunc({});
								}
							" v-bind="{ ...item.dialogProps }"></base-dialog>
					</view>
					<view v-else-if="item.type == 'uploader'">
						<base-uploader v-model="formData[item.key + 's']" :limit="1" :disabled="item.disabled"
							@callback="
								(file) => {
									formData[item.key] = file.filesPath;
									emit('update:modelValue', toRaw(formData));
									typeof item.callbackFunc == 'function' && item.callbackFunc(file);
								}
							" v-bind="item.props">
						</base-uploader>
					</view>
					<view v-else-if="item.type === 'lookup' || item.type === 'lookupCode'" class="w-full">
						<view @click="() => !item.disabled && proxy.$refs['lookup' + index][0].showModal()">
							<uv-input class="pointer-events-none" v-model="formData[item.value|| item.key + 'Text']" readonly
								:placeholder="item.placeholder || '请选择'" :disabled="item.disabled" clearable
								border="surround" suffixIcon="arrow-down"></uv-input>
						</view>
						<base-lookup-code :ref="'lookup' + index" :lookupType="item.lookupType"
							:systemCode="item.systemCode" @callback="
								value => {
									formData[item.key] = value.lookupCode;
									formData[item.value ||item.key + 'Text'] = value.meaning;
									emit('update:modelValue', toRaw(formData));
									typeof item.callbackFunc == 'function' && item.callbackFunc(value);
								}
							" @onLoad="
						list => {
							formData[item.key + 'Text'] = formData[item.key + 'Text'] || list.find(line => line.lookupCode === formData[item.key])?.meaning;
						}
					"></base-lookup-code>
					</view>
					<view v-else-if="item.type === 'select'" class="w-full">
						<view @click="() => !item.disabled && proxy.$refs['select' + index][0].open()">
							<uv-input class="pointer-events-none" v-model="formData[item.key + 'Text']" readonly
								:placeholder="item.placeholder || '请选择'" :disabled="item.disabled" clearable
								border="surround" suffixIcon="arrow-down"></uv-input>
						</view>

						<uv-picker :ref="'select' + index" :columns="[item.options]" keyName="label" cancelText="清除选择"
							@confirm="
								({ value }) => {
									formData[item.key] = value[0].key;
									formData[item.key + 'Text'] = value[0].label;
									emit('update:modelValue', toRaw(formData));
									typeof item.confirmFunc == 'function' && item.confirmFunc(value[0]);
									typeof item.callbackFunc == 'function' && item.callbackFunc(value[0]);
								}
							" @cancel="
					() => {
						formData[item.key] = '';
						formData[item.key + 'Text'] = '';
						emit('update:modelValue', toRaw(formData));
						typeof item.confirmFunc == 'function' && item.confirmFunc({});
						typeof item.callbackFunc == 'function' && item.callbackFunc({});
					}
				"></uv-picker>
					</view>
					<view v-else-if="item.type === 'switch'" class="w-full">
						<uv-switch v-model="formData[item.key + 'Flag']" size="28" :disabled="item.disabled" @change="
							(event) => {
								formData[item.key] = event ? (item.trueValue || 'Y') : (item.falseValue || 'N');
								emit('update:modelValue', toRaw(formData));
								typeof item.callBackFunc == 'function' && item.callBackFunc(formData[item.key]);
								typeof item.callbackFunc == 'function' && item.callbackFunc(formData[item.key]);
							}
						" v-bind="item.props"></uv-switch>
					</view>
					<view v-else-if="item.type === 'radio'" class="w-full">
						<uv-radio-group v-model="formData[item.key]" v-bind="{ ...item.props, ...item.radioGroupProps }"
							:disabled="item.disabled" @change="() => emit('update:modelValue', toRaw(formData))">
							<uv-radio v-for="(line, index) in item?.options" :key="index"
								:customStyle="{ marginRight: '16px', marginBottom: '8px' }" shape="square"
								:label="line.value" :name="line.key" v-bind="item.radioProps">{{ line.value
								}}</uv-radio>
						</uv-radio-group>
					</view>
					<view v-else-if="item.type === 'checkbox'" class="w-full">
						<uv-checkbox-group v-model="formData[item.key + 's']" :disabled="item.disabled" @change="
							detail => {
								formData[item.key] = detail.join(',');
								emit('update:modelValue', toRaw(formData));
							}
						" v-bind="{ ...item.props, ...item.radioGroupProps }">
							<uv-checkbox :customStyle="{ marginRight: '16px', marginBottom: '8px' }"
								v-for="(item, index) in item?.options" :key="index" :label="item.value" :name="item.key"
								v-bind="item.checkboxProps"></uv-checkbox>
						</uv-checkbox-group>
					</view>
					<view v-else-if="item.type === 'text'" class="w-full">
						{{ formData[item.key] }}
					</view>
					<view v-else class="w100p">
						<uv-input v-model="formData[item.key]" :placeholder="item.placeholder || '请输入'" clearable
							:disabled="item.disabled" border="surround" v-bind="{ ...item.props }" @change="
								value => {
									emit('update:modelValue', toRaw(formData));
									typeof item.change === 'function' && item.change(value);
								}
							" />
					</view>
				</uv-form-item>
			</view>
		</uv-form>
	</view>
</template>

<script setup>
import dayjs from "dayjs";
import { getCurrentInstance, reactive, ref, watch, toRaw, onMounted } from "vue";
import { warning } from "../common/message";

const props = defineProps({
	legend: {
		type: Array,
		default: [],
	},
	modelValue: {
		type: Object,
		default: {},
	},
	gutter: {
		type: Number,
		default: 20,
	},
	span: {
		type: Number,
		default: 8,
	},
	showButton: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	formData: {
		type: Object,
		default: null,
	},
	formProps: {
		type: Object,
		default: () => ({}),
	},
	formItemProps: {
		type: Object,
		default: () => ({}),
	},
	rules: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(["update:modelValue", "btnSearch", "dataOnChange"]);

const formData = reactive({});

watch(
	() => props.modelValue,
	value => {
		if (value) {
			for (let i in toRaw(value)) {
				formData[i] = toRaw(value)[i];
			}
		}
	},
	{ deep: true, immediate: true }
);

watch(
	() => formData,
	value => {
		if (value) {
			// emit("update:modelValue", value);
			emit("dataOnChange", toRaw(value)); //提供一个onChange方法，避免多个form存在时可能有响应式失效
		}
	},
	{ deep: true, immediate: true }
);

const curRules = ref({});

let rules = { ...toRaw(props.rules) };

props.legend.forEach(item => {
	item.disabled = item.disabled ?? (item.disabledFunc && item.disabledFunc()) ?? props.disabled;
	rules[item.key] = rules[item.key] || [];
	if (item.rules && item.rules.length !== 0) {
		rules[item.key] = [...rules[item.key], ...item.rules];
	}
	if (item.type === "phoneNumber" || item.type === "phone") {
		rules[item.key] = [
			...rules[item.key],
			{
				validator: (rule, value, callback) => !(value && !phoneNumber.test(value)),
				message: "手机号格式错误",
				trigger: ["change"],
			},
		];
	}
	if (item.type === 'switch') {
		item.trueValue = item.trueValue || 'Y';
		item.falseValue = item.falseValue || 'N';
		formData[item.key] = formData[item.key] || item.falseValue;
		formData[item.key + 'Flag'] = formData[item.key] === item.trueValue;
	}
	if (item.type === 'uploader') {
			formData[item.key + 's'] = formData[item.key] ? [{ filesPath: formData[item.key] }] : [];
		}
	if (item.type === "email") {
		rules[item.key] = [
			...rules[item.key],
			{
				validator: (rule, value, callback) => !(value && !email.test(value)),
				message: "邮箱格式错误",
				trigger: ["change"],
			},
		];
	}
	if (item.required) {
		rules[item.key] = [
			...rules[item.key],
			{
				validator: (rule, value, callback) => !!value,
				message: item.label ? item.label + "为必填字段" : "请检查必填项",
				trigger: ["change"],
			},
		];
	}
});

curRules.value = rules;

const formRef = ref();

const { proxy } = getCurrentInstance();

const validate = () =>
	new Promise((resolve, reject) =>
		formRef.value
			.validate()
			.then(res => resolve(res))
			.catch(e => reject(e))
	);

const validateField = props => new Promise((resolve, reject) => formRef.value.validateField(props, errMsg => (errMsg.length ? reject(errMsg) : resolve(errMsg))));

defineExpose({
	validate,
	validateField,
});

onMounted(() => {
	// console.log(proxy.$refs.select12[0].open())
});


</script>

<style lang="scss" scoped></style>
