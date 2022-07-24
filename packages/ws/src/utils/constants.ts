import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Collection } from '@discordjs/collection';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { lazy } from './utils';
import type { OptionalWebSocketManagerOptions, SessionInfo } from '../ws/WebSocketManager';

/**
 * Valid encoding types
 */
export enum Encoding {
	JSON = 'json',
}

/**
 * Valid compression methods
 */
export enum CompressionMethod {
	ZlibStream = 'zlib-stream',
}

const packageJson = readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const Package = JSON.parse(packageJson);

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
export const DefaultDeviceProperty = `@discordjs/ws ${Package.version}`;

const getDefaultSessionStore = lazy(() => new Collection<number, SessionInfo | null>());

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions: OptionalWebSocketManagerOptions = {
	shardCount: null,
	shardIds: null,
	largeThreshold: null,
	initialPresence: null,
	identifyProperties: {
		browser: DefaultDeviceProperty,
		device: DefaultDeviceProperty,
		os: process.platform,
	},
	version: APIVersion,
	encoding: Encoding.JSON,
	compression: null,
	retrieveSessionInfo(shardId) {
		const store = getDefaultSessionStore();
		return store.get(shardId) ?? null;
	},
	updateSessionInfo(shardId: number, info: SessionInfo | null) {
		const store = getDefaultSessionStore();
		if (info) {
			store.set(shardId, info);
		} else {
			store.delete(shardId);
		}
	},
	handshakeTimeout: 30_000,
	helloTimeout: 60_000,
	readyTimeout: 15_000,
};

export const ImportantGatewayOpcodes = new Set([
	GatewayOpcodes.Heartbeat,
	GatewayOpcodes.Identify,
	GatewayOpcodes.Resume,
]);
