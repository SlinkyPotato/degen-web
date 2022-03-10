import { Collection, Db, ObjectId } from 'mongodb';
import MongoDBUtils from './MongoDBUtils';
import constants from '../constants/constants';
import platformTypes from '../constants/platformTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';

export type ZoomAuthentication = {
    oauth_token: string
    oauth_token_secret: string;
    url: string,
}

const requestNewToken = async (refreshToken: string): Promise<AxiosResponse> => {
    return await axios.post('https://zoom.us/oauth/token',
        null,
        {
            headers: { Authorization: `Basic ${Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64')}` },
            params: { grant_type: 'refresh_token', refresh_token: refreshToken },
        }) as AxiosResponse;
};

const requestUserInfo = async (accessToken: string): Promise<AxiosResponse> => {
    return await axios.get('https://api.zoom.us/v2/users/me', { headers: { Authorization : `Bearer ${accessToken}` } });
};

const ZoomAuth = {

    getAuthUrl: async () => {
        return 'https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.ZOOM_CLIENT_ID + '&redirect_uri=' + process.env.ZOOM_REDIRECT_URL
    },

    isZoomLinked: async (sessionUserId: string): Promise<boolean> => {
        const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
        const accountsCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);

        // Retrieve zoom account using discordId
        const account = await accountsCollection.findOne({
            providerId: platformTypes.ZOOM,
            userId: ObjectId(sessionUserId),
        });

        // Return if no entry found
        if (account == null || account.accessToken == null) {
            return false;
        }

        // verify oauth is still valid
        try {
            // fetch user profile using access token from DB
            const userProfile = await requestUserInfo(account.accessToken);
            console.log('ZOOM USER PROFILE', userProfile.data);
            console.log('SESSION USER ID', sessionUserId);
            return sessionUserId === userProfile.data.id;

        } catch (e) {
            const error = e as AxiosError<any, any>;
            // Try to refresh the token if it has expired
            if (error.response.data.message === 'Access token is expired.') {
                // return false in case of failure - otherwise update Db and return true
                const response = await requestNewToken(account.refreshToken).catch();
                console.log('ACCESS_TOKEN', response.data.access_token);
                console.log('REFRESH_TOKEN', response.data.refresh_token);
                await accountsCollection.updateOne(
                    { userId: ObjectId(sessionUserId), providerId: 'zoom' },
                    { $set: { accessToken: response.data.access_token, refreshToken: response.data.refresh_token } },
                    { upsert: true });
                return true;
            }
            return false;
        }
    },
};

export default ZoomAuth;