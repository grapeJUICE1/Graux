import {
  VStack,
  Heading,
  Flex,
  Center,
  Button,
  Text,
  Box,
} from "@chakra-ui/react"
import Link from "next/link"
import { useEffect } from "react"
import { useMeLazyQuery } from "../../gql/graphql"
import CreateBattleButton from "../Buttons/CreateBattleButton"

function Hero() {
  const [meQuery, { data }] = useMeLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])

  return (
    <Flex h="80vh" alignItems={"center"} justifyContent={"center"}>
      <Center>
        <VStack>
          <Heading fontSize="4rem">Graux</Heading>
          <Text fontSize="2rem">Aux Battles for the Web</Text>
          <Box>
            <Link href="/battles">
              <Button m={2} color="cyan.400" size="lg">
                Browse All Battles
              </Button>
            </Link>
            <CreateBattleButton
              buttonProps={{ m: 2, colorScheme: "green", size: "lg" }}
              userIsAuthenticated={data?.me ? true : false}
            />
          </Box>
        </VStack>
      </Center>
    </Flex>
  )
}

export default Hero
