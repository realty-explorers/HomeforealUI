import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
	cleanEnv(process.env, {
		PORT: port(),
	});
}

export default validateEnv;
