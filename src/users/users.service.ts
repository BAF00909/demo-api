import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './user.repository.interface';
import { UserModal } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ name, password, email }: UserRegisterDto): Promise<UserModal | null> {
		const newUser = new User(name, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existed = await this.usersRepository.find(email);
		if (existed) {
			return null;
		} else {
			return await this.usersRepository.create(newUser);
		}
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return false;
		}
		const newUser = new User(user.name, user.email, user.password);
		return newUser.comparePassword(password);
	}
	async getUserInfo(email: string): Promise<UserModal | null> {
		return await this.usersRepository.find(email);
	}
}
