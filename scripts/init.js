(function () {
  "use strict";

  // 1. 宣告主控台警告文字的 CSS 樣式
  const warningHeaderStyle = "color: #FF3B30; font-size: 24px; font-weight: bold; background-color: #FFE5E5; padding: 8px 16px; border-radius: 4px; border: 1px solid #FF3B30;";
  const warningBodyStyle = "color: #EAEAEA; font-size: 14px; font-weight: bold; line-height: 1.8; margin-top: 10px;";

  // 2. 連續印出 10 次醒目的安全警示，防止被其他訊息洗掉
  for (let i = 1; i <= 10; i++) {
    console.log(`%c⚠️ 請注意！Security Warning [${i}/10] ⚠️`, warningHeaderStyle);
    console.log(
      `%c[${i}/10] 此控制台專供程式設計師偵錯使用。請勿在此輸入、貼上或執行任何來源不明的程式腳本，以免您的帳號與個人資料遭受惡意竊取！`, 
      warningBodyStyle
    );
  }

  // 3. 執行防劫持框架（Frame-busting）檢測，避免網頁被惡意內嵌於 iframe 中
  try {
    if (window.self !== window.top) {
      // 偵測到網頁處於 iframe 內部，將父視窗重導向至安全聲明頁面
      window.top.location.href = "/pages/embed.html";
    }
  } catch (error) {
    // 捕捉因跨網域（Cross-Origin）限制所導致的存取錯誤，並採取備用重導向機制
    window.parent.location.href = "/pages/embed.html";
  }

  // 4. 請求頻率限制器（1分鐘內超過 60 次 fetch 請求，則鎖定 5 分鐘）
  function trackRequestFrequency() {
    const now = Date.now();
    let requestHistory = [];

    try {
      // 從 localStorage 讀取請求歷史戳記陣列
      requestHistory = JSON.parse(localStorage.getItem("lifeToolsRequestHistory")) || [];
    } catch (e) {
      requestHistory = [];
    }

    // 僅保留過去 60 秒內（60000毫秒）發生的請求戳記
    requestHistory = requestHistory.filter(timestamp => now - timestamp < 60000);
    
    // 加入本次請求
    requestHistory.push(now);

    try {
      // 將過濾後的新陣列存回 localStorage
      localStorage.setItem("lifeToolsRequestHistory", JSON.stringify(requestHistory));
    } catch (e) {
      // 忽視隱私模式下 localStorage 寫入受阻的異常
    }

    // 當 1 分鐘內累積請求大於 60 次，啟動鎖定懲罰
    if (requestHistory.length > 60) {
      const penaltyEndTime = now + 5 * 60 * 1000; // 5分鐘後
      localStorage.setItem("lifeToolsLockoutEnd", penaltyEndTime);
      // 立即讓當前網頁變空白
      document.documentElement.innerHTML = "";
    }
  }

  // 8. 覆寫全域 fetch，針對本站設定檔進行防快取（Cache-Busting）處理並統計請求次數
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let requestUrl = "";

    // 進行全域請求次數累加監控
    trackRequestFrequency();

    // 判斷請求輸入類型，並提取出網址字串
    if (typeof input === "string") {
      requestUrl = input;
    } else if (input instanceof Request) {
      requestUrl = input.url;
    }

    // 僅針對本站內部的 .json 檔案或 /config/ 目錄下的請求進行防快取攔截
    const isLocalJson = requestUrl && (requestUrl.endsWith(".json") || requestUrl.includes("/config/"));
    
    if (isLocalJson) {
      // 串接時間戳記作為隨機參數，確保網址不重複
      const separator = requestUrl.includes("?") ? "&" : "?";
      const cacheBusterUrl = `${requestUrl}${separator}_t=${Date.now()}`;
      
      const newInit = init || {};
      newInit.cache = "no-store"; // 設定快取模式為不儲存

      // 根據原始傳入類型重組 Request 物件或網址字串
      if (input instanceof Request) {
        input = new Request(cacheBusterUrl, input);
      } else {
        input = cacheBusterUrl;
      }
      
      return originalFetch(input, newInit);
    }

    // 非設定檔之一般請求則維持原樣執行
    return originalFetch(input, init);
  };

})();
