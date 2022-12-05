import { Box, Flex } from '@chakra-ui/react'
import { Battle } from '../../../../gql/graphql'
import BattleCardBody from './BattleCardBody'
import BattleCardFooter from './BattleCardFooter'
import BattleCardHeader from './BattleCardHeader'

function BattleCard({ battle }: { battle: Battle }) {
  return (
    <Flex py='10' w='full' alignItems='center' justifyContent='center'>
      <Box
        mx='auto'
        px={8}
        py={4}
        rounded='lg'
        shadow='lg'
        bg='white'
        _dark={{
          bg: 'gray.700',
        }}
        w='90%'
      >
        <BattleCardHeader battle={battle} />
        <BattleCardBody battle={battle} />
        <BattleCardFooter battle={battle} />
      </Box>
    </Flex>
  )
}

export default BattleCard
