import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Не указано имя' })
	name: string;
	@IsEmail({}, { message: 'Не верно указан Email' })
	email: string;
	@IsString({ message: 'Не указан пароль' })
	password: string;
}
