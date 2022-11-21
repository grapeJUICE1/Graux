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
   likeDislikeCount: Int
  }

  type Comment {
    id: ID!
    body: String!
    battle: Battle
    user: User
    likeDislikeCount: Int
  }
  type getUserBattlesResponse {
    battle:Battle
  }
  type getBattleUsersResponse {
    user:User
  }

    
  type Query {
    
    # Battle Queries
    getBattles: [Battle]
    getBattle(battleId:Int!): Battle

    # User Queries
    getUsers: [User]
    getUser(userId:Int!): User
  
    # BattleUser Queries
    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [getBattleUsersResponse]
    getUserBattles(userId: Int!): [getUserBattlesResponse]

    # Comment Queries
    getComments:[Comment]
    getComment(commentId:Int!):Comment
    getCommentsOfBattle(battleId:Int!):[Comment]

    test:String

    me: User 
  }


  type LoginResponse {
    accessToken: String
    user:User
  }
  
  union BattleOrComment = Battle | Comment

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
    startBattle(battleId:Int! , hoursTillActive:Int!):Boolean
    
    # Battle User Mutations
    addBattleUser(battleId:Int! ,userId:Int!): Boolean
    removeBattleUser(battleUserId:Int!): Boolean
    chooseSong(battleId:Int!, songName:String! , songArtist:String! , songAlbum:String! , songImage:String! , songLink:String!):BattleUser

    # Vote Mutations
    vote(battleUserId:Int!):Boolean
  
    # LikeDislike Mutations 
    likeDislike(battleId:Int , commentId:Int , value:Int!): BattleOrComment
  
    # Comment Mutations
    addComment(battleId:Int! , body:String!):Comment
    updateComment(commentId:Int! , body:String!):Comment
    removeComment(commentId:Int!):Boolean

    approveBattleRequest(battleRequestId:Int!):Boolean
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
// DONE: comments
// DONE: liking comments and battle
// TODO: sort , filter/search , pagination
// TODO: try graphql code generator
// TODO: strict mode on typescript
