import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import SidebarItem from './SidebarItem'

function SidebarContent(props: any) {
  return (
    <Box
      as='nav'
      pos='fixed'
      top='0'
      left='0'
      zIndex='sticky'
      h='full'
      pb='10'
      overflowX='hidden'
      overflowY='auto'
      bg='white'
      _dark={{
        bg: 'gray.800',
      }}
      border
      color='inherit'
      borderRightWidth='1px'
      w='60'
      {...props}
    >
      <Flex px='4' py='5' align='center'>
        <Text
          fontSize='2xl'
          ml='0'
          color='brand.500'
          _dark={{
            color: 'white',
          }}
          fontWeight='semibold'
        >
          Graux
        </Text>
      </Flex>
      <Flex
        direction='column'
        as='nav'
        fontSize='sm'
        color='gray.600'
        aria-label='Main Navigation'
      >
        <SidebarItem as={Link} href='/'>
          Home
        </SidebarItem>
        <SidebarItem as={Link} href='/battles'>
          Battles
        </SidebarItem>
        <SidebarItem as={Link} href='/users'>
          Users
        </SidebarItem>
        <SidebarItem as={Link} href='/auth/login'>
          Log In
        </SidebarItem>

        <SidebarItem as={Link} href='/auth/register'>
          Register
        </SidebarItem>
        <SidebarItem>Logout</SidebarItem>
      </Flex>
    </Box>
  )
}

export default SidebarContent