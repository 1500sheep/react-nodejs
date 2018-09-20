import db from './db_settings';

export const DEBUG = false;
export const PORT = 7343;
export const INSTALLED_APPS = [
    'media',
];
export const MEDIA_DIRECTORY = './media';
export const ORIGINAL_DIRECTORY ='./files';
export const DECRYPTED_DIRECTORY = './media/sound/decrypted';
export const BEEP_DIRECTORY = './media/sound/beep';
export const ENCRYPT_KEY = '14189dc35ae35e75ff31d7502e245cd9bc7803838fbfd5c773cdcd79b8a28bbd';
export const DB = {
    dialect: db.dialect || 'mysql',
    database: db.database || 'media',
    host: db.host || '127.0.0.1',
    port: db.port || '3306',
    user: db.user || 'root',
    password: db.password || '',
};
