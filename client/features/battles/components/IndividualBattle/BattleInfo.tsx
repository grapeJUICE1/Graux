import { Box, Center, HStack, Text } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useEffect, useMemo } from "react"
import ChooseSongButton from "../../../../components/Buttons/ChooseSongButton"
import LikeDislike from "../../../../components/Buttons/LikeDislikeButton"
import ManageBattleButton from "../../../../components/Buttons/ManageBattleButton"
import StartBattleButton from "../../../../components/Buttons/StartBattleButton"
import { Battle, useMeLazyQuery } from "../../../../gql/graphql"
import formatDate from "../../../../utils/formatDate"

interface BattleInfoProps {
  battle: Battle
  totalVotes: number | null
  setBattle: Dispatch<SetStateAction<Battle>>
}
function BattleInfo({ battle, totalVotes, setBattle }: BattleInfoProps) {
  const [meQuery, { data }] = useMeLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])

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

  const isBattleStartable = useMemo(() => {
    if (battle?.status !== "creation") return false
    let battleHasEnoughUsers = battle?.battleUsers?.length === 2
    let battleUsersHaveNotChosenSong = battle?.battleUsers?.find(
      (battleUser) => {
        return !battleUser?.songName
      }
    )

    return battleHasEnoughUsers && !battleUsersHaveNotChosenSong
  }, [battle])

  return (
    <Box border="1px" borderColor="cyan.500" width="100%" p="10">
      <Box style={{ wordWrap: "break-word" }} py={2} textAlign="center">
        <Text display="inline" fontSize="xl" fontWeight="medium">
          Title:{" "}
        </Text>
        <Text display="inline" fontSize="xl">
          {battle?.title}
        </Text>
      </Box>
      <Box style={{ wordWrap: "break-word" }} py={2} textAlign="center">
        <Text display="inline" fontSize="xl" fontWeight="medium">
          Battle Status :{" "}
        </Text>
        <Text display="inline" fontSize="xl">
          {battle?.status}
        </Text>
      </Box>
      <Box style={{ wordWrap: "break-word" }} py={2} textAlign="center">
        <Text display="inline" fontSize="xl" fontWeight="medium">
          Total Votes :{" "}
        </Text>
        <Text display="inline" fontSize="xl">
          {totalVotes !== null ? totalVotes : "no votes yet"}
        </Text>
      </Box>
      {battle?.id && (
        <LikeDislike
          entityType="Battle"
          setEntity={setBattle}
          entity={battle}
        />
      )}
      <HStack width="100%" alignItems="center" justifyContent="center" gap="10">
        <Box py="2" fontSize="sm" textAlign="center">
          <Text display="inline" fontWeight="medium">
            created at:{" "}
          </Text>
          {battle?.createdAt ? formatDate(+battle.createdAt) : ""}
        </Box>
        <Box py="2" fontSize="sm" textAlign="center">
          <Text display="inline" fontWeight="medium">
            ends at :{" "}
          </Text>
          {battle?.expires
            ? formatDate(+battle.expires)
            : "No expiry date set yet as battle is not yet active"}
        </Box>
      </HStack>

      <Center>
        <HStack mt={5}>
          {data?.me?.id &&
            battleCreator?.user?.id &&
            data?.me?.id === battleCreator?.user?.id && (
              <ManageBattleButton
                buttonProps={{ colorScheme: "green" }}
                battleId={battle?.id}
              />
            )}
          <Center>
            {userIsInBattle && (
              <ChooseSongButton
                battleId={battle?.id}
                battleStatus={battle?.status}
                buttonProps={{ colorScheme: "teal", size: "md" }}
              />
            )}
          </Center>
          {battle && isBattleStartable && (
            <StartBattleButton battleId={+battle?.id} />
          )}
        </HStack>
      </Center>
    </Box>
  )
}

export default BattleInfo
