import { GraphQLError } from 'graphql'
import BattleRequest from '../../../entities/BattleRequest'
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
      const battleRequest = await BattleRequest.findOne({
        where: { battleId: battleId, userId: userId },
        relations: { battle: { battleUsers: true }, user: true },
      })
      if (battleRequest) {
        errors.push({
          path: 'username',
          message: 'You have already sent battle request once to this user',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      const battle = await Battle.findOne({
        where: { id: battleId },
        relations: { battleUsers: true },
      })

      if (!battle) {
        errors.push({
          path: 'username',
          message: 'Battle with that id does not exist',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      if (battle.status !== BattleStatus.CREATION) {
        errors.push({
          path: 'username',
          message:
            'You can only add users to battle if battle is being created',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      if (battle.battleUsers.length >= 2) {
        errors.push({
          path: 'username',
          message: 'Battle already has 2 users',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        errors.push({
          path: 'username',
          message: 'User with that id does not exist',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const battleCreatorId = battle.getBattleCreator
      if (!battleCreatorId) {
        errors.push({ path: 'battle', message: 'Battle does not exist' })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      if (user.id === battleCreatorId) {
        errors.push({
          path: 'username',
          message: 'You cannnot request yourself to join the battle',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      if (Number(payload.userId) !== battleCreatorId) {
        errors.push({
          path: 'username',
          message: 'Battle was not created by you',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      await BattleRequest.insert({
        battle: battle,
        user: user,
        validated: false,
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
          relations: { battle: { battleUsers: true } },
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

        const battleCreatorId = battleUser.battle.getBattleCreator
        if (!battleCreatorId) {
          errors.push({ path: 'battle', message: 'Battle does not exist' })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (battleCreatorId !== Number(payload.userId)) {
          if (battleUser.userId !== Number(payload.userId)) {
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
          where: {
            battleId: battleId,
            userId: Number(payload.userId),
          },
          relations: { battle: true },
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
            path: 'battleUser',
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

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
