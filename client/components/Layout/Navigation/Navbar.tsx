import {
  Avatar,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'

function Navbar({ sidebarDisclosure }: any) {
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
        <Icon
          color='gray.500' //as={FaBell}
          cursor='pointer'
        />
        <Avatar
          ml='4'
          size='sm'
          name='anubra266'
          src='https://avatars.githubusercontent.com/u/30869823?v=4'
          cursor='pointer'
        />
      </Flex>
    </Flex>
  )
}

export default Navbar
