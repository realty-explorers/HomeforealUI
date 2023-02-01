import express from 'express';
import cors from 'cors';
import { Server, createServer } from 'https';
import router from '../../api';
import * as fs from 'fs';

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
		const privateKey = fs.readFileSync(process.env.CERTIFICATE_KEY_PATH!, 'utf8');
		const certificate = fs.readFileSync(process.env.CERTIFICATE_CERT_PATH!, 'utf8');
		const credentials = { key: privateKey, cert: certificate, port };
		this.server = createServer(credentials, this.app);
		this.server.listen(port, () => {
			console.log(`App listening on the port ${port}`);
		});
		// this.server = createServer(this.app.listen(port, () => {
		// 	console.log(`App listening on the port ${port}`);
		// });
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
						`https://${process.env.HOST}`,
						'https://localhost',
						'https://localhost:3000',
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
