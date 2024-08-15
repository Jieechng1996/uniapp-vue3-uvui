/*
 * @Date: 2024-08-15 14:57:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-15 15:15:34
 * @LastEditors: guojiecheng
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const repoUrl = 'git@github.com:Jieechng1996/uniapp-vue3-uvui.git'; // 远程仓库 URL

const tempDir = path.join(__dirname, 'temp-repo'); // 临时目录

// 从命令行获取 remoteDir 和 localDir 参数
const remoteDir = process.argv[2]; // 远程仓库中的目录
const localDir = process.argv[3]; // 本地目标目录

// 验证参数是否存在
if (!remoteDir || !localDir) {
    console.error('Usage: node sync-repo-files.js <remoteDir> <localDir>');
    process.exit(1);
}


// 克隆指定目录
function cloneRepo() {
    console.log(`Cloning ${remoteDir} from ${repoUrl}...`);
    execSync(`git clone --depth 1 --filter=blob:none --sparse ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
    execSync(`cd ${tempDir} && git sparse-checkout set ${remoteDir}`, { stdio: 'inherit' });
}

// 复制文件并替换
function copyFiles(srcDir, destDir) {
    console.log(`Copying files from ${srcDir} to ${destDir}...`);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 清理临时目录
function cleanUp() {
    console.log(`Cleaning up temporary files...`);
    fs.rmdirSync(tempDir, { recursive: true });
}

// 主执行流程
function main() {
    try {
        cloneRepo();
        const srcPath = path.join(tempDir, remoteDir);
        copyFiles(srcPath, localDir);
        console.log('Files have been successfully copied and replaced.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        cleanUp();
    }
}

main();
