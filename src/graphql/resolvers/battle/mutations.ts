import { isEmpty, validate } from 'class-validator'
import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  createBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { title, expires }, { payload }) => {
      try {
        let errors = []

        const titleTaken = await Battle.findOne({ where: { title } })

        if (titleTaken) {
          errors.push({ path: 'title', message: 'Title is already taken' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        const battleCreatedBy = await User.findOne({
          where: { id: Number(payload.userId) },
        })

        if (!battleCreatedBy) {
          errors.push({
            path: 'jwt',
            message: 'User logged in does not exist anymore',
          })
          return new GraphQLError('Authentication Error', {
            extensions: {
              errors,
              code: 'BAD_USER_INPUT',
            },
          })
        }

        const expiresAt = new Date(Date.now() + expires * 3.6e6)

        const newBattle = new Battle()

        newBattle.title = title
        newBattle.expires = expiresAt

        errors = await validate(newBattle)
        if (errors.length > 0)
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        await Battle.save(newBattle)
        await BattleUser.insert({
          battle: newBattle,
          user: battleCreatedBy,
          battleCreator: true,
        })

        return newBattle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
  updateBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, title }, { payload }) => {
      try {
        let errors = []
        //Check if battle exists
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleUsers: { user: true } },
        })
        if (!battle) {
          errors.push({
            path: 'battle',
            message: 'Battle with that id does not exist',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        const battleCreator = battle.getBattleCreator
        if (battleCreator) {
          errors.push({ path: 'battle', message: 'Battle does not exist' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        if (Number(payload.userId) !== battleCreator.id) {
          errors.push({
            path: 'battle',
            message: 'Battle was not created by you',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        // Check if title is empty
        if (isEmpty(title)) {
          errors.push({ path: 'title', message: 'Title cannot be empty' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        const battleExists = await Battle.findOne({ where: { title } })

        if (battleExists) {
          errors.push({ path: 'title', message: 'Title is already taken' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        battle.title = title
        await Battle.save(battle)
        return battle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  deleteBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId }, { payload }) => {
      try {
        let errors = []
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleUsers: { user: true } },
        })

        if (!battle) {
          errors.push({
            path: 'battle',
            message: 'Battle with that id does not exist',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        const battleCreator = battle.getBattleCreator
        if (!battleCreator) {
          errors.push({ path: 'battle', message: 'Battle does not exist' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (Number(payload.userId) !== battleCreator.id) {
          errors.push({
            path: 'battle',
            message: 'Battle was not created by you',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        await Battle.remove(battle)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
