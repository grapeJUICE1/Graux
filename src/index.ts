import { ApolloServer } from '@apollo/server'
import config from './config/config'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import dataSource from './data-source'
import { User } from './entities/User'
import { Battle } from './entities/Battle'
import typeDefs from './graphql/typeDefs'

interface MyContext {
  token?: String
}

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

const resolvers = {
  Query: {
    books: () => books,
  },
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
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.PORT }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:4000/`)
}

main().catch((err) => console.log(err))
