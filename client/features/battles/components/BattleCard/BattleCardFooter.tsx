import { Box, Flex, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Battle } from '../../../../gql/graphql'
import formatDate from '../../../../utils/formatDate'

interface BattleCardFooterProps {
  battle: Battle
}
function BattleCardFooter({ battle }: BattleCardFooterProps) {
  const battleWinner = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.isWinner ? true : false
    })
  }, [battle])
  return (
    <>
      {battle?.status === 'over' && (
        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          {battle.status === 'over' ? (
            <Box mx='auto'>
              <Text mx='auto' display='inline'>
                Battle won by :{' '}
              </Text>
              <Text display='inline' fontWeight='medium'>
                {battleWinner?.user?.username || "None cuz it's a tie"}
              </Text>
            </Box>
          ) : (
            ''
          )}
        </Flex>
      )}

      {battle?.status === 'active' && battle?.expires && (
        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          <Box mx='auto'>
            <Text mx='auto' display='inline'>
              Ends at :{' '}
            </Text>
            <Text
              fontSize='sm'
              color='gray.600'
              _dark={{
                color: 'gray.400',
              }}
              display='inline'
              fontWeight='medium'
            >
              {formatDate(+battle.expires) || ''}
            </Text>
          </Box>
        </Flex>
      )}
    </>
  )
}

export default BattleCardFooter
