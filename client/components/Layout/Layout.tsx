import { Box, useDisclosure } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useMeQuery } from '../../gql/graphql'
import Navbar from './Navigation/Navbar'
import Sidebar from './Navigation/Sidebar'

function Layout({ children }: { children: ReactNode }) {
  const sidebar = useDisclosure()
  const { data, error, loading } = useMeQuery()
  return (
    <Box
      as='section'
      bg='gray.50'
      _dark={{
        bg: 'gray.800',
      }}
      minH='100vh'
    >
      <Sidebar sidebarDisclosure={sidebar} />
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition='.3s ease'
      >
        <Navbar
          sidebarDisclosure={sidebar}
          meQuery={{ data, error, loading }}
        />
        <Box as='main' p='4' pt='20'>
          {(data || error) && children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
