import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'

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

  async getBattle(_: any, { battleId, manage }) {
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
              { path: 'battle', message: 'Battle with that id was not found' },
            ],
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return battle
    } catch (err) {
      throw new Error(err)
    }
  },
}
