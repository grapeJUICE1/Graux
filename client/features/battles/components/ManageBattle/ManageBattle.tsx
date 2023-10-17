import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"

import {
  Battle,
  BattleRequest,
  BattleUser,
  useGetBattleLazyQuery,
  useMeLazyQuery,
} from "../../../../gql/graphql"
import BattleCard from "./BattleCard"
import BattleRequestCard from "./BattleRequestCard"
import BattleUserCard from "./BattleUserCard"

function ManageBattle() {
  const router = useRouter()
  const toast = useToast()

  const [battle, setBattle] = useState<Battle | null>(null)

  const [getBattleQuery] = useGetBattleLazyQuery()
  const [meQuery, { data }] = useMeLazyQuery()

  const battleCreator = useMemo(() => {
    if (battle?.battleUsers)
      return battle.battleUsers.find(
        (battleUser) => battleUser?.battleCreator === true
      )
  }, [battle])

  useEffect(() => {
    if (battleCreator?.user?.username) {
      meQuery().then((response) => {
        if (response?.data?.me?.username !== battleCreator?.user?.username) {
          toast({
            description: "You did not create this battle",
            duration: 2000,
            status: "warning",
          })
          router.replace("/")
        }
      })
    }
  }, [battleCreator])

  useEffect(() => {
    if (router?.query?.id) {
      getBattleQuery({
        variables: { battleId: +router.query.id, manage: true },
        fetchPolicy: "network-only",
      }).then((response) => {
        if (response?.data?.getBattle) {
          const battle = response?.data?.getBattle as Battle
          setBattle(battle)
        }
      })
    }
  }, [router.query.id])

  return (
    <>
      {battle &&
      data?.me?.username &&
      battleCreator?.user?.username &&
      data?.me?.username === battleCreator?.user?.username ? (
        <Box pt={0}>
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>
              Refresh the page time to time to see if battle requests were
              approved
            </AlertTitle>
          </Alert>
          <Box width="100%">
            <Text textAlign="center" fontSize="2xl" mt="10">
              Battle
            </Text>
            <BattleCard battle={battle} />
          </Box>
          <Stack direction={{ base: "column", sm: "column", md: "row" }}>
            <Box width={{ base: "100%", sm: "100%", md: "50%" }}>
              <Text fontSize="2xl" mt="10">
                Battle Participants
              </Text>

              {battle?.battleUsers &&
                //@ts-ignore
                battle?.battleUsers?.map((battleUser: BattleUser) => {
                  return (
                    <BattleUserCard
                      battleUser={battleUser}
                      battleCreator={battleCreator}
                      battleStatus={battle?.status}
                    />
                  )
                })}
            </Box>
            {battle?.status === "creation" && (
              <Box width={{ base: "100%", sm: "100%", md: "50%" }}>
                <Text fontSize="2xl" mt="10">
                  Battle Requests
                </Text>
                <Button
                  colorScheme="cyan"
                  onClick={() =>
                    router.push(`/battles/${router?.query?.id}/users`)
                  }
                >
                  Request People To Join the battle
                </Button>
                {battle?.battleRequests &&
                  battle?.battleRequests?.map(
                    //@ts-ignore
                    (battleRequest: BattleRequest) => {
                      return <BattleRequestCard battleRequest={battleRequest} />
                    }
                  )}
              </Box>
            )}
          </Stack>
        </Box>
      ) : (
        <Spinner size="xl" />
      )}
    </>
  )
}
export default ManageBattle
