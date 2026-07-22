(function () {
  'use strict';

  if (document.getElementById('cs-ai-launcher-container')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cs-ai-launcher-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: none;
    }

    #cs-ai-launcher-container * {
      box-sizing: border-box;
      pointer-events: auto;
    }

    /* Floating Button */
    #cs-ai-trigger-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 8px 16px -6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #ffffff;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
      position: relative;
      outline: none;
      user-select: none;
    }

    #cs-ai-trigger-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.6), 0 12px 20px -6px rgba(0, 0, 0, 0.35);
    }

    #cs-ai-trigger-btn:active {
      transform: scale(0.95);
    }

    /* Tooltip */
    #cs-ai-tooltip {
      position: absolute;
      right: 76px;
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    #cs-ai-trigger-btn:hover #cs-ai-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }

    /* Popup Window */
    #cs-ai-popup {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 420px;
      height: 650px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom right;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.35s;
    }

    #cs-ai-popup.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Header */
    #cs-ai-header {
      padding: 14px 18px;
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    }

    .cs-ai-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cs-ai-avatar {
      width: 38px;
      height: 38px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .cs-ai-title-group {
      display: flex;
      flex-direction: column;
    }

    .cs-ai-title {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
      color: #ffffff;
    }

    .cs-ai-subtitle {
      font-size: 12px;
      margin: 2px 0 0 0;
      opacity: 0.85;
      font-weight: 400;
      color: #dbeafe;
    }

    #cs-ai-close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: #ffffff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      line-height: 1;
      transition: background 0.2s ease, transform 0.2s ease;
      outline: none;
    }

    #cs-ai-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    /* Body & Iframe */
    #cs-ai-body {
      flex: 1;
      width: 100%;
      height: calc(100% - 66px);
      background: transparent;
      position: relative;
    }

    #cs-ai-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      #cs-ai-launcher-container {
        bottom: 16px;
        right: 16px;
      }

      #cs-ai-popup {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        top: auto;
        width: 100vw;
        height: 90vh;
        max-width: 100vw;
        max-height: 90vh;
        border-radius: 24px 24px 0 0;
        border-bottom: none;
        transform: translateY(100%);
      }

      #cs-ai-popup.open {
        transform: translateY(0);
      }

      #cs-ai-tooltip {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // Container
  const container = document.createElement('div');
  container.id = 'cs-ai-launcher-container';

  // Popup Window
  const popup = document.createElement('div');
  popup.id = 'cs-ai-popup';

  // Header
  const header = document.createElement('div');
  header.id = 'cs-ai-header';

  const headerInfo = document.createElement('div');
  headerInfo.className = 'cs-ai-header-info';

  const avatar = document.createElement('div');
  avatar.className = 'cs-ai-avatar';
  avatar.textContent = '🤖';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'cs-ai-title-group';

  const title = document.createElement('h3');
  title.className = 'cs-ai-title';
  title.textContent = 'CareerSteps AI';

  const subtitle = document.createElement('p');
  subtitle.className = 'cs-ai-subtitle';
  subtitle.textContent = 'AI Career Guide';

  titleGroup.appendChild(title);
  titleGroup.appendChild(subtitle);
  headerInfo.appendChild(avatar);
  headerInfo.appendChild(titleGroup);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'cs-ai-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close Chat');

  header.appendChild(headerInfo);
  header.appendChild(closeBtn);

  // Body and Iframe
  const body = document.createElement('div');
  body.id = 'cs-ai-body';

  const iframe = document.createElement('iframe');
  iframe.id = 'cs-ai-iframe';
  iframe.src = 'chatbot-ui.html';
  iframe.title = 'CareerSteps AI Chat Interface';

  body.appendChild(iframe);
  popup.appendChild(header);
  popup.appendChild(body);

  // Trigger Button
  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'cs-ai-trigger-btn';
  triggerBtn.innerHTML = '🤖';
  triggerBtn.setAttribute('aria-label', 'Open CareerSteps AI');

  const tooltip = document.createElement('div');
  tooltip.id = 'cs-ai-tooltip';
  tooltip.textContent = 'CareerSteps AI';
  triggerBtn.appendChild(tooltip);

  container.appendChild(popup);
  container.appendChild(triggerBtn);

  const init = () => {
    document.body.appendChild(container);

    let isOpen = false;

    const toggleChat = () => {
      isOpen = !isOpen;
      if (isOpen) {
        popup.classList.add('open');
      } else {
        popup.classList.remove('open');
      }
    };

    triggerBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = true;
      toggleChat();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
