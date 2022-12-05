import { Box, Button, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { Battle, BattleUser, useVoteMutation } from '../../../../gql/graphql'
import useMutation from '../../../../hooks/useMutation'

interface BattleUserInfo {
  battleUser: BattleUser
  totalVotes: number
  battle: Battle
  setBattle: Dispatch<SetStateAction<Battle>>
}

function BattleUserInfo({
  battleUser,
  totalVotes,
  battle,
  setBattle,
}: BattleUserInfo) {
  const [vote] = useVoteMutation()
  const voteMutation = useMutation(vote)

  async function voteButtonOnClick(battleUserId: number) {
    if (battle?.battleUsers?.length === 2 && battle.status === 'active') {
      await voteMutation({ variables: { battleUserId } }, (data) => {
        let battleUser1 = battle?.battleUsers?.at(0)!
        let battleUser2 = battle?.battleUsers?.at(1)!

        if (battleUser1?.id && battleUser2?.id) {
          if (+battleUser1?.id === battleUserId) {
            battleUser2.userVote = 0
            if (typeof battleUser1?.voteCount === 'number') {
              if (typeof battleUser1?.userVote === 'number') {
                if (battleUser1?.voteCount! > data?.vote!) {
                  battleUser1.userVote = 0
                }
                if (battleUser1?.voteCount! < data?.vote!) {
                  battleUser1.userVote = 1
                }
              }
              battleUser1.voteCount = data?.vote!
              if (typeof battleUser2?.voteCount === 'number')
                battleUser2.voteCount =
                  data?.vote! + battleUser2.voteCount - data?.vote!
            }
          }
          if (+battleUser2?.id === battleUserId) {
            battleUser1.userVote = 0
            if (typeof battleUser2?.voteCount === 'number') {
              if (typeof battleUser2?.userVote === 'number') {
                if (battleUser2?.voteCount! > data?.vote!) {
                  battleUser2.userVote = 0
                }
                if (battleUser2?.voteCount! < data?.vote!) {
                  battleUser2.userVote = 1
                }
              }
              battleUser2.voteCount = data?.vote!
            }
          }
        }

        setBattle((oldBattle) => {
          return { ...oldBattle, battleUsers: [battleUser1, battleUser2] }
        })
      })
    }
  }
  return (
    <Box
      key={battleUser?.id}
      border='1px'
      borderColor='cyan.500'
      width={{ base: '100%', sm: '100%', md: '100%', lg: '50%' }}
      p='10'
      mx='0 !important'
      bgColor={battleUser?.isWinner ? 'green.700' : ''}
    >
      <Box h='90%'>
        <Text fontSize='2rem'>{battleUser?.isWinner ? 'Winner' : ''}</Text>
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
            colorScheme={battleUser?.userVote === 1 ? 'orange' : 'blue'}
            isDisabled={battle?.status !== 'active'}
          >
            Vote ({battleUser?.voteCount} votes)
          </Button>
        )}
      </Box>
      {typeof battleUser?.voteCount === 'number' && totalVotes !== null && (
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
}

export default BattleUserInfo
