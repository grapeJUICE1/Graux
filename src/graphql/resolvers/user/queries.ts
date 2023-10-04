import { verify } from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import config from '../../../config/config'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import MyContext from '../../../MyContext'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'
import { ILike } from 'typeorm'

export default {
  test: addMiddleware(isAuthMiddleware, async () => {
    return 'testo desu ne'
  }),
  getUsers: async (_: any, { search, take, skip, orderBy }) => {
    try {
      const orderByOptions = ['createdAt']
      const users = await User.find({
        where: { username: search ? ILike(`%${search}%`) : undefined },
        //take: search ? 10 : undefined,
        take: take || undefined,
        skip: skip || undefined,
        order: orderByOptions.includes(orderBy)
          ? { [orderBy]: 'DESC' }
          : { createdAt: 'DESC' },
      })

      return users
    } catch (err) {
      throw new Error(err)
    }
  },
  getUser: async (_: any, { userId }) => {
    try {
      console.log('Am i coming here')
      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        return new GraphQLError('Validation Error', {
          extensions: {
            errors: [
              { path: 'user', message: 'User with that id was not found' },
            ],
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return user
    } catch (err) {
      throw new Error(err)
    }
  },
  getUserBattles:
    async (_: any, { userId, battlesWon, battlesCreated, take, skip, orderBy }) => {
      const orderByOptions = ['title', 'expires', 'createdAt', 'likeDislikeCount']
      try {
        const [battleUsers,total] = await BattleUser.findAndCount({
          relations: { battle: { battleUsers: { user: true } } },
          where: {
            userId: userId,
            isWinner: battlesWon ? true : undefined,
            battleCreator: battlesCreated ? true : undefined,
          },
          take: take || undefined,
          skip: skip || undefined,
          order: orderByOptions.includes(orderBy)
            ? { [orderBy]: 'DESC' }
            : { createdAt: 'DESC' },
        })

        if (!battleUsers) return new Error('Given user has no battles')
        // console.log({battles,lel:battles[0].battle,total})
        const battles = [];
        battleUsers.forEach(battleUser=>{
          battles.push(battleUser.battle)
        })
        console.log(battles)
        return {
          battles , total
      }
      } catch (err) {
        throw new Error(err)
      }
    },
  me: async (_: any, { }, context: MyContext) => {
    const authorization = context.req.headers['authorization'] // bearer token
    if (!authorization) {
      return null
    }
    try {
      const token = authorization.split(' ')[1]
      const payload: any = verify(token, config.ACCESS_TOKEN_SECRET)
      if (!payload) {
        return null
      }

      const user = await User.findOne({ where: { id: payload.userId } })

      if (!user) {
        return null
      }

      return user
    } catch (err) {
      console.log(err)
      return null
    }
  },
}
