import { hash, verify } from 'argon2'
import User from '../../../entities/User'
import MyContext from '../../../MyContext'
// import {UserInputError} from '@apollo/server'
import { createAccessToken, sendRefreshToken } from '../../../utils/auth'

export default {
  async register(_, { username, email, password }, context) {
    try {
      const checkIfUserExists = await User.findOne({
        where: { username },
      })
      if (checkIfUserExists) {
        console.log('this reached')
        // throw new UserInputError()
        // return new AppError('User already exists')
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
      sendRefreshToken(res, user)
      // res.cookie('jid', createRefreshToken(user), {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      // })

      return {
        accessToken: createAccessToken(user),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
