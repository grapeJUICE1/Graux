import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import User from './User'
import Vote from './Vote'

@Entity()
export default class BattleUser extends AppBaseEntity {
  @ManyToOne(() => Battle, (battle) => battle.battleUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'battleId' })
  battle: Battle

  @Column({ nullable: true })
  battleId: number

  @ManyToOne(() => User, (user) => user.battleSongs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: number

  @OneToMany(() => Vote, (vote) => vote.battleUser)
  votes: Vote[]

  @Column({ default: 0 })
  voteCount: number

  @Column({ default: false })
  battleCreator: boolean

  @Column({ default: false })
  isWinner: boolean

  @Column({ nullable: true })
  songName: string

  @Column({ nullable: true })
  songArtist: string

  @Column({ nullable: true })
  songImage: string

  @Column({ nullable: true })
  songLink: string
}
