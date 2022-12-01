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
import { useFormik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { loginSchema, registerSchema } from '../../../data/validationSchemas'
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from '../../../gql/graphql'
import useMutation from '../../../hooks/useMutation'

interface AuthCardProps {
  authType: 'register' | 'login'
}
function AuthCard({ authType }: AuthCardProps) {
  let [login] = useLoginMutation()
  let [register] = useRegisterMutation()
  let loginMutation = useMutation(login)
  let registerMutation = useMutation(register)

  const router = useRouter()

  const formik = useFormik({
    initialValues:
      authType === 'login'
        ? {
            username: '',
            password: '',
          }
        : { email: '', username: '', password: '' },

    validationSchema: authType === 'login' ? loginSchema : registerSchema,

    onSubmit: async (values, { setFieldError }) => {
      if (authType === 'login') {
        await loginMutation(
          {
            variables: {
              ...values,
            },
            update: (store: any, { data }: any) => {
              if (!data) return null
              //@ts-ignore
              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: data?.login?.user },
              })
            },
          },
          () => {
            router.replace('/')
          },
          setFieldError
        )
      } else if (authType === 'register') {
        await registerMutation(
          { variables: { ...values } },
          () => {
            router.replace('/auth/login')
          },
          setFieldError
        )
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
            <Heading fontSize={'4xl'}>
              {authType === 'login' ? 'Log in to your' : 'Register for a new'}{' '}
              account
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features{' '}
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              {Object.keys(formik.values)?.map((field: string) => {
                return (
                  <FormControl key={field} id={field}>
                    <FormLabel>Your {field}</FormLabel>
                    <Input
                      type={field === 'password' ? 'password' : 'text'}
                      {...formik.getFieldProps(field)}
                    />

                    {
                      //@ts-ignore
                      formik.touched[field] && formik.errors[field] ? (
                        //@ts-ignore
                        <Text color='red.500'>{formik.errors[field]}</Text>
                      ) : null
                    }
                  </FormControl>
                )
              })}
              <Stack spacing={10}>
                <Button
                  isDisabled={!formik.isValid}
                  type='submit'
                  bg={'cyan.400'}
                  color={'white'}
                  mt={5}
                  _hover={{
                    bg: 'cyan.500',
                  }}
                >
                  {authType === 'login' ? 'Log In' : 'Register'}
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  {authType === 'login'
                    ? "Don't have and account?"
                    : 'Already have a account?'}
                </Text>
                <Link
                  //@ts-ignore
                  align={'center'}
                  as={NextLink}
                  href={`/auth/${authType === 'login' ? 'register' : 'login'}`}
                  color={'blue.400'}
                >
                  {authType === 'login' ? 'Register' : 'Log In'}
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  )
}

export default AuthCard
