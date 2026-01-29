import { IsString, IsDate } from "class-validator";

export class CreateClubDto {
    @IsString()
    name!: string;

    @IsString()
    address!: string;
    
    @IsDate()
    openingDate!: Date;
}

export class UpdateClubDto {
    @IsString()
    name?: string;

    @IsString()
    address?: string;
    
    @IsDate()
    openingDate?: Date;
}