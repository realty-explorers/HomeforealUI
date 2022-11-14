import { Server } from 'http';
import { WebsocketClient } from './websocket_client';
import * as WebSocket from 'ws';

interface WebsocketConnection {
	connect: (
		onConnection: (websocketClient: WebsocketClient) => void,
		onMessage: (message: string) => void,
		onClose: () => void,
		server?: Server,
		path?: string
	) => void;
	getClients: () => {};
	broadcast: (string: any) => void;
	send: (data: any, clientId: number) => void;
	close: () => void;
}

export default WebsocketConnection;
