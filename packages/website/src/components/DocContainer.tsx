import type {
	ApiItemJSON,
	TokenDocumentation,
	TypeParameterData,
	ApiClassJSON,
	ApiInterfaceJSON,
} from '@discordjs/api-extractor-utils';
import {
	Group,
	Stack,
	Title,
	Text,
	Box,
	MediaQuery,
	Aside,
	ScrollArea,
	Skeleton,
	Divider,
	useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Fragment, type PropsWithChildren } from 'react';
import {
	VscSymbolClass,
	VscSymbolMethod,
	VscSymbolEnum,
	VscSymbolInterface,
	VscSymbolVariable,
	VscListSelection,
	VscSymbolParameter,
} from 'react-icons/vsc';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, ghcolors } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { TableOfContentItems } from './TableOfContentItems';
import { TypeParamTable } from './TypeParamTable';
import { TSDoc } from './tsdoc/TSDoc';

type DocContainerProps = PropsWithChildren<{
	excerpt: string;
	extendsTokens?: TokenDocumentation[] | null;
	implementsTokens?: TokenDocumentation[][];
	kind: string;
	methods?: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] | null;
	name: string;
	properties?: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] | null;
	summary?: ApiItemJSON['summary'];
	typeParams?: TypeParameterData[];
}>;

function generateIcon(kind: string) {
	const icons = {
		Class: <VscSymbolClass />,
		Method: <VscSymbolMethod />,
		Function: <VscSymbolMethod />,
		Enum: <VscSymbolEnum />,
		Interface: <VscSymbolInterface />,
		TypeAlias: <VscSymbolVariable />,
	};

	return icons[kind as keyof typeof icons];
}

export function DocContainer({
	name,
	kind,
	excerpt,
	summary,
	typeParams,
	children,
	extendsTokens,
	implementsTokens,
	methods,
	properties,
}: DocContainerProps) {
	const router = useRouter();
	const matches = useMediaQuery('(max-width: 768px)');
	const { colorScheme } = useMantineColorScheme();

	return (
		<Group>
			<Stack sx={{ flexGrow: 1, maxWidth: '100%' }}>
				<Skeleton visible={router.isFallback} radius="sm">
					<Title sx={{ wordBreak: 'break-all' }} order={2} ml="xs">
						<Group>
							{generateIcon(kind)}
							{name}
						</Group>
					</Title>
				</Skeleton>

				<Skeleton visible={router.isFallback} radius="sm">
					<Section title="Summary" icon={<VscListSelection size={20} />} padded dense={matches}>
						{summary ? <TSDoc node={summary} /> : <Text>No summary provided.</Text>}
						<Divider size="md" mt={20} />
					</Section>
				</Skeleton>

				<Skeleton visible={router.isFallback} radius="sm">
					<Box pb="xs">
						<SyntaxHighlighter
							wrapLongLines
							language="typescript"
							style={colorScheme === 'dark' ? vscDarkPlus : ghcolors}
							codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
						>
							{excerpt}
						</SyntaxHighlighter>
					</Box>
				</Skeleton>

				{extendsTokens?.length ? (
					<Group pb="xs" noWrap>
						<Title order={3} ml="xs">
							Extends
						</Title>
						<Text sx={{ wordBreak: 'break-all' }} className="font-mono">
							<HyperlinkedText tokens={extendsTokens} />
						</Text>
					</Group>
				) : null}

				{implementsTokens?.length ? (
					<Group pb="xs" noWrap>
						<Title order={3} ml="xs">
							Implements
						</Title>
						<Text sx={{ wordBreak: 'break-all' }} className="font-mono">
							{implementsTokens.map((token, idx) => (
								<Fragment key={idx}>
									<HyperlinkedText tokens={token} />
									{idx < implementsTokens.length - 1 ? ', ' : ''}
								</Fragment>
							))}
						</Text>
					</Group>
				) : null}

				<Skeleton visible={router.isFallback} radius="sm">
					<Stack>
						{typeParams?.length ? (
							<Section
								title="Type Parameters"
								icon={<VscSymbolParameter size={20} />}
								padded
								dense={matches}
								defaultClosed
							>
								<TypeParamTable data={typeParams} />
							</Section>
						) : null}
						<Stack>{children}</Stack>
					</Stack>
				</Skeleton>
			</Stack>
			{(kind === 'Class' || kind === 'Interface') && (methods?.length || properties?.length) ? (
				<MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
					<Aside hiddenBreakpoint="lg" width={{ lg: 250 }} withBorder>
						<ScrollArea p="sm" offsetScrollbars>
							<TableOfContentItems properties={properties ?? []} methods={methods ?? []} />
						</ScrollArea>
					</Aside>
				</MediaQuery>
			) : null}
		</Group>
	);
}
