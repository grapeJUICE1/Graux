const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   firstName: String!
   lastName: String!
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
  }

`

export default typeDefs
