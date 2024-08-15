/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-15 16:36:09
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

export function createApp() {
	const app = createSSRApp(App);
	app.provide("skin", {
		primaryColor: "red",
	});
	app.provide("base", {});
	return {
		app
	};
}
