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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css"
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
