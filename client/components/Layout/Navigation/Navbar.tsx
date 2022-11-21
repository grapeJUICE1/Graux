import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useMeQuery } from '../../../gql/graphql'

function Navbar({ sidebarDisclosure }: any) {
  const { data, error, loading } = useMeQuery()
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
      as='header'
      align='center'
      justify='space-between'
      w='full'
      px='4'
      bg='white'
      _dark={{
        bg: 'gray.900',
      }}
      borderBottomWidth='1px'
      color='inherit'
      h='14'
      position='fixed'
    >
      <IconButton
        aria-label='Menu'
        display={{
          base: 'inline-flex',
          md: 'none',
        }}
        onClick={sidebarDisclosure.onOpen}
        //icon={<FiMenu />}
        size='sm'
      />
      <InputGroup
        w='96'
        display={{
          base: 'none',
          md: 'flex',
        }}
      >
        <InputLeftElement color='gray.500'>
          {/* <FiSearch /> */}
        </InputLeftElement>
        <Input placeholder='Search for articles...' />
      </InputGroup>

      <Flex align='center' position='fixed' right='1rem'>
        {/*<Icon
          color='gray.500' //as={FaBell}
          cursor='pointer'
        />*/}
        {/*<Avatar
          ml='4'
          size='sm'
          name='anubra266'
          src='https://avatars.githubusercontent.com/u/30869823?v=4'
          cursor='pointer'
        />*/}

        {userNavItem}
      </Flex>
    </Flex>
  )
}

export default Navbar
