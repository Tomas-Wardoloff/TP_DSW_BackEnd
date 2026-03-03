import { Type } from 'class-transformer';
import {
    IsString,
    IsDate,
    IsBoolean,
    IsArray,
    ArrayMinSize,
    IsInt,
    IsOptional,
} from 'class-validator';

export class CreateAthleteDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @Type(() => Date)
    @IsDate()
    birthDate!: Date;

    @IsString()
    nationality!: string;

    @IsArray()
    @ArrayMinSize(1) // Un atleta debe tener al menos un deporte
    @IsInt({ each: true }) // each: true valida cada elemento del array
    sportIds!: number[];

    @IsArray()
    @ArrayMinSize(1) // Un atleta debe tener al menos una posición
    @IsInt({ each: true })
    positionIds!: number[];

    @IsOptional()
    @IsBoolean()
    isSigned?: boolean;
}

export class UpdateAthleteDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthDate?: Date;

    @IsOptional()
    @IsString()
    nationality?: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    sportIds?: number[];

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    positionIds?: number[];

    @IsOptional()
    @IsBoolean()
    isSigned?: boolean;
}
