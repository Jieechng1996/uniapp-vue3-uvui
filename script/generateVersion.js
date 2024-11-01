/*
 * @Date: 2024-09-24 13:04:03
 * @Author: guojiecheng
 * @LastEditTime: 2024-09-24 21:59:25
 * @LastEditors: guojiecheng
 */
const dayjs = require('dayjs');
const fs = require('fs');
const timestamp = dayjs().format('YYYYMMDD_HHmmss');
const version = `v${timestamp}`;
// const dotenv = require('dotenv');

// dotenv.config();

// 将版本写入到环境变量文件或其他配置文件中
// fs.writeFileSync('version.json', JSON.stringify({ version }));

// fs.writeFileSync('.env', fs.readFileSync('.env').toString().replace(/VUE_APP_VERSION=.*/g, ''));

// fs.appendFileSync('.env', `VUE_APP_VERSION=${version}\n`);

let envContent = fs.readFileSync('.env', 'utf8');

// 清除旧的 VUE_APP_VERSION
envContent = envContent.replace(/VITE_APP_VERSION=.*/g, '');

// 重新写入 .env 文件，确保没有换行
fs.writeFileSync('.env', envContent.trim() + `\nVITE_APP_VERSION=${version}`);