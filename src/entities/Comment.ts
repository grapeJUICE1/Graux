import { Length } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import LikeDislike from './LikeDislike'
import User from './User'

@Entity()
export default class Comment extends AppBaseEntity {
  @ManyToOne(() => Battle, (battle) => battle.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'battleId' })
  battle: Battle

  @Column({ nullable: true })
  battleId: number

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: number

  @OneToMany(() => LikeDislike, (likeDislike) => likeDislike.battle)
  likeDislikes: LikeDislike[]

  @Column()
  @Length(1, 255)
  body: string

  @Column({ default: 0 })
  likeDislikeCount: Number

  userLikeDislike: number
  async setUserLikeDislike(userId: number) {
    const likeDislike = await LikeDislike.findOne({
      where: { user: { id: userId }, comment: { id: this.id } },
    })
    this.userLikeDislike = likeDislike ? likeDislike.value : 0
  }
}
