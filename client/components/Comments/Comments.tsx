import { Box, Center, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Comment, useGetCommentsOfBattleLazyQuery } from '../../gql/graphql'
import LikeDislike from '../LikeDislike/LikeDislike'
import AddCommentButton from './AddCommentButton'

function Comments({ battleId }: { battleId: number }) {
  const [comments, setComments] = useState<Comment[] | null>([])

  const [getCommentsOfBattle] = useGetCommentsOfBattleLazyQuery()

  useEffect(() => {
    if (battleId) {
      getCommentsOfBattle({ variables: { battleId } })
        .then((response) => {
          const comments = response?.data?.getCommentsOfBattle
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
            <Box border='1px' borderColor='cyan.500' my='3' p='3'>
              <Text fontSize='1.1rem' textAlign='center'>
                {comment?.body}
              </Text>
              <Text textAlign='center'>-{comment?.user?.username}</Text>
              <LikeDislike
                entityType='Comment'
                setEntity={setComment}
                entity={comment}
              />
            </Box>
          )
        })}
    </Box>
  )
}

export default Comments
