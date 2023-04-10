import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	UseRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	UseExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	UseMiddleWares(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.exec.bind(authMiddleware));
	}

	public async Init(): Promise<any> {
		this.UseMiddleWares();
		this.UseRoutes();
		this.UseExceptionFilter();
		this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server was started on port: ${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
