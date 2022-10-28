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
   battleCreatedBy: User
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
    createBattle(title:String! , expires: Int!  ,usersIdArr: [Int]): Battle
    updateBattle(id:Int! , title:String! , winnerId:Int):Battle
    # updateWinnerBattle():Battle
    # updateUsersBattle():Battle
    deleteBattle(title:String!):Boolean
  
  }

`

export default typeDefs
