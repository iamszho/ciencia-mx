'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ChatBotWidget() {
  return (
    <>
      <div id="chatbot-container"></div>
      <Script
        src="/chatbot-widget/assets/index-Dpw88i0v.js"
        strategy="afterInteractive"
      />
    </>
  );
}