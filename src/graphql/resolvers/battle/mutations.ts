import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
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

        newBattle.title = title
        newBattle.expires = expiresAt

        await Battle.save(newBattle)
        await BattleUser.insert({
          battle: newBattle,
          user: battleCreatedBy,
          battleCreator: true,
        })

        return newBattle
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
  updateBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, title }, { payload }) => {
      try {
        //Check if battle exists
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleUsers: true },
        })
        if (!battle) {
          return new Error('Battle with the id does not exist')
        }
        const battleCreator = battle.battleUsers.find(
          (battleUser) => battleUser.battleCreator === true
        )
        if (!battleCreator) return new Error('Battle does not exist')

        if (Number(payload.userId) !== battleCreator.id)
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

  deleteBattle: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId }, { payload }) => {
      try {
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: { battleUsers: true },
        })

        if (!battle) return new Error('Battle with that Id not found')

        const battleCreator = battle.battleUsers.find(
          (battleUser) => battleUser.battleCreator === true
        )
        if (!battleCreator) return new Error('Battle does not exist')

        if (Number(payload.userId) !== battleCreator.id)
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
