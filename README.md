# Restaurant 餐廳清單

此專案提供使用者註冊、登入後可以搜尋、查找餐廳的資訊，例如：餐廳類別、餐廳名稱以及CRUD新增、編輯、刪除功能

## Features 功能列表
### 使用者可以註冊帳號，註冊的資料包括：名字、email、密碼、確認密碼。
### 使用者也可以透過 Facebook Login 直接登入
### 使用者的密碼要使用 bcrypt 來處理
### 使用者必須登入才能使用餐廳清單
### 使用者可以在首頁看到所有餐廳以及編輯資料：
- 餐廳照片、名稱、分類、評分
- 新增餐廳
- 瀏覽一家餐廳的詳細資訊
- 瀏覽全部餐廳
- 修改一家餐廳的資訊
- 刪除一家餐廳
- 首頁可以經由下拉選單排序餐廳
### 使用者可以查看餐廳的詳細資訊以及編輯資料：
- 類別
- 地址
- 電話
- 描述
- 圖片
### 使用者可以透過搜尋餐廳名稱來找到特定的餐廳
### 使用者可以透過搜尋餐廳類別來找到特定的餐廳

## Environment 環境
Node.js
需先設定環境變數為development，在終端機輸入export NODE_ENV=development


## Installation 安裝
開啟終端機(Terminal)並進到專案路徑，執行以下指令：
```bash
git clone https://github.com/PedroBWDF/restaurants.git
```
初始
```bash
cd restaurants  # 切至專案資料夾
npm install  # 安裝套件
```
需先設定環境變數為development，在終端機輸入
```bash
export NODE_ENV=development
```
執行程式
```bash
npm run dev
```
請開啟瀏覽器輸入 [http://localhost:3000](http://localhost:3000) 執行
