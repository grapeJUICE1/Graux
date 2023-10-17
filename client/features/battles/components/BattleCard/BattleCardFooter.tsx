import { Box, Center, Flex, HStack, Text } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import ChooseSongButton from "../../../../components/Buttons/ChooseSongButton"
import ManageBattleButton from "../../../../components/Buttons/ManageBattleButton"
import { Battle, useMeLazyQuery } from "../../../../gql/graphql"
import formatDate from "../../../../utils/formatDate"

interface BattleCardFooterProps {
  battle: Battle
}
function BattleCardFooter({ battle }: BattleCardFooterProps) {
  const [meQuery, { data }] = useMeLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])

  const battleWinner = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.isWinner ? true : false
    })
  }, [battle])

  const battleCreator = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator === true ? true : false
    })
  }, [battle])

  const userIsInBattle = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.user?.id === data?.me?.id
    })
  }, [battle, data])

  return (
    <>
      {battle?.status === "over" && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          {battle.status === "over" ? (
            <Box mx="auto">
              <Text mx="auto" display="inline">
                Battle won by :{" "}
              </Text>
              <Text display="inline" fontWeight="bold" fontSize="lg">
                {battleWinner?.user?.username || "None cuz it's a tie"}
              </Text>
            </Box>
          ) : (
            ""
          )}
        </Flex>
      )}

      {battle?.status === "active" && battle?.expires && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Box mx="auto">
            <Text mx="auto" display="inline">
              Ends at :{" "}
            </Text>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{
                color: "gray.400",
              }}
              display="inline"
              fontWeight="medium"
            >
              {formatDate(+battle.expires) || ""}
            </Text>
          </Box>
        </Flex>
      )}
      <Center>
        <HStack>
          {data?.me?.id &&
          battleCreator?.user?.id &&
          data?.me?.id === battleCreator?.user?.id ? (
            <Box>
              <ManageBattleButton
                buttonProps={{ mt: 5, colorScheme: "green" }}
                battleId={battle?.id}
              />
            </Box>
          ) : (
            ""
          )}

          {userIsInBattle && (
            <ChooseSongButton
              battleId={battle?.id}
              battleStatus={battle?.status}
              buttonProps={{ mt: 5, colorScheme: "teal", size: "md" }}
            />
          )}
        </HStack>
      </Center>
    </>
  )
}

export default BattleCardFooter
