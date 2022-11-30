import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { Button, HStack, Text, useToast } from '@chakra-ui/react'
import { Battle, Comment, useLikeDislikeMutation } from '../../gql/graphql'

interface likeDislikeComponentProps {
  entityType: 'Battle' | 'Comment'
  entity: Battle | Comment
  setEntity: any
}
function LikeDislike({
  entityType,
  entity,
  setEntity,
}: likeDislikeComponentProps) {
  const toast = useToast()
  const [likeDislike] = useLikeDislikeMutation()
  async function likeDislikeButtonOnClick(value: number, id: number) {
    try {
      toast.closeAll()
      toast({
        description: 'Please wait for a few seconds',
        duration: null,
        isClosable: true,
      })
      let { data } = await likeDislike({
        variables: {
          battleId: entityType === 'Battle' ? id : undefined,
          commentId: entityType === 'Comment' ? id : undefined,
          value,
        },
      })
      setEntity({
        ...entity,
        likeDislikeCount: data?.likeDislike!,
        userLikeDislike: value,
      })

      toast.closeAll()
      toast({
        description: 'voting successfull',
        duration: 1000,
        status: 'success',
      })
    } catch (err) {
      console.log(err)
      toast.closeAll()
      //@ts-ignore
      let error = err?.graphQLErrors[0].extensions.errors[0] as {
        path: string
        message: string
      }
      if (error) {
        toast({
          description: error.message,
          status: 'error',
          duration: 3000,
        })
      }
    }
  }

  return (
    <HStack
      width='100%'
      alignItems='center'
      justifyContent='center'
      gap='10'
      my='5'
    >
      <Button
        colorScheme={entity.userLikeDislike === 1 ? `orange` : 'gray'}
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
        colorScheme={entity.userLikeDislike === -1 ? `red` : 'gray'}
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
