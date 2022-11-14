import * as WebSocket from 'ws';

export default class WebsocketClient {
	private ws: WebSocket;
	private locationInfo: object | undefined;
	private testPlans: object | undefined;
	private progress: number | undefined;
	constructor(
		ws: WebSocket,
		locationInfo?: object,
		testPlans?: object,
		progress?: number
	) {
		this.ws = ws;
		this.locationInfo = locationInfo;
		this.testPlans = testPlans;
		this.progress = progress;
	}

	public setLocationInfo = (locationInfo: object) => {
		this.locationInfo = locationInfo;
	};

	public getLocationInfo = () => {
		return this.locationInfo;
	};

	public setTestPlans = (testPlans: object) => {
		this.testPlans = testPlans;
	};

	public getTestPlans = () => {
		return this.testPlans;
	};

	public setProgress = (progress: number) => {
		this.progress = progress;
	};

	public getProgress = () => {
		return this.progress;
	};

	public getConnection = () => {
		return this.ws;
	};

	public send = (data: any) => {
		this.ws.send(data);
	};

	public close = () => {
		this.ws.close();
	};
}

export { WebsocketClient };
