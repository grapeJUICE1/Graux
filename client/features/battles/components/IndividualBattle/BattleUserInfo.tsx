import { Box, Button, Text } from "@chakra-ui/react"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useMemo } from "react"
import ChooseSongButton from "../../../../components/Buttons/ChooseSongButton"
import {
  Battle,
  BattleUser,
  useMeLazyQuery,
  useVoteMutation,
} from "../../../../gql/graphql"
import useMutation from "../../../../hooks/useMutation"

interface BattleUserInfo {
  battleUser: BattleUser
  totalVotes: number
  battle: Battle
  setBattle: Dispatch<SetStateAction<Battle>>
}

function BattleUserInfo({
  battleUser,
  totalVotes,
  battle,
  setBattle,
}: BattleUserInfo) {
  const [vote] = useVoteMutation()
  const voteMutation = useMutation(vote)

  const [meQuery, { data }] = useMeLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])
  const userIsInBattle = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.user?.id === data?.me?.id
    })
  }, [battle, data])
  async function voteButtonOnClick(battleUserId: number) {
    if (battle?.battleUsers?.length === 2 && battle.status === "active") {
      await voteMutation({ variables: { battleUserId } }, (data) => {
        let battleUser1 = battle?.battleUsers?.at(0)!
        let battleUser2 = battle?.battleUsers?.at(1)!

        if (battleUser1?.id && battleUser2?.id) {
          if (+battleUser1?.id === battleUserId) {
            battleUser2.userVote = 0
            if (
              typeof battleUser1?.voteCount === "number" &&
              typeof battleUser1?.userVote === "number"
            ) {
              if (battleUser1?.voteCount! > data?.vote!) {
                battleUser1.userVote = 0
              }
              if (battleUser1?.voteCount! < data?.vote!) {
                battleUser1.userVote = 1
              }
              battleUser1.voteCount = data?.vote!
              if (typeof battleUser2?.voteCount === "number")
                battleUser2.voteCount =
                  data?.vote! + battleUser2.voteCount - data?.vote!
            }
          }
          if (+battleUser2?.id === battleUserId) {
            battleUser1.userVote = 0
            if (
              typeof battleUser2?.voteCount === "number" &&
              typeof battleUser2?.userVote === "number"
            ) {
              if (battleUser2?.voteCount! > data?.vote!) {
                battleUser2.userVote = 0
              }
              if (battleUser2?.voteCount! < data?.vote!) {
                battleUser2.userVote = 1
              }
              battleUser2.voteCount = data?.vote!
            }
          }
        }

        setBattle((oldBattle) => {
          return { ...oldBattle, battleUsers: [battleUser1, battleUser2] }
        })
      })
    }
  }

  return (
    <Box
      key={battleUser?.id}
      border="1px"
      borderColor="cyan.500"
      width={{ base: "100%", sm: "100%", md: "100%", lg: "50%" }}
      p="10"
      mx="0 !important"
      bgColor={battleUser?.isWinner ? "green.700" : ""}
    >
      <Box h="90%">
        {battle?.status === "creation" && userIsInBattle && (
          <ChooseSongButton
            battleId={battle?.id}
            battleStatus={battle?.status}
            buttonProps={{ size: "lg", colorScheme: "teal" }}
          />
        )}
        <Text fontSize="2rem">{battleUser?.isWinner ? "Winner" : ""}</Text>
        <Link href={`/users/${battleUser?.user?.id}`}>
          <Text as="u" fontSize="1.5rem" color="green.400">
            Song choice of {battleUser?.user?.username}
          </Text>
        </Link>
        <Text>song name : {battleUser?.songName}</Text>
        <Text>song artist : {battleUser?.songArtist}</Text>
        <Text>song album : {battleUser?.songAlbum}</Text>
        <Text mb={5}>song link : {battleUser?.songLink}</Text>
        {battleUser?.songImage && (
          <img src={battleUser.songImage} style={{ width: "8rem" }} />
        )}

        {battleUser?.id && (
          <Button
            onClick={() => voteButtonOnClick(+battleUser?.id)}
            mt="10"
            colorScheme={battleUser?.userVote === 1 ? "orange" : "blue"}
            isDisabled={battle?.status !== "active"}
          >
            Vote For {battleUser?.user?.username} ({battleUser?.voteCount}{" "}
            votes)
          </Button>
        )}
      </Box>
      {typeof battleUser?.voteCount === "number" && totalVotes !== null && (
        <Box
          mt="5"
          width="100%"
          p="1"
          bgGradient={`linear(to-r, cyan.500 ${
            totalVotes !== 0
              ? `${(battleUser?.voteCount / totalVotes) * 100}`
              : "100"
          }%, gray.800 0%)`}
        >
          {(battleUser?.voteCount / totalVotes) * 100 || "0"}% votes
        </Box>
      )}
    </Box>
  )
}

export default BattleUserInfo
