import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'http';
import { fsync, readFileSync } from 'fs';
// import { Server, createServer, ServerOptions } from 'https';
import router from '../../api';
import WebsocketConnection from '../websocket/websocket_connection';

class App {
	public app: express.Application;
	private server: Server | undefined;

	constructor(
		app: express.Application,
	) {
		this.app = app;
		this.initializeMiddlewares();
		this.app.use(
			'/api/v1/',
			router()
		);
	}

	public startServer(port: string) {
		this.server = this.app.listen(port, () => {
			console.log(`App listening on the port ${port}`);
			console.log(`rev 3`);
		});
	}

	public stopServer() {
		if (this.server) this.server.close();
	}

	public getServer() {
		return this.server;
	}

	private initializeMiddlewares() {
		this.app.get('/', (req, res) => {
			res.send('ok');
		});
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json({ limit: '500mb' }));
		this.app.use(
			cors({
				// origin: '*',
				origin: [
					'http://18.222.221.89',
					`${process.env.FRONT_URL}`,
					'http://localhost:3000',
					'https://localhost:5001',
					'https://master.d3rxvhp6gvauoo.amplifyapp.com/',
				],
				credentials: true,
			})
		);
	}
}
export default App;
