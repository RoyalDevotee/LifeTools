(function () {
  "use strict";

  // 1. 宣告主控台警告文字的 CSS 樣式
  const warningHeaderStyle = "color: #FF3B30; font-size: 24px; font-weight: bold; background-color: #FFE5E5; padding: 8px 16px; border-radius: 4px; border: 1px solid #FF3B30;";
  const warningBodyStyle = "color: #2C3E50; font-size: 14px; font-weight: bold; line-height: 1.8; margin-top: 10px;";

  // 2. 於控制台印出醒目的安全警示，防止 Self-XSS 社交工程攻擊
  console.log("%c⚠️ 請注意！Security Warning ⚠️", warningHeaderStyle);
  console.log(
    "%c此控制台專供程式設計師偵錯使用。請勿在此輸入、貼上或執行任何來源不明的程式腳本，以免您的帳號與個人資料遭受惡意竊取！", 
    warningBodyStyle
  );

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

  // 4. 監測網頁核心 HTML 結構，防範使用者手動篡改
  function startHtmlMonitoring() {
    const targetNode = document.documentElement;
    
    // 設定觀察選項，監控子節點變化、屬性變化及所有子樹節點
    const observerConfig = {
      childList: true,
      attributes: true,
      subtree: true
    };

    // 變更事件觸發時的監聽函式
    const callback = function (mutationsList) {
      for (const mutation of mutationsList) {
        const mutatedElement = mutation.target;

        // 定義不可被變更的靜態核心結構條件
        //（包含：<head> 標籤、其中的腳本、以及底部的版權宣告區）
        const isHeadChanged = mutatedElement.tagName === "HEAD" || mutatedElement.closest("head") !== null;
        const isScriptChanged = mutatedElement.tagName === "SCRIPT" || mutation.addedNodes[0]?.tagName === "SCRIPT" || mutation.removedNodes[0]?.tagName === "SCRIPT";
        const isFooterChanged = mutatedElement.closest("footer") !== null || (mutatedElement.classList && mutatedElement.classList.contains("footer"));

        if (isHeadChanged || isScriptChanged || isFooterChanged) {
          // 偵測到使用者手動刪除/修改靜態核心元件，立即重新載入網頁以還原預設狀態
          window.location.reload();
          break;
        }
      }
    };

    // 宣告並啟動 DOM 監聽器
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(targetNode, observerConfig);
  }

  // 5. 確保 DOM 載入完成後再啟動監聽器，避免與瀏覽器初始解析衝突
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHtmlMonitoring);
  } else {
    startHtmlMonitoring();
  }

  // 6. 覆寫全域 fetch，針對本站設定檔進行防快取（Cache-Busting）處理
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let requestUrl = "";

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
