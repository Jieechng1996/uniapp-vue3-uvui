/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 10:32:05
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
		primaryColor: '#CC3D3E',
		primaryColorText: {
			color: '#CC3D3E',
		}
	});
	app.provide("base", {});
	return {
		app
	};
}
