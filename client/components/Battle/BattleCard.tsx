import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import NextLink from 'next/link'
import { Battle as BattleType, BattleUser } from '../../gql/graphql'
import formatDate from '../../utils/formatDate'

function BattleCard({ battle }: { battle: BattleType }) {
  const battleCreator = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator ? true : false
    })
  }, [battle])
  const battleWinner = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.isWinner ? true : false
    })
  }, [battle])

  return (
    <Flex p={41} w='full' alignItems='center' justifyContent='center'>
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
        w='55rem'
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
          {/*<Flex justifyContent='space-between' alignItems='center' mt={4}>
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
          </Flex>*/}
        </Box>

        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          {battle?.battleUsers &&
            battle.battleUsers?.map((battleUser: BattleUser | null) => {
              return (
                <Box bgColor={battleUser?.isWinner ? 'green.700' : ''}>
                  <Box>
                    <Link
                      color='brand.600'
                      _dark={{
                        color: 'brand.400',
                      }}
                    >
                      {battleCreator?.user?.id === battleUser?.user?.id && (
                        <Text display='inline'>battle created by : </Text>
                      )}
                      <Text
                        _hover={{
                          textDecor: 'underline',
                        }}
                        fontWeight='700'
                        display='inline'
                      >
                        {battleUser?.user?.username || ''}
                      </Text>
                    </Link>
                  </Box>
                  <HStack>
                    {battleUser?.songImage && (
                      <img
                        style={{ width: '5rem' }}
                        onError={({ currentTarget }) => {
                          if (currentTarget.src != '/images/404.png')
                            currentTarget.src = '/images/404.png'
                        }}
                        src={battleUser?.songImage}
                      />
                    )}
                    <Box>
                      {battleUser?.songName && (
                        <Box>
                          <Text display='inline'>Song Name: </Text>
                          <Text
                            style={{ wordWrap: 'break-word' }}
                            fontWeight='medium'
                            display='inline'
                          >
                            {battleUser?.songName}
                          </Text>
                        </Box>
                      )}
                      {battleUser?.songAlbum && (
                        <Box>
                          <Text display='inline'>Song Album: </Text>
                          <Text
                            style={{ wordWrap: 'break-word' }}
                            fontWeight='medium'
                            display='inline'
                          >
                            {battleUser?.songAlbum}
                          </Text>
                        </Box>
                      )}
                      {battleUser?.songArtist && (
                        <Box>
                          <Text display='inline'>Song Artist: </Text>
                          <Text
                            style={{ wordWrap: 'break-word' }}
                            display='inline'
                            fontWeight='medium'
                          >
                            {battleUser?.songArtist}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </HStack>
                </Box>
              )
            })}
        </Flex>
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
      </Box>
    </Flex>
  )
}

export default BattleCard
