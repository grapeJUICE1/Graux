import {
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import React, { useEffect } from "react"
import { useMeLazyQuery } from "../../../gql/graphql"
import CreateBattleButton from "../../Buttons/CreateBattleButton"

function Navbar({ sidebarDisclosure }: any) {
  const [meQuery, { data, error, loading }] = useMeLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])

  let userNavItem
  if (loading) {
    userNavItem = <Text> Loading </Text>
  } else if (error || !data) {
    userNavItem = <Text> login/signup </Text>
  } else {
    userNavItem = <Text> {data?.me?.username}</Text>
  }
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg="white"
      _dark={{
        bg: "gray.900",
      }}
      borderBottomWidth="1px"
      color="inherit"
      h="14"
    >
      <IconButton
        aria-label="Menu"
        display={{
          base: "inline-flex",
          md: "none",
        }}
        onClick={sidebarDisclosure.onOpen}
        //icon={<FiMenu />}
        size="sm"
      />
      <InputGroup
        w="96"
        display={{
          base: "none",
          md: "flex",
        }}
      >
        <InputLeftElement color="gray.500">
          {/* <FiSearch /> */}
        </InputLeftElement>
        <Input placeholder="Search for articles..." />
      </InputGroup>
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <CreateBattleButton
          buttonProps={{ m: 2, colorScheme: "green", size: "sm" }}
          userIsAuthenticated={data?.me ? true : false}
        />
        <Center>
          {" "}
          <Flex>{userNavItem}</Flex>
        </Center>
      </Stack>
    </Flex>
  )
}

export default Navbar
