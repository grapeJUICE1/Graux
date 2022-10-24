import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  getUsers: addMiddleware(isAuthMiddleware, async () => {
    try {
      const users = await User.find({})
      return users
    } catch (err) {
      throw new Error(err)
    }
  }),
}
