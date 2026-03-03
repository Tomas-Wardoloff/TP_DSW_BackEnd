import { Type } from 'class-transformer';
import { IsString, IsDate, MinLength, IsOptional } from 'class-validator';

export class CreateClubDto {
    @IsString()
    @MinLength(3)
    name!: string;

    @IsString()
    address!: string;

    @Type(() => Date)
    @IsDate()
    openingDate!: Date;
}

export class UpdateClubDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    openingDate?: Date;
}
