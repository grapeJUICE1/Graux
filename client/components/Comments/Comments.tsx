import { Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Comment, useGetCommentsOfBattleLazyQuery } from '../../gql/graphql'

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
  return (
    <Box mt='10'>
      <Text textAlign='center' fontSize='2rem'>
        Comments
      </Text>
      {comments &&
        comments?.map((comment: Comment) => {
          return (
            <Box border='1px' borderColor='cyan.500' my='3' p='5'>
              <Text fontSize='1.3rem' textAlign='center'>
                {comment?.body}
              </Text>
              <Text textAlign='center'>-{comment?.user?.username}</Text>
            </Box>
          )
        })}
    </Box>
  )
}

export default Comments
