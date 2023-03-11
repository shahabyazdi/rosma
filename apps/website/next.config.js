//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextMdx = require('@next/mdx');
const remarkPrism = require('remark-prism');
const { withNx } = require('@nrwl/next/plugins/with-nx');
const { withTranslate } = require('../../with_translate');

const withMdx = nextMdx({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkPrism],
  },
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
};

module.exports = withMdx(withTranslate(withNx(nextConfig)));
