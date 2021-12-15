import { Collection, ObjectId } from 'mongodb';

export interface AccountCollection extends Collection {
    compoundId: string,
    userId: ObjectId,
    providerType: string,
    providerId: string,
    providerAccountId: string,
    refreshToken?: string,
    accessToken: string,
    accessSecret?: string,
    accessTokenExpires?: string,
    createdAt?: string,
    updatedAt?: string,
}

