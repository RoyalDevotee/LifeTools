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
})();
