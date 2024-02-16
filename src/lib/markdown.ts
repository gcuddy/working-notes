// TODO: want to use the portaljs one but it imports fs and path >:(
// import wikiLinkPlugin from '@portaljs/remark-wiki-link';
import remarkWikiLink from 'remark-wiki-link';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';

export const useProcessor = (permalinks: { slug: string; id: string }[]) =>
	unified()
		.use(remarkParse as any)
		.use(remarkFrontmatter as any)
		.use(remarkGfm)
		.use(remarkSmartypants)
		// TODO: write plugin to get ids
		// .use(wikiLinkPlugin)
		.use(remarkWikiLink, {
			//
			permalinks: permalinks.map((p) => p.slug),
			pageResolver: (name: string) => {
				const p = permalinks.find((p) => p.slug === name);
				console.log({ p, permalinks, name });
				if (p) {
					return [`${p.id}`];
				}
				return [`${name}`];
			},
			hrefTemplate: (permalink) => {
				return `/${permalink}`;
			}
		})
		.use(remarkRehype, {
			allowDangerousHtml: true,
			passThrough: []
		})
		.use(rehypeRaw)
		.use(rehypeStringify, { allowDangerousHtml: true });
