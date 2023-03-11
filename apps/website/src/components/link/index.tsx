import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export type LinkProps = NextLinkProps & { children: ReactNode };

export default function Link({ locale, href, children, ...props }: LinkProps) {
  const { locale: currentLocale } = useRouter();

  if (!locale) locale = currentLocale;

  const prefix = locale === 'en' ? '' : locale;

  return (
    <NextLink href={prefix + href} {...props}>
      {children}
    </NextLink>
  );
}
