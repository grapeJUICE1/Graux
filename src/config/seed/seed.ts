import AppDataSource from "../../data-source"
import Battle from "../../entities/Battle"
import BattleUser from "../../entities/BattleUser"
import Comment from "../../entities/Comment"
import LikeDislike from "../../entities/LikeDislike"
import User from "../../entities/User"
import Vote from "../../entities/Vote"
import BattleStatus from "../../types/BattleStatusEnum"
import battlesJson from "./battles.json"
import usersJson from "./users.json"

const battles = battlesJson.battles
const users = usersJson.users

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const generateWord = (n: number) => {
  let word = ""
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789!#.,"

  for (let i = 0; i < n; ++i) {
    const random = getRandomInt(0, letters.length - 1)
    word += letters[random]
  }

  return word
}

const generateParagraph = (numOfWords: number) => {
  let paragraph = ""
  for (let i = 0; i < numOfWords; ++i) {
    const randomNumber = getRandomInt(0, 15)
    paragraph += generateWord(randomNumber)
    paragraph += " "
  }
  return paragraph
}

const emptyDatabase = async () => {
  const entities = AppDataSource.entityMetadatas

  for await (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name)

    await repository.query(
      `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`
    )
  }
}

const createUsers = async () => {
  for (const user of users) {
    const newUser = new User()
    newUser.username = user.username
    newUser.email = user.email
    newUser.password = user.password
    await newUser.save()
    console.log("One user created")
  }
}
const createBattleUsers = async (
  createdUsers: User[],
  chosenSongs: string[],
  createdBattle: Battle
) => {
  const randomIndexFromUsers1 = getRandomInt(0, createdUsers.length - 1)
  const battleCreatedBy = createdUsers[randomIndexFromUsers1]

  let randomIndexFromUsers2 = getRandomInt(0, createdUsers.length - 1)

  while (randomIndexFromUsers1 === randomIndexFromUsers2) {
    randomIndexFromUsers2 = getRandomInt(0, createdUsers.length - 1)
  }

  const secondBattleParticipant = createdUsers[randomIndexFromUsers2]

  const trackResponseOfSong1 = await fetch(chosenSongs[0])
  const trackResponseOfSong2 = await fetch(chosenSongs[1])

  const dataFromTrackResponse1 = await trackResponseOfSong1.json()
  const dataFromTrackResponse2 = await trackResponseOfSong2.json()

  const song1 = dataFromTrackResponse1?.track
  const song2 = dataFromTrackResponse2?.track

  const newBattleUser1 = new BattleUser()
  newBattleUser1.battle = createdBattle
  newBattleUser1.user = battleCreatedBy
  newBattleUser1.battleCreator = true
  newBattleUser1.songName = song1?.name || ""
  newBattleUser1.songArtist = song1?.artist?.name || ""
  newBattleUser1.songAlbum = song1?.album?.title || ""
  newBattleUser1.songImage = song1?.album?.image[2]["#text"] || ""
  newBattleUser1.songLink = song1?.url
  const BattleUser1 = await BattleUser.save(newBattleUser1)

  const newBattleUser2 = new BattleUser()
  newBattleUser2.battle = createdBattle
  newBattleUser2.user = secondBattleParticipant
  newBattleUser2.battleCreator = false
  newBattleUser2.songName = song2?.name || ""
  newBattleUser2.songArtist = song2?.artist?.name || ""
  newBattleUser2.songAlbum = song2?.album?.title || ""
  newBattleUser2.songImage = song2?.album?.image[2]["#text"] || ""
  newBattleUser2.songLink = song2?.url
  const BattleUser2 = await BattleUser.save(newBattleUser2)

  const hoursTillActive = 1
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + hoursTillActive)

  createdBattle.status = BattleStatus.ACTIVE
  createdBattle.expires = expiresAt

  await Battle.save(createdBattle)

  return [BattleUser1, BattleUser2]
}
const createLikeDislikes = async (
  createdUsers: User[],
  createdBattle: Battle
) => {
  const numOfLikesOfBattle = getRandomInt(4, users.length - 1)

  for (let i = 0; i < numOfLikesOfBattle; i++) {
    const likeDislike = new LikeDislike()

    likeDislike.user = createdUsers[i]
    likeDislike.value = 1

    likeDislike.battle = createdBattle

    await likeDislike.save()

    createdBattle.setUserLikeDislike(createdUsers[i].id)
    const likes = await LikeDislike.count({
      where: { battleId: createdBattle.id, value: 1 },
    })
    const dislikes = await LikeDislike.count({
      where: { battleId: createdBattle.id, value: -1 },
    })

    let likeDislikeCount = 0

    if (likes === undefined && dislikes === undefined) likeDislikeCount = 0
    else if (likes === undefined) likeDislikeCount = dislikes
    else if (dislikes === undefined) likeDislikeCount = likes
    else likeDislikeCount = likes - dislikes

    createdBattle.likeDislikeCount = likeDislikeCount
    await createdBattle.setUserLikeDislike(createdUsers[i]?.id)
    await createdBattle.save()
  }
}
const createVotes = async (
  createdUsers: User[],
  BattleUser1: BattleUser,
  BattleUser2: BattleUser
) => {
  const numOfVotesForBattleUser1 = getRandomInt(3, users.length - 1)
  const numOfVotesForBattleUser2 = getRandomInt(3, users.length - 1)

  for (let i = 0; i < numOfVotesForBattleUser1; i++) {
    await Vote.insert({
      user: createdUsers[i],
      battleUser: BattleUser1,
    })
    const voteCount = await Vote.count({
      where: { battleUserId: BattleUser1.id },
    })
    BattleUser1.voteCount = voteCount
    await BattleUser.save(BattleUser1)
  }

  for (let i = 0; i < numOfVotesForBattleUser2; i++) {
    await Vote.insert({
      user: createdUsers[i],
      battleUser: BattleUser2,
    })
    const voteCount = await Vote.count({
      where: { battleUserId: BattleUser2.id },
    })
    BattleUser2.voteCount = voteCount
    await BattleUser.save(BattleUser2)
  }
}
const createComments = async (createdUsers: User[], createdBattle: Battle) => {
  const numOfComments = getRandomInt(3, users.length - 1)

  for (let i = 0; i < numOfComments; i++) {
    const newComment = new Comment()
    newComment.battle = createdBattle
    newComment.user = createdUsers[i]
    newComment.body = generateParagraph(getRandomInt(3, 20))
    await Comment.save(newComment)
  }
}
const createBattles = async () => {
  const createdUsers = await User.find({})

  for (const battle of battles) {
    const newBattle = new Battle()

    newBattle.title = battle.title
    newBattle.status = BattleStatus.CREATION

    const createdBattle = await Battle.save(newBattle)

    const [BattleUser1, BattleUser2] = await createBattleUsers(
      createdUsers,
      battle.chosenSongs,
      createdBattle
    )

    console.log("Populating Battle With Votes ... ")
    await createVotes(createdUsers, BattleUser1, BattleUser2)
    console.log("Done\nPopulating Battle With Like Dislikes ... ")
    await createLikeDislikes(createdUsers, createdBattle)
    console.log("Done\nPopulating Battle With Comments ... ")
    await createComments(createdUsers, createdBattle)
    console.log("Done")

    console.log("One Battle created")
  }
}

const seed = async () => {
  try {
    await AppDataSource.initialize()
    console.log("connected to database 📅📅📅")

    await emptyDatabase()
    console.log("Deleted all data successfull \n Creating Users")

    await createUsers()
    console.log("Created Users Successfully")

    console.log("Creating Battles")
    await createBattles()
    console.log("All battles Created")
  } catch (err) {
    console.log(err)
  }
}

seed()
