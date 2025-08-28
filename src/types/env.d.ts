declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MONGODB_URI: string;
    MONGODB_DB_NAME: string;
    PORT: string;
  }
}