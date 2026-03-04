import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T extends object>(
    type: new () => T
): (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(type, req.body);
        const errors: ValidationError[] = await validate(dto, {
            skipMissingProperties: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            return res.status(400).json({ errors: errorMessages });
        }

        // Reemplazar req.body con el DTO validado si no hay errores
        req.body = dto;
        next();
    };
}
