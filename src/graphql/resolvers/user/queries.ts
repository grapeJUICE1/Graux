import BattleUser from '../../../entities/BattleUser'
import User from '../../../entities/User'

export default {
  getUsers: async () => {
    try {
      const users = await User.find({})
      return users
    } catch (err) {
      throw new Error(err)
    }
  },

  getUserBattles: async (_: any, { userId }) => {
    try {
      const battles = await BattleUser.find({
        select: {
          songName: false,
          songArtist: false,
          songAlbum: false,
          songImage: false,
          songLink: false,
        },
        relations: { battle: true },
        where: { user: userId },
      })

      if (!battles) return new Error('Given user has no battles')

      return battles
    } catch (err) {
      throw new Error(err)
    }
  },
}
