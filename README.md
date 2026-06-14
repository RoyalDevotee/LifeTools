# LifeTools 生活萬用工具邦

## 1. repo介紹:
這個repo裡的程式碼為靜態網站(HTML)，會被架設在Tencent Cloud的Edgeone。

## 2. 資料夾以及檔案的介紹
[/](/) 這是根目錄

[/config](/config) 這是放詮釋資料和設定等的地方

[/pages](/pages) 這裡是放各種小工具HTML的folder

[/scripts](/scripts) 這是放HTML腳本的地方

## 3. 檔案, 程式寫法
每個腳本程式的function或動作要有註解 (//)
每個function或變數要用駝峰式命名法(例如蛇形式是 get_user_data 駝峰式是 getUserData)

有任何寫法不會的可以問BrightSpecter或是找專門介紹那個檔案的.md 介紹檔
每個HTML程式都要在<head>的標籤內新增
```
<script src="/scripts/init.html"></script>
```
每個工具都要到/config/metadata.json註冊 不然不會出現在搜尋結果

## AI Prompt
給AI的prompt:
```md
你是一位資深的網頁前端工程師。請為「LifeTools 精緻工具箱」設計一個實用、美觀且具備現代感的小工具網頁。請嚴格遵守以下開發與設計規範：

---

### 1. 基礎規範與程式風格
1. **初始化腳本**：必須在 `<head>` 標籤內加入以下標籤：
   `<script src="/scripts/init.js"></script>`
2. **命名規範**：JavaScript 變數與函式必須使用「駝峰式命名法」（例如：`getUserData`, `calculateResult`）。
3. **程式註解**：每個函式或主要動作步驟，都必須撰寫單行註解（`//`）。
4. **架構限制**：這是一個單一的 HTML 檔案，所有的 CSS 必須寫在 `<style>` 標籤中，JavaScript 必須寫在 `<script>` 標籤中，不引用外部自訂的 CSS/JS 檔案（除了必要的圖標庫如 Font Awesome 或 Google Fonts）。

---

### 2. 響應式佈局 (Responsive Layout)
- **滿版適應**：網頁必須適應所有螢幕解析度（從手機到桌機）。使用 `box-sizing: border-box`、Flexbox 或 CSS Grid 進行排版。
- **捲動優化**：內容自動填充到最大可用空間。版面配置流暢，不論在哪種裝置上，使用者只需輕鬆上下滑動即可瀏覽完整內容，避免出現非必要的橫向滾動條。

---

### 3. 頂部導覽列 (Navigation Bar) 規範
頂部必須包含一條固定（或置頂）的導覽列，風格如下：
- **配色**：使用親和力高、溫暖的暖色系:柔和暖橘 `#FF8C00`（確保對比度足夠且視覺舒適）。
- **左側**：標題「Life Tools」，點擊連結至 `/`。
- **右側配置**：
  1. 連結「關於我們」，點擊連結至 `/pages/about.html`。
  2. 搜尋欄位：包含一個輸入框與搜尋按鈕。
     - 當使用者在輸入框按下「Enter」鍵，或點擊右側的搜尋按鈕時，必須跳轉至 `/pages/search.html?q=輸入內容`。
     - 需使用 JavaScript 處理此跳轉邏輯。

---

### 4. 視覺與動畫設計 (UI/UX)
- **現代感設計**：避免過時的扁平或粗糙排版。使用柔和圓角（`border-radius`）、細緻陰影（`box-shadow`）、漸層背景與適當的留白。
- **動畫動效**：
  - 頁面載入時需有流暢的淡入（Fade-in）或升起動畫。
  - 按鈕與互動元件必須有 Hover/Active 狀態的過渡動畫（`transition`），例如微幅放大、顏色漸變或陰影加深。
  - 互動反饋（如計算完成、防呆提示）需有平滑的動態呈現。
- **語言**: 語言為繁體中文。
- **版權聲明**: 每個頁面底下要有&copy; Royal Devotee (NeuralNexusLab X 0xseanlee), all rights reserved.

---

### 5. 本次要開發的工具功能需求：
[在此處輸入您想製作的小工具功能細節，例如：BMI 計算機、密碼產生器、單位換算器等]
```
