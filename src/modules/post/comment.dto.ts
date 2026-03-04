import { IsString, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content!: string;

    // Si se manda parentCommentId es un reply, si no es un comentario raíz.
    @IsOptional()
    @IsInt()
    parentCommentId?: number;
}

export class UpdateCommentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content!: string;
}
