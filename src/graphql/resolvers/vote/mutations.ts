import { GraphQLError } from 'graphql'
import BattleUser from '../../../entities/BattleUser'
import Vote from '../../../entities/Vote'
import BattleStatus from '../../../types/BattleStatusEnum'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  vote: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleUserId }, { req }) => {
      try {
        let errors = []
        const battleUser = await BattleUser.findOne({
          where: { id: battleUserId },
          relations: { battle: true },
        })

        if (!battleUser) {
          errors.push({
            path: 'battleUser',
            message: 'BattleUser with that id does not exist',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        if (battleUser.battle.status !== BattleStatus.ACTIVE) {
          errors.push({
            path: 'battle',
            message: 'You can only vote if a batttle is active',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        const voteExists = await Vote.findOne({
          relations: { battleUser: true },
          where: { battleUser: { id: battleUserId } },
        })
        if (voteExists) {
          await Vote.remove(voteExists)
          return true
        }
        await Vote.insert({
          user: req.user,
          battleUser: battleUser,
        })
        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
