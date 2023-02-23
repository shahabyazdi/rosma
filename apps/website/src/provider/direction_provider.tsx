import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';

const cache = createCache({
  key: 'rtl',
  stylisPlugins: [rtlPlugin],
});

export default function DirectionProvider({ children }) {
  const { locale } = useRouter();

  return locale == 'fa' ? <RTL>{children}</RTL> : children;
}

function RTL(props) {
  return (
    <div dir="rtl">
      <CacheProvider value={cache}>{props.children}</CacheProvider>
    </div>
  );
}
