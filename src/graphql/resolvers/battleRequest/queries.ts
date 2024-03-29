import { GraphQLError } from "graphql"
import BattleRequest from "../../../entities/BattleRequest"

export default {
  getAllBattleRequests: async () => {
    const battleRequests = await BattleRequest.find({
      relations: { battle: true, user: true },
    })
    return battleRequests
  },

  getBattleRequests: async (_: any, { battleId, showValidated }) => {
    const battleRequests = await BattleRequest.find({
      relations: { user: true },
      where: { battleId: battleId, validated: showValidated },
    })

    return battleRequests
  },

  getUserBattleRequests: async (_: any, { userId, showValidated }) => {
    const battleRequests = await BattleRequest.find({
      relations: { battle: { battleUsers: { user: true } } },
      where: { userId: userId, validated: showValidated },
    })

    return battleRequests
  },

  getBattleRequest: async (_: any, { battleRequestId }) => {
    const battleRequest = BattleRequest.findOne({
      where: { id: battleRequestId },
      relations: { battle: { battleUsers: { user: true } } },
    })
    if (!battleRequest) {
      return new GraphQLError("Validation Error", {
        extensions: {
          errors: [
            {
              path: "battleRequest",
              message: "Battle Request with that id was not found",
            },
          ],
          code: "BAD_USER_INPUT",
        },
      })
    }
    return battleRequest
  },
}
