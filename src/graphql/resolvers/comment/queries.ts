import { GraphQLError } from "graphql"
import Comment from "../../../entities/Comment"
import addMiddleware from "../../../utils/addMiddleware"
import isAuthMiddleware from "../../middlewares/isAuth"

export default {
  getComments: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, userId, take, skip, orderBy }, { payload }) => {
      try {
        const orderByOptions = ["createdAt", "-createdAt", "likeDislikeCount"]
        const [comments, total] = await Comment.findAndCount({
          relations: { user: true },
          where: {
            battleId: battleId || undefined,
            userId: userId || undefined,
          },
          take: take || undefined,
          skip: skip || undefined,
          order: orderByOptions.includes(orderBy)
            ? Array.from(orderBy)[0] === "-"
              ? { [orderBy.substring(1)]: "ASC" }
              : { [orderBy]: "DESC" }
            : { createdAt: "DESC" },
        })

        if (payload?.userId) {
          for (const comment of comments) {
            await comment.setUserLikeDislike(+payload?.userId)
          }
          return { comments, total }
        }
        return { comments, total }
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
          path: "comment",
          message: "Comment with that id does not exist",
        })
        return new GraphQLError("Validation Error", {
          extensions: { errors, code: "BAD_USER_INPUT" },
        })
      }
      return comment
    } catch (err) {
      throw new Error(err)
    }
  },
}
