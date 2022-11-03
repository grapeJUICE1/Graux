import { validate } from 'class-validator'
import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import Comment from '../../../entities/Comment'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import mapErrors from '../../../utils/mapErrors'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  addComment: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, body }, { payload }) => {
      let errors = []

      const battle = await Battle.findOne({ where: { id: battleId } })
      if (!battle) {
        errors.push({
          path: 'battle',
          message: 'Battle with that id does not exist',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const user = await User.findOne({ where: { id: Number(payload.userId) } })
      if (!user) {
        errors.push({
          path: 'jwt',
          message: 'User logged in does not exist anymore',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const newComment = new Comment()
      newComment.battle = battle
      newComment.user = user
      newComment.body = body

      errors = await validate(newComment)
      if (errors.length > 0) {
        return new GraphQLError('Validation Error', {
          extensions: { errors: mapErrors(errors), code: 'BAD_USER_INPUT' },
        })
      }

      const comment = await Comment.save(newComment)
      return comment
    }
  ),
}
