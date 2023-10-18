import path from "path"
import dotenv from "dotenv"
// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "./config.env") })

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  DATABASE_PORT: number | undefined

  DATABASE_HOST: string | undefined
  DATABASE_USERNAME: string | undefined
  DATABASE_PASSWORD: string | undefined
  DATABASE_TYPE: string | undefined
  DATABASE_NAME: string | undefined

  LOCAL_DATABASE_HOST: string | undefined
  LOCAL_DATABASE_USERNAME: string | undefined
  LOCAL_DATABASE_PASSWORD: string | undefined
  LOCAL_DATABASE_NAME: string | undefined

  ACCESS_TOKEN_SECRET: string | undefined
  REFRESH_TOKEN_SECRET: string | undefined
  LAST_FM_API_KEY: string | undefined
}

interface Config {
  NODE_ENV: string
  PORT: number
  DATABASE_HOST: string
  DATABASE_PORT: number
  DATABASE_USERNAME: string
  DATABASE_PASSWORD: string
  DATABASE_TYPE: string
  DATABASE_NAME: string

  LOCAL_DATABASE_HOST: string
  LOCAL_DATABASE_USERNAME: string
  LOCAL_DATABASE_PASSWORD: string
  LOCAL_DATABASE_NAME: string

  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  LAST_FM_API_KEY: string
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT
      ? Number(process.env.DATABASE_PORT)
      : undefined,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    DATABASE_NAME: process.env.DATABASE_NAME,
    LOCAL_DATABASE_HOST: process.env.LOCAL_DATABASE_HOST,
    LOCAL_DATABASE_USERNAME: process.env.LOCAL_DATABASE_USERNAME,
    LOCAL_DATABASE_PASSWORD: process.env.LOCAL_DATABASE_PASSWORD,
    LOCAL_DATABASE_NAME: process.env.LOCAL_DATABASE_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
  }
}

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

let config = getConfig()

config = getSanitzedConfig(config)

export default config
