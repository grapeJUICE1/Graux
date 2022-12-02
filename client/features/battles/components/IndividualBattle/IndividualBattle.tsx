import { Box, Stack } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { Battle, BattleUser } from '../../../../gql/graphql'
import Comments from '../../../../components/Comments/Comments'
import BattleInfo from './BattleInfo'
import BattleUserInfo from './BattleUserInfo'

function IndividualBattle({ initialBattle }: { initialBattle: Battle }) {
  const [battle, setBattle] = useState(() => initialBattle)

  const totalVotes = useMemo(() => {
    if (battle?.battleUsers)
      return (
        (battle?.battleUsers[0]?.voteCount || 0) +
        (battle?.battleUsers[1]?.voteCount || 0)
      )

    return null
  }, [battle])

  return (
    <Box>
      <BattleInfo
        battle={battle}
        totalVotes={totalVotes}
        setBattle={setBattle}
      />
      <Stack
        direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }}
      >
        {battle?.battleUsers?.map((battleUser: BattleUser | null) => {
          return (
            <BattleUserInfo
              key={battleUser?.user?.id}
              battleUser={battleUser as BattleUser}
              totalVotes={totalVotes || 0}
              battle={battle}
              setBattle={setBattle}
            />
          )
        })}
      </Stack>
      {battle?.id && <Comments battleId={+battle?.id} />}
    </Box>
  )
}

export default IndividualBattle
