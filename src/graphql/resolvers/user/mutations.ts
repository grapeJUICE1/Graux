import { hash, verify } from 'argon2'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
// import {UserInputError} from '@apollo/server'
import { createAccessToken, sendRefreshToken } from '../../../utils/auth'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  register: async (_: any, { username, email, password }, { req }) => {
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

  login: async (_: any, { username, password }, { req, res }) => {
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

  updateUser: addMiddleware(
    isAuthMiddleware,
    async (_, { newUsername, newEmail }, { payload }) => {
      const user = await User.findOne({ where: { id: Number(payload.userId) } })

      if (!user) return new Error('User logged in does not exist anymore')

      const username = newUsername.trim()
      const email = newEmail.trim()

      if (username === '' || email === '') {
        return new Error("username and email can't be empty")
      }

      const checkIfUserExists = await User.findOne({
        where: [{ username }, { email }],
      })
      if (checkIfUserExists)
        return new Error('User with that username and email already exists')
      user.username = username
      user.email = email

      await User.save(user)
      return user
    }
  ),

  deleteUser: addMiddleware(isAuthMiddleware, async (_, {}, { payload }) => {
    try {
      const user = await User.findOne({
        where: { id: Number(payload.userId) },
        relations: { battles: true },
      })
      if (!user) return new Error('User logged in does not exist anymore')

      user.battles = []
      User.save(user)
      User.delete({ id: Number(payload.userId) })
      return true
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }),
}
