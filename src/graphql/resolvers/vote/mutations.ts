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
      console.log(req.user)
      await Vote.insert({
        user: req.user,
        battleUser: battleUser,
      })
      return true
    }
  ),
}
