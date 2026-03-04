import { IsString, IsInt, IsOptional, MinLength, IsArray } from 'class-validator';

export class CreateAgentDto {
    @IsString()
    @MinLength(2)
    firstName!: string;

    @IsString()
    @MinLength(2)
    lastName!: string;
}

export class UpdateAgentDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    lastName?: string;
}

export class UpdateAgentClubsDto {
    @IsArray()
    @IsInt({ each: true })
    clubIds!: number[];
}
