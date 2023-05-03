import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { connect } from '@planetscale/database';

const sql = connect({
	async fetch(input, init) {
		// @ts-expect-error: Deleting cache or setting as undefined, same thing
		return fetch(input, { ...init, cache: undefined, next: { revalidate: 3_600 } });
	},
	url: process.env.DATABASE_URL!,
});

export async function fetchVersions(packageName: string): Promise<string[]> {
	const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}

export async function fetchModelJSON(packageName: string, version: string): Promise<unknown> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
		const res = await readFile(
			join(process.cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'),
			'utf8',
		);

		try {
			return JSON.parse(res);
		} catch {
			console.log(res);
			return {};
		}
	}

	const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
		packageName,
		version,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows[0].data;
}
