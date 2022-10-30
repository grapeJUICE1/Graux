import AppDataSource from '../../../data-source'
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
      return true
    }
  ),

  removeBattleUserExp: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, userToRemoveId }, { payload }) => {
      try {
        const battleUser = await BattleUser.findOne({
          relations: { battle: { battleCreatedBy: true }, user: true },
          where: { battle: { id: battleId }, user: { id: userToRemoveId } },
        })
        if (!battleUser) return new Error('BattleUser not found')
        if (battleUser.battle.battleCreatedBy.id !== Number(payload.userId)) {
          return new Error('Battle is not created by you')
        }
        if (battleUser.battleCreator === true) {
          return new Error(
            "You can't remove yourself from the battle you created"
          )
        }
        await BattleUser.remove(battleUser)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
