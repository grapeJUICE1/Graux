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
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { MeDocument, MeQuery, useLoginMutation } from '../../gql/graphql'

function LoginCard() {
  let [login, { data, loading }] = useLoginMutation()
  const toast = useToast()
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
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
        const response = await login({
          variables: {
            ...values,
          },
          update: (store, { data }) => {
            console.log(data)
            if (!data) return null
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: { me: data?.login?.user },
            })
          },
        })
        toast.closeAll()
        toast({
          id: 'successToast',
          description: 'Logged In Successfully',
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
              <FormControl id='username'>
                <FormLabel>Your Username</FormLabel>
                <Input type='text' {...formik.getFieldProps('username')} />
                {formik.touched.username && formik.errors.username ? (
                  <Text color='red.500'>{formik.errors.username}</Text>
                ) : null}
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <Input type='password' {...formik.getFieldProps('password')} />
                {formik.touched.password && formik.errors.password ? (
                  <Text color='red.500'>{formik.errors.password}</Text>
                ) : null}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isDisabled={!formik.isValid}
                  type='submit'
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
      </form>
    </Flex>
  )
}

export default LoginCard
