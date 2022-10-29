import 'reflect-metadata'
import { DataSource } from 'typeorm'
import User from './entities/User'
import Battle from './entities/Battle'
import config from './config/config'
import BattleUser from './entities/BattleUser'
import Vote from './entities/Vote'

const AppDataSource = new DataSource({
  //@ts-ignore
  type: config.DATABASE_TYPE,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Battle, BattleUser, Vote],
  migrations: [],
  subscribers: [],
})

export default AppDataSource
