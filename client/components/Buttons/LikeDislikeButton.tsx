import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import { Button, HStack, Text } from "@chakra-ui/react"
import { Battle, Comment, useLikeDislikeMutation } from "../../gql/graphql"
import useMutation from "../../hooks/useMutation"

interface likeDislikeComponentProps {
  entityType: "Battle" | "Comment"
  entity: Battle | Comment
  setEntity: any
}
function LikeDislike({
  entityType,
  entity,
  setEntity,
}: likeDislikeComponentProps) {
  const [likeDislike] = useLikeDislikeMutation()

  const likeDislikeMutation = useMutation(likeDislike)

  async function likeDislikeButtonOnClick(value: number, id: number) {
    await likeDislikeMutation(
      {
        variables: {
          battleId: entityType === "Battle" ? id : undefined,
          commentId: entityType === "Comment" ? id : undefined,
          value,
        },
      },
      (data) => {
        setEntity({
          ...entity,
          likeDislikeCount: data?.likeDislike!,
          userLikeDislike: value,
        })
      }
    )
  }

  return (
    <HStack
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap="10"
      my="5"
    >
      <Button
        colorScheme={entity.userLikeDislike === 1 ? `orange` : "gray"}
        onClick={() =>
          likeDislikeButtonOnClick(
            entity.userLikeDislike === 1 ? 0 : 1,
            +entity.id
          )
        }
      >
        <ArrowUpIcon />
      </Button>
      <Text>{entity.likeDislikeCount} likes</Text>
      <Button
        colorScheme={entity.userLikeDislike === -1 ? `red` : "gray"}
        onClick={() =>
          likeDislikeButtonOnClick(
            entity.userLikeDislike === -1 ? 0 : -1,
            +entity.id
          )
        }
      >
        <ArrowDownIcon />
      </Button>
    </HStack>
  )
}
export default LikeDislike
