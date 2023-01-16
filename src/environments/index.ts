import * as dotenv from 'dotenv';

dotenv.config();

export const NEED_TO_CONFIGURED = 'NEED TO CONFIGURED';

// environment
export const NODE_ENV: string = process.env.NODE_ENV || 'dev';

// application
export const SERVER_PORT: number = +process.env.SERVER_PORT || 3000;

// // database
// export const SMTP_SERVER = process.env.SMTP_SERVER || NEED_TO_CONFIGURED;
// export const SMTP_PORT: number = Number(process.env.SMTP_PORT) || 587;
// export const SMTP_USER = process.env.SMTP_USER || NEED_TO_CONFIGURED;
// export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || NEED_TO_CONFIGURED;

// export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// export const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
// export const AWS_BUCKET = process.env.AWS_BUCKET;
// export const S3_REGION = process.env.S3_REGION;

// // Onfido
// export const ONFIDO_API_TOKEN = process.env.ONFIDO_API_TOKEN;

// export const WEB_BASE_USER_URL = process.env.WEB_BASE_USER_URL;
// export const WEB_BASE_ADMIN_URL = process.env.WEB_BASE_ADMIN_URL;
