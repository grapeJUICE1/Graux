import { verify } from "jsonwebtoken"
import User from "../../entities/User"
import { GraphQLMiddlewareFunc } from "../../types/graphql-utils"

const isAuthMiddleware: GraphQLMiddlewareFunc = async (
  resolver,
  parent,
  args,
  context,
  info,
  justCheckIfAuthorized: boolean = false
) => {
  let authorized = false

  const authorization = context.req.headers["authorization"] // bearer token
  if (!authorization) {
    if (justCheckIfAuthorized) {
      const result = await resolver(parent, args, context, info)
      return result
    }
    throw new Error("not authenticated")
  }
  try {
    const token = authorization.split(" ")[1]
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findOne({ where: { id: payload.userId } })

    if (!user) {
      throw new Error("User associated with this token does not exist anymore")
    }

    //@ts-ignore
    context.payload = payload
    //@ts-ignore
    context.req.user = user
    authorized = true
  } catch (err) {
    console.log(err)

    context?.res?.cookie("jid", "", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    if (!justCheckIfAuthorized) throw new Error(err)
  }
  if (authorized || justCheckIfAuthorized) {
    const result = await resolver(parent, args, context, info)

    return result
  }
}

export default isAuthMiddleware
