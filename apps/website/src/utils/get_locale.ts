export function getLocale(locale = 'en', props?: Array<string>) {
  const fs = require('fs');
  const path = `apps/website/src/locales/${locale}/index.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  const { getNestedValue } = require('with_translate');

  if (!Array.isArray(props)) props = [];
  if (!props.includes('common')) props.unshift('common');

  const array = props.map((prop) => getNestedValue(data, prop) || {});

  return array.reduce((a, b) => ({ ...a, ...b }));
}
