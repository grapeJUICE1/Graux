import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { BattleRequest } from '../../gql/graphql'

function BattleRequest({ battleRequest }: { battleRequest: BattleRequest }) {
  const router = useRouter()

  const battleCreator = useMemo(() => {
    console.log(battleRequest)
    return battleRequest?.battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator ? true : false
    })
  }, [battleRequest])

  return (
    <Box>
      <Text>{battleRequest?.battle?.title}</Text>
      <Text>{battleRequest?.battle?.status}</Text>
      <Text> {battleCreator?.user?.username} </Text>
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
