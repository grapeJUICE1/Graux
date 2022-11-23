import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import Comment from './Comment'
import User from './User'

@Entity()
export default class LikeDislike extends AppBaseEntity {
  @Column()
  value: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: number

  @ManyToOne(() => Battle, (battle) => battle.likeDislikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'battleId' })
  battle: Battle

  @Column({ nullable: true })
  battleId: number

  @ManyToOne(() => Comment, (comment) => comment.likeDislikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment

  @Column({ nullable: true })
  commentId: number
}
