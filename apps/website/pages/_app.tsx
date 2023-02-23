import { AppProps } from 'next/app';
import Head from 'next/head';
import MDXProvider from '../src/provider/mdx';

import '../public/css/global.css';
import 'node_modules/prismjs/themes/prism.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const data = pageProps.data || {};

  return (
    <>
      <Head>
        <title>Welcome to website!</title>
      </Head>
      <MDXProvider translate={translate}>
        <Component {...pageProps} />
      </MDXProvider>
    </>
  );

  function translate(string: string) {
    return data[string] || string;
  }
}

export default CustomApp;
