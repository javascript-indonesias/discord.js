import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import { Separator } from './Seperator';

export interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string | undefined;
	defaultClosed?: boolean;
}

export function Section({ title, children, className, defaultClosed }: SectionProps) {
	const [collapsed, setCollapsed] = useState(defaultClosed ?? false);

	return (
		<div className={className}>
			<AnimatePresence initial={false}>
				<h3 className="flex gap-2 whitespace-pre-wrap font-semibold dark:text-white">
					<div onClick={() => setCollapsed(!collapsed)}>
						{collapsed ? <VscChevronRight size={20} /> : <VscChevronDown size={20} />}
					</div>
					{title}
				</h3>
				{collapsed ? null : (
					<>
						<motion.div
							transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
							key="content"
							initial="collapsed"
							animate="open"
							exit="collapsed"
							variants={{
								open: {
									opacity: 1,
									height: 'auto',
									paddingLeft: '1.75rem',
									paddingRight: '1.75rem',
									paddingBottom: '2.5rem',
								},
								collapsed: { opacity: 0, height: 0, paddingLeft: '1.75rem', paddingRight: '1.75rem', paddingBottom: 0 },
							}}
						>
							{children}
						</motion.div>
						<Separator />
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
