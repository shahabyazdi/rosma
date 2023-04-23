import { FC, createElement } from 'react';
import Link from '@/components/link';
import Pre from '@/components/pre';
import { MDXProvider } from '@mdx-js/react';
import { useObserver } from 'rosma';

const elements = [
  ['p'],
  ['h1'],
  ['h2'],
  ['h3'],
  ['h4'],
  ['h5'],
  ['h6'],
  ['li'],
  ['span'],
  ['strong'],
  ['a', Link],
  ['pre', Pre],
];

export default function Provider({ ...props }) {
  const { translate } = useObserver();

  const components = Object.fromEntries(
    elements.map(([name, Component]: [string, FC]) => [
      name,
      ({ children, ...props }) =>
        createElement(Component || name, props, translate(children)),
    ])
  );

  return (
    <MDXProvider components={components}>
      <div {...props} />
    </MDXProvider>
  );
}
