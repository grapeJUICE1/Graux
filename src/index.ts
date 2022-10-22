import { ApolloServer } from '@apollo/server'
import config from './config/config'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import dataSource from './data-source'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'

interface MyContext {
  token?: String
}

async function main() {
  await dataSource.initialize()
  console.log('connected to database')

  const app = express()
  const httpServer = http.createServer(app)

  // @ts-ignore
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  // @ts-ignore
  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.PORT }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:${config.PORT}/`)
}

main().catch((err) => console.log(err))
