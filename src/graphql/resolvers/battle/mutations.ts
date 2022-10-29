import Battle from '../../../entities/Battle'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  createBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { title, expires }, { payload }) => {
      try {
        const titleTaken = await Battle.findOne({ where: { title } })

        if (titleTaken) {
          return new Error('Title is already taken')
        }

        const battleCreatedBy = await User.findOne({
          where: { id: Number(payload.userId) },
        })

        if (!battleCreatedBy)
          return new Error('Logged in User no longer exists')

        const expiresAt = new Date(Date.now() + expires * 3.6e6)

        const newBattle = new Battle()

        ;(newBattle.title = title),
          (newBattle.expires = expiresAt),
          (newBattle.battleCreatedBy = battleCreatedBy),
          (newBattle.users = [battleCreatedBy])

        await Battle.save(newBattle)

        return newBattle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
  updateBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { id, title, winnerId }, { req }) => {
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
    }
  ),

  // add  a user

  addBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, newUserId }, { payload }) => {
      const battle = await Battle.findOne({
        where: { id: battleId },
        relations: { battleCreatedBy: true, users: true },
      })
      if (!battle) return new Error('Battle with that id does not exist')

      const userId = Number(payload.userId)
      if (userId !== battle.battleCreatedBy.id)
        return new Error('Battle was not created by you')

      const userExistsInBattle = battle.users.find(
        (user) => user.id === newUserId
      )
      if (userExistsInBattle) return new Error('User Already Exists in Battle')

      const newUser = await User.findOne({ where: { id: newUserId } })
      if (!newUser) return new Error('User with that Id does not exist')

      battle.users.push(newUser)

      await Battle.save(battle)

      return battle
    }
  ),

  // delete a user
}

//add mutation for adding users
// add mutation for deleting battle and users
//implement voting
// better way of error handling
