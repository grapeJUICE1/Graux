import { Box, Center, Text } from "@chakra-ui/react"
import DeleteButton from "../../../../components/Buttons/DeleteButton"
import LikeDislike from "../../../../components/Buttons/LikeDislikeButton"
import {
  Comment,
  User,
  useRemoveCommentMutation,
} from "../../../../gql/graphql"

interface CommentCardProps {
  comment: Comment
  setComment: (commentToReplaceWith: Comment) => boolean
  me: User | null | undefined
}

function CommentCard({ comment, setComment, me }: CommentCardProps) {
  const [removeComment] = useRemoveCommentMutation()

  return (
    <Box key={comment?.id} border="1px" borderColor="cyan.500" my="3" p="3">
      <Text fontSize="1.2rem" textAlign="center">
        {comment?.body}
      </Text>
      <Text textAlign="center">-{comment?.user?.username}</Text>
      <LikeDislike
        entityType="Comment"
        setEntity={setComment}
        entity={comment}
      />
      {me && me?.id === comment?.user?.id && (
        <Center mt="7">
          <DeleteButton
            modalHeader="Delete Comment"
            modalBody="Are you sure you want to remove this comment?"
            mutationFunc={() =>
              removeComment({
                variables: { commentId: +comment?.id },
              })
            }
          />
        </Center>
      )}
    </Box>
  )
}

export default CommentCard
