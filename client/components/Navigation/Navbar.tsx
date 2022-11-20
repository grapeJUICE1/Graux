import {
  useColorMode,
  useColorModeValue,
  Box,
  Flex,
  Button,
  Text,
  Stack,
  IconButton,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useMeQuery } from '../../gql/graphql'

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data, loading } = useMeQuery()
  let userProfileNavLink = (
    <Button rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
      <Link href='/auth/login'>Login/Signup</Link>
    </Button>
  )
  if (loading) {
    userProfileNavLink = (
      <Box>
        <Text m='auto'> Loading </Text>
      </Box>
    )
  } else if (data?.me) {
    userProfileNavLink = (
      <Text m='auto' fontWeight='bold'>
        <Link href={`/users/${data.me.id}`}>{data.me.username}</Link>
      </Text>
    )
  }
  return (
    <div style={{ position: 'sticky', top: 0 }}>
      <Box pos='relative' bg={useColorModeValue('gray.300', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Text fontWeight='bold' pl={3}>
              <Link href='/'>Graux </Link>
            </Text>
          </Box>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7} pr={5}>
              {userProfileNavLink}
              <IconButton
                aria-label='darkModeToggle'
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                isRound={true}
                onClick={toggleColorMode}
              ></IconButton>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </div>
  )
}

export default Navbar
