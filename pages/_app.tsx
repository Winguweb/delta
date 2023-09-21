import '@fontsource/quicksand';
import '@fontsource/poppins';
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { responseTransformer } from '../axios/transformers';
import '../styles/globals.css';
import { Header } from '../components/molecules/Header';

axios.defaults.transformResponse = [responseTransformer];

// @ts-ignore
export default function MyApp({ Component, pageProps }) {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker.register("/sw.js").then((registration) => console.log('scope is: ', registration.scope))
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <div className={`min-h-screen flex flex-col ${showScroll}`}>
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <Script
          // strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script id="my-script"
        // strategy="lazyOnload"
        >
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
        `}
        </Script>
        <Script id="my-script-hotjar" strategy="lazyOnload">
          {`
          (function (h, o, t, j, a, r) {
            h.hj =
              h.hj ||
              function () {
                (h.hj.q = h.hj.q || []).push(arguments);
              };
            h._hjSettings = { hjid: 3272366, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        `}
        </Script>
        <Header onMenuOpening={handleDisableScroll} />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
