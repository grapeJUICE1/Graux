import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import {
  Battle,
  BattleRequest,
  BattleUser,
  useGetBattleLazyQuery,
  useMeLazyQuery,
  useRemoveBattleUserMutation,
  useRemoveBattleRequestMutation,
  useStartBattleMutation,
  useDeleteBattleMutation,
} from '../../gql/graphql'
import formatDate from '../../utils/formatDate'
import DeleteButton from '../DeleteButton/DeleteButton'
import EditTitleButton from './EditTitleButton'

function StartBattleButton({ battleId }: { battleId: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startBattle] = useStartBattleMutation()
  const toast = useToast()
  const router = useRouter()

  const formik = useFormik({
    initialValues: { hours: 10 },
    validationSchema: Yup.object({
      hours: Yup.number()
        .min(1, 'battle has to be active for atleast 1 hour')
        .max(168, 'battle cannot be active for more than 7 days or 168 hours')
        .required()
        .positive()
        .integer(),
    }),
    onSubmit: async (values, { setFieldError }) => {
      if (true) {
        try {
          toast.closeAll()
          toast({
            description: 'Please wait for a few seconds',
            duration: null,
            isClosable: true,
          })
          await startBattle({
            variables: { battleId, hoursTillActive: values.hours },
          })
          toast.closeAll()
          toast({
            description: 'Battle started successfully',
            duration: 3000,
            status: 'success',
          })
          router.push(`/battles/${router.query.id}`)
        } catch (err) {
          toast.closeAll()
          //@ts-ignore
          let error = err?.graphQLErrors[0].extensions?.errors[0] as {
            path: string
            message: string
          }
          if (error) {
            setFieldError('hours', error.message)
          } else {
            toast({
              description: 'Something went wrong',
              duration: 3000,
              status: 'error',
            })
          }
        }
      }
    },
  })
  return (
    <>
      <Button
        colorScheme='green'
        mt='5'
        textAlign='center'
        mx='3'
        onClick={onOpen}
      >
        Start Battle
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader mt='5'>
              How many hours do you want the battle to be active
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box p={8}>
                <Stack spacing={4}>
                  <FormControl id='songLink'>
                    <FormLabel>Hours</FormLabel>
                    <NumberInput
                      id='hours'
                      name='hours'
                      onChange={(val) => {
                        formik.setFieldValue('hours', +val)
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.hours}
                      defaultValue={1}
                      min={1}
                      max={168}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {formik.touched.hours && formik.errors.hours ? (
                      <Text color='red.500'>{formik.errors.hours}</Text>
                    ) : null}
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='green' mr={3} type='submit'>
                Start Battle
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
function ManageBattle() {
  const router = useRouter()
  const toast = useToast()

  const [battle, setBattle] = useState<Battle | null>(null)
  const [battleCreator, setBattleCreator] = useState<BattleUser | null>(null)

  const [getBattleQuery] = useGetBattleLazyQuery()
  const [meQuery, { data }] = useMeLazyQuery()
  const [removeBattleUser] = useRemoveBattleUserMutation()
  const [removeBattleRequest] = useRemoveBattleRequestMutation()
  const [deleteBattle] = useDeleteBattleMutation()

  const isBattleStartable = useMemo(() => {
    if (battle?.status !== 'creation') return false
    let battleHasEnoughUsers = battle?.battleUsers?.length === 2
    let battleUsersHaveNotChosenSong = battle?.battleUsers?.find(
      (battleUser) => {
        return !battleUser?.songName
      }
    )

    return battleHasEnoughUsers && !battleUsersHaveNotChosenSong
  }, [battle])

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
      {data?.me?.username &&
      battleCreator?.user?.username &&
      data?.me?.username === battleCreator?.user?.username ? (
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
                <Box>
                  {battle?.id && (
                    <EditTitleButton
                      buttonProps={{ colorScheme: 'cyan', mt: '5', mx: '3' }}
                      battleId={+battle?.id}
                    />
                  )}
                  {battle && isBattleStartable && (
                    <StartBattleButton battleId={+battle?.id} />
                  )}
                  {battle && (
                    <DeleteButton
                      modalHeader='Delete Battle'
                      modalBody='Are you sure you want to remove this battle??'
                      mutationFunc={() =>
                        deleteBattle({
                          variables: { battleId: +battle?.id },
                        })
                      }
                      buttonProps={{ mt: '5', mx: '3' }}
                    />
                  )}
                </Box>
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
                      {battleUser?.songName ? (
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
                      ) : (
                        <Text>Song not chosen yet</Text>
                      )}
                      <br />
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
      ) : (
        <Spinner size='xl' />
      )}
    </>
  )
}
export default ManageBattle
