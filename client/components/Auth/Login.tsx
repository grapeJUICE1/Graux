import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'

function LoginCard() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Log in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input type='email' />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input type='password' />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                mt={5}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>Don't Have and account?</Text>
              <Link
                //@ts-ignore
                align={'center'}
                as={NextLink}
                href='/auth/register'
                color={'blue.400'}
              >
                Register
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default LoginCard
