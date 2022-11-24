import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import {
  BattleRequest,
  useApproveBattleRequestMutation,
  useGetBattleRequestLazyQuery,
} from '../../gql/graphql'
import formatDate from '../../utils/formatDate'

function ApproveBattleRequest() {
  const [getBattleRequest] = useGetBattleRequestLazyQuery()
  const [approveBattleRequest] = useApproveBattleRequestMutation()

  const [battleRequest, setBattleRequest] = useState<BattleRequest | null>(null)

  const battleCreator = useMemo(() => {
    return battleRequest?.battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator ? true : false
    })
  }, [battleRequest])

  const router = useRouter()
  const toast = useToast()

  async function handleApproveBattleRequestOnClick() {
    if (battleRequest?.id) {
      try {
        toast({ description: 'Please wait for a few seconds', duration: null })
        await approveBattleRequest({
          variables: { battleRequestId: +battleRequest?.id },
        })
        toast.closeAll()
        toast({
          description: 'Battle Request Approved',
          status: 'success',
          duration: 2000,
        })
        router.replace('/users/battleRequests')
      } catch (err) {
        toast.closeAll()
        //@ts-ignore
        let error = err?.graphQLErrors[0].extensions.errors[0] as {
          path: string
          message: string
        }
        if (error) {
          toast({ description: error.message, status: 'error', duration: 3000 })
        }
      }
    }
  }

  useEffect(() => {
    console.log(router?.query)
    if (router?.query?.battleRequestId) {
      getBattleRequest({
        variables: { battleRequestId: +router?.query?.battleRequestId },
      }).then(({ data }) => {
        if (data?.getBattleRequest)
          setBattleRequest((data?.getBattleRequest as BattleRequest) || null)
      })
    }
  }, [router.query.battleRequestId])
  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box border='1px' p='5' width='40rem' borderColor='cyan.500'>
        <span style={{ fontSize: '1.2rem' }}>
          <Text fontWeight='medium' display='inline'>
            Battle Title :{' '}
          </Text>
          <Text display='inline'>{battleRequest?.battle?.title}</Text>
        </span>
        <br />
        <span style={{ fontSize: '1.2rem' }}>
          <Text fontWeight='medium' display='inline'>
            Battle Status :{' '}
          </Text>
          <Text display='inline'>{battleRequest?.battle?.status}</Text>
        </span>
        <br />
        <span style={{ fontSize: '1.2rem' }}>
          <Text fontWeight='medium' display='inline'>
            Battle Creator :{' '}
          </Text>
          <Text display='inline'>{battleCreator?.user?.username}</Text>
        </span>
        <br />
        <span style={{ fontSize: '1.2rem' }}>
          <Text fontWeight='medium' display='inline'>
            Battle Created at :{' '}
          </Text>
          <Text display='inline'>
            {battleRequest?.battle?.createdAt &&
              formatDate(+battleRequest?.battle?.createdAt)}
          </Text>
        </span>
        <br />
        <span style={{ fontSize: '1.2rem' }}>
          <Text fontWeight='medium' display='inline'>
            Battle Request Sent at :{' '}
          </Text>
          <Text display='inline'>
            {battleRequest?.createdAt && formatDate(+battleRequest?.createdAt)}
          </Text>
        </span>
        <br />
        <Box width='100%'>
          <Box mx='auto' width='13rem'>
            <Button
              colorScheme='cyan'
              mx='auto !important'
              textAlign='center'
              my='5'
              width='13rem'
              onClick={handleApproveBattleRequestOnClick}
            >
              Approve Battle Request
            </Button>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
export default ApproveBattleRequest
