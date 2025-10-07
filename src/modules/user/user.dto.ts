import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { UserType } from './user.entity.js';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    phoneNumber!: string;

    @IsEnum(UserType)
    userType!: UserType;
}

export class UpdateUserDto {
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(6)
    password?: string;

    @IsString()
    phoneNumber?: string;
}
