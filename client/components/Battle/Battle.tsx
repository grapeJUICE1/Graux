import { Box, Button, HStack, Stack, Text, useToast } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import {
  Battle,
  BattleUser,
  useLikeDislikeMutation,
  useVoteMutation,
} from '../../gql/graphql'
import formatDate from '../../utils/formatDate'
import Comments from '../Comments/Comments'
import LikeDislike from '../LikeDislike/LikeDislike'

function Battle({ initialBattle }: { initialBattle: Battle }) {
  const [vote] = useVoteMutation()
  const [likeDislike] = useLikeDislikeMutation()
  const [battle, setBattle] = useState(() => initialBattle)
  const toast = useToast()
  const totalVotes = useMemo(() => {
    if (battle?.battleUsers)
      return (
        (battle?.battleUsers[0]?.voteCount || 0) +
        (battle?.battleUsers[1]?.voteCount || 0)
      )

    return null
  }, [battle])
  async function voteButtonOnClick(battleUserId: number) {
    if (battle?.battleUsers?.length === 2 && battle.status === 'active') {
      try {
        toast.closeAll()
        toast({
          description: 'Please wait for a few seconds',
          duration: null,
          isClosable: true,
        })
        const { data } = await vote({ variables: { battleUserId } })
        let battleUser1 = battle?.battleUsers[0]
        let battleUser2 = battle?.battleUsers[1]

        if (battleUser1?.id && battleUser2?.id) {
          if (+battleUser1?.id === battleUserId) {
            if (typeof battleUser1?.voteCount === 'number') {
              if (data?.vote === '+1') battleUser1.voteCount += 1
              else if (data?.vote === '-1') battleUser1.voteCount -= 1
            }
          }
          if (+battleUser2?.id === battleUserId) {
            if (typeof battleUser2?.voteCount === 'number') {
              if (data?.vote === '+1') battleUser2.voteCount += 1
              else if (data?.vote === '-1') battleUser2.voteCount -= 1
            }
          }
        }

        setBattle((oldBattle) => {
          return { ...oldBattle, battleUsers: [battleUser1, battleUser2] }
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
    } else {
      toast.closeAll()
      toast({
        description: 'voting time over',
        status: 'error',
        duration: 1000,
      })
    }
  }
  return (
    <Box>
      <Box border='1px' borderColor='cyan.500' width='100%' p='10'>
        <Text
          style={{ wordWrap: 'break-word' }}
          fontSize='xl'
          textAlign='center'
          py='2'
        >
          <Text display='inline' fontWeight='medium'>
            Title:{' '}
          </Text>
          {battle?.title}
        </Text>
        <Text py='2' fontSize='xl' textAlign='center'>
          <Text display='inline' fontWeight='medium'>
            Battle Status :{' '}
          </Text>
          {battle?.status}
        </Text>
        <Text py='2' fontSize='xl' textAlign='center'>
          <Text display='inline' fontWeight='medium'>
            Total Votes :{' '}
          </Text>
          {totalVotes !== null ? totalVotes : 'no votes yet'}
        </Text>
        {battle?.id && (
          <LikeDislike
            entityType='Battle'
            setEntity={setBattle}
            entity={battle}
          />
        )}
        <HStack
          width='100%'
          alignItems='center'
          justifyContent='center'
          gap='10'
        >
          <Text py='2' fontSize='sm' textAlign='center'>
            <Text display='inline' fontWeight='medium'>
              created at:{' '}
            </Text>
            {battle?.createdAt ? formatDate(+battle.createdAt) : ''}
          </Text>
          <Text py='2' fontSize='sm' textAlign='center'>
            <Text display='inline' fontWeight='medium'>
              ends at :{' '}
            </Text>
            {battle?.expires
              ? formatDate(+battle.expires)
              : 'No expiry date set yet as battle is not yet active'}
          </Text>
        </HStack>
      </Box>
      <Stack
        direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }}
      >
        {battle?.battleUsers?.map((battleUser: BattleUser | null) => {
          return (
            <Box
              key={battleUser?.id}
              border='1px'
              borderColor='cyan.500'
              width={{ base: '100%', sm: '100%', md: '100%', lg: '50%' }}
              p='10'
              m='0'
              bgColor={battleUser?.isWinner ? 'green.700' : ''}
            >
              <Box h='90%'>
                <Text fontSize='2rem'>
                  {battleUser?.isWinner ? 'Winner' : ''}
                </Text>
                <Text>{battleUser?.songName}</Text>
                <Text>{battleUser?.songArtist}</Text>
                <Text>{battleUser?.songAlbum}</Text>
                <Text>{battleUser?.songLink}</Text>
                {battleUser?.songImage && (
                  <img src={battleUser.songImage} style={{ width: '8rem' }} />
                )}

                {battleUser?.id && (
                  <Button
                    onClick={() => voteButtonOnClick(+battleUser?.id)}
                    mt='10'
                    colorScheme='blue'
                  >
                    Vote ({battleUser?.voteCount} votes)
                  </Button>
                )}
              </Box>
              {typeof battleUser?.voteCount === 'number' &&
                totalVotes !== null && (
                  <Box
                    mt='5'
                    width='100%'
                    p='1'
                    bgGradient={`linear(to-r, cyan.500 ${
                      totalVotes !== 0
                        ? `${(battleUser?.voteCount / totalVotes) * 100}`
                        : '100'
                    }%, gray.800 0%)`}
                  >
                    {(battleUser?.voteCount / totalVotes) * 100 || '0'}% votes
                  </Box>
                )}
            </Box>
          )
        })}
      </Stack>
      {battle?.id && <Comments battleId={+battle?.id} />}
    </Box>
  )
}

export default Battle
