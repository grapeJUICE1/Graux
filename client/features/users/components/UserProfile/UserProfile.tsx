import { Box, Center, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  useGetUserLazyQuery,
  useMeLazyQuery,
  User,
} from '../../../../gql/graphql'
import ProfileTabs from './ProfileTabs'
import UserCard from './UserCard'

function UserProfile() {
  const [getUser] = useGetUserLazyQuery()
  const [meQuery, { data }] = useMeLazyQuery()
  const [user, setUser] = useState<User | null>()
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.id) {
      meQuery()
        .then(({ data }) => {
          if (data?.me?.id === router?.query?.id) {
            setUser(data?.me!)
          } else {
            getUser({ variables: { userId: +router?.query?.id! } }).then(
              (response) => {
                if (response?.data?.getUser) setUser(response?.data?.getUser)
              }
            )
          }
        })
        .catch((_) => {
          getUser({ variables: { userId: +router?.query?.id! } })
            .then((response) => {
              if (response?.data?.getUser) setUser(response?.data?.getUser)
            })
            .catch((err) => {
              console.log(err)
            })
        })
    }
  }, [router?.query?.id])

  return (
    <>
      {user?.id ? (
        <Box>
          <Center py={6}>
            <UserCard user={user} me={data?.me} />
          </Center>
          <ProfileTabs user={user} me={data?.me} />
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  )
}
export default UserProfile
