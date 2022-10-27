import { hash, verify } from 'argon2'
import User from '../../../entities/User'
// import {UserInputError} from '@apollo/server'
import { createAccessToken, sendRefreshToken } from '../../../utils/auth'

export default {
  async register(_: any, { username, email, password }, { req }) {
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
      const newUser = await User.save({
        username,
        email,
        password: hashedPassword,
      })
      req.user = newUser
      return 'it happened woohoo'
    } catch (err) {
      console.log(err)
    }
  },

  async login(_: any, { username, password }, { req, res }) {
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
      req.user = user
      return {
        accessToken: createAccessToken(user),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
