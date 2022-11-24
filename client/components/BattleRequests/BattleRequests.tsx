import { Box, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMeLazyQuery, User } from '../../gql/graphql'

function BattleRequests() {
  const [meQuery] = useMeLazyQuery()
  const [me, setMe] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    meQuery().then(({ data }) => {
      if (!data?.me) router.replace('/')
      setMe(data?.me || null)
    })
  }, [])

  useEffect(() => {
    if (me) {
    }
  }, [me])

  return <>{me ? <Box></Box> : <Spinner />}</>
}

export default BattleRequests
