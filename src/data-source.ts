import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "./config/config"

const AppDataSource = new DataSource({
  //@ts-ignore
  type: config.DATABASE_TYPE,
  port: config.DATABASE_PORT,

  host:
    process.env.NODE_ENV === "production"
      ? config.DATABASE_HOST
      : config.LOCAL_DATABASE_HOST,
  username:
    process.env.NODE_ENV === "production"
      ? config.DATABASE_USERNAME
      : config.LOCAL_DATABASE_USERNAME,
  password:
    process.env.NODE_ENV === "production"
      ? config.DATABASE_PASSWORD
      : config.LOCAL_DATABASE_PASSWORD,
  database:
    process.env.NODE_ENV === "production"
      ? config.DATABASE_NAME
      : config.LOCAL_DATABASE_NAME,

  synchronize: process.env.NODE_ENV === "production" ? false : true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscribers",
  },
  extra: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : "",
  },
})

export default AppDataSource
