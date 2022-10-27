import { hash, verify } from 'argon2'
import User from '../../../entities/User'
// import {UserInputError} from '@apollo/server'
import { createAccessToken, sendRefreshToken } from '../../../utils/auth'

export default {
  async register(_: any, { username, email, password }, { req }) {
    const checkIfUserExists = await User.findOne({
      where: [{ username }, { email }],
    })
    if (checkIfUserExists) {
      return new Error('User Already Exists')
    }
    try {
      const hashedPassword = await hash(password)
      const newUser = await User.save({
        username,
        email,
        password: hashedPassword,
      })
      req.user = newUser
      return 'it happened woohoo'
    } catch (err) {
      throw new Error(err)
    }
  },

  async login(_: any, { username, password }, { req, res }) {
    try {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return new Error('User was not found')
      }

      const isPasswordCorrect = await verify(user.password, password)

      if (!isPasswordCorrect) {
        return new Error('password was incorrect')
      }

      //login successful
      sendRefreshToken(res, user)

      req.user = user
      return {
        accessToken: createAccessToken(user),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
