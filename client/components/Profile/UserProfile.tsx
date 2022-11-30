import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  useDeleteUserMutation,
  useGetUserLazyQuery,
  useMeLazyQuery,
  User,
} from '../../gql/graphql'
import UserBattles from '../Battle/UserBattles'
import BattleRequests from '../BattleRequests/BattleRequests'
import Comments from '../Comments/Comments'
import DeleteButton from '../DeleteButton/DeleteButton'

function UserProfile() {
  const [getUser] = useGetUserLazyQuery()
  const [meQuery, { data }] = useMeLazyQuery()
  const [user, setUser] = useState<User | null>()
  const [deleteUser] = useDeleteUserMutation()
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.id) {
      meQuery().then(({ data }) => {
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
    }
  }, [router?.query?.id])

  return (
    <>
      {user?.id ? (
        <Box>
          <Center py={6}>
            <Box
              maxW={'320px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Avatar
                size={'xl'}
                src={'/images/defaultProfile.png'}
                mb={4}
                pos={'relative'}
              />
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                {user?.username}
              </Heading>
              <Text fontWeight={600} color={'gray.500'} mb={4}>
                {user?.email}
              </Text>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                px={3}
              >
                TODO
              </Text>
              {user?.id && data?.me?.id && user?.id === data?.me?.id && (
                <DeleteButton
                  modalHeader='Delete Account'
                  buttonProps={{ mt: '5' }}
                  modalBody='Are you sure you want to delete your account? All your battles , comments , votes etc will be deleted as well.'
                  mutationFunc={() => deleteUser()}
                />
              )}
            </Box>
          </Center>
          <Tabs
            defaultIndex={
              router?.query?.tab
                ? router?.query?.tab === 'battlesPartOf'
                  ? 1
                  : router?.query?.tab === 'battlesWon'
                  ? 2
                  : router?.query?.tab === 'comments'
                  ? 3
                  : router?.query?.tab === 'battleRequests'
                  ? 4
                  : 0
                : 0
            }
            isFitted
            isLazy
            mt='10'
          >
            <TabList>
              <Tab>Battles Created</Tab>
              <Tab>Battles Part of</Tab>
              <Tab>Battles Won</Tab>
              <Tab>Comments</Tab>
              {data?.me?.id ? <Tab>Battle Requests</Tab> : ''}
            </TabList>

            <TabPanels>
              <TabPanel>
                <UserBattles userId={+user?.id} battlesCreated />
              </TabPanel>
              <TabPanel>
                <p>
                  <UserBattles userId={+user?.id} battlesPartOf />
                </p>
              </TabPanel>
              <TabPanel>
                <UserBattles userId={+user?.id} battlesWon />
              </TabPanel>
              <TabPanel>
                <Comments userId={+user?.id} />
              </TabPanel>

              {data?.me?.id ? (
                <TabPanel>
                  <BattleRequests />
                </TabPanel>
              ) : (
                ''
              )}
            </TabPanels>
          </Tabs>
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  )
}
export default UserProfile
