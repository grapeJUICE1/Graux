import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Battle from './Battle'
import User from './User'
import Vote from './Vote'

@Entity()
export default class BattleUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(() => Battle, (battle) => battle.battleUsers)
  battle: Battle

  @ManyToOne(() => User, (user) => user.battleSongs)
  user: User

  @OneToMany(() => Vote, (vote) => vote.battleUser)
  votes: Vote[]

  @Column({ default: 0 })
  voteCount: number

  @Column({ default: false })
  battleCreator: boolean

  @Column({ nullable: true })
  songName: string

  @Column({ nullable: true })
  songArtist: string

  @Column({ nullable: true })
  songAlbum: string

  @Column({ nullable: true })
  songImage: string

  @Column({ nullable: true })
  songLink: string
}
