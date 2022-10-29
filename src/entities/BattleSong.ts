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
export default class BattleSong extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // Battle id
  @Column()
  @ManyToOne(() => Battle, (battle) => battle.id, {
    onDelete: 'CASCADE',
  })
  battle: Battle

  // User who associated with it
  @Column()
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
