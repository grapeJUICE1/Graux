import { Box, Center, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  Comment,
  useGetCommentsLazyQuery,
  useMeLazyQuery,
} from '../../../../gql/graphql'

import AddCommentButton from './AddCommentButton'
import CommentCard from './CommentCard'

function Comments({
  battleId,
  userId,
}: {
  battleId?: number
  userId?: number
}) {
  const [meQuery, { data }] = useMeLazyQuery()
  const [comments, setComments] = useState<Comment[] | null>([])
  const [getComments] = useGetCommentsLazyQuery()
  useEffect(() => {
    meQuery()
  }, [])
  useEffect(() => {
    if (battleId || userId) {
      getComments({ variables: { battleId, userId } })
        .then((response) => {
          const comments = response?.data?.getComments
          if (comments) {
            setComments(comments as Comment[])
          }
        })
        .catch()
    }
  }, [battleId])

  function setComment(commentToReplaceWith: Comment) {
    if (comments) {
      const commentIndex = comments?.findIndex((comment: Comment) => {
        return comment.id === commentToReplaceWith.id
      })
      console.log(commentIndex)

      if (typeof commentIndex === 'number' && commentIndex !== -1) {
        const commentsCopy = [...comments]
        commentsCopy[commentIndex] = commentToReplaceWith
        setComments(commentsCopy)
        return true
      }
    }
    return false
  }

  return (
    <Box mt='10'>
      <Text textAlign='center' fontSize='2rem'>
        Comments
      </Text>
      <Center>
        {battleId && (
          <AddCommentButton
            battleId={battleId}
            comments={comments}
            setComments={setComments}
          />
        )}
      </Center>
      {comments &&
        comments?.map((comment: Comment) => {
          return (
            <CommentCard
              comment={comment}
              me={data?.me}
              setComment={setComment}
            />
          )
        })}
    </Box>
  )
}

export default Comments
