import { GraphQLError } from "graphql"
import BattleUser from "../../../entities/BattleUser"
import Vote from "../../../entities/Vote"
import BattleStatus from "../../../types/BattleStatusEnum"
import addMiddleware from "../../../utils/addMiddleware"
import isAuthMiddleware from "../../middlewares/isAuth"

export default {
  vote: addMiddleware(
    isAuthMiddleware,
    async (_: any, { battleUserId }, { req, payload }) => {
      try {
        let errors = []
        const battleUser = await BattleUser.findOne({
          where: { id: battleUserId },
          relations: { battle: { battleUsers: true } },
        })

        if (!battleUser) {
          errors.push({
            path: "battleUser",
            message: "BattleUser with that id does not exist",
          })
          return new GraphQLError("Validation Error", {
            extensions: { errors, code: "BAD_USER_INPUT" },
          })
        }

        if (battleUser.battle.status !== BattleStatus.ACTIVE) {
          errors.push({
            path: "battle",
            message: "You can only vote if a battle is active",
          })
          return new GraphQLError("Validation Error", {
            extensions: { errors, code: "BAD_USER_INPUT" },
          })
        }

        const voteExists = await Vote.findOne({
          where: { battleUserId: battleUserId, userId: +payload.userId },
        })
        if (voteExists) {
          // remove the vote
          await Vote.remove(voteExists)
          const voteCount = await Vote.count({
            where: { battleUserId: voteExists.battleUserId },
          })
          battleUser.voteCount = voteCount
          await BattleUser.save(battleUser)
          return voteCount
        }
        // add the new vote

        await Vote.insert({
          //@ts-ignore
          user: req.user,
          battleUser: battleUser,
        })

        const voteCount = await Vote.count({
          where: { battleUserId: battleUser.id },
        })
        battleUser.voteCount = voteCount
        await BattleUser.save(battleUser)
        return voteCount
      } catch (err) {
        throw new Error(err)
      }
    }
  ),
}
