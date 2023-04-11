'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
	const pathname = usePathname();
	const href = pathname.split('/').slice(0, -1).join('/');

	return (
		<div className="mx-auto flex min-h-screen max-w-lg flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
			<Link
				className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
				href={href}
			>
				Take me back
			</Link>
		</div>
	);
}
