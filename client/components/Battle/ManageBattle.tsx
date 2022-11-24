import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Divider,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  Battle,
  BattleRequest,
  BattleUser,
  useGetBattleLazyQuery,
  useMeLazyQuery,
} from '../../gql/graphql'
import formatDate from '../../utils/formatDate'

function ManageBattle() {
  const router = useRouter()
  const toast = useToast()
  const [getBattleQuery] = useGetBattleLazyQuery()
  const [battle, setBattle] = useState<Battle | null>(null)
  const [battleCreator, setBattleCreator] = useState<BattleUser | null>(null)
  const [meQuery] = useMeLazyQuery()

  useEffect(() => {
    if (battleCreator?.user?.username) {
      meQuery().then((response) => {
        if (response?.data?.me?.username !== battleCreator?.user?.username) {
          toast({
            description: 'You did not create this battle',
            duration: 2000,
            status: 'warning',
          })
          router.replace('/')
        }
      })
    }
  }, [battleCreator])

  useEffect(() => {
    if (router?.query?.id) {
      getBattleQuery({
        variables: { battleId: +router.query.id, manage: true },
      }).then((response) => {
        if (response?.data?.getBattle) {
          const battle = response?.data?.getBattle as Battle
          setBattle(battle)
          const battleCreator = battle?.battleUsers?.find(
            (battleUser) => battleUser?.battleCreator === true
          )
          if (battleCreator) {
            setBattleCreator(battleCreator)
          }
        }
      })
    }
  }, [router.query.id])

  return (
    <Box>
      <Alert status='warning'>
        <AlertIcon />
        <AlertTitle>
          Refresh the page time to time to see if battle requests were approved
        </AlertTitle>
      </Alert>
      <Box width='100%'>
        <Text textAlign='center' fontSize='2xl' mt='10'>
          Battle
        </Text>

        <Box width='70%' mx='auto' bgColor='gray.700' py='10'>
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
          <Divider />
          <Text py='2' fontSize='xl' textAlign='center'>
            <Text display='inline' fontWeight='medium'>
              Battle Created At:{' '}
            </Text>
            {battle?.createdAt ? formatDate(+battle.createdAt) : ''}
          </Text>
          <Divider />
          <Text py='2' fontSize='xl' textAlign='center'>
            <Text display='inline' fontWeight='medium'>
              Battle Expires At :{' '}
            </Text>
            {battle?.expires ? formatDate(+battle.expires) : ''}
          </Text>
          <Divider />
          <Text py='2' fontSize='xl' textAlign='center'>
            <Text display='inline' fontWeight='medium'>
              Battle Status :{' '}
            </Text>
            {battle?.status}
          </Text>
          <Divider />
          <Center>
            <Button colorScheme='cyan' mt='5' mx='auto' textAlign='center'>
              {' '}
              Edit Title
            </Button>
          </Center>
        </Box>
      </Box>
      <Stack direction={{ base: 'column', sm: 'column', md: 'row' }}>
        <Box width={{ base: '100%', sm: '100%', md: '50%' }}>
          <Text fontSize='2xl' mt='10'>
            Battle Users
          </Text>
          {battle?.battleUsers &&
            //@ts-ignore
            battle?.battleUsers?.map((battleUser: BattleUser) => {
              return (
                <Box
                  key={battleUser.id}
                  bgColor='gray.700'
                  py='10'
                  pl='10'
                  width='100%'
                  my='5'
                >
                  <Text fontSize='xl'>
                    <Text display='inline' fontWeight='medium'>
                      Username:{' '}
                    </Text>
                    {battleUser?.user?.username}
                  </Text>

                  <Text fontSize='xl'>
                    <Text display='inline' fontWeight='medium'>
                      Email:{' '}
                    </Text>
                    {battleUser?.user?.email}
                  </Text>
                  <Button colorScheme='red' mt='5'>
                    Remove Battle User
                  </Button>
                </Box>
              )
            })}
        </Box>
        <Box width={{ base: '100%', sm: '100%', md: '50%' }}>
          <Text fontSize='2xl' mt='10'>
            Battle Requests
          </Text>
          {battle?.battleRequests &&
            //@ts-ignore
            battle?.battleRequests?.map((battleRequest: BattleRequest) => {
              return (
                <Box
                  key={battleRequest.id}
                  bgColor='gray.700'
                  py='10'
                  pl='10'
                  width='100%'
                  my='5'
                >
                  <Text fontSize='xl'>
                    <Text display='inline' fontWeight='medium'>
                      username:{' '}
                    </Text>
                    {battleRequest?.user?.username}
                  </Text>

                  <Text fontSize='xl'>
                    <Text display='inline' fontWeight='medium'>
                      request validated:{' '}
                    </Text>
                    {battleRequest?.validated
                      ? battleRequest.validated.toString()
                      : ''}
                  </Text>
                  <Button colorScheme='red' mt='5'>
                    Delete Battle Request
                  </Button>
                </Box>
              )
            })}
        </Box>
      </Stack>
    </Box>
  )
}

export default ManageBattle
