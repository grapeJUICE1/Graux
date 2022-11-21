import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import SidebarContent from './SidebarContent'

function Sidebar({ sidebarDisclosure }: any) {
  return (
    <>
      <SidebarContent
        display={{
          base: 'none',
          md: 'unset',
        }}
      />
      <Drawer
        isOpen={sidebarDisclosure.isOpen}
        onClose={sidebarDisclosure.onClose}
        placement='left'
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w='full' borderRight='none' />
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default Sidebar
