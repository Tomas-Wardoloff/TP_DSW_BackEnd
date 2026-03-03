import jwt from 'jsonwebtoken';
//import { env } from '../config/env.js';
import { UserType } from '../../modules/user/user.entity.js';

export interface JwtPayload {
    userId: number;
    userType: UserType;
}

export interface DecodedToken extends JwtPayload {
    iat: number; // issued at
    exp: number; // expiration
}

export class JwtHelper {
    static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN!),
        });
    }

    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN!),
        });
    }

    static verifyAccessToken(token: string): DecodedToken {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as DecodedToken;
    }

    static verifyRefreshToken(token: string): DecodedToken {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as DecodedToken;
    }
}
