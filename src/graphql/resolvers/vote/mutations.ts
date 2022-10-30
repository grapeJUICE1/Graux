import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  addBattleUserExp: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, userId }, { payload }) => {
      const battle = await Battle.findOne({
        where: { id: battleId },
        relations: { battleCreatedBy: true },
      })
      if (!battle) return new Error('Battle with that id not found')

      if (battle.battleCreatedBy.id !== Number(payload.userId))
        return new Error('Battle was not created by you')

      const user = await User.findOne({ where: { id: userId } })
      if (!user) return new Error('User with that id not found')

      await BattleUser.insert({
        battle: battle,
        user: user,
      })
    }
  ),
}
