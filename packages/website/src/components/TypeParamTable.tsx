import { Box, ScrollArea } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './tsdoc/TSDoc';
import type { TypeParameterData } from '~/DocModel/TypeParameterMixin';

export function TypeParamTable({ data }: { data: TypeParameterData[] }) {
	const rows = data.map((typeParam) => ({
		Name: typeParam.name,
		Constraints: <HyperlinkedText tokens={typeParam.constraintTokens} />,
		Optional: typeParam.optional ? 'Yes' : 'No',
		Default: <HyperlinkedText tokens={typeParam.defaultTokens} />,
		Description: typeParam.commentBlock ? <TSDoc node={typeParam.commentBlock} /> : 'None',
	}));

	const rowElements = {
		Name: 'font-mono whitespace-nowrap',
		Constraints: 'font-mono whitespace-pre break-normal',
		Default: 'font-mono whitespace-pre break-normal',
	};

	return (
		<Box sx={{ overflowX: 'auto' }}>
			<ScrollArea type="auto">
				<Table
					columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
					rows={rows}
					columnStyles={rowElements}
				/>
			</ScrollArea>
		</Box>
	);
}
