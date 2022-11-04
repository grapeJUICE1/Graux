import Comment from '../../../entities/Comment'

export default {
  getComments: async () => {
    try {
      const comments = await Comment.find({})
      return comments
    } catch (err) {
      throw new Error(err)
    }
  },
  getComment: async () => {},
}
