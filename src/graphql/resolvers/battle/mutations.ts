import dataSource from '../../../data-source'
import Battle from '../../../entities/Battle'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  createBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { title, expires, usersIdArr }, { payload }) => {
      try {
        const titleTaken = await Battle.findOne({ where: { title } })

        if (titleTaken) {
          return new Error('Title is already taken')
        }
        if (!usersIdArr) usersIdArr = []
        if (!usersIdArr.includes(payload.userId)) {
          usersIdArr.unshift(payload.userId)
        }
        const usersArr = []

        for (const userId of usersIdArr) {
          let user = await User.findOne({ where: { id: userId } })
          if (!user) {
            return new Error('User Ids provided are faulty')
          }
          usersArr.push(user)
        }
        const battleCreatedBy = usersArr[0]

        const expiresAt = new Date(Date.now() + expires * 3.6e6)

        const battleRepository = dataSource.getRepository(Battle)

        const newBattle = new Battle()

        ;(newBattle.title = title),
          (newBattle.expires = expiresAt),
          (newBattle.battleCreatedBy = battleCreatedBy),
          (newBattle.users = usersArr)

        battleRepository.save(newBattle)

        return newBattle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
  async updateBattle(_, { id, title, winnerId }, { req }) {
    try {
      //Check if battle exists
      const battle = await Battle.findOne({
        where: { id },
        relations: { users: true, battleCreatedBy: true, winner: true },
      })
      if (!battle) {
        return new Error('Battle with the id does not exist')
      }

      // Check if title is empty
      if (!title || title.trim() === '') {
        return new Error('Title cannot be empty')
      }

      // //update winner
      // if (winnerId) {
      //   // const checkIfWinnerInUsersArr = battle.users?.includes()
      //   let winnerExistsInBattleUsers = false
      //
      //   const winner = await User.findOne({ where: { id: winnerId } })
      //   if (!winner) {
      //     return new Error('No user exists with the id of the winner')
      //   }
      //   if (battle.users) {
      //     for (let user of battle.users) {
      //       if (user.id === winner.id) {
      //         winnerExistsInBattleUsers = true
      //         break
      //       }
      //     }
      //   }
      //   if (!winnerExistsInBattleUsers) {
      //     return new Error(
      //       'User with that winner id does not exist among users participating in battle'
      //     )
      //   }
      //
      //   battle.winner = winner
      // }

      battle.title = title
      await Battle.save(battle)
      return battle
    } catch (err) {
      throw new Error(err)
    }
  },
  async deleteBattle() {},
}

//add mutation for adding users
// add mutation for deleting battle and users
//implement voting
// better way of error handling
