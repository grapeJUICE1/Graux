import { verify } from "jsonwebtoken"
import { GraphQLError } from "graphql"
import config from "../../../config/config"
import BattleUser from "../../../entities/BattleUser"
import User from "../../../entities/User"
import MyContext from "../../../MyContext"
import addMiddleware from "../../../utils/addMiddleware"
import isAuthMiddleware from "../../middlewares/isAuth"
import { ILike } from "typeorm"

export default {
  test: addMiddleware(isAuthMiddleware, async () => {
    return "testo desu ne"
  }),
  getUsers: async (
    _: any,
    { search, take, skip, orderBy, avoidClientSideError }
  ) => {
    try {
      const orderByOptions = ["createdAt", "-createdAt", "battlesWon"]
      let mutableSearch = search
      if (search && avoidClientSideError) {
        mutableSearch = search?.substring(1)
      }
      const [users, total] = await User.findAndCount({
        where: { username: search ? ILike(`%${mutableSearch}%`) : undefined },
        take: take || undefined,
        skip: skip || undefined,
        order: orderByOptions.includes(orderBy)
          ? Array?.from(orderBy)[0] === "-"
            ? { [orderBy.substring(1)]: "ASC" }
            : { [orderBy]: "DESC" }
          : { createdAt: "DESC" },
      })
      return { users, total }
    } catch (err) {
      throw new Error(err)
    }
  },
  getUser: async (_: any, { userId }) => {
    try {
      const user = await User.findOne({ where: { id: userId } })
      if (!user) {
        return new GraphQLError("Validation Error", {
          extensions: {
            errors: [
              { path: "user", message: "User with that id was not found" },
            ],
            code: "BAD_USER_INPUT",
          },
        })
      }
      return user
    } catch (err) {
      throw new Error(err)
    }
  },
  getUserBattles: async (
    _: any,
    { userId, battlesWon, battlesCreated, take, skip, orderBy }
  ) => {
    const orderByOptions = ["title", "expires", "createdAt", "likeDislikeCount"]
    try {
      const [battleUsers, total] = await BattleUser.findAndCount({
        relations: { battle: { battleUsers: { user: true } } },
        where: {
          userId: userId,
          isWinner: battlesWon ? true : undefined,
          battleCreator: battlesCreated ? true : undefined,
        },
        take: take || undefined,
        skip: skip || undefined,
        order: orderByOptions.includes(orderBy)
          ? { [orderBy]: "DESC" }
          : { createdAt: "DESC" },
      })

      if (!battleUsers) return new Error("Given user has no battles")
      const battles = []
      battleUsers.forEach((battleUser) => {
        battles.push(battleUser.battle)
      })
      return {
        battles,
        total,
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  me: async (_: any, {}, context: MyContext) => {
    const authorization = context.req.headers["authorization"] // bearer token
    if (!authorization) {
      return null
    }
    try {
      const token = authorization.split(" ")[1]
      const payload: any = verify(token, config.ACCESS_TOKEN_SECRET)
      if (!payload) {
        return null
      }

      const user = await User.findOne({ where: { id: payload.userId } })

      if (!user) {
        return null
      }

      return user
    } catch (err) {
      console.log(err)
      return null
    }
  },
}
