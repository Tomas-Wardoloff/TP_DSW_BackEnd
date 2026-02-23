import { Request, Response, NextFunction } from 'express';

import { UserType } from '../user/user.entity.js';
import { JwtHelper, DecodedToken } from '../../shared/utils/jwt.helper.js';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = JwtHelper.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') 
            return res.status(401).json({ message: 'Token expired' });
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export function authorizationMiddleware(...allowedTypes: UserType[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user)
            return res.status(401).json({ message: 'Not authenticated' });

        if (!allowedTypes.includes(req.user.userType)) 
            return res.status(403).json({ message: 'Forbidden' });

        next();
    };
}   