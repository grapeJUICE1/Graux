const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battleSongs: [BattleUser]
   createdAt:String
  }
  type BattleUser{
    id: ID!
    battle:Battle
    user: User
    battleCreator:Boolean
    isWinner:Boolean
    songName: String
    songArtist: String
    songAlbum: String
    songImage: String
    songLink : String
    voteCount: Int
    createdAt:String
  }

  type Battle {
   id: ID!
   uuid: String!
   title: String!
   expires: String
   status: String!
   battleUsers: [BattleUser]
   createdAt:String
    
  }

  type Comment {
    body: String!
    battle: Battle
    user: User
  }
  type getUserBattlesResponse {
    battle:Battle
  }
  type getBattleUsersResponse {
    user:User
  }
  type Query {
    getBattles: [Battle]
    getBattle(battleId:Int!): Battle
    getUsers: [User]
    getUser(userId:Int!): User

    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [getBattleUsersResponse]
    getUserBattles(userId: Int!): [getUserBattlesResponse]
  }


  type LoginResponse {
    accessToken: String
  }
  
  type Error {
    path: String
    message: String
  }
  type Mutation {
    # User Mutations
    register(username: String! , email: String! , password: String!): User
    login(username: String! , password: String!): LoginResponse
    updateUser(newUsername:String! , newEmail: String! ):User
    deleteUser:Boolean

    # Battle Mutations
    createBattle(title:String!): Battle
    updateBattle(battleId:Int! , title:String! ):Battle
    deleteBattle(battleId:Int!):Boolean
    addBattleUser(battleId:Int! ,userId:Int!): Boolean
    removeBattleUser(battleUserId:Int!): Boolean
    chooseSong(battleId:Int!, songName:String! , songArtist:String! , songAlbum:String! , songImage:String! , songLink:String!):BattleUser
    startBattle(battleId:Int! , hoursTillActive:Int!):Boolean
    #votes
    vote(battleUserId:Int!):Boolean

    addComment(battleId:Int!):Comment
  }

`

export default typeDefs

// DONE: implement chooseSong mutation
// DONE: change exp mutations with the real ones
// DONE: appropirate queries to get battles of user and users in battle
// DONE: implement votes
// DONE: better error handling
// DONE: validation of inputs (either yup or class validator)
// DONE: handle expiration dates
// DONE: set and get winner
// TODO: comments
// TODO: liking comments and battle
// TODO: sort , filter/search , pagination
// TODO: try graphql code generator
// TODO: strict mode on typescript
