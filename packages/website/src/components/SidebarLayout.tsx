import type { getMembers, ApiItemJSON, ApiClassJSON, ApiInterfaceJSON } from '@discordjs/api-extractor-utils';
import { Button } from 'ariakit/button';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { type PropsWithChildren, useState, useEffect, useMemo, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { FiCommand } from 'react-icons/fi';
import {
	VscChevronDown,
	VscColorMode,
	VscGithubInverted,
	VscMenu,
	VscPackage,
	VscSearch,
	VscVersions,
} from 'react-icons/vsc';
import { useMedia /* useLockBodyScroll */ } from 'react-use';
import useSWR from 'swr';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { CmdKDialog } from './CmdK';
import { SidebarItems } from './SidebarItems';
import { useCmdK } from '~/contexts/cmdK';
import { PACKAGES } from '~/util/constants';
import { fetcher } from '~/util/fetcher';
import type { findMember } from '~/util/model.server';

export interface SidebarLayoutProps {
	branchName: string;
	data: {
		member: ReturnType<typeof findMember>;
		members: ReturnType<typeof getMembers>;
		searchIndex: any[];
		source: MDXRemoteSerializeResult;
	};
	packageName: string;

	selectedMember?: ApiItemJSON | undefined;
}

export type Members = SidebarLayoutProps['data']['members'];

export interface GroupedMembers {
	Classes: Members;
	Enums: Members;
	Functions: Members;
	Interfaces: Members;
	Types: Members;
	Variables: Members;
}

export function SidebarLayout({
	packageName,
	branchName,
	data,
	children,
}: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const dialog = useCmdK();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { data: versions } = useSWR<string[]>(`https://docs.discordjs.dev/api/info?package=${packageName}`, fetcher);
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);
	const packageMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });
	const versionMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });
	// useLockBodyScroll(opened);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}
	}, [matches]);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0]?.split(':')[0] ?? '');
	}, [router.asPath]);

	const packageMenuItems = useMemo(
		() => [
			<a key="discord.js" href="https://discord.js.org/#/docs/discord.js">
				<MenuItem
					className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
					state={packageMenu}
					onClick={() => packageMenu.setOpen(false)}
				>
					discord.js
				</MenuItem>
			</a>,
			...PACKAGES.map((pkg) => (
				<Link key={pkg} href={`/docs/packages/${pkg}/main`} passHref prefetch={false}>
					<MenuItem
						className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
						as="a"
						state={packageMenu}
						onClick={() => packageMenu.setOpen(false)}
					>
						{pkg}
					</MenuItem>
				</Link>
			)),
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const versionMenuItems = useMemo(
		() =>
			versions
				?.map((item) => (
					<Link key={item} href={`/docs/packages/${packageName}/${item}`} passHref prefetch={false}>
						<MenuItem
							className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
							as="a"
							state={versionMenu}
							onClick={() => versionMenu.setOpen(false)}
						>
							{item}
						</MenuItem>
					</Link>
				))
				.reverse() ?? [],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[versions, packageName],
	);

	const pathElements = useMemo(
		() =>
			asPathWithoutQueryAndAnchor
				.split('/')
				.slice(1)
				.map((path, idx, original) => (
					<Link key={idx} href={`/${original.slice(0, idx + 1).join('/')}`} prefetch={false}>
						<a className="focus:ring-width-2 focus:ring-blurple rounded outline-0 hover:underline focus:ring">{path}</a>
					</Link>
				)),
		[asPathWithoutQueryAndAnchor],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
				if (idx === 0) {
					return (
						<Fragment key={idx}>
							<div className="mx-2">/</div>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				if (idx !== array.length - 1) {
					return (
						<Fragment key={idx}>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				return <Fragment key={idx}>{el}</Fragment>;
			}),
		[pathElements],
	);

	return (
		<>
			<header className="dark:bg-dark-600 dark:border-dark-100 bg-light-600 border-light-800 fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-18 block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<Button
							className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
							aria-label="Menu"
							onClick={() => setOpened((open) => !open)}
						>
							<VscMenu size={24} />
						</Button>
						<div className="hidden md:flex md:flex-row">{breadcrumbs}</div>
						<div className="flex flex-row place-items-center gap-4">
							<Button
								as="div"
								className="dark:bg-dark-800 focus:ring-width-2 focus:ring-blurple rounded bg-white px-4 py-2.5 outline-0 focus:ring"
								onClick={() => dialog?.toggle()}
							>
								<div className="flex flex-row place-items-center gap-4">
									<VscSearch size={18} />
									<span className="opacity-65">Search...</span>
									<div className="opacity-65 flex flex-row place-items-center gap-2">
										<FiCommand size={18} /> K
									</div>
								</div>
							</Button>
							<Button
								as="a"
								className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded rounded-full border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
								aria-label="GitHub"
								href="https://github.com/discordjs/discord.js"
								target="_blank"
								rel="noopener noreferrer"
							>
								<VscGithubInverted size={24} />
							</Button>
							<Button
								className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded-full rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
								aria-label="Toggle theme"
								onClick={() => toggleTheme()}
							>
								<VscColorMode size={24} />
							</Button>
						</div>
					</div>
				</div>
			</header>
			<nav
				className={`h-[calc(100vh - 73px)] dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[73px] left-0 bottom-0 z-20 w-full border-r bg-white ${
					opened ? 'block' : 'hidden'
				} lg:w-76 lg:max-w-76 lg:block`}
			>
				<Scrollbars
					universal
					autoHide
					hideTracksWhenNotNeeded
					renderTrackVertical={(props) => (
						<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
					)}
					renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				>
					<div className="flex flex-col gap-3 px-3 pt-3">
						<MenuButton
							className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
							state={packageMenu}
						>
							<div className="flex flex-row place-content-between place-items-center">
								<div className="flex flex-row place-items-center gap-3">
									<VscPackage size={20} />
									<span className="font-semibold">{packageName}</span>
								</div>
								<VscChevronDown
									className={`transform transition duration-150 ease-in-out ${
										packageMenu.open ? 'rotate-180' : 'rotate-0'
									}`}
									size={20}
								/>
							</div>
						</MenuButton>
						<Menu
							className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
							state={packageMenu}
						>
							{packageMenuItems}
						</Menu>

						<MenuButton
							className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
							state={versionMenu}
						>
							<div className="flex flex-row place-content-between place-items-center">
								<div className="flex flex-row place-items-center gap-3">
									<VscVersions size={20} />
									<span className="font-semibold">{branchName}</span>
								</div>
								<VscChevronDown
									className={`transform transition duration-150 ease-in-out ${
										versionMenu.open ? 'rotate-180' : 'rotate-0'
									}`}
									size={20}
								/>
							</div>
						</MenuButton>
						<Menu
							className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
							state={versionMenu}
						>
							{versionMenuItems}
						</Menu>
					</div>

					<SidebarItems members={data?.members ?? []} setOpened={setOpened} />
				</Scrollbars>
			</nav>
			<main
				className={`pt-18 lg:pl-76 ${
					(data?.member?.kind === 'Class' || data?.member?.kind === 'Interface') &&
					((data.member as ApiClassJSON | ApiInterfaceJSON).methods?.length ||
						(data.member as ApiClassJSON | ApiInterfaceJSON).properties?.length)
						? 'xl:pr-64'
						: ''
				}`}
			>
				<article className="dark:bg-dark-600 bg-light-600">
					<div className="dark:bg-dark-800 relative z-10 min-h-[calc(100vh_-_70px)] bg-white p-6 pb-20 shadow">
						{children}
					</div>
					<div className="h-76 md:h-52" />
					<footer
						className={`dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16 ${
							(data?.member?.kind === 'Class' || data?.member?.kind === 'Interface') &&
							((data.member as ApiClassJSON | ApiInterfaceJSON).methods?.length ||
								(data.member as ApiClassJSON | ApiInterfaceJSON).properties?.length)
								? 'xl:pr-76'
								: 'xl:pr-16'
						}`}
					>
						<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
							<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
								<a
									href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
									className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
									target="_blank"
									rel="noopener noreferrer"
									title="Vercel"
								>
									<Image src={vercelLogo} alt="Vercel" />
								</a>
								<div className="flex flex-row gap-6 md:gap-12">
									<div className="flex flex-col gap-2">
										<div className="text-lg font-semibold">Community</div>
										<div className="flex flex-col gap-1">
											<a
												href="https://discord.gg/djs"
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												target="_blank"
												rel="noopener noreferrer"
											>
												Discord
											</a>
											<a
												href="https://github.com/discordjs/discord.js/discussions"
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												target="_blank"
												rel="noopener noreferrer"
											>
												GitHub discussions
											</a>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<div className="text-lg font-semibold">Project</div>
										<div className="flex flex-col gap-1">
											<a
												href="https://github.com/discordjs/discord.js"
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												target="_blank"
												rel="noopener noreferrer"
											>
												discord.js
											</a>
											<a
												href="https://discordjs.guide"
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												target="_blank"
												rel="noopener noreferrer"
											>
												discord.js guide
											</a>
											<a
												href="https://discord-api-types.dev"
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												target="_blank"
												rel="noopener noreferrer"
											>
												discord-api-types
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</article>
			</main>
			<CmdKDialog currentPackageName={packageName} currentVersion={branchName} />
		</>
	);
}
