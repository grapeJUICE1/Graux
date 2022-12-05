import { Box, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Battle } from '../../../../gql/graphql'
import formatDate from '../../../../utils/formatDate'

interface BattleCardHeader {
  battle: Battle
}
function BattleCardHeader({ battle }: BattleCardHeader) {
  return (
    <Box>
      <Flex justifyContent='space-between' alignItems='center'>
        <Text
          fontSize='sm'
          color='gray.600'
          _dark={{
            color: 'gray.400',
          }}
        >
          {battle.createdAt ? formatDate(+battle.createdAt) : ''}
        </Text>
        <Link
          px={3}
          py={1}
          bg='gray.600'
          color='gray.100'
          fontSize='sm'
          fontWeight='700'
          rounded='md'
          _hover={{
            bg: 'gray.500',
          }}
        >
          {battle.status}
        </Link>
      </Flex>

      <Box mt={2}>
        <Link
          as={NextLink}
          href={`/battles/${battle.id}`}
          fontSize='2xl'
          color='gray.700'
          _dark={{
            color: 'white',
          }}
          fontWeight='700'
          _hover={{
            color: 'gray.600',
            _dark: {
              color: 'gray.200',
            },
            textDecor: 'underline',
          }}
        >
          {battle.title}
        </Link>
      </Box>
    </Box>
  )
}

export default BattleCardHeader
