import { useState } from 'react';
import { useObserver } from 'rosma';

export default function Pre({ children, raw, ...props }) {
  const { lang, setLang } = useObserver('js');
  const currentLang = props['data-language'];

  return (
    <pre
      {...props}
      style={{
        display:
          currentLang.includes(lang) || currentLang === 'bash'
            ? 'block'
            : 'none',
      }}
    >
      <div className="code-toolbar">
        <Copy text={raw} currentLang={currentLang} />
        {currentLang !== 'bash' && <Language lang={lang} setLang={setLang} />}
      </div>
      {children}
    </pre>
  );
}

function Copy({ text = '', currentLang }) {
  const [done, setDone] = useState(false);

  return (
    <div className="copy">
      <i onClick={copy} />
      {done && (
        <span style={{ right: currentLang === 'bash' ? '25px' : '50px' }}>
          Copied!
        </span>
      )}
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

function Language({ lang, setLang }) {
  return (
    <div className="lang">
      <i
        className={lang}
        onClick={() => setLang(lang === 'ts' ? 'js' : 'ts')}
      />
    </div>
  );
}
