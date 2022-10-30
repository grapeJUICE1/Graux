const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battles:[Battle]
    
  }
  type BattleUser{
    id: ID!
    battle:Battle
    user: User
    songName: String
    songArtist: String
    songAlbum: String
    songImage: String
    songLink : String
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
  type Query {
    getBattles: [Battle]
    getUsers: [User]

    #experimental
    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [BattleUser]
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
    updateBattle(battleId:Int! , title:String! ):Battle
    addBattleUser(battleId:Int! , newUserId:Int!):Battle
    removeBattleUser(battleId:Int! , userIdToRemove:Int!):Battle
    deleteBattle(battleId:Int!):Boolean
    
    #experimental
    addBattleUserExp(battleId:Int! ,userId:Int!): BattleUser
  }

`

export default typeDefs
