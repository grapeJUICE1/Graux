import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  async getBattles() {
    try {
      const battles = await Battle.find({
        relations: { battleUsers: { user: true } },
      })
      return battles
    } catch (err) {
      throw new Error(err)
    }
  },

  getBattle: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleId, manage }, { payload }) => {
      try {
        const battle = await Battle.findOne({
          where: { id: battleId },
          relations: {
            battleUsers: { user: true },
            comments: manage ? undefined : true,
            battleRequests: manage ? { user: true } : undefined,
          },
        })
        if (!battle) {
          return new GraphQLError('Validation Error', {
            extensions: {
              errors: [
                {
                  path: 'battle',
                  message: 'Battle with that id was not found',
                },
              ],
              code: 'BAD_USER_INPUT',
            },
          })
        }
        if (payload?.userId) await battle.setUserLikeDislike(+payload?.userId)
        return battle
      } catch (err) {
        throw new Error(err)
      }
    },
    true
  ),
}
