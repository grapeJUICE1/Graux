const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
    
  }

  type Battle {
   id: ID!
   uuid: String!
   title: String!
   votingTill: String!
   winner : User
   users: [User]
    
  }
  type Book {
    title: String
    author: String
  }
  type Query {
    getBattles: [Battle]
    getUsers: [User]
    test: String
  }

  type LoginResponse {
    accessToken: String
  }

  type Mutation {
    register(username: String! , email: String! , password: String!): String
    login(username: String! , password: String!): LoginResponse
  }

`

export default typeDefs
