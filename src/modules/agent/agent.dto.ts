import { IsString } from "class-validator";

export class CreateAgentDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;
}

export class UpdateAgentDto {
    @IsString()
    firstName?: string;
    
    @IsString()
    lastName?: string;
}