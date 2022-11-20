import { validate } from 'class-validator'
import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import BattleStatus from '../../../types/BattleStatusEnum'
import addMiddleware from '../../../utils/addMiddleware'
import mapErrors from '../../../utils/mapErrors'
import isAuthMiddleware from '../../middlewares/isAuth'
import { checkIfBattleExistsAndBattleCreatedByUser } from './utils'

export default {
  createBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { title }, { req }) => {
      try {
        let errors = []

        //Check if title is already taken
        const titleTaken = await Battle.findOne({ where: { title } })

        if (titleTaken) {
          errors.push({ path: 'title', message: 'Title is already taken' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        // make logged in user battleCreator
        const battleCreatedBy = req.user
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

        const newBattle = new Battle()
        newBattle.title = title

        // validate input
        errors = await validate(newBattle)

        if (errors.length > 0)
          return new GraphQLError('Validation Error', {
            extensions: { errors: mapErrors(errors), code: 'BAD_USER_INPUT' },
          })

        await Battle.save(newBattle)

        // add logged in user as BattleUser
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
    async (_, { battleId, title }, { req }) => {
      try {
        let errors = []
        const battle = await checkIfBattleExistsAndBattleCreatedByUser(
          battleId,
          req.user as User
        )
        if (battle instanceof GraphQLError) {
          return battle
        }
        const battleExists = await Battle.findOne({ where: { title } })

        if (battleExists) {
          errors.push({ path: 'title', message: 'Title is already taken' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        // validate input
        battle.title = title

        errors = await validate(battle)
        if (errors.length > 0)
          return new GraphQLError('Validation Error', {
            extensions: { errors: mapErrors(errors), code: 'BAD_USER_INPUT' },
          })

        await Battle.save(battle)
        return battle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  deleteBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId }, { req }) => {
      try {
        const battle = await checkIfBattleExistsAndBattleCreatedByUser(
          battleId,
          req.user as User
        )
        if (battle instanceof GraphQLError) {
          return battle
        }
        await Battle.remove(battle)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  startBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, hoursTillActive }, { req }) => {
      let errors = []

      const battle = await checkIfBattleExistsAndBattleCreatedByUser(
        battleId,
        req.user as User
      )
      if (battle instanceof GraphQLError) {
        return battle
      }

      // check if battle is in creation phase
      if (battle.status !== BattleStatus.CREATION) {
        errors.push({
          path: 'battle',
          message: 'Battle has already started or over',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      // check if battle has atleast 2 users
      if (battle.battleUsers.length < 2) {
        errors.push({
          path: 'battle',
          message: 'Battle must have 2 participants',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      // check if users have chosen songs
      if (!battle.battleUsersChosenSong) {
        errors.push({
          path: 'battle',
          message: 'Battle participants havent chose songs yet',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + hoursTillActive)

      battle.status = BattleStatus.ACTIVE
      battle.expires = expiresAt

      await Battle.save(battle)
      return true
    }
  ),
}
