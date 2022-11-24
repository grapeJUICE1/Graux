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
  useRemoveBattleUserMutation,
  useRemoveBattleRequestMutation,
} from '../../gql/graphql'
import formatDate from '../../utils/formatDate'

function ManageBattle() {
  const router = useRouter()
  const toast = useToast()

  const [battle, setBattle] = useState<Battle | null>(null)
  const [battleCreator, setBattleCreator] = useState<BattleUser | null>(null)

  const [getBattleQuery] = useGetBattleLazyQuery()
  const [meQuery] = useMeLazyQuery()
  const [removeBattleUser] = useRemoveBattleUserMutation()
  const [removeBattleRequest] = useRemoveBattleRequestMutation()

  function battleQuery(battleId: number) {
    getBattleQuery({
      variables: { battleId: battleId, manage: true },
      fetchPolicy: 'network-only',
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
  async function handleRemoveButtonOnClick(
    type: 'removeBattleUser' | 'removeBattleRequest',
    id: number
  ) {
    try {
      let mutationToUse =
        type === 'removeBattleUser' ? removeBattleUser : removeBattleRequest

      let mutationVariables:
        | { battleUserId: number }
        | { battleRequestId: number } =
        type === 'removeBattleUser'
          ? { battleUserId: id }
          : { battleRequestId: id }

      //@ts-ignore
      await mutationToUse({ variables: mutationVariables })
      if (router?.query?.id) battleQuery(+router?.query?.id)
      toast({
        description: 'Battle user removed successfully',
        status: 'success',
        duration: 2000,
      })
    } catch (err) {
      let description = 'something went wrong'
      //@ts-ignore
      let error = err?.graphQLErrors[0].extensions?.errors[0]
      if (error?.message) description = error?.message
      toast({
        description,
        status: 'error',
        duration: 2000,
      })
    }
  }

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
    <>
      {battleCreator?.user?.username && (
        <Box>
          <Alert status='warning'>
            <AlertIcon />
            <AlertTitle>
              Refresh the page time to time to see if battle requests were
              approved
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
                {battle?.expires
                  ? formatDate(+battle.expires)
                  : 'No expiry date set yet as battle is not yet active'}
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
                      <span style={{ fontSize: '1.2rem' }}>
                        <Text display='inline' fontWeight='medium'>
                          Username:{' '}
                        </Text>
                        {battleUser?.user?.username}
                      </span>
                      <br />
                      <span style={{ fontSize: '1.2rem' }}>
                        <Text display='inline' fontWeight='medium'>
                          Email:{' '}
                        </Text>
                        {battleUser?.user?.email}
                      </span>
                      {battleUser?.songName && (
                        <Box
                          border='1px'
                          borderColor='cyan.500'
                          width='90%'
                          mt='5'
                          p='5'
                        >
                          <span style={{ fontSize: '1rem' }}>
                            <Text display='inline' fontWeight='medium'>
                              Song Name:{' '}
                            </Text>
                            {battleUser?.songName}
                          </span>
                          <br />
                          <span style={{ fontSize: '1rem' }}>
                            <Text display='inline' fontWeight='medium'>
                              Song Artist:{' '}
                            </Text>
                            {battleUser?.songArtist}
                          </span>
                          <br />
                          <span style={{ fontSize: '1rem' }}>
                            <Text display='inline' fontWeight='medium'>
                              Song Album:{' '}
                            </Text>
                            {battleUser?.songAlbum}
                          </span>
                          <br />
                          <span style={{ fontSize: '1rem' }}>
                            <Text display='inline' fontWeight='medium'>
                              Song Link:{' '}
                            </Text>
                            {battleUser?.songLink}
                          </span>
                          <br />
                          <span style={{ fontSize: '1rem' }}>
                            <Text display='inline' fontWeight='medium'>
                              Song Image:{' '}
                            </Text>
                            <img
                              style={{ width: '8rem' }}
                              alt='song image'
                              src={`${battleUser?.songImage}`}
                            />
                          </span>
                          <br />
                        </Box>
                      )}
                      {battleCreator?.user?.username !==
                        battleUser?.user?.username && (
                        <Button
                          onClick={async () =>
                            handleRemoveButtonOnClick(
                              'removeBattleUser',
                              +battleUser?.id
                            )
                          }
                          colorScheme='red'
                          mt='5'
                        >
                          Remove Battle User
                        </Button>
                      )}
                    </Box>
                  )
                })}
            </Box>
            <Box width={{ base: '100%', sm: '100%', md: '50%' }}>
              <Text fontSize='2xl' mt='10'>
                Battle Requests
              </Text>
              <Button
                colorScheme='cyan'
                onClick={() =>
                  router.push(`/battles/${router?.query?.id}/users`)
                }
              >
                Request People To Join the battle
              </Button>
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
                        {battleRequest?.validated?.toString() || ''}
                      </Text>
                      <Button
                        onClick={async () =>
                          handleRemoveButtonOnClick(
                            'removeBattleRequest',
                            +battleRequest?.id
                          )
                        }
                        colorScheme='red'
                        mt='5'
                      >
                        Remove Battle Request
                      </Button>
                    </Box>
                  )
                })}
            </Box>
          </Stack>
        </Box>
      )}
    </>
  )
}
export default ManageBattle
