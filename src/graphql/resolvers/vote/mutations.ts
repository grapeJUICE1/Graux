import BattleUser from '../../../entities/BattleUser'
import Vote from '../../../entities/Vote'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  vote: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleUserId }, { req }) => {
      const battleUser = await BattleUser.findOne({
        where: { id: battleUserId },
      })

      if (!battleUser)
        return new Error('The thing u wanted to vote was not found')

      const voteExists = await Vote.findOne({
        relations: { battleUser: true },
        where: { battleUser: { id: battleUserId } },
      })
      console.log('sodomy', voteExists)
      if (voteExists) {
        await Vote.remove(voteExists)
        return true
      }
      await Vote.insert({
        user: req.user,
        battleUser: battleUser,
      })
      return true
    }
  ),
}
