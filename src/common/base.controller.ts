import { Response, Router } from 'express';
import { IControllerRoute } from './routes.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const rout of routes) {
			this.logger.log(`[${rout.method}] ${rout.path}`);
			const middlewares = rout.middlewwares?.map((m) => m.exec.bind(m));
			const handler = rout.func.bind(this);
			const piepline = middlewares ? [...middlewares, handler] : handler;
			this._router[rout.method](rout.path, piepline);
		}
	}

	public created(res: Response): Response<any, Record<string, any>> {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		res.type('application/json');
		return res.send(message);
	}

	public ok<T>(res: Response, message: T): Response<any, Record<string, any>> {
		return this.send<T>(res, 200, message);
	}
}
