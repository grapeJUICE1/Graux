import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import Comment from '../../../entities/Comment'
import LikeDislike from '../../../entities/LikeDislike'
import User from '../../../entities/User'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  likeDislike: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, commentId, value }, { req }) => {
      let errors = []
      // validate value
      if (![1, 0, -1].includes(value)) {
        errors.push({ path: 'value', message: 'Value can either be 1,0 or -1' })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      const user: User = req.user as User
      let likeDislike: LikeDislike
      let battle: Battle
      let comment: Comment

      if (battleId) {
        // find battle if battle give
        battle = await Battle.findOne({ where: { id: battleId } })
        if (!battle) {
          errors.push({
            path: 'battle',
            message: 'Battle with that id was not found',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        // check if likeDislike by this user already exists for battle
        likeDislike = await LikeDislike.findOne({
          where: { battle: { id: battleId }, user: { id: user.id } },
        })
      } else if (commentId) {
        //find comment if comment given
        comment = await Comment.findOne({ where: { id: commentId } })
        if (!comment) {
          errors.push({
            path: 'comment',
            message: 'Comment with that id was not found',
          })
          return new GraphQLError('Validation Error', {
            extensions: { errors, code: 'BAD_USER_INPUT' },
          })
        }
        // check if likeDislike by this user already exists for comment
        likeDislike = await LikeDislike.findOne({
          where: { comment: { id: commentId }, user: { id: user.id } },
        })
      } else {
        // if none battle and comment given , then return error
        errors.push({
          path: 'id',
          message: 'Please provide id of the thing you wanna like or dislike',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      }

      if (!likeDislike && value === 0) {
        //if there is no likedislike and value is set to reset , then return error , cuz there is nothing to reset
        errors.push({
          path: 'likeDislike',
          message: 'LikeDislike not found',
        })
        return new GraphQLError('Validation Error', {
          extensions: { errors, code: 'BAD_USER_INPUT' },
        })
      } else if (!likeDislike) {
        // if there is no likedislike and value is 1 or -1 , create a like dislike
        likeDislike = new LikeDislike()

        likeDislike.user = user
        likeDislike.value = value

        if (battle) likeDislike.battle = battle
        else likeDislike.comment = comment

        await likeDislike.save()
      } else if (value === 0) {
        //if value is 0 reset like dislike
        await likeDislike.remove()
      } else if (likeDislike.value !== value) {
        // if likedislike exists and another value is given , update the value
        likeDislike.value = value
        await likeDislike.save()
      }

      if (battle) {
        battle.setUserLikeDislike(user.id)
        const likes = await LikeDislike.count({
          where: { battle: { id: battle.id }, value: 1 },
        })
        const dislikes = await LikeDislike.count({
          where: { battle: { id: battle.id }, value: 0 },
        })

        let likeDislikeCount = 0

        if (!likes && !dislikes) likeDislikeCount = 0
        else if (!likes) likeDislikeCount = dislikes
        else if (!dislikes) likeDislikeCount = likes
        else likeDislikeCount = likes - dislikes

        battle.likeDislikeCount = likeDislikeCount

        return await battle.save()
      } else {
        comment.setUserLikeDislike(user.id)

        const likes = await LikeDislike.count({
          where: { comment: { id: comment.id }, value: 1 },
        })
        const dislikes = await LikeDislike.count({
          where: { comment: { id: comment.id }, value: 0 },
        })

        let likeDislikeCount = 0

        if (!likes && !dislikes) likeDislikeCount = 0
        else if (!likes) likeDislikeCount = dislikes
        else if (!dislikes) likeDislikeCount = likes
        else likeDislikeCount = likes - dislikes

        comment.likeDislikeCount = likeDislikeCount
        return await comment.save()
      }
    }
  ),
}
