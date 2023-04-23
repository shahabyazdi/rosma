import { useState } from 'react';

export default function Pre({ children, raw, ...props }) {
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
