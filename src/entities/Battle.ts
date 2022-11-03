import { Length } from 'class-validator'
import { Entity, Column, OneToMany } from 'typeorm'
import BattleUser from './BattleUser'
import BattleStatus from '../types/BattleStatusEnum'
import AppBaseEntity from './AppBaseEntity'
import Comment from './Comment'

@Entity()
export default class Battle extends AppBaseEntity {
  @Column({ generated: 'uuid' })
  uuid: string

  @Length(10, 255)
  @Column()
  title: string

  @Column({ nullable: true })
  expires: Date

  @Column({
    type: 'enum',
    enum: BattleStatus,
    default: BattleStatus.CREATION,
  })
  status: BattleStatus

  @OneToMany(() => BattleUser, (battleUser) => battleUser.battle)
  battleUsers: BattleUser[]

  @OneToMany(() => Comment, (comment) => comment.battle)
  comments: Comment[]

  public get getBattleCreator() {
    const battleUser = this.battleUsers.find(
      (battleUser) => battleUser.battleCreator === true
    )
    return battleUser.user
  }

  public setBattleWinner() {
    let winner: any
    if (this.battleUsers[0]?.voteCount === this.battleUsers[1]?.voteCount) {
      winner = 'tie'
      return winner
    }
    winner = this?.battleUsers.sort((prev, curr) => {
      return curr.voteCount - prev.voteCount
    })[0]

    return winner
  }

  public get getBattleWinner() {
    const winner = this.battleUsers.find(
      (battleUser) => battleUser.isWinner === true
    )
    if (!winner) return 'No Winner'
    return winner
  }

  public get battleUsersChosenSong() {
    const userNotChoseSong = this.battleUsers.find(
      (battleUser) => battleUser.songName === null
    )

    if (userNotChoseSong) return false
    return true
  }
}
