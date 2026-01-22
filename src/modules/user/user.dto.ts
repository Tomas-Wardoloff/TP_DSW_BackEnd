import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

import { UserType } from './user.entity.js';
import { CreateAthleteDto } from '../athlete/athlete.dto.js';

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

    @ValidateNested()
    @Type(() => CreateAthleteDto)
    @IsOptional()
    athleteProfile?: CreateAthleteDto;
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
