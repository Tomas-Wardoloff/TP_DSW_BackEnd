// src/shared/utils/pagination.helper.ts
import { PaginationDto, PaginatedResult } from '../dtos/pagination.dto.js';

export function buildPaginatedResult<T>(
    data: T[],
    total: number,
    pagination: PaginationDto
): PaginatedResult<T> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}

export function getPaginationParams(pagination: PaginationDto): { limit: number; offset: number } {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return {
        limit,
        offset: (page - 1) * limit,
    };
}
