import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import express from "express"
import cookieParser from "cookie-parser"
import MyContext from "./MyContext"
import http from "http"
import cors from "cors"
import dataSource from "./data-source"
import resolvers from "./graphql/resolvers"
import typeDefs from "./graphql/typeDefs"
import { verify } from "jsonwebtoken"
import config from "./config/config"
import User from "./entities/User"
import { createAccessToken, sendRefreshToken } from "./utils/auth"

async function main() {
  await dataSource.initialize()
  console.log("connected to database 📅📅📅")

  const app = express()
  const httpServer = http.createServer(app)

  // @ts-ignore
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    includeStacktraceInErrorResponses: false,
  })

  // @ts-ignore
  await server.start()

  app.use(cookieParser())
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
    })
  )
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  )

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid
    if (!token) {
      return res.send({ status: "failure", accessToken: "" })
    }
    let payload: any = null
    try {
      payload = verify(token, config.REFRESH_TOKEN_SECRET)

      const user = await User.findOne({
        where: {
          id: payload.userId,
        },
      })
      if (!user) {
        return res.status(400).json({ status: "failure", accessToken: "" })
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ status: "failure", accessToken: "" })
      }
      sendRefreshToken(res, user)
      const newToken = createAccessToken(user)
      res.cookie("jid", newToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      return res.send({
        status: "success",
        accessToken: newToken,
      })
    } catch (err) {
      return res.send({ status: "failure", accessToken: "" })
    }
  })
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.PORT }, resolve)
  )

  console.log(`🚀 Server ready at http://localhost:${config.PORT}/`)
}
main().catch((err) => console.log(err))
