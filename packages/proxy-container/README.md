<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/@discordjs/proxy"><img src="https://img.shields.io/npm/v/@discordjs/proxy.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@discordjs/proxy"><img src="https://img.shields.io/npm/dt/@discordjs/proxy.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Build status" /></a>
  </p>
</div>

## About

`@discordjs/proxy-container` - Lightweight HTTP proxy for Discord's API, brought to you as a container 📦

## Usage

Quickly spin up an instance:

`docker run -d --restart unless-stopped --name proxy -p 127.0.0.1:8080:8080 -e DISCORD_TOKEN=abc discordjs/proxy`

Use it:

```ts
import { Client } from 'discord.js';
import { ProxyAgent } from 'undici';

const client = new Client({
	// other options,
	rest: {
		agent: new ProxyAgent('https://localhost:8080'),
	},
});
```

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [Documentation](https://discord.js.org/#/docs/proxy)
- [discord.js Discord server](https://discord.gg/djs)
- [GitHub](https://github.com/discordjs/discord.js/tree/main/packages/proxy)
- [npm](https://www.npmjs.com/package/@discordjs/proxy)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs/proxy).  
See [the contribution guide](https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [discord.js Server](https://discord.gg/djs).
