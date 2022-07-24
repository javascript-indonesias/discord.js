import { REST } from '@discordjs/rest';
import {
	GatewayDispatchEvents,
	GatewayDispatchPayload,
	GatewayOpcodes,
	GatewaySendPayload,
} from 'discord-api-types/v10';
import { MockAgent, Interceptable } from 'undici';
import { beforeEach, test, vi, expect, afterEach } from 'vitest';
import {
	WorkerRecievePayload,
	WorkerSendPayload,
	WebSocketManager,
	WorkerSendPayloadOp,
	WorkerRecievePayloadOp,
	WorkerShardingStrategy,
	WebSocketShardEvents,
	SessionInfo,
} from '../../src';

let mockAgent: MockAgent;
let mockPool: Interceptable;

const mockConstructor = vi.fn();
const mockSend = vi.fn();
const mockTerminate = vi.fn();

const memberChunkData: GatewayDispatchPayload = {
	op: GatewayOpcodes.Dispatch,
	s: 123,
	t: GatewayDispatchEvents.GuildMembersChunk,
	d: {
		guild_id: '123',
		members: [],
	},
};

const sessionInfo: SessionInfo = {
	shardId: 0,
	shardCount: 2,
	sequence: 123,
	sessionId: 'abc',
};

vi.mock('node:worker_threads', async () => {
	const { EventEmitter }: typeof import('node:events') = await vi.importActual('node:events');
	class MockWorker extends EventEmitter {
		public constructor(...args: any[]) {
			super();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			mockConstructor(...args);
			// need to delay this by an event loop cycle to allow the strategy to attach a listener
			setImmediate(() => this.emit('online'));
		}

		public postMessage(message: WorkerSendPayload) {
			switch (message.op) {
				case WorkerSendPayloadOp.Connect: {
					const response: WorkerRecievePayload = {
						op: WorkerRecievePayloadOp.Connected,
						shardId: message.shardId,
					};
					this.emit('message', response);
					break;
				}

				case WorkerSendPayloadOp.Destroy: {
					const response: WorkerRecievePayload = {
						op: WorkerRecievePayloadOp.Destroyed,
						shardId: message.shardId,
					};
					this.emit('message', response);
					break;
				}

				case WorkerSendPayloadOp.Send: {
					if (message.payload.op === GatewayOpcodes.RequestGuildMembers) {
						const response: WorkerRecievePayload = {
							op: WorkerRecievePayloadOp.Event,
							shardId: message.shardId,
							event: WebSocketShardEvents.Dispatch,
							data: memberChunkData,
						};
						this.emit('message', response);

						// Fetch session info
						const sessionFetch: WorkerRecievePayload = {
							op: WorkerRecievePayloadOp.RetrieveSessionInfo,
							shardId: message.shardId,
							nonce: Math.random(),
						};
						this.emit('message', sessionFetch);
					}

					mockSend(message.shardId, message.payload);
					break;
				}

				case WorkerSendPayloadOp.SessionInfoResponse: {
					message.session ??= sessionInfo;

					const session: WorkerRecievePayload = {
						op: WorkerRecievePayloadOp.UpdateSessionInfo,
						shardId: message.session.shardId,
						session: { ...message.session, sequence: message.session.sequence + 1 },
					};
					this.emit('message', session);
					break;
				}
			}
		}

		public terminate = mockTerminate;
	}

	return {
		Worker: MockWorker,
	};
});

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	mockPool = mockAgent.get('https://discord.com');
});

afterEach(() => {
	mockConstructor.mockRestore();
	mockSend.mockRestore();
	mockTerminate.mockRestore();
});

test('spawn, connect, send a message, session info, and destroy', async () => {
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');

	const mockRetrieveSessionInfo = vi.fn();
	const mockUpdateSessionInfo = vi.fn();
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		rest,
		shardIds: [0, 1],
		retrieveSessionInfo: mockRetrieveSessionInfo,
		updateSessionInfo: mockUpdateSessionInfo,
	});

	const managerEmitSpy = vi.spyOn(manager, 'emit');

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(() => ({
			data: {
				shards: 1,
				session_start_limit: {
					max_concurrency: 3,
					reset_after: 60,
					remaining: 3,
					total: 3,
				},
				url: 'wss://gateway.discord.gg',
			},
			statusCode: 200,
			responseOptions: {
				headers: {
					'content-type': 'application/json',
				},
			},
		}));

	const strategy = new WorkerShardingStrategy(manager, { shardsPerWorker: 'all' });
	manager.setStrategy(strategy);

	await manager.connect();
	expect(mockConstructor).toHaveBeenCalledWith(
		expect.stringContaining('worker.cjs'),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		expect.objectContaining({ workerData: expect.objectContaining({ shardIds: [0, 1] }) }),
	);

	const payload: GatewaySendPayload = { op: GatewayOpcodes.RequestGuildMembers, d: { guild_id: '123', limit: 0 } };
	await manager.send(0, payload);
	expect(mockSend).toHaveBeenCalledWith(0, payload);
	expect(managerEmitSpy).toHaveBeenCalledWith(WebSocketShardEvents.Dispatch, {
		...memberChunkData,
		shardId: 0,
	});
	expect(mockRetrieveSessionInfo).toHaveBeenCalledWith(0);
	expect(mockUpdateSessionInfo).toHaveBeenCalledWith(0, { ...sessionInfo, sequence: sessionInfo.sequence + 1 });

	await manager.destroy({ reason: 'souji is a soft boi :3' });
	expect(mockTerminate).toHaveBeenCalled();
});
