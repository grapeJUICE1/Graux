import addMiddleware from '../../../utils/addMiddleware'
import isAuthMiddleware from '../../middlewares/isAuth'

export default {
  addBattleUserExp: addMiddleware(isAuthMiddleware, async () => {}),
}
