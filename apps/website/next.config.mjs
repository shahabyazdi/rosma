//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
import nextMdx from '@next/mdx';
import remarkPrism from 'remark-prism';
import { withNx } from '@nrwl/next/plugins/with-nx.js';
import { withTranslate } from '../../with_translate.js';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const withMdx = nextMdx({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkPrism],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
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
  basePath: process.env.NODE_ENV === 'development' ? '' : '/rosma',
};

export default withMdx(withTranslate(withNx(nextConfig)));
