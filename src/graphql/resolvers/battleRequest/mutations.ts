import { GraphQLError } from 'graphql'
import BattleRequest from '../../../entities/BattleRequest'
import BattleUser from '../../../entities/BattleUser'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  approveBattleRequest: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleRequestId }, { payload }) => {
      try {
        let errors = []
        const battleRequest = await BattleRequest.findOne({
          where: { id: battleRequestId },
          relations: { battle: { battleUsers: true }, user: true },
        })

        if (!battleRequest) {
          errors.push({
            path: 'battleRequest',
            message: 'BattleRequest with that id does not exist',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        if (battleRequest.battle.battleUsers.length >= 2) {
          errors.push({
            path: 'battleRequest',
            message:
              'Battle Already has 2 users , tell the battle creator to remove the other battle participant and add you again',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        if (!battleRequest.validated) {
          if (battleRequest.userId === +payload.userId) {
            await BattleUser.insert({
              battle: battleRequest.battle,
              user: battleRequest.user,
            })
            battleRequest.validated = true
            await battleRequest.save()
            return true
          } else {
            errors.push({
              path: 'battleRequest',
              message: 'BattleRequest was not sent to you',
            })
            return new GraphQLError('Validation Error', {
              extensions: { errors, code: 'BAD_USER_INPUT' },
            })
          }
        } else {
          errors.push({
            path: 'battleRequest',
            message: 'BattleRequest is already validated',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  ),
}
