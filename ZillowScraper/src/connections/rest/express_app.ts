import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import router from '../../api';

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
		});
	}

	public stopServer() {
		if (this.server) this.server.close();
	}

	public getServer() {
		return this.server;
	}

	private initializeMiddlewares() {
		this.app.use(
			cors(
				{
					// origin: '*',
					origin: [
						'http://139.59.204.186',
						'http://homeforeal.com',
						'http://localhost',
						'http://localhost:3000',
					],
					credentials: true,
				}
			)
		);
		this.app.get('/', (req, res) => {
			res.send('ok');
		});
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json({ limit: '500mb' }));
	}
}
export default App;
