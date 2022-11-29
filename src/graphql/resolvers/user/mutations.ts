import { verify } from 'argon2'
import { isEmpty, validate } from 'class-validator'
import { GraphQLError } from 'graphql'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
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
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const newUser = new User()
      newUser.username = username
      newUser.email = email
      newUser.password = password
      errors = await validate(newUser)
      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors: mapErrors(errors), code: 'BAD_USER_INPUT' },
        })

      const user = await newUser.save()
      req.user = user
      return user
    } catch (err) {
      throw new Error(err)
    }
  },

  login: async (_: any, { username, password }, { req, res }) => {
    console.log('sepas')
    try {
      let errors = []

      if (isEmpty(username))
        errors.push({ path: 'username', message: 'Username must not be empty' })
      if (isEmpty(password))
        errors.push({ path: 'password', message: 'Password must not be empty' })

      if (errors.length > 0) {
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      const user = await User.findOne({ where: { username } })
      console.log(user)
      if (!user) {
        errors.push({
          path: 'username',
          message: 'user with that username not found',
        })
      }
      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })

      const isPasswordCorrect = await verify(user.password, password)

      if (!isPasswordCorrect) {
        errors.push({ path: 'password', message: 'password is not correct' })
      }
      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })

      //login successful
      sendRefreshToken(res, user)

      req.user = user
      return {
        accessToken: createAccessToken(user),
        user: user,
      }
    } catch (err) {
      console.log(err)
    }
  },

  updateUser: addMiddleware(
    isAuthMiddleware,
    async (_, { newUsername, newEmail }, { payload }) => {
      let errors = []
      const user = await User.findOne({ where: { id: Number(payload.userId) } })
      if (!user) {
        errors.push({
          path: 'jwt',
          message: 'User logged in does not exist anymore',
        })
        return new GraphQLError('Authentication Error', {
          extensions: {
            errors,
            code: 'BAD_USER_INPUT',
          },
        })
      }

      if (isEmpty(newUsername))
        errors.push({ path: 'username', message: 'Username must not be empty' })
      if (isEmpty(newEmail))
        errors.push({ path: 'email', message: 'Email must not be empty' })
      if (errors.length > 0) {
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const checkIfUsernameExists = await User.findOne({
        where: { username: newUsername },
      })

      const checkIfEmailExists = await User.findOne({
        where: { email: newEmail },
      })

      if (checkIfUsernameExists)
        errors.push({ path: 'username', message: 'Username is already taken' })

      if (checkIfEmailExists)
        errors.push({ path: 'email', message: 'Email is already taken' })

      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })

      user.username = newUsername
      user.email = newEmail

      errors = await validate(user)
      if (errors.length > 0)
        return new GraphQLError('Validation Error', {
          extensions: { errors: mapErrors(errors), code: 'BAD_USER_INPUT' },
        })

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
      if (!user)
        return new GraphQLError('Authentication Error', {
          extensions: {
            path: 'jwt',
            message: 'User logged in does not exist anymore',
          },
        })

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
