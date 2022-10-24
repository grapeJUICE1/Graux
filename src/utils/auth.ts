import { sign } from 'jsonwebtoken'
import config from '../config/config'
import User from '../entities/User'

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })
}

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })
}
