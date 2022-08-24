import { Stack } from '@mantine/core';
import { CodeListing } from './CodeListing';
import type { ApiPropertyItemJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function PropertyList({ data }: { data: ApiPropertyItemJSON[] }) {
	return (
		<Stack>
			{data.map((prop) => (
				<CodeListing
					key={prop.name}
					name={prop.name}
					typeTokens={prop.propertyTypeTokens}
					readonly={prop.readonly}
					optional={prop.optional}
					summary={prop.summary}
					comment={prop.comment}
					deprecation={prop.deprecated}
					inheritanceData={prop.inheritanceData}
				/>
			))}
		</Stack>
	);
}
