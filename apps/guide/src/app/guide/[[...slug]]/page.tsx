import { allContents } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '~/components/Mdx';

export async function generateStaticParams() {
	return allContents.map((content) => ({ slug: content.slug }));
}

export default function Page({ params }: { params: { slug: string[] } }) {
	const content = allContents.find((content) => content.slug === params.slug?.join('/'));

	if (!content) {
		notFound();
	}

	return (
		<article className="prose mx-auto max-w-4xl py-8">
			<Mdx code={content?.body.code ?? ''} />
		</article>
	);
}
