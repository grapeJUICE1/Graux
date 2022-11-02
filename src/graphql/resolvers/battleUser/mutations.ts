import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import BattleStatus from '../../../types/BattleStatusEnum'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  addBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, userId }, { payload }) => {
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

      if (Date.now() > Number(battle.expires)) {
        console.log('expired')
      }
      if (battle.status !== BattleStatus.CREATION) {
        errors.push({
          path: 'battle',
          message:
            'You can only add users to battle if battle is being created',
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

      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        errors.push({
          path: 'id',
          message: 'user with that id not found',
        })
      }
      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })

      await BattleUser.insert({
        battle: battle,
        user: user,
      })
      return true
    }
  ),

  removeBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleUserId }, { payload }) => {
      try {
        let errors = []
        const battleUser = await BattleUser.findOne({
          relations: { battle: { battleUsers: { user: true } }, user: true },
          where: { id: battleUserId },
        })

        if (!battleUser) {
          errors.push({
            path: 'id',
            message: 'BattleUser with that id was not found',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (battleUser.battle.status !== BattleStatus.CREATION) {
          errors.push({
            path: 'battle',
            message:
              'You can only add users to battle if battle is being created',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        if (battleUser.battleCreator === true) {
          errors.push({
            path: 'battleUser',
            message: "You can't remove yourself from the battle you created",
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        const battleCreator = battleUser.battle.getBattleCreator
        if (!battleCreator) {
          errors.push({ path: 'battle', message: 'Battle does not exist' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (battleCreator.id !== Number(payload.userId)) {
          if (battleUser.user.id !== Number(payload.userId)) {
            errors.push({
              path: 'battleUser',
              message: "You can't remove no one but yourself from the battle",
            })
            return new GraphQLError('Validation Error', {
              extensions: { errors, code: 'BAD_USER_INPUT' },
            })
          }
        }

        await BattleUser.remove(battleUser)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  chooseSong: addMiddleware(
    isAuthMiddleware,
    async (
      _: any,
      { battleId, songName, songArtist, songAlbum, songImage, songLink },
      { payload }
    ) => {
      try {
        let errors = []
        const battleUser = await BattleUser.findOne({
          relations: { battle: true, user: true },
          where: {
            battle: { id: battleId },
            user: { id: Number(payload.userId) },
          },
        })

        if (!battleUser) {
          errors.push({
            path: 'battleUser',
            message: 'You are not a participant of this battle',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (battleUser.battle.status !== BattleStatus.CREATION) {
          errors.push({
            path: 'battle',
            message:
              'You can only add users to battle if battle is being created',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        battleUser.songName = songName
        battleUser.songArtist = songArtist
        battleUser.songAlbum = songAlbum
        battleUser.songImage = songImage
        battleUser.songLink = songLink

        await BattleUser.save(battleUser)

        return battleUser
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
