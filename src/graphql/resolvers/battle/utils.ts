import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import User from '../../../entities/User'

export const checkIfBattleExistsAndBattleCreatedByUser = async (
  battleId: number,
  user: User
) => {
  let errors = []
  //Check if battle exists
  const battle = await Battle.findOne({
    where: { id: battleId },
    relations: { battleUsers: true },
  })
  if (!battle) {
    errors.push({
      path: 'battle',
      message: 'Battle with that id does not exist',
    })
    return new GraphQLError('Validation Error', {
      extensions: { errors, code: 'BAD_USER_INPUT' },
    })
  }

  // Check if battle has a user who created the battle
  const battleCreatorId = battle.getBattleCreator
  if (!battleCreatorId) {
    errors.push({ path: 'battle', message: 'Battle does not exist' })
    return new GraphQLError('Validation Error', {
      extensions: { errors, code: 'BAD_USER_INPUT' },
    })
  }

  // Check if battle was created by logged in user
  if (user.id !== battleCreatorId) {
    errors.push({
      path: 'battle',
      message: 'Battle was not created by you',
    })
    return new GraphQLError('Validation Error', {
      extensions: { errors, code: 'BAD_USER_INPUT' },
    })
  }

  return battle
}
