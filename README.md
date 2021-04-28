# 基于区块链的学位认证管理系统

## 项目简介

学位造假现象对社会造成了严重的影响，而传统的学位认证系统认证繁琐、成本高。而SmartDegreeCertificate系统底层采用区块链技术，不易篡改的特性大大增加了系统的可信度。

## 运行条件

- Node.js v8.11.2
- Express v4.0+
- MongoDB v4.4.4+
- 最好在linux部署,windows请尝试改变vnt.js和vnt-kit.js的仓库地址
- 准备一个vnt的账号（并具有一定vnt币）

## 运行说明

- 下载/clone源码
- deploy文件夹下修改账户为你账户，执行npm instal，拿到的交易地址放在service/Blockchain/common.js
- 执行 npm install
- 配置数据库 app.js
- npm start 启动 默认3000端口号



## 技术架构

系统底层采用VNTChain智能合约，交互采用Vnt.js，表示层使用NodeJs+express架构，MongoDB存放用户账户信息。

## 感谢

感谢VNTChain提供区块链平台，感谢Nodejs提供高效的js运行容器，感谢MongoDB介于关系和非关系提供的分布式文件数据库。
