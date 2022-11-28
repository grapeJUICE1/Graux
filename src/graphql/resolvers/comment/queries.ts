import { GraphQLError } from 'graphql'
import Comment from '../../../entities/Comment'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  getComments: async () => {
    try {
      const comments = await Comment.find({})
      return comments
    } catch (err) {
      throw new Error(err)
    }
  },

  getCommentsOfBattle: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId }, { payload }) => {
      try {
        let errors = []
        const comments = await Comment.find({
          relations: { user: true },
          where: { battleId: battleId },
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
