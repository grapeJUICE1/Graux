import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  OneToOne,
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
  // Song Name
  @Column()
  songName: string
  // Song Artist
  @Column()
  songArtist: string
  // Song Album
  @Column()
  songAlbum: string
  // Song Image
  songImage: string
  // Song Link
  @Column()
  songLink: string
}
