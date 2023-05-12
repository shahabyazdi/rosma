import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { getLocales } from 'with_translate';

export default function Document(props: DocumentProps) {
  const lang = getLocales().find((locale) =>
    props.dangerousAsPath?.includes?.('/' + locale)
  );

  return (
    <Html lang={lang || 'en'}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300&family=Vazirmatn:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
