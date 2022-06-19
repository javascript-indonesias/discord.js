import { createServer } from 'node:http';
import { proxyRequests } from '@discordjs/proxy';
import { REST } from '@discordjs/rest';

if (!process.env.DISCORD_TOKEN) {
	throw new Error('A DISCORD_TOKEN env var is required');
}

// We want to let upstream handle retrying
const api = new REST({ rejectOnRateLimit: () => true, retries: 0 }).setToken(process.env.DISCORD_TOKEN);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(proxyRequests(api));

const port = parseInt(process.env.PORT ?? '8080', 10);
server.listen(port, () => console.log(`Listening on port ${port}`));
