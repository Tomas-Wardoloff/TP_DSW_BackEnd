import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';

import { LoginDto } from './auth.dto.js';
import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { JwtHelper } from '../../shared/utils/jwt.helper.js';
import { UnauthorizedError } from '../../shared/erros/http.erros.js';
import { RefreshToken } from './refresh-token.entity.js';

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
        if (!user) throw new UnauthorizedError('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

        return this.generateAndPersistTokens(this.em, user);
    }

    async refresh(refreshToken: string): Promise<AuthTokens> {
        let decoded;
        try {
            decoded = JwtHelper.verifyRefreshToken(refreshToken);
        } catch {
            throw new UnauthorizedError('Invalid refresh token');
        }

        const user = await this.em.findOne(User, { id: decoded.userId });
        if (!user) throw new UnauthorizedError('Invalid refresh token');

        const storedToken = await this.em.findOne(
            RefreshToken,
            { token: refreshToken, isRevoked: false },
            { populate: ['user'] }
        );
        if (!storedToken) throw new UnauthorizedError('Invalid refresh token');

        if (storedToken.expiresAt < new Date()) {
            storedToken.isRevoked = true;
            await this.em.flush();
            throw new UnauthorizedError('Refresh token expired');
        }

        storedToken.isRevoked = true;
        await this.em.flush();
        return this.generateAndPersistTokens(this.em, storedToken.user);
    }

    async logout(refreshToken: string): Promise<void> {
        const storedToken = await this.em.findOne(RefreshToken, { token: refreshToken });

        if (!storedToken) return;

        storedToken.isRevoked = true;
        await this.em.flush();
    }

    // Limpia tokens expirados o revocados de la DB.
    async cleanExpiredTokens(): Promise<void> {
        const em = this.em;
        await em.nativeDelete(RefreshToken, {
            $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
        });
    }

    private async generateAndPersistTokens(em: EntityManager, user: User): Promise<AuthTokens> {
        const payload = { userId: user.id, userType: user.userType };

        const accessToken = JwtHelper.generateAccessToken(payload);
        const refreshToken = JwtHelper.generateRefreshToken(payload);

        const tokenEntity = em.create(RefreshToken, {
            token: refreshToken,
            user,
            expiresAt: JwtHelper.getRefreshTokenExpiration(),
            isRevoked: false,
        });

        await em.persistAndFlush(tokenEntity);

        return { accessToken, refreshToken };
    }
}
