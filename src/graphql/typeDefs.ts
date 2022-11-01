const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battleSongs: [BattleUser]
    
  }
  type BattleUser{
    id: ID!
    battle:Battle
    user: User
    battleCreator:Boolean
    songName: String
    songArtist: String
    songAlbum: String
    songImage: String
    songLink : String
    voteCount: Int
  }

  type Battle {
   id: ID!
   uuid: String!
   title: String!
   expires: String!
   winner : User
   battleUsers: [BattleUser]
    
  }
  type getUserBattlesResponse {
    battle:Battle
  }
  type getBattleUsersResponse {
    user:User
  }
  type Query {
    getBattles: [Battle]
    getUsers: [User]

    #experimental
    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [getBattleUsersResponse]
    getUserBattles(userId: Int!): [getUserBattlesResponse]
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
    deleteBattle(battleId:Int!):Boolean
    addBattleUser(battleId:Int! ,userId:Int!): Boolean
    removeBattleUser(battleUserId:Int!): Boolean
    chooseSong(battleId:Int!, songName:String! , songArtist:String! , songAlbum:String! , songImage:String! , songLink:String!):BattleUser

    #votes
    vote(battleUserId:Int!):Boolean
  }

`

export default typeDefs

// DONE: implement chooseSong mutation
// DONE: change exp mutations with the real ones
// DONE: appropirate queries to get battles of user and users in battle
// DONE: implement votes
// TODO: handle expiration dates
// TODO: better error handling
// TODO: comments
// TODO: liking comments and battle
// TODO: sort , filter/search , pagination
//
