import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { BattleRequest } from '../../../gql/graphql'

function BattleRequest({ battleRequest }: { battleRequest: BattleRequest }) {
  const router = useRouter()

  const battleCreator = useMemo(() => {
    return battleRequest?.battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator ? true : false
    })
  }, [battleRequest])

  return (
    <Box>
      <Text> title : {battleRequest?.battle?.title}</Text>
      <Text> status : {battleRequest?.battle?.status}</Text>
      <Text> username : {battleCreator?.user?.username} </Text>
      <Text> validated : {battleRequest?.validated?.toString()} </Text>
      <Button
        onClick={() =>
          router.push(`/users/approveBattleRequest/${battleRequest?.id}`)
        }
        colorScheme='cyan'
      >
        Approve
      </Button>
    </Box>
  )
}
export default BattleRequest
