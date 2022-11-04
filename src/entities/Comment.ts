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

  @Column({ default: 0 })
  likeDislikeCount: Number

  protected userLikeDislike: number
  async setUserLikeDislike(userId: number) {
    const likeDislike = await LikeDislike.findOne({
      where: { user: { id: userId }, comment: { id: this.id } },
    })
    this.userLikeDislike = likeDislike ? likeDislike.value : 0
  }
}
