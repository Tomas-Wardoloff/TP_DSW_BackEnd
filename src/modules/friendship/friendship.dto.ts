import { IsInt, IsEnum } from 'class-validator';

import { FriendshipStatus } from './friendship.entity.js';

export class CreateFriendshipDto {
    @IsInt()
    addresseeId!: number;
}

export class UpdateFriendshipDto {
    // Solo ACCEPTED o REJECTED
    @IsEnum(FriendshipStatus)
    status!: FriendshipStatus.ACCEPTED | FriendshipStatus.REJECTED;
}
