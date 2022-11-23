import BattleUser from '../../../entities/BattleUser'

export default {
  getAllBattleUsers: async () => {
    const battleUsers = await BattleUser.find({
      relations: { battle: true, user: true },
    })
    return battleUsers
  },
  getBattleUsers: async (_: any, { battleId }) => {
    const battleUsers = await BattleUser.find({
      where: { battleId: battleId },
      relations: { user: true },
    })

    if (!battleUsers) return new Error('The battle does not have any users yet')

    return battleUsers
  },
}
