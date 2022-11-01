import { verify } from 'argon2'
import { isEmpty, validate } from 'class-validator'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import AppError from '../../../utils/AppError'
// import {UserInputError} from '@apollo/server'
import { createAccessToken, sendRefreshToken } from '../../../utils/auth'
import mapErrors from '../../../utils/mapErrors'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  register: async (_: any, { username, email, password }, { req }) => {
    try {
      // Validate data
      let errors = []
      const emailUser = await User.findOne({ where: { email } })
      const usernameUser = await User.findOne({ where: { username } })
      if (emailUser)
        errors.push({ path: 'email', message: 'Email is already taken' })

      if (usernameUser)
        errors.push({ path: 'username', message: 'Username is already taken' })

      if (errors.length > 0) {
        return new AppError('Validation Error', errors, 'BAD_USER_INPUT')
      }

      const newUser = new User()
      newUser.username = username
      newUser.email = email
      newUser.password = password

      errors = await validate(newUser)
      if (errors.length > 0)
        return new AppError(
          'Validation Error',
          mapErrors(errors),
          'BAD_USER_INPUT'
        )

      await newUser.save()

      req.user = newUser
      return newUser
    } catch (err) {
      throw new Error(err)
    }
  },

  login: async (_: any, { username, password }, { req, res }) => {
    try {
      let errors = []

      if (isEmpty(username))
        errors.push({ path: 'username', message: 'Username must not be empty' })
      if (isEmpty(password))
        errors.push({ path: 'password', message: 'Password must not be empty' })
      if (errors.length > 0) {
        return new AppError('Validation Error', errors, 'BAD_USER_INPUT')
      }
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
        relations: { battleSongs: true },
      })
      if (!user) return new Error('User logged in does not exist anymore')

      user.battleSongs = []
      User.save(user)
      User.delete({ id: Number(payload.userId) })
      return true
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }),
}
