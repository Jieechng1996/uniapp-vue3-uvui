/*
 * @Date: 2024-09-24 13:04:03
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-17 16:46:01
 * @LastEditors: guojiecheng
 */
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc); // 使用 UTC 插件
dayjs.extend(timezone); // 使用时区插件

const fs = require('fs');
const date = dayjs().tz('Asia/Shanghai');
const timestamp = date.format('YYYYMMDD_HHmmss');
const version = `v${timestamp}`;
const path = require('path');
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

let directory = 'src/static'

const filePath = path.join(directory, 'version.json');

fs.mkdirSync(directory, { recursive: true });

fs.writeFileSync(filePath, JSON.stringify({
    ver: version
}, null, 2), 'utf8');