import { Column, Entity, ManyToOne } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import Comment from './Comment'
import User from './User'

@Entity()
export default class LikeDislike extends AppBaseEntity {
  @Column()
  value: number

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Battle, (battle) => battle.likeDislikes, {
    onDelete: 'CASCADE',
  })
  battle: Battle

  @ManyToOne(() => Comment, (comment) => comment.likeDislikes, {
    onDelete: 'CASCADE',
  })
  comment: Comment
}
