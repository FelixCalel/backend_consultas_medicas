import 'dotenv/config';
import { get } from 'env-var';

export const envs = {

    PORT: get('PORT').required().asPortNumber(),
    HOST: get('HOST').required().asString(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    FIREBASE_APIKEY: get('FIREBASE_APIKEY').required().asString(),
    FIREBASE_AUTHDOMAIN: get('FIREBASE_AUTHDOMAIN').required().asString(),
    FIREBASE_PROJECTID: get('FIREBASE_PROJECTID').required().asString(),
    FIREBASE_STORAGEBUCKET: get('FIREBASE_STORAGEBUCKET').required().asString(),
    FIREBASE_MESSAGINGSENDERID: get('FIREBASE_MESSAGINGSENDERID').required().asString(),
    FIREBASE_APPID: get('FIREBASE_APPID').required().asString(),
    FIREBASE_MEASUREMENTID: get('FIREBASE_MEASUREMENTID').required().asString(),
    GOOGLE_APPLICATION_CREDENTIALS: get('GOOGLE_APPLICATION_CREDENTIALS').required().asString(),

    // JWT
    JWT_SECRET: get('JWT_SECRET').default('super-secret-dev-key').asString(),

    // Nodemailer
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
};
