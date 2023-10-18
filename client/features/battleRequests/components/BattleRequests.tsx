import { Alert, AlertIcon, AlertTitle, Box, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  BattleRequest as BattleRequestType,
  useGetUserBattleRequestsLazyQuery,
  useMeLazyQuery,
  User,
} from "../../../gql/graphql"
import BattleRequest from "./BattleRequest"

function BattleRequests() {
  const [meQuery] = useMeLazyQuery()
  const [getUserBattleRequests] = useGetUserBattleRequestsLazyQuery()

  const [me, setMe] = useState<User | null>(null)
  const [battleRequests, setBattleRequests] = useState<
    BattleRequestType[] | null
  >(null)

  const router = useRouter()

  useEffect(() => {
    meQuery().then(({ data }) => {
      if (!data?.me) router.replace("/")
      setMe(data?.me || null)
    })
  }, [])

  useEffect(() => {
    if (me) {
      getUserBattleRequests({ variables: { userId: +me.id } }).then(
        ({ data }) => {
          setBattleRequests(
            (data?.getUserBattleRequests as BattleRequestType[]) || null
          )
        }
      )
    }
  }, [me])

  return (
    <>
      {me ? (
        <Box>
          {battleRequests?.length ? (
            battleRequests.map((battleRequest: BattleRequestType) => {
              return <BattleRequest battleRequest={battleRequest} />
            })
          ) : (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>You currently have no battle requests</AlertTitle>
            </Alert>
          )}
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BattleRequests
