declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    PORT: string
    DATABASE_HOST: string
    DATABASE_PORT: string
    DATABASE_USERNAME: string
    DATABASE_PASSWORD: string
    DATABASE_TYPE: string
    DATABASE_NAME: string
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
  }
}
