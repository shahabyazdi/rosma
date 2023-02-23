export function getNestedValue(obj = {}, propString = '') {
  if (typeof obj !== 'object') return;

  const props = propString.split('.');
  let value = obj;

  for (const prop of props) {
    value = value[prop];

    if (value === undefined) return undefined;
  }

  return value;
}
