const typeDefs = `#graphql
  type User{
   id: ID!
   email: String!
   username: String!
   battleSongs: [BattleUser]
   createdAt:String
   battlesWon:Int
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
    userVote: Int
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
   commentCount:Int
   battleRequests:[BattleRequest]
   userLikeDislike:Int
  }

  type Comment {
    id: ID!
    body: String!
    battle: Battle
    user: User
    likeDislikeCount: Int
    userLikeDislike:Int
  }
  type BattleRequest {
    id: ID!
    battle: Battle
    user: User
    validated:Boolean
    createdAt:String
  }

  type getUserBattlesResponse {
    battles:[Battle]
    total:Int
  }
  type getBattleUsersResponse {
    user:User
  }

  type getBattlesResponse {
    battles:[Battle] 
    total:Int 
  } 

  type getUsersResponse {
    users: [User] 
    total: Int
  }

  type getCommentsResponse {
    comments: [Comment] 
    total: Int
  }
  type Query {
    
    # Battle Queries
    getBattles(take:Int skip:Int orderBy:String search:String avoidClientSideError:Boolean): getBattlesResponse
    getBattle(battleId:Int! manage:Boolean!): Battle

    # User Queries
    getUsers(search:String take:Int skip:Int orderBy:String avoidClientSideError:Boolean):getUsersResponse
    getUser(userId:Int!): User
  
    # BattleUser Queries
    getAllBattleUsers: [BattleUser]
    getBattleUsers(battleId:Int!): [getBattleUsersResponse]
    getUserBattles(userId: Int! ,battlesWon:Boolean,
    battlesCreated:Boolean,take:Int,skip:Int,orderBy:String ,avoidClientSideError:Boolean ): getUserBattlesResponse

    getAllBattleRequests: [BattleRequest]
    getBattleRequests(battleId:Int! showValidated:Boolean ): [BattleRequest]
    getUserBattleRequests(userId:Int! showValidated:Boolean): [BattleRequest]
    getBattleRequest(battleRequestId:Int!): BattleRequest

    # Comment Queries
    getComments(battleId:Int , userId:Int,take:Int skip:Int orderBy:String):getCommentsResponse
    getComment(commentId:Int!):Comment

    test:String

    me: User 
  }


  type LoginResponse {
    accessToken: String
    user:User
  }
  

  type Mutation {
    # User Mutations
    register(username: String! , email: String! , password: String!): User
    login(username: String! , password: String!): LoginResponse
    updateUser(newUsername:String! , newEmail: String! ):User
    deleteUser:Boolean

    # Battle Mutations
    createBattle(title:String!): Battle
    updateBattle(battleId:Int! , title:String! ):Boolean
    deleteBattle(battleId:Int!):Boolean
    startBattle(battleId:Int! , hoursTillActive:Int!):Boolean
    
    # Battle User Mutations
    addBattleUser(battleId:Int! ,userId:Int!): Boolean
    removeBattleUser(battleUserId:Int!): Boolean
    chooseSong(battleId:Int!, songName:String! , songArtist:String! , songAlbum:String! , songImage:String! , songLink:String!):Boolean

    # Vote Mutations
    vote(battleUserId:Int!):Int
  
    # LikeDislike Mutations 
    likeDislike(battleId:Int , commentId:Int , value:Int!): Int
  
    # Comment Mutations
    addComment(battleId:Int! , body:String!):Comment
    updateComment(commentId:Int! , body:String!):Comment
    removeComment(commentId:Int!):Boolean

    approveBattleRequest(battleRequestId:Int!):Boolean
    removeBattleRequest(battleRequestId:Int!):Boolean
    logout:Boolean
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
// DONE: sort , filter/search , pagination
// TODO: deploy website

// version 2
// TODO: try graphql code generator
// TODO: strict mode on typescript
