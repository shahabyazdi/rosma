/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://rosma.dev',
  sourceDir: 'dist/apps/website/.next',
  outDir: 'dist/apps/website/exported',
  exclude: ['/en', '/en/*'],
  generateRobotsTxt: true,
  robotsTxtOptions: { policies: [{ userAgent: '*', disallow: '' }] },
};
