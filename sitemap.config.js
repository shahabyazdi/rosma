/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shahabyazdi.github.io/rosma',
  sourceDir: 'dist/apps/website/.next',
  outDir: 'dist/apps/website/exported',
  exclude: ['/en', '/en/*'],
};
