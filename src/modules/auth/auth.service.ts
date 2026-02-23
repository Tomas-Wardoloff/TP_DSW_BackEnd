import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';

import { LoginDto } from './auth.dto.js';
import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { JwtHelper } from '../../shared/utils/jwt.helper.js';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async login(dto: LoginDto): Promise<AuthTokens> {
        const user = await this.em.findOne(User, { email: dto.email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return this.generateTokens(user);
    }

    async refresh(refreshToken: string): Promise<AuthTokens> {
        let decoded;
        try {
            decoded = JwtHelper.verifyRefreshToken(refreshToken);
        } catch {
            throw new Error('Invalid refresh token');
        }

        const user = await this.em.findOne(User, { id: decoded.userId });
        if (!user) {
            throw new Error('Invalid refresh token');
        }

        return this.generateTokens(user);
    }

    private generateTokens(user: User): AuthTokens {
        const payload = { userId: user.id, userType: user.userType };
        return {
            accessToken: JwtHelper.generateAccessToken(payload),
            refreshToken: JwtHelper.generateRefreshToken(payload),
        };
    }
}