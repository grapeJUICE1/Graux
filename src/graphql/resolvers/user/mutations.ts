import { hash, verify } from 'argon2'
import { sign } from 'jsonwebtoken'
import User from '../../../entities/User'

export default {
  async register(_, { username, email, password }, context) {
    try {
      console.log(context)
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

  async login(_, { username, email, password }, context) {
    try {
      console.log(context)
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return { error: 'User was not found' }
      }

      const isPasswordCorrect = await verify(user.password, password)

      if (!isPasswordCorrect) {
        return { error: 'password was incorrect' }
      }

      //login successful

      return {
        accessToken: sign({ userId: user.id }, 'lololololol', {
          expiresIn: '15m',
        }),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
