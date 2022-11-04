import { Length } from 'class-validator'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import LikeDislike from './LikeDislike'
import User from './User'

@Entity()
export default class Comment extends AppBaseEntity {
  @ManyToOne(() => Battle, (battle) => battle.comments, {
    onDelete: 'CASCADE',
  })
  battle: Battle

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User

  @OneToMany(() => LikeDislike, (likeDislike) => likeDislike.battle)
  likeDislikes: LikeDislike[]

  @Column()
  @Length(1, 255)
  body: string
}
