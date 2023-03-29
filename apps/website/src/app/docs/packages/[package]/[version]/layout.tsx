import { addPackageToModel } from '@discordjs/scripts';
import type { ApiFunction, ApiItem } from '@microsoft/api-extractor-model';
import { ApiModel } from '@microsoft/api-extractor-model';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import { fetchModelJSON, fetchVersions } from '~/app/docAPI';
import { CmdKDialog } from '~/components/CmdK';
import { Nav } from '~/components/Nav';
import type { SidebarSectionItemData } from '~/components/Sidebar';
import { resolveItemURI } from '~/components/documentation/util';
import { N_RECENT_VERSIONS, PACKAGES } from '~/util/constants';

const Header = dynamic(async () => import('~/components/Header'));
const Footer = dynamic(async () => import('~/components/Footer'));

export interface VersionRouteParams {
	package: string;
	version: string;
}

export async function generateStaticParams() {
	const params: VersionRouteParams[] = [];

	await Promise.all(
		PACKAGES.map(async (packageName) => {
			const versions = (await fetchVersions(packageName)).slice(-N_RECENT_VERSIONS);

			params.push(...versions.map((version) => ({ package: packageName, version })));
		}),
	);

	return params;
}

function serializeIntoSidebarItemData(item: ApiItem): SidebarSectionItemData {
	return {
		kind: item.kind,
		name: item.displayName,
		href: resolveItemURI(item),
		overloadIndex: 'overloadIndex' in item ? (item.overloadIndex as number) : undefined,
	};
}

export default async function PackageLayout({ children, params }: PropsWithChildren<{ params: VersionRouteParams }>) {
	const modelJSON = await fetchModelJSON(params.package, params.version);
	const model = addPackageToModel(new ApiModel(), modelJSON);

	const pkg = model.tryGetPackageByName(params.package);

	if (!pkg) {
		notFound();
	}

	const entry = pkg.entryPoints[0];

	if (!entry) {
		notFound();
	}

	const members = entry.members.filter((member) => {
		if (member.kind !== 'Function') {
			return true;
		}

		return (member as ApiFunction).overloadIndex === 1;
	});

	return (
		<Providers>
			<main className="mx-auto max-w-7xl px-4 lg:max-w-full">
				<Header />
				<div className="relative top-6 mx-auto max-w-7xl gap-6 lg:flex lg:max-w-full">
					<div className="lg:top-23 lg:sticky lg:h-[calc(100vh_-_100px)]">
						<Nav members={members.map((member) => serializeIntoSidebarItemData(member))} />
					</div>

					<div className="min-w-xs mx-auto w-full max-w-5xl pb-10">
						{children}
						<Footer />
					</div>
				</div>
			</main>
			<CmdKDialog />
		</Providers>
	);
}
