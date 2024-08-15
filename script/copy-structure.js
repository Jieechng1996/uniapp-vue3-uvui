/*
 * @Date: 2024-08-15 11:44:19
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-15 14:51:47
 * @LastEditors: guojiecheng
 */
const fs = require('fs');
const path = require('path');

// 递归复制目录和文件
function copyDir(src, dest) {
    // 如果目标目录不存在，则创建
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // 读取源目录中的所有文件和子目录
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // 如果是目录，则递归复制
            copyDir(srcPath, destPath);
        } else {
            // 如果是文件，则复制文件
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 脚本参数
const srcDir = process.argv[2];  // 源目录
const destDir = process.argv[3]; // 目标目录

if (!srcDir || !destDir) {
    console.error('Please provide source and destination directories.');
    process.exit(1);
}

// 执行复制
copyDir(srcDir, destDir);

console.log(`Directory structure and files copied from ${srcDir} to ${destDir}`);
