import { hash } from 'argon2'
import { IsAlphanumeric, IsEmail, Length, Max, Min } from 'class-validator'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
} from 'typeorm'
import BattleUser from './BattleUser'
import Vote from './Vote'

@Entity('users')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEmail()
  email: string

  @Column()
  @Length(3, 30)
  @IsAlphanumeric()
  username: string

  @Column()
  @Length(8, 255)
  password: string

  @Column('int', { default: 0 })
  tokenVersion: number

  @OneToMany(() => BattleUser, (battleUser) => battleUser.user)
  battleSongs: BattleUser[]

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password)
  }
}
