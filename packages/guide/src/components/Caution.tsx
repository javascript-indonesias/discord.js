import type { PropsWithChildren } from 'react';
import { VscWarning } from 'react-icons/vsc';

export function Caution({ children }: PropsWithChildren<{}>) {
	return (
		<div className="my-4">
			<div className="relative flex">
				<div className="p-4">{children}</div>
				<div className="absolute flex h-full w-full">
					<div className="rounded-tl-1.5 rounded-bl-1.5 w-4 shrink-0 border-t-2 border-b-2 border-l-2 border-red-500" />
					<div className="relative border-b-2 border-red-500">
						<div className="-translate-y-50% flex place-items-center gap-2 px-2 text-red-500">
							<VscWarning size={20} />
							<span className="font-semibold text-red-500">Caution</span>
						</div>
					</div>
					<div className="rounded-tr-1.5 rounded-br-1.5 flex-1 border-t-2 border-b-2 border-r-2 border-red-500" />
				</div>
			</div>
		</div>
	);
}
