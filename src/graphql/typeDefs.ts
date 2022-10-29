const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battles:[Battle]
    
  }

  type Battle {
   id: ID!
   uuid: String!
   title: String!
   expires: String!
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
    # User Mutations
    register(username: String! , email: String! , password: String!): String
    login(username: String! , password: String!): LoginResponse
    updateUser(newUsername:String! , newEmail: String! ):User
    deleteUser:Boolean

    # Battle Mutations
    createBattle(title:String! , expires: Int! ): Battle
    updateBattle(battleId:Int! , title:String! , winnerId:Int):Battle
    addBattleUser(battleId:Int! , newUserId:Int!):Battle
    removeBattleUser(battleId:Int! , userIdToRemove:Int!):Battle
    deleteBattle(battleId:Int!):Boolean
  
  }

`

export default typeDefs
