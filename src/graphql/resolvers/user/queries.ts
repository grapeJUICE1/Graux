import User from '../../../entities/User'

export default {
  async getUsers() {
    try {
      const users = await User.find({})
      return users
    } catch (err) {
      throw new Error(err)
    }
  },
}
