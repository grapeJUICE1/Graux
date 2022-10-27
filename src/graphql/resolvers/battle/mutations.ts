import dataSource from '../../../data-source'
import Battle from '../../../entities/Battle'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  createBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { title, votingTill, usersIdArr }, { payload }) => {
      try {
        if (!usersIdArr.includes(payload.userId)) {
          usersIdArr.unshift(payload.userId)
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
    }
  ),
  async updateBattle() {},
  async deleteBattle() {},
  async voteForInBattle() {},
}
