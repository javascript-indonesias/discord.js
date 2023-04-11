import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { getInput, setFailed } from '@actions/core';
import { create } from '@actions/glob';
import { connect } from '@planetscale/database';
import { fetch } from 'undici';

if (!process.env.DATABASE_URL) {
	setFailed('DATABASE_URL is not set');
}

const pkg = getInput('package', { required: true });
const version = getInput('version') || 'main';

const sql = connect({
	fetch,
	url: process.env.DATABASE_URL!,
});

const globber = await create(`docs/${pkg}/docs/docs.api.json`);
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	try {
		console.log(`Uploading ${file} with ${version}...`);
		await sql.execute('replace into documentation (version, data) values (?, ?)', [version, data]);
	} catch (error) {
		const err = error as Error;
		setFailed(err.message);
	}
}
