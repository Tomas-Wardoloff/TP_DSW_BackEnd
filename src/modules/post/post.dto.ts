import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    content!: string;
}

export class UpdatePostDto {
    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    content!: string;
}