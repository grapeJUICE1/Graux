import { hash, verify } from 'argon2'
import User from '../../../entities/User'
import MyContext from '../../../MyContext'
import { createAccessToken, createRefreshToken } from '../../../utils/auth'

export default {
  async register(_, { username, email, password }, context) {
    try {
      const checkIfUserExists = await User.findOne({
        where: { username },
      })
      if (checkIfUserExists) {
        return { error: 'User already exists' }
      }

      const hashedPassword = await hash(password)
      await User.insert({
        username,
        email,
        password: hashedPassword,
      })

      return 'it happened woohoo'
    } catch (err) {
      console.log(err)
    }
  },

  async login(_, { username, password }, { res }: MyContext) {
    try {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return { error: 'User was not found' }
      }

      const isPasswordCorrect = await verify(user.password, password)

      if (!isPasswordCorrect) {
        return { error: 'password was incorrect' }
      }

      //login successful

      res.cookie('lit', createRefreshToken(user), {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })

      return {
        accessToken: createAccessToken(user),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
