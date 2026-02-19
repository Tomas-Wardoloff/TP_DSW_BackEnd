import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested, IsPhoneNumber } from 'class-validator';

import { UserType } from './user.entity.js';
import { CreateAgentDto } from '../agent/agent.dto.js'
import { CreateClubDto } from '../club/club.dto.js';
import { CreateAthleteDto } from '../athlete/athlete.dto.js';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsOptional()
    @IsPhoneNumber(undefined)
    phoneNumber?: string;

    @IsEnum(UserType)
    userType!: UserType;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAthleteDto)
    athleteProfile?: CreateAthleteDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateClubDto)
    clubProfile?: CreateClubDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAgentDto)
    agentProfile?: CreateAgentDto;
}

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsPhoneNumber(undefined)
    phoneNumber?: string;
}
