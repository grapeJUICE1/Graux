import { Heading, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  Battle as BattleType,
  useGetUserBattlesLazyQuery,
} from '../../gql/graphql'
import BattleCard from './BattleCard'

function UserBattles({
  battlesCreated,
  battlesWon,
  userId,
}: {
  battlesWon?: boolean
  battlesCreated?: boolean
  battlesPartOf?: boolean
  userId: number
}) {
  const [battles, setBattles] = useState<{ battle: BattleType }[] | null>(null)
  const [getUserBattles] = useGetUserBattlesLazyQuery()

  useEffect(() => {
    getUserBattles({
      variables: {
        userId: userId,
        battlesCreated: battlesCreated ? true : false,
        battlesWon: battlesWon ? true : false,
      },
    }).then(({ data }) => {
      setBattles((data?.getUserBattles as { battle: BattleType }[]) || null)
    })
  }, [])

  return (
    <>
      <Heading textAlign='center' mt='5'>
        {battlesCreated
          ? 'All Battles Created By User'
          : battlesWon
          ? 'All Battles Won By User'
          : 'All Battles User Is Part Of'}
      </Heading>
      {battles ? (
        battles.map(({ battle }: { battle: BattleType }) => {
          return <BattleCard key={battle?.id} battle={battle} />
        })
      ) : (
        <Spinner size='xl' />
      )}
    </>
  )
}
export default UserBattles
