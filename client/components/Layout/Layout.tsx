import { Box, useDisclosure } from "@chakra-ui/react"
import { ReactNode } from "react"
import Navbar from "./Navigation/Navbar"
import Sidebar from "./Navigation/Sidebar"

function Layout({ children }: { children: ReactNode }) {
  const sidebar = useDisclosure()
  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.800",
      }}
      minH="100vh"
    >
      <Sidebar sidebarDisclosure={sidebar} />
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Navbar sidebarDisclosure={sidebar} />
        <Box as="main" p="4">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
