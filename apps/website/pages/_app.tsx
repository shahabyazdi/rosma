import Head from 'next/head';
import MainLayout from '../src/layouts/main_layout';
import MDXProvider from '../src/provider/mdx_provider';
import LocaleProvider from '../src/provider/locale_provider';
import { AppProps } from 'next/app';
import { observer } from 'rosma';

import '../public/css/global.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const { data = {}, locales, locale } = pageProps;

  observer.set({ translate }, { silent: true });

  return (
    <>
      <Head>
        <title>Rosma</title>
      </Head>
      <LocaleProvider locales={locales} locale={locale}>
        <MainLayout>
          <MDXProvider>
            <Component {...pageProps} />
          </MDXProvider>
        </MainLayout>
      </LocaleProvider>
    </>
  );

  function translate(string: string) {
    return data[string] || string;
  }
}

export default CustomApp;
