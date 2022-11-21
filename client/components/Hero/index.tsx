import { VStack, Heading, Flex, Center, Button, Text } from '@chakra-ui/react'
import Link from 'next/link'

function Hero() {
  return (
    <Flex h='80vh' alignItems={'center'} justifyContent={'center'}>
      <Center>
        <VStack>
          <Heading fontSize='4rem'>Graux</Heading>
          <Text fontSize='2rem'>Aux Battles for the Web</Text>
          <Link href='/battles'>
            <Button color='cyan.400' size='lg'>
              Browse All Battles
            </Button>
          </Link>
        </VStack>
      </Center>
    </Flex>
  )
}

export default Hero
