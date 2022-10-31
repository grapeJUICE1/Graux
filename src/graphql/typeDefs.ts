const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battles:[Battle]
   battleSongs: [BattleUser]
    
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
   battleUsers: [BattleUser]
    
  }
  type Query {
    getBattles: [Battle]
    getUsers: [User]

    #experimental
    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [BattleUser]
    getUserBattles(userId: Int!): [BattleUser]
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
    addBattleUserExp(battleId:Int! ,userId:Int!): Boolean
    removeBattleUserExp(battleId:Int!, userToRemoveId:Int!): Boolean
    chooseSong(battleId:Int!, songName:String! , songArtist:String! , songAlbum:String! , songImage:String! , songLink:String!):BattleUser
  }

`

export default typeDefs

// TODO: implement chooseSong mutation
// TODO: change exp mutations with the real ones
// TODO: appropirate queries to get battles of user and users in battle
// TODO: implement votes
// TODO: handle expiration dates
// TODO: better error handling
