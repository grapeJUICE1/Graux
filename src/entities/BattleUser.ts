import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
} from 'typeorm'
import Battle from './Battle'
import User from './User'

@Entity()
export default class BattleUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // Battle id
  @ManyToOne(() => Battle, (battle) => battle.battleUsers)
  battle: Battle

  // User who associated with it
  @ManyToOne(() => User, (user) => user.battleSongs)
  user: User

  @Column({ default: false })
  battleCreator: boolean

  // Song Name
  @Column({ nullable: true })
  songName: string
  // Song Artist
  @Column({ nullable: true })
  songArtist: string
  // Song Album
  @Column({ nullable: true })
  songAlbum: string
  // Song Image
  @Column({ nullable: true })
  songImage: string
  // Song Link
  @Column({ nullable: true })
  songLink: string
}
