import { createElement, useState } from 'react';
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
    <MDXProvider components={{ ...components, pre: Pre }}>
      <div {...props} />
    </MDXProvider>
  );
}

function Pre({ children, raw, ...props }) {
  return (
    <pre {...props}>
      <Copy text={raw} />
      {children}
    </pre>
  );
}

function Copy({ text = '' }) {
  const [done, setDone] = useState(false);

  return (
    <div className="copy">
      <i onClick={copy} />
      {done && <span>Copied!</span>}
    </div>
  );

  function copy() {
    try {
      navigator.clipboard.writeText(text.trim());

      setDone(true);
      setTimeout(() => setDone(false), 700);
    } catch {}
  }
}
