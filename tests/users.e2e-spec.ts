import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('users e2e', () => {
	it('Register - is exist', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'anyuta069069@gmail.com', password: 'anyuta12345' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'anyuta069069@gmail.com', password: 'anyuta12345' });
		expect(res.body.token).not.toBeUndefined();
	});
});

afterAll(() => {
	application.close();
});
