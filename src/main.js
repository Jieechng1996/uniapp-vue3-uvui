/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-09-04 17:19:20
 * @LastEditors: guojiecheng
 */
import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import "./mock/index";
import "./base.css";
import "./lib/common.css";
import "tailwindcss/tailwind.css";
import "./uni.scss"
import store from "./store";

store.dispatch('INIT_BASE_INFO')

// #ifdef MP-WEIXIN
import baseForm from "@/components/base-form-mp";
// #endif

// #ifndef MP-WEIXIN
import baseForm from "@/components/base-form.jsx";
// #endif

import baseUploader from "@/components//base-uploader"
import baseList from "@/components/base-list"
import baseDialog from "@/components/base-dialog"
import baseLookupCode from "@/components//base-lookupCode"
import baseRegions from "@/components//base-regions"
import baseApprovalBtns from "@/components/base-approval-btns"
import baseFlowRecord from "@/components/base-flow-record"

export function createApp() {
	const app = createSSRApp(App);
	app.component('baseForm' , baseForm)
	app.component('baseList' , baseList)
	app.component('baseDialog' , baseDialog)
	app.component('baseUploader' , baseUploader)
	app.component('baseLookupCode' , baseLookupCode)
	app.component('baseRegions' , baseRegions)
	app.component('baseApprovalBtns' , baseApprovalBtns)
	app.component('baseFlowRecord' , baseFlowRecord)
	app.provide("skin", {
		primaryColor: "red",
	});
	app.provide("base", {});
	return {
		app
	};
}
