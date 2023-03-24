import MDXProvider from '../src/provider/mdx_provider';
import LocaleProvider from '../src/provider/locale_provider';
import { AppProps } from 'next/app';
import { observer } from 'rosma';

import '../public/css/global.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const { data = {}, locales, locale } = pageProps;

  observer.set({ translate }, { silent: true });

  return (
    <LocaleProvider locales={locales} locale={locale}>
      <MDXProvider>
        <Component {...pageProps} />
      </MDXProvider>
    </LocaleProvider>
  );

  function translate(string: string) {
    return data[string] || string;
  }
}

export default CustomApp;
