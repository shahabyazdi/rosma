const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const pages = './apps/website/pages';
const docs = './apps/website/src/docs';

function clear() {
  fs.readdirSync(pages).forEach((item) => {
    if (item.endsWith('.tsx')) return;

    removeDir(path.join(pages, item));
  });
}

function removeDir(dir) {
  fse.rmSync(dir, { recursive: true, force: true });
}

function translateDir(directory = docs) {
  fs.readdirSync(directory).forEach((dir) => {
    const fullPath = path.join(directory, dir);

    if (isDir(fullPath)) return translateDir(fullPath);
    if (!dir.endsWith('.mdx')) return;

    try {
      translateFile(fullPath, dir);
    } catch (e) {
      console.log(e);
    }
  });

  clearJunkFiles();
}

function isDir(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function getLocales() {
  const locales = './apps/website/src/locales';

  return fs
    .readdirSync(locales)
    .filter((item) => isDir(path.join(locales, item)));
}

function translateFile(filePath, fileName) {
  const file = fs.readFileSync(filePath, 'utf-8');
  const currentFilePath = path.join(pages, fileName);

  compareTranslate(currentFilePath, { file });

  getLocales().forEach((locale) => {
    createDirectoryIfNotExist(path.join(process.cwd(), pages, locale));

    const localeFilePath = path.join(pages, locale, fileName);

    compareTranslate(localeFilePath, { file, locale });
  });
}

function compareTranslate(dir, { file, locale }) {
  let oldTranslated;

  try {
    oldTranslated = fs.readFileSync(dir, 'utf-8');
  } catch {}

  let translated = translate(file, locale);

  if (oldTranslated !== translated) {
    fs.writeFileSync(dir, translated);
  }
}

function translate(string, locale = 'en') {
  const object = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        `./apps/website/src/locales/${locale}/index.json`
      ),
      'utf-8'
    )
  );

  let array = string.match(/(\w+\s)+\w+/gm) || [];

  array.forEach((item) => {
    if (typeof item !== 'string') return;

    string = string.replace(item, object[item] || item);
  });

  array = string.match(/\w+((\.\w+)+)?$/gm) || [];

  array.forEach((item) => {
    let value = getNestedValue(object, item);

    if (Array.isArray(value)) {
      value = value
        .map((item) => (Array.isArray(item) ? item.join(', ') : item))
        .join('\n\n');
    }

    string = string.replace(item, value || item);
  });

  return appendStaticProps(string, locale);
}

function appendStaticProps(string, locale) {
  if (!string.includes('import { getLocale }')) {
    string =
      `import { getLocale } from 'apps/website/src/utils/get_locale';
import { getLocales } from 'with_translate';

` + string;
  }

  if (string.includes('getStaticProps')) {
    string = string.replace(
      'getStaticProps({ locale',
      `getStaticProps({ locale = "${locale}"`
    );
  } else {
    string =
      string +
      `
export function getStaticProps({ locale = "${locale}" }) {
  return { props: { data: getLocale(locale), locales: getLocales(), locale } };
}`;
  }

  return string;
}

function createDirectoryIfNotExist(path) {
  if (fse.existsSync(path)) return;

  fse.mkdirSync(path, { recursive: true });
}

function getNestedValue(obj = {}, propString = '') {
  if (typeof obj !== 'object' || typeof propString !== 'string') return;

  const props = propString.split('.');
  let value = obj;

  for (const prop of props) {
    value = value[prop];

    if (value === undefined) return undefined;
  }

  return value;
}

function clearJunkFiles(dir = pages) {
  try {
    fs.readdirSync(dir).forEach((name) => {
      const fullDirectory = path.join(dir, name);
      const locales = getLocales();

      if (isDir(fullDirectory)) return clearJunkFiles(fullDirectory);
      if (!name.endsWith('.mdx')) return;

      const dirName = fullDirectory.match(
        new RegExp(`website\\${path.sep}pages\\${path.sep}(.*)?\\${path.sep}`)
      )?.[1];

      if (locales.includes(dirName) || typeof dirName === 'undefined') {
        const validFiles = fs.readdirSync(path.join(docs));

        if (!validFiles.includes(name)) removeDir(fullDirectory);
      } else {
        try {
          const validFiles = fs.readdirSync(path.join(docs, dirName));

          if (!validFiles.includes(name)) removeDir(path.join(docs, dirName));
        } catch (e) {
          removeDir(path.join(pages, dirName));
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}

class TranslatePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('TranslatePlugin', (compilation, callback) => {
      compilation.contextDependencies.add(path.resolve(__dirname, docs));

      compilation.contextDependencies.add(
        path.resolve(__dirname, './apps/website/src/locales')
      );

      translateDir();
      callback();
    });
  }
}

function preTranslate() {
  clear();
  translateDir();
}

function withTranslate(nextConfig = {}) {
  preTranslate();

  return Object.assign({}, nextConfig, {
    webpack: (config) => {
      config.plugins.push(new TranslatePlugin());

      return config;
    },
  });
}

module.exports = {
  clear,
  getLocales,
  withTranslate,
  getNestedValue,
};
