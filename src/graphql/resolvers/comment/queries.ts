import { GraphQLError } from 'graphql'
import Comment from '../../../entities/Comment'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  getComments: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, userId }, { payload }) => {
      try {
        const comments = await Comment.find({
          relations: { user: true },
          where: {
            battleId: battleId || undefined,
            userId: userId || undefined,
          },
        })

        if (payload?.userId) {
          for (const comment of comments) {
            await comment.setUserLikeDislike(+payload?.userId)
          }
          return comments
        }
        return comments
      } catch (err) {
        throw new Error(err)
      }
    },
    true
  ),
  getComment: async (_: any, { commentId }) => {
    try {
      let errors = []
      const comment = Comment.findOne({
        relations: { battle: true, user: true },
        where: { id: commentId },
      })
      if (!comment) {
        errors.push({
          path: 'comment',
          message: 'Comment with that id does not exist',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }
      return comment
    } catch (err) {
      throw new Error(err)
    }
  },
}
