import crypto from 'crypto';

import { PUBLIC_ADM_KEY } from './constants.js';


import {
    TOKEN_EXPIRY_TIME,
} from './settings';

export const get_random_string = (len) => {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('base64')
        .slice(0, len);
}
export const string_to_hash = (str, salt) => {
    return crypto.createHmac('sha512', salt)
        .update(str)
        .digest('base64');
};
export const verify_hash = (str, hash, salt) => {
    return hash === string_to_hash(str, salt);
};
