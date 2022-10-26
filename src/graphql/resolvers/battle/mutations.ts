import dataSource from '../../../data-source'
import Battle from '../../../entities/Battle'
import User from '../../../entities/User'

export default {
  async createBattle(_, { title, votingTill, battleCreatedById, usersIdArr }) {
    try {
      if (!usersIdArr.includes(battleCreatedById)) {
        usersIdArr.unshift(battleCreatedById)
      }
      const usersArr = []

      for (const userId of usersIdArr) {
        let user = await User.findOne({ where: { id: userId } })
        if (!user) {
          throw new Error('User Ids provided are faulty')
        }
        usersArr.push(user)
      }
      const battleCreatedBy = usersArr[0]
      //   await User.findOne({
      //   where: { id: battleCreatedById },
      // })
      console.log(usersIdArr, usersArr)
      const voteTill = new Date(Date.now() + votingTill * 3.6e6)

      const battleRepository = dataSource.getRepository(Battle)

      const newBattle = new Battle()

      ;(newBattle.title = title),
        (newBattle.votingTill = voteTill),
        (newBattle.battleCreatedBy = battleCreatedBy),
        (newBattle.users = usersArr)

      battleRepository.save(newBattle)

      // await Battle.insert({
      //   title,
      //   votingTill: voteTill,
      //   battleCreatedBy,
      //   users: usersArr,
      // })

      return true
    } catch (err) {
      throw new Error(err)
    }
  },
  async updateBattle() {},
  async deleteBattle() {},
  async voteForInBattle() {},
}
