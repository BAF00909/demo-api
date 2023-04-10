import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
	exec: ({ body }: Request, res: Response, next: NextFunction) => void;
}
