import WebsocketConnection from './websocket_connection';
import { Server } from 'http';
import * as WebSocket from 'ws';
import WsWebsocketClient, { WebsocketClient } from './websocket_client';

export default class WsWebsocketConnection implements WebsocketConnection {
	private websocketServer: WebSocket.Server | undefined;
	private clients: { [date: number]: WebsocketClient };

	constructor() {
		this.clients = {};
	}

	public connect = (
		onConnection: (websocketClient: WebsocketClient) => void,
		onMessage: (message: string) => void,
		onClose: (message: string) => void,
		server?: Server,
		path?: string
	) => {
		if (server) {
			this.websocketServer = new WebSocket.Server({
				server,
				path,
			});
		} else {
			this.websocketServer = new WebSocket.Server({
				noServer: true,
				path,
			});
		}
		this.websocketServer.on('connection', (ws: WebSocket) => {
			const clientId = Date.now();
			var websocketClient: WebsocketClient = new WebsocketClient(ws);
			this.clients[clientId] = websocketClient;
			ws.on('close', () => {
				delete this.clients[clientId];
			});
			ws.on('message', (message) => {
				var m = message.toString().replace(/\\/g, '');
				m = m.substr(1, m.length - 2);
				onMessage(m);
			});
			onConnection(websocketClient);
		});
	};

	private broadcastClientsLocations = () => {
		var clientsLocations = Object.values(this.clients).map(
			(websocketClient) => websocketClient.getLocationInfo()
		);
		var data = { Topic: 'status', Data: clientsLocations };
		console.log(JSON.stringify(data));
		this.broadcast(JSON.stringify(data));
	};

	public getClients = () => {
		return this.clients;
	};

	public broadcast(data: string) {
		Object.values(this.clients).forEach((client) => {
			client.send(data);
		});
	}

	public send(data: any, clientId: number) {
		this.clients[clientId].send(data);
	}

	public close() {
		Object.values(this.clients).forEach((client) => {
			client.close();
		});
		this.websocketServer?.close();
	}
}
