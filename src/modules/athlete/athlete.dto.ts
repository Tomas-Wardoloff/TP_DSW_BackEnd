import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean } from 'class-validator';

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

    @IsString()
    sport!: string;

    @IsString()
    position!: string;

    @IsBoolean()
    isSigned!: boolean;
}

export class UpdateAthleteDto {
    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;

    @Type(() => Date)
    @IsDate()
    birthDate?: Date;

    @IsString()
    nationality?: string;

    @IsString()
    sport?: string;

    @IsString()
    position?: string;

    @IsBoolean()
    isSigned?: boolean;
}
