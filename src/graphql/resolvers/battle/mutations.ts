import Battle from '../../../entities/Battle'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'
//
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
    async (_, { battleId, title, winnerId }, { payload }) => {
      try {
        //Check if battle exists
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { users: true, battleCreatedBy: true },
        })
        if (!battle) {
          return new Error('Battle with the id does not exist')
        }

        if (Number(payload.userId) !== battle.battleCreatedBy.id)
          return new Error('Battle was not created by you')

        // Check if title is empty
        if (!title) {
          return new Error('Title cannot be empty')
        }

        const battleExists = await Battle.findOne({ where: { title } })
        if (battleExists)
          return new Error('Battle with that title already exists')
        battle.title = title.trim()
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
  removeBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, userIdToRemove }, { payload }) => {
      try {
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleCreatedBy: true, users: true },
        })
        if (!battle) return new Error('Battle with that id does not exist')

        const userId = Number(payload.userId)

        if (userId !== battle.battleCreatedBy.id)
          return new Error('Battle was not created by you')

        if (userIdToRemove === battle.battleCreatedBy.id)
          return new Error("You can't remove yourself from the battle")

        const userToRemove = await User.findOne({
          where: { id: userIdToRemove },
        })
        if (!userToRemove) return new Error('User with that Id does not exist')

        let userDoesNotExistInBattle = true

        const usersArr = battle.users.filter((user) => {
          if (user.id === userIdToRemove) {
            userDoesNotExistInBattle = false
          }
          return user.id !== userIdToRemove
        })
        if (userDoesNotExistInBattle)
          return new Error('User with that id does not exist in battle users')

        battle.users = usersArr
        await Battle.save(battle)
        return battle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  deleteBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId }, { payload }) => {
      try {
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleCreatedBy: true },
        })
        if (!battle) return new Error('Battle with that Id not found')

        if (Number(payload.userId) !== battle.battleCreatedBy.id)
          return new Error('Battle was not created by you')

        await Battle.remove(battle)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}

// DONE:add mutation for adding users in battle
// DONE:add mutation for deleting users in battle
// DONE:update user mutation
// DONE:delete user mutation
// TODO:think of a better way to store battle users
// TODO:implement voting
// TODO:better way of error handling
