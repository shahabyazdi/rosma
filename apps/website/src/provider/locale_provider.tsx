import { useEffect, useLayoutEffect } from 'react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';

const cache = createCache({
  key: 'rtl',
  stylisPlugins: [rtlPlugin],
});

export default function LocaleProvider({ children, locales = [], locale }) {
  const router = useRouter();

  router.defaultLocale = 'en';
  router.locale = 'en';
  router.locales = locales;

  if (locale) {
    addLocale(locale);
  } else {
    locales.forEach((locale) => {
      if (router.pathname.startsWith('/' + locale)) addLocale(locale);
    });
  }

  if (!router.pathname) router.pathname = '/';

  const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
  const isRtl = ['fa'].includes(router.locale);

  effect(() => {
    document.documentElement.lang = router.locale;
  }, [router.locale]);

  return isRtl ? <RTL>{children}</RTL> : children;

  function addLocale(locale) {
    router.locale = locale;
    router.pathname = router.pathname.replace('/' + locale, '');
  }
}

function RTL(props) {
  return (
    <div dir="rtl">
      <CacheProvider value={cache}>{props.children}</CacheProvider>
    </div>
  );
}
