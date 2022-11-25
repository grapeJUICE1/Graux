import { Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Battle as BattleType,
  useMeLazyQuery,
  User,
  useGetUserBattlesLazyQuery,
} from '../../gql/graphql'
import BattleCard from './BattleCard'

function UserBattles() {
  const [battles, setBattles] = useState<{ battle: BattleType }[] | null>(null)
  const [me, setMe] = useState<User | null>(null)

  const [meQuery] = useMeLazyQuery()
  const [getUserBattles] = useGetUserBattlesLazyQuery()
  const router = useRouter()

  useEffect(() => {
    meQuery().then(({ data }) => {
      if (!data?.me) router.replace('/')
      setMe(data?.me || null)
    })
  }, [])

  useEffect(() => {
    if (me) {
      getUserBattles({ variables: { userId: +me.id } }).then(({ data }) => {
        setBattles((data?.getUserBattles as { battle: BattleType }[]) || null)
      })
    }
  }, [me])

  return (
    <>
      <Heading textAlign='center' mt='5'>
        All Battles You Are Part Of
      </Heading>
      {battles
        ? battles.map(({ battle }: { battle: BattleType }) => {
            return <BattleCard battle={battle} />
          })
        : ''}
    </>
  )
}
export default UserBattles
