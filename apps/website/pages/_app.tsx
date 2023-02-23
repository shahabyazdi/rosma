import Head from 'next/head';
import MainLayout from '../src/layouts/main_layout';
import MDXProvider from '../src/provider/mdx_provider';
import DirectionProvider from '../src/provider/direction_provider';
import { AppProps } from 'next/app';
import { observer } from 'rosma';

import '../public/css/global.css';
import 'node_modules/prismjs/themes/prism.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const data = pageProps.data || {};

  observer.set({ translate }, { silent: true });

  return (
    <>
      <Head>
        <title>Rosma</title>
      </Head>
      <DirectionProvider>
        <MainLayout>
          <MDXProvider>
            <Component {...pageProps} />
          </MDXProvider>
        </MainLayout>
      </DirectionProvider>
    </>
  );

  function translate(string: string) {
    return data[string] || string;
  }
}

export default CustomApp;
