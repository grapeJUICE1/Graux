import { Box, Center, Flex, HStack, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { useMemo } from "react"
import LikeDislike from "../../../../components/Buttons/LikeDislikeButton"
import { Battle } from "../../../../gql/graphql"

interface BattleCardBody {
  battle: Battle
}
function BattleCardBody({ battle }: BattleCardBody) {
  const battleCreator = useMemo(() => {
    return battle?.battleUsers?.find((battleUser) => {
      return battleUser?.battleCreator ? true : false
    })
  }, [battle])

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        {battle?.battleUsers &&
          battle.battleUsers?.map((battleUser) => {
            return (
              <Box
                key={battleUser?.user?.id}
                bgColor={battleUser?.isWinner ? "green.700" : ""}
              >
                <Box>
                  <Link
                    as={NextLink}
                    color="brand.600"
                    _dark={{
                      color: "brand.400",
                    }}
                    href={`/users/${battleUser?.user?.id}`}
                  >
                    {battleCreator?.user?.id === battleUser?.user?.id && (
                      <Text display="inline">battle created by : </Text>
                    )}
                    <Text
                      _hover={{
                        textDecor: "underline",
                      }}
                      fontWeight="700"
                      display="inline"
                    >
                      {battleUser?.user?.username || ""}
                    </Text>
                  </Link>
                </Box>
                <HStack>
                  {battleUser?.songImage && (
                    <img
                      style={{ width: "5rem" }}
                      onError={({ currentTarget }) => {
                        if (currentTarget.src != "/images/404.png")
                          currentTarget.src = "/images/404.png"
                      }}
                      src={battleUser?.songImage}
                    />
                  )}
                  <Box>
                    {battleUser?.songName && (
                      <Box>
                        <Text display="inline">Name: </Text>
                        <Text
                          style={{ wordWrap: "break-word" }}
                          fontWeight="medium"
                          display="inline"
                        >
                          {battleUser?.songName}
                        </Text>
                      </Box>
                    )}
                    {battleUser?.songAlbum && (
                      <Box>
                        <Text display="inline">Album: </Text>
                        <Text
                          style={{ wordWrap: "break-word" }}
                          fontWeight="medium"
                          display="inline"
                        >
                          {battleUser?.songAlbum}
                        </Text>
                      </Box>
                    )}
                    {battleUser?.songArtist && (
                      <Box>
                        <Text display="inline">Artist: </Text>
                        <Text
                          style={{ wordWrap: "break-word" }}
                          display="inline"
                          fontWeight="medium"
                        >
                          {battleUser?.songArtist}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </HStack>
              </Box>
            )
          })}
      </Flex>
      <Center>
        <Text fontSize="medium" fontWeight="bold">
          {battle.likeDislikeCount} likes
        </Text>
      </Center>
    </Box>
  )
}

export default BattleCardBody
