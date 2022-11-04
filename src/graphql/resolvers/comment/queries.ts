import { GraphQLError } from 'graphql'
import Comment from '../../../entities/Comment'

export default {
  getComments: async () => {
    try {
      const comments = await Comment.find({})
      return comments
    } catch (err) {
      throw new Error(err)
    }
  },

  getCommentsOfBattle: async (_: any, { battleId }) => {
    try {
      let errors = []
      const comments = await Comment.find({
        relations: { battle: { id: true }, user: true },
        where: { battle: { id: battleId } },
      })
      if (!comments) {
        errors.push({
          path: 'comment',
          message: 'Battle does not have any comments yet',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      return comments
    } catch (err) {
      throw new Error(err)
    }
  },
}
