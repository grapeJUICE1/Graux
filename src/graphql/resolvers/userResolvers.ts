import { warn } from 'console'
import { User } from '../../entities/User'

const resolvers = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find({})
        return users
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

export default resolvers
