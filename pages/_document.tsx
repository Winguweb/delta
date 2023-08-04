import { Head, Html, Main, NextScript } from 'next/document';

//@ts-ignore
export default function Document(props) {
  return (
    <Html lang="es">
      <Head>
        <meta
          name="description"
          content="Delta."
        />
        <meta name="theme-color" content="#346AF0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
