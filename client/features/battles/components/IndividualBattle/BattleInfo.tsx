import { Box, Center, HStack, Text } from "@chakra-ui/react"
import { Dispatch, SetStateAction } from "react"
import ChooseSongButton from "../../../../components/Buttons/ChooseSongButton"
import LikeDislike from "../../../../components/Buttons/LikeDislikeButton"
import ManageBattleButton from "../../../../components/Buttons/ManageBattleButton"
import { Battle } from "../../../../gql/graphql"
import formatDate from "../../../../utils/formatDate"

interface BattleInfoProps {
  battle: Battle
  totalVotes: number | null
  setBattle: Dispatch<SetStateAction<Battle>>
}
function BattleInfo({ battle, totalVotes, setBattle }: BattleInfoProps) {
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
          <ManageBattleButton
            buttonProps={{ colorScheme: "green" }}
            battleId={battle?.id}
          />
          <Center>
            <ChooseSongButton
              battleId={battle?.id}
              battleStatus={battle?.status}
              buttonProps={{ colorScheme: "teal", size: "md" }}
            />
          </Center>
        </HStack>
      </Center>
    </Box>
  )
}

export default BattleInfo
