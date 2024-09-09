import { defineComponent, onMounted, reactive, ref, toRaw, useSlots, watch } from "vue"
import uvInput from '@/uni_modules/uv-input/components/uv-input/uv-input.vue'
import uvForm from '../uni_modules/uv-form/components/uv-form/uv-form.vue'
import uvFormItem from '../uni_modules/uv-form/components/uv-form-item/uv-form-item.vue'
import uvDatetimePicker from '@/uni_modules/uv-datetime-picker/components/uv-datetime-picker/uv-datetime-picker.vue'
import uvPicker from '../uni_modules/uv-picker/components/uv-picker/uv-picker.vue'
import uvTextarea from '../uni_modules/uv-textarea/components/uv-textarea/uv-textarea.vue'
import baseDialog from './base-dialog.vue'
import baseUploader from './base-uploader.vue'
import baseLookupCode from "./base-lookupCode.vue"
import baseRegions from "./base-regions.vue"
import baseRemoteSelect from "./base-remote-select.vue"
import uvIcon from '../uni_modules/uv-icon/components/uv-icon/uv-icon.vue'
import uvCalendars from '../uni_modules/uv-calendars/components/uv-calendars/uv-calendars.vue'
import uvSwitch from '../uni_modules/uv-switch/components/uv-switch/uv-switch.vue'
import uvRadioGroup from '../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.vue'
import uvRadio from '../uni_modules/uv-radio/components/uv-radio/uv-radio.vue'
import dayjs from "dayjs"
import { email, phoneNumber } from '@/lib/regexp'
/*
 * @Date: 2023-07-21 09:25:31
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 15:16:59
 * @LastEditors: guojiecheng
 * 
 * @description:
 *  1、不支持动态参数，动态参数的使用可通过插槽进行
 *  2、当前组件并不支持小程序，使用方式可参考generate方法阅读
 *  3、目前日期范围并不支持清除选择功能，若需要，则手写重置按钮功能，慎用
 * 
 */
export default defineComponent({
    props: {
        legend: {
            type: Array,
            default: []
        },
        modelValue: {
            type: Object,
            default: {}
        },
        gutter: {
            type: Number,
            default: 20
        },
        span: {
            type: Number,
            default: 8
        },
        showButton: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        formData: {
            type: Object,
            default: null
        },
        formProps: {
            type: Object,
            default: () => ({})
        },
        formItemProps: {
            type: Object,
            default: () => ({})
        },
        rules: {
            type: Object,
            default: () => ({})
        }

    },
    emits: ['update:modelValue', 'btnSearch', 'dataOnChange'],
    components: {
        uvForm, uvFormItem, uvInput, uvDatetimePicker, uvPicker, baseDialog, baseLookupCode, baseRegions, uvTextarea, baseRemoteSelect, uvIcon, uvCalendars, uvSwitch, uvRadioGroup, uvRadio, baseUploader
    },
    setup(props, { emit, slots, expose }) {

        const formData = reactive({})

        watch(() => props.modelValue, (value) => {
            if (value) {
                for (let i in value) {
                    formData[i] = value[i]
                }
            }

        }, { deep: true, immediate: true })

        watch(() => formData, (value) => {
            if (value) {
                emit('update:modelValue', value)
                emit('dataOnChange', toRaw(value)) //提供一个onChange方法，避免多个form存在时可能有响应式失效
            }
        }, { deep: true, immediate: true })

        const validate = () => new Promise((resolve, reject) => formRef.value.validate().then(res => resolve(res)).catch(e => reject(e)))

        const validateField = (props) => new Promise((resolve, reject) =>
            formRef.value.validateField(props, errMsg => errMsg ? reject(errMsg) : resolve(errMsg))
        )
        // } 

        //    const validate = () =>{
        //     try{
        //         formRef.value.validate().catch(e => { console.log(e) })
        //     }catch(e){
        //         console.log(e)
        //     }
        //    }
        expose({
            validate,
            validateField
        })



        const generate = (legend) => legend.map(item => {
            let element
            item.disabled = item.disabled || (item.disabledFunc && item.disabledFunc()) || props.disabled
            switch (item.type) {
                case 'date':
                    const datetimePicker = ref()
                    element = (
                        <view className="w100p">
                            <uv-datetime-picker ref={datetimePicker} mode="date"
                                value={dayjs().valueOf()}
                                onConfirm={({ value, mode }) => {
                                    if (mode === 'date') {
                                        formData[item.key] = dayjs(value).format('YYYY-MM-DD')
                                    }
                                }}
                                cancelText="清除选择"
                                onCancel={() => {
                                    formData[item.key] = ''
                                }}
                                {...item.timeProps} ></uv-datetime-picker>
                            <uv-input v-model={formData[item.key]} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-right" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && datetimePicker.value.open()}{...item.props} ></uv-input>
                        </view>
                    )
                    break
                case 'range':
                case 'dateRange':
                    let range = ref()
                    // var slot = {
                    //     suffix: <view>
                    //         {!formData[item.key] || formData[item.key].length === 0 ?
                    //             <uv-icon name="arrow-down" ></uv-icon> :
                    //             <uv-icon name="close-circle" onClick={() => {
                    //                 formData[item.key] = ''
                    //                 formData[item.startDateKey] = ''
                    //                 formData[item.endDateKey] = ''
                    //             }} ></uv-icon>}
                    //     </view>
                    // }
                    element = <view className="w100p">
                        <uv-input v-model={formData[item.key]} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-down" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && range.value.open()} {...item.props} ></uv-input>
                        <uv-calendars ref={range} mode="range" onConfirm={({ range }) => {
                            formData[item.key] = range.before + ' ~ ' + range.after
                            formData[item.startDateKey] = range.before
                            formData[item.endDateKey] = range.after
                        }} {...item.calendarProps}></uv-calendars>
                    </view>

                    break
                case 'region':
                case 'regions':
                    let regions = ref()
                    element = (
                        <view className="w100p">
                            <uv-input v-model={formData[item.key + 'Text']} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-down" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && regions.value.showModal()} {...item.props} ></uv-input>
                            <base-regions ref={regions}
                                onConfirm={(value) => {
                                    formData[item.key] = value.map(item => item.code).join('/')
                                    formData[item.key + 'Text'] = value.map(item => item.name).join('/')
                                    typeof item.callbackFunc == 'function' && item.confirmFunc(value)
                                }}
                                onClear={() => {
                                    formData[item.key] = ''
                                    formData[item.key + 'Text'] = ''
                                    typeof item.callbackFunc == 'function' && item.clearFunc(value)
                                }}
                                {...item.regionsProps}></base-regions>
                        </view>
                    )
                    break;
                case 'uploader':
                    formData[item.key + 's'] = formData[item.key] ? [{ filesPath: formData[item.key] }] : []
                    element = <view>
                        <base-uploader v-model={formData[item.key + 's']} limit={1} disabled={item.disabled} onCallback={(file) => {
                            formData[item.key] = file.filesPath
                        }}></base-uploader>
                    </view>
                    break;
                case 'lookup':
                case 'lookupCode':
                    let lookup = ref()
                    element = (
                        <view className="w100p">
                            <uv-input v-model={formData[item.key + 'Text']} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-down" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && lookup.value.showModal()} {...item.props} ></uv-input>
                            <base-lookup-code ref={lookup} lookupType={item.lookupType} systemCode={item.systemCode}
                                onCallback={(value) => {
                                    formData[item.key] = value.lookupCode
                                    formData[item.key + 'Text'] = value.meaning
                                    typeof item.callbackFunc == 'function' && item.callbackFunc(value)
                                }} onOnLoad={(list) => {
                                    formData[item.key + 'Text'] = formData[item.key + 'Text'] || list.find(line => line.lookupCode === formData[item.key])?.meaning
                                }}></base-lookup-code>
                        </view>
                    )
                    break;
                case 'slot':
                    element = (slots[item.key] ? <div style='width: 100%'>{slots[item.key]()}</div> : <div></div>)
                    break;
                case 'lov':
                    let dialog = ref()
                    element = (
                        <view className="w100p">
                            <uv-input v-model={formData[item.key + 'Text']} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="search" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && dialog.value.showModal()} {...item.props} ></uv-input>
                            <base-dialog search-key={item.searchKey} ref={dialog} params={item.params || {}}
                                api={item.api} keys={item.keys}
                                onConfirm={(value) => {
                                    formData[item.key + 'Text'] = value[item.keys?.value]
                                    formData[item.key] = value[item.keys?.key]
                                    typeof item.confirmFunc == 'function' && item.confirmFunc(value)
                                    typeof item.callBackFunc == 'function' && item.callBackFunc(value)
                                }}
                                onClear={() => {
                                    formData[item.key + 'Text'] = ''
                                    formData[item.key] = ''
                                    typeof item.clearFunc == 'function' && item.clearFunc({})
                                    typeof item.callBackFunc == 'function' && item.callBackFunc({})
                                }} {...item.dialogProps}></base-dialog>
                        </view>
                    )
                    break;
                case 'text':
                    element = <view>{formData[item.key]}</view>
                    break
                case 'select':
                    let picker = ref()
                    element = <view className="w100p">
                        <uv-input v-model={formData[item.key]} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-down" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && picker.value.open()} {...item.props} ></uv-input>
                        <uv-picker ref={picker} columns={[item.options]} keyName="label" cancelText="清除选择" onConfirm={
                            ({ value }) => {
                                formData[item.key] = value[0].key
                                formData[item.key + 'Text'] = value[0].label
                                typeof item.confirmFunc == 'function' && item.confirmFunc(value[0])
                                typeof item.callbackFunc == 'function' && item.callbackFunc(value[0])
                            }
                        } onCancel={
                            () => {
                                formData[item.key] = ''
                                formData[item.key + 'Text'] = ''
                                typeof item.clearFunc == 'function' && item.clearFunc()
                                typeof item.callbackFunc == 'function' && item.callbackFunc({})
                            }
                        }{...item.pickerProps}> </uv-picker>
                    </view>
                    break;
                case 'romoteSelect':
                    let romoteSelect = ref()
                    element = <view className="w100p">
                        <uv-input v-model={formData[item.key + 'Text']} placeholder={item.placeholder || '请选择'} clearable readonly border="surround" suffixIcon="arrow-down" disabled={item.disabled} onClick={() => !(item.disabled || props.disabled) && romoteSelect.value.showModal()} {...item.props} ></uv-input>
                        <base-remote-select ref={romoteSelect}
                            keys={item.keys}
                            api={item.api}
                            params={item.params}
                            onCallback={(value) => {
                                formData[item.key] = value[item.keys?.key]
                                formData[item.key + 'Text'] = value[item.keys?.value]
                                typeof item.callBackFunc == 'function' && item.callBackFunc(value)
                            }}
                            {...item.remoteSelectProps}
                        />
                    </view>
                    break;
                case 'switch':
                    item.trueValue = item.trueValue || 'Y'
                    item.falseValue = item.falseValue || 'N'
                    formData[item.key + 'Flag'] = formData[item.key] == item.trueValue
                    element = <uv-switch v-model={formData[item.key + 'Flag']} size="28" disabled={item.disabled} onChange={(event) => {
                        formData[item.key] = event ? item.trueValue : item.falseValue
                    }} {...item.props}></uv-switch>
                    break;
                case 'radio':
                    element = <uv-radio-group v-model={formData[item.key]} {...item.props} {...item.radioGroupProps} disabled={item.disabled}>
                        {item?.options.map((line, index) => {
                            return <uv-radio customStyle={{ marginRight: '16px' }} shape="square" label={line.value} name={line.key} {...item.radioProps}>{line.value}</uv-radio>
                        })}
                    </uv-radio-group>
                    break;
                case 'textarea':
                    element = <uv-textarea v-model={formData[item.key]} placeholder={item.placeholder || '请输入'} clearable disabled={item.disabled} border="surround" {...item.props} />
                    break
                case 'phone':
                case 'phoneNumber':
                case 'input':
                case 'email':
                default:
                    element = <uv-input v-model={formData[item.key]} placeholder={item.placeholder || '请输入'} clearable disabled={item.disabled} border="surround" {...item.props} />
                    break;
            }

            let elementBox = <uv-form-item label={item.label} name={item.key} prop={item.key} borderBottom={true} required={item.required} {...props.formItemProps} {...item.formItemProps} >
                {element}
            </uv-form-item>

            return (
                item.showFunc ? item.showFunc() && elementBox: elementBox
            )

        })

        const formRef = ref()

        let rules = { ...props.rules }

        props.legend.forEach(item => {
            rules[item.key] = rules[item.key] || []
            if (item.rules && item.rules.length !== 0) {
                rules[item.key] = [...rules[item.key], ...item.rules]
            }
            if (item.type === 'phoneNumber' || item.type === 'phone') {
                rules[item.key] = [...rules[item.key], {
                    validator: (rule, value, callback) => !(value && !phoneNumber.test(value)), message: '手机号格式错误', trigger: ['change']
                }]
            }
            if (item.type === 'email') {
                rules[item.key] = [...rules[item.key], {
                    validator: (rule, value, callback) => !(value && !email.test(value)), message: '邮箱格式错误', trigger: ['change']
                }]
            }
            if (item.required) {
                rules[item.key] = [...rules[item.key], {
                    validator: (rule, value, callback) => value, message: item.label ? item.label + '为必填字段' : '请检查必填项', trigger: ['change']
                }]
                // rules[item.key] = [...rules[item.key], {
                //     required: true,
                //     message: item.label ? item.label + '为必填字段' : '请检查必填项',
                //     trigger: ['blur', 'change']
                // }]
            }
        })

        rules = Object.entries(rules).length === 0 ? null : rules

        return () => <div className="w100p">
            <uv-form labelPosition="left" model={formData} rules={rules} errorType="border-bottom" {...props.formProps} ref={formRef}>
                {...generate(props.legend)}
            </uv-form>
        </div>
    }
})