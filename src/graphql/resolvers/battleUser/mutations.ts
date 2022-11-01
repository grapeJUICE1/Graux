import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  addBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_, { battleId, userId }, { payload }) => {
      const battle = await Battle.findOne({
        where: { id: battleId },
        relations: { battleUsers: { user: true } },
      })
      if (!battle) return new Error('Battle with that id not found')

      if (!battle.getBattleCreator) return new Error('Battle does not exist')
      if (battle.getBattleCreator.id !== Number(payload.userId))
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

  removeBattleUser: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleUserId }, { payload }) => {
      try {
        const battleUser = await BattleUser.findOne({
          relations: { battle: { battleUsers: { user: true } }, user: true },
          where: { id: battleUserId },
        })

        if (!battleUser) return new Error('BattleUser not found')

        if (battleUser.battleCreator === true) {
          return new Error(
            "You can't remove yourself from the battle you created"
          )
        }

        const battleCreator = battleUser.battle.getBattleCreator
        if (!battleCreator) return new Error('Battle does not exist')

        if (battleCreator.id !== Number(payload.userId)) {
          if (battleUser.user.id !== Number(payload.userId)) {
            return new Error(
              'You cant remove no one but yourself from the battle'
            )
          }
        }

        await BattleUser.remove(battleUser)

        return true
      } catch (err) {
        throw new Error(err)
      }
    }
  ),

  chooseSong: addMiddleware(
    isAuthMiddleware,
    async (
      _: any,
      { battleId, songName, songArtist, songAlbum, songImage, songLink },
      { payload }
    ) => {
      try {
        const battleUser = await BattleUser.findOne({
          relations: { battle: true, user: true },
          where: {
            battle: { id: battleId },
            user: { id: Number(payload.userId) },
          },
        })

        if (!battleUser)
          return new Error('You are not a participant of this battle')

        battleUser.songName = songName
        battleUser.songArtist = songArtist
        battleUser.songAlbum = songAlbum
        battleUser.songImage = songImage
        battleUser.songLink = songLink

        await BattleUser.save(battleUser)

        return battleUser
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
