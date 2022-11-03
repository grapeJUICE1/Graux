import { GraphQLError } from 'graphql'
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
  getUser: async (_: any, { userId }) => {
    try {
      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        return new GraphQLError('Validation Error', {
          extensions: {
            errors: [
              { path: 'user', message: 'User with that id was not found' },
            ],
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return user
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
