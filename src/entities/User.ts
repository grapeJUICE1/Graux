import { hash } from 'argon2'
import { IsAlphanumeric, IsEmail, Length } from 'class-validator'
import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import BattleUser from './BattleUser'
import Comment from './Comment'
import Vote from './Vote'

@Entity('users')
export default class User extends AppBaseEntity {
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password)
  }
}
