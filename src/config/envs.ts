import 'dotenv/config';
import { get } from 'env-var';

export const envs = {

    PORT: get('PORT').required().asPortNumber(),
    HOST: get('HOST').required().asString(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
};
