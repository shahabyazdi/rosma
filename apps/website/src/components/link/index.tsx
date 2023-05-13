import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export type LinkProps = NextLinkProps & { children: ReactNode };

export default function Link({ locale, href, children, ...props }: LinkProps) {
  const { locale: currentLocale, pathname } = useRouter();

  href = (href || '').toString();

  if (!locale) locale = currentLocale;
  if (href.startsWith('#') && !href.includes(pathname)) href = pathname + href;

  const prefix = locale === 'en' ? '' : locale;

  return (
    <NextLink href={href.includes(locale) ? href : prefix + href} {...props}>
      {children}
    </NextLink>
  );
}
