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
          relations: { battle: { battleUsers: true } },
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
            message: 'You can only vote if a battle is active',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }

        //        const now = new Date()
        //        if (now.getTime() > battleUser.battle.expires.getTime()) {
        //          console.log('expired')

        //          battleUser.battle.status = BattleStatus.OVER
        ///          await battleUser.battle.save()

        //          const winner = battleUser.battle.setBattleWinner()
        //          console.log(winner)
        //          if (winner instanceof BattleUser) {
        //            winner.isWinner = true
        //            BattleUser.save(winner)
        //          }
        //        }
        const voteExists = await Vote.findOne({
          relations: { battleUser: true },
          where: { battleUserId: battleUserId },
        })
        if (voteExists) {
          // remove the vote
          await Vote.remove(voteExists)
          const voteCount = await Vote.count({
            where: { battleUserId: voteExists.battleUserId },
          })
          voteExists.battleUser.voteCount = voteCount
          await BattleUser.save(voteExists.battleUser)
          return true
        }
        // add the new vote

        await Vote.insert({
          user: req.user,
          battleUser: battleUser,
        })

        const voteCount = await Vote.count({
          where: { battleUserId: battleUser.id },
        })
        battleUser.voteCount = voteCount
        await BattleUser.save(battleUser)
        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
