import { GraphQLError } from "graphql"
import { ILike } from "typeorm"
import Battle from "../../../entities/Battle"
import BattleStatus from "../../../types/BattleStatusEnum"
import addMiddleware from "../../../utils/addMiddleware"
import isAuthMiddleware from "../../middlewares/isAuth"

export default {
  async getBattles(
    _: any,
    { take, skip, orderBy, avoidClientSideError, search }
  ) {
    let mutableSearch = search
    if (search && avoidClientSideError) {
      mutableSearch = search?.substring(1)
    }
    const orderByOptions = [
      "title",
      "expires",
      "createdAt",
      "-createdAt",
      "likeDislikeCount",
    ]
    try {
      const [battles, count] = await Battle.findAndCount({
        where: { title: search ? ILike(`%${mutableSearch}%`) : undefined },
        relations: { battleUsers: { user: true } },
        take: take || undefined,
        skip: skip || undefined,
        order: orderByOptions.includes(orderBy)
          ? orderBy?.at(0) === "-"
            ? { [orderBy.substring(1)]: "ASC" }
            : { [orderBy]: "DESC" }
          : { createdAt: "DESC" },
      })
      return { battles, total: count }
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
          return new GraphQLError("Validation Error", {
            extensions: {
              errors: [
                {
                  path: "battle",
                  message: "Battle with that id was not found",
                },
              ],
              code: "BAD_USER_INPUT",
            },
          })
        }
        if (payload?.userId) {
          await battle.setUserLikeDislike(+payload?.userId)

          if (battle?.status !== BattleStatus.CREATION) {
            for (const battleUser of battle?.battleUsers) {
              await battleUser.setUserVote(+payload?.userId)
            }
          }
        }
        return battle
      } catch (err) {
        throw new Error(err)
      }
    },
    true
  ),
}
