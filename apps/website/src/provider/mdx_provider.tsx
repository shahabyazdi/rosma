import { createElement } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useObserver } from 'rosma';

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
  'strong',
];

export default function Provider({ ...props }) {
  const { translate } = useObserver();

  const components = Object.fromEntries(
    elements.map((name) => [
      name,
      ({ children, ...props }) =>
        createElement(name, props, translate(children)),
    ])
  );

  return (
    <MDXProvider components={components}>
      <div {...props} />
    </MDXProvider>
  );
}
