import { getNestedValue } from './get_nested_prop_in_object';

export function getLocale(locale = 'en', prop = '') {
  const fs = require('fs');
  const path = `apps/website/src/locales/${locale}/index.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

  return getNestedValue(data, prop) || {};
}
