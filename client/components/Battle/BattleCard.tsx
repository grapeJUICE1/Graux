import { Box, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { Battle as BattleType } from '../../gql/graphql'
import formatDate from '../../utils/formatDate'

function Battle({ battle }: { battle: BattleType }) {
  return (
    <Flex p={50} w='full' alignItems='center' justifyContent='center'>
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
        w='50vw'
      >
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
          <Flex justifyContent='space-between' alignItems='center' mt={4}>
            <Text
              color='cyan.600'
              _dark={{
                color: 'cyan.400',
              }}
              fontWeight='500'
              display='inline'
            >
              <Text style={{ textDecoration: 'underline' }} display='inline'>
                {battle?.battleUsers ? battle?.battleUsers[1]?.songName : ''}
              </Text>{' '}
              by{' '}
              <Text display='inline' style={{ textDecoration: 'underline' }}>
                {battle?.battleUsers ? battle?.battleUsers[1]?.songAlbum : ''}
              </Text>
            </Text>
            <Flex alignItems='center'>
              <Text
                color='cyan.600'
                _dark={{
                  color: 'cyan.400',
                }}
                fontWeight='500'
                display='inline'
              >
                <Text style={{ textDecoration: 'underline' }} display='inline'>
                  {battle?.battleUsers ? battle?.battleUsers[0]?.songName : ''}
                </Text>{' '}
                by{' '}
                <Text display='inline' style={{ textDecoration: 'underline' }}>
                  {battle?.battleUsers ? battle?.battleUsers[0]?.songAlbum : ''}
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          <Link
            color='brand.600'
            _dark={{
              color: 'brand.400',
            }}
          >
            <Text display='inline'>battle created by : </Text>
            <Text
              _hover={{
                textDecor: 'underline',
              }}
              fontWeight='700'
              display='inline'
            >
              {battle?.battleUsers
                ? battle?.battleUsers[1]?.user?.username
                : ''}
            </Text>
          </Link>
          <Flex alignItems='center'>
            <Link
              color='gray.700'
              _dark={{
                color: 'gray.200',
              }}
              fontWeight='700'
              cursor='pointer'
            >
              {battle?.battleUsers
                ? battle?.battleUsers[0]?.user?.username
                : ''}
            </Link>
          </Flex>
        </Flex>
        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          {battle.status === 'over' ? (
            <Text mx='auto'>
              Battle won by:{' '}
              {battle?.battleUsers?.find((el) => {
                return el?.isWinner === true
              })?.user?.username || "None cuz it's a tie"}
            </Text>
          ) : (
            ''
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default Battle
