import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  //@ts-ignore
  type: process.env.DATABASE_TYPE,
  port: +process.env.DATABASE_PORT,

  host:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_HOST
      : process.env.LOCAL_DATABASE_HOST,
  username:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_USERNAME
      : process.env.LOCAL_DATABASE_USERNAME,
  password:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_PASSWORD
      : process.env.LOCAL_DATABASE_PASSWORD,
  database:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_NAME
      : process.env.LOCAL_DATABASE_NAME,

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
