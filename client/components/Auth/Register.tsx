import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRegisterMutation } from '../../gql/graphql'
import { useRouter } from 'next/router'

function RegisterCard() {
  const [showPassword, setShowPassword] = useState(false)
  let [register, { data, loading }] = useRegisterMutation()
  const toast = useToast()
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Required'),
      username: Yup.string()
        .min(3, 'Must be atleaast 3 characters long')
        .max(30, "Can't exceed 30 characters")
        .required('Required'),
      password: Yup.string()
        .min(8, 'Must be atleaast 8 characters long')
        .max(255, "Can't exceed 255 characters")
        .required('Required'),
    }),
    onSubmit: async (values, { setFieldError }) => {
      toast.closeAll()
      try {
        const response = await register({
          variables: {
            ...values,
          },
        })
        toast.closeAll()
        toast({
          id: 'successToast',
          description: 'Registered Successfully',
          status: 'success',
          duration: 1000,
        })

        router.replace('/')
      } catch (err) {
        toast.closeAll()
        //@ts-ignore
        if (err?.graphQLErrors[0]?.extensions?.errors) {
          //@ts-ignore
          let errors = err?.graphQLErrors[0].extensions.errors as {
            path: string
            message: string
          }[]
          if (errors) {
            if (errors[0]?.path) {
              errors.forEach((error: { path: string; message: string }) => {
                //@ts-ignore
                setFieldError(error.path, error.message)
              })
            }
          } else {
            if (!toast.isActive('errorToast')) {
              toast({
                id: 'errorToast',
                description: 'Error',
                status: 'error',
                duration: 2000,
              })
            }
          }
        }
      }
    },
  })

  if (loading) {
    if (!toast.isActive('loadingToast')) {
      toast.closeAll(),
        toast({
          id: 'loadingToast',
          description: 'Please wait for a few seconds',
          isClosable: true,
          duration: null,
        })
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Register for a new account
            </Heading>
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
              <FormControl id='email' isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input type='email' {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email ? (
                  <Text color='red.500'>{formik.errors.email}</Text>
                ) : null}
              </FormControl>
              <FormControl id='username' isRequired>
                <FormLabel>Your Username</FormLabel>
                <Input type='text' {...formik.getFieldProps('username')} />
                {formik.touched.username && formik.errors.username ? (
                  <Text color='red.500'>{formik.errors.username}</Text>
                ) : null}
              </FormControl>
              <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...formik.getFieldProps('password')}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {formik.touched.password && formik.errors.password ? (
                  <Text color='red.500'>{formik.errors.password}</Text>
                ) : null}
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText='Submitting'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type='submit'
                  isDisabled={!formik.isValid}
                >
                  Register
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link as={NextLink} href='/auth/login' color={'blue.400'}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  )
}

export default RegisterCard
