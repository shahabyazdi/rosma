import { createElement, HTMLAttributes, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';

const elements = [
  'p',
  'a',
  'span',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
] as const;

type ElementProps = {
  variant?: (typeof elements)[number];
  translate: (node: ReactNode) => string;
} & HTMLAttributes<HTMLParagraphElement>;

function Element({
  variant = 'p',
  translate,
  children,
  ...props
}: ElementProps) {
  return createElement(variant, props, translate(children));
}

export default function Provider({ translate, ...props }) {
  const components = Object.fromEntries(
    elements.map((variant) => [
      variant,
      (props) => <Element variant={variant} translate={translate} {...props} />,
    ])
  );

  return (
    <MDXProvider components={components}>
      <div {...props} />
    </MDXProvider>
  );
}
