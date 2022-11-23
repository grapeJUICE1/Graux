import { GraphQLError } from 'graphql'
import BattleRequest from '../../../entities/BattleRequest'

export default {
  getAllBattleRequests: async () => {
    const battleRequests = await BattleRequest.find({
      relations: { battle: true, user: true },
    })
    return battleRequests
  },

  getBattleRequests: async (_, { battleId }) => {
    let errors = []
    const battleRequests = await BattleRequest.find({
      relations: { user: true },
      where: { battleId: battleId },
    })
    if (!battleRequests) {
      errors.push({
        path: 'battleRequests',
        message:
          "Either this battle has no battle requests yet or battle with this id doesn't exist",
      })
      return new GraphQLError('Validation Error', {
        extensions: { errors, code: 'BAD_USER_INPUT' },
      })
    }

    return battleRequests
  },

  getBattleRequest: async (_, { battleRequestId }) => {
    const battleRequest = BattleRequest.findOne({
      where: { id: battleRequestId },
      relations: { battle: true, user: true },
    })
    if (!battleRequest) {
      return new GraphQLError('Validation Error', {
        extensions: {
          errors: [
            {
              path: 'battleRequest',
              message: 'Battle Request with that id was not found',
            },
          ],
          code: 'BAD_USER_INPUT',
        },
      })
    }
    return battleRequest
  },
}
