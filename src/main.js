/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 10:47:44
 * @LastEditors: guojiecheng
 */
import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import "./mock/index";
import "./base.css";
import "tailwindcss/tailwind.css";
import "./uni.scss"
import store from "./store";

store.dispatch('INIT_BASE_INFO')

import skin from "./fuhai/skin";
import base from "./fuhai/base"

export function createApp() {
	const app = createSSRApp(App);
	app.provide("skin", skin);
	app.provide("base", base);
	return {
		app
	};
}
