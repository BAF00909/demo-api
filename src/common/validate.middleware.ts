import { ClassConstructor, plainToClass } from 'class-transformer';
import { IMiddleware } from './middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classValidate: ClassConstructor<object>) {}
	exec({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classValidate, body);
		validate(instance).then((errors) => {
			if (errors.length) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
