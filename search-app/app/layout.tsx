import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";
import MainNav from "./components/MainNav";
// import ChatBotWidget from "./components/ChatBot";
// import FeedbackWrapper from "./components/FeedBack/FeedbackWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var theme=localStorage.getItem('ciencia-mx-theme');if(theme==='dark'||theme==='light'){document.documentElement.setAttribute('data-theme',theme);}}catch(e){}})();`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2B3F45XQZ4"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2B3F45XQZ4');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} page`}>
        <header className="header">
          <div className="header__top">
            <div className="header__brand">
              <a href="https://cienciaabierta.mx">
                <span className="header__brand__isotipo">
                  <img
                    src="/ca-isotipo.png"
                    alt="Ciencia Abierta MX"
                  />
                </span>
                <span className="header__brand__tipo">
                  <img
                    src="/ca-tipo.png"
                    alt="Ciencia Abierta MX"
                  />
                </span>
              </a>
            </div>
            {/* <div className="header__slogan">Plataforma de Indexación y Búsqueda de Repositorios</div> */}
          </div>
          <div className="header__bottom">
            <MainNav />
          </div>
        </header>
        <main className="main">
          {children}
        </main>
        <footer className="footer">
          <div className="footer__brand">
            <img
              src="/ca-isotipo.png"
              alt="Ciencia Abierta MX"
            />
          </div>
          <nav className="footer__nav">
            <Link href="/autores">Autores</Link>
            <Link href="/repositorios">Repositorios</Link>
            <Link href="/areas-conocimiento">Áreas de Conocimiento</Link>
            <Link href="/tipo-publicacion">Tipo de Publicación</Link>
          </nav>
          <div className="content-wrapper">
            <p>© {new Date().getFullYear()} CIENCIA ABIERTA MX. Todos los derechos reservados.</p>
          </div>
        </footer>
        {/* <ChatBotWidget /> */}
        {/* <FeedbackWrapper /> */}
      </body>
    </html>
  );
}
