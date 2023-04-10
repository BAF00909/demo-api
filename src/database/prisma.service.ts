import { PrismaClient, UserModal } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Успешно подключились к базе данных');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`[PrismaService] Не удалось подключиться к базе данных. Ошибка: ${error.message}`,
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		this.client.$disconnect();
	}
}
