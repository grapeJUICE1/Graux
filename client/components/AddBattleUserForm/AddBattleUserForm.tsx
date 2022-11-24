import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  useAddBattleUserMutation,
  useGetUsersLazyQuery,
  useGetUsersQuery,
  User,
} from '../../gql/graphql'

function AddBattleUserForm() {
  let [addBattleUser] = useAddBattleUserMutation()

  const toast = useToast()
  const router = useRouter()

  const [options, setOptions] = useState<User[]>([])
  const [optionChoosed, setOptionChoosed] = useState<String | null>(null)
  const [optionWasChoosed, setOptionWasChoosed] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be atleaast 3 characters long')
        .max(30, "Can't exceed 30 characters")
        .required('Required'),
    }),

    onSubmit: async (_, { setFieldError }) => {
      try {
        if (!optionChoosed) {
          toast.closeAll()
          toast({
            status: 'warning',
            title:
              'You need to search and then choose the username from the dropdown menu to select a user , just typing the username will not work',
            duration: null,
            isClosable: true,
          })
          return
        }
        await addBattleUser({
          variables: {
            userId: +optionChoosed,
            battleId: +router?.query?.id! as number,
          },
        })

        toast.closeAll()
        toast({
          description: 'Battle Request send to the user',
          status: 'success',
          duration: 2000,
        })
        router.replace(`/battles/${router.query.id}/manage`)
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

  const [getUsersQuery] = useGetUsersLazyQuery({})

  useEffect(() => {
    if (!optionWasChoosed && formik.values.username.length > 0) {
      getUsersQuery({
        variables: { search: formik.values.username },
      }).then(({ data }) => {
        //@ts-ignore
        setOptions(data?.getUsers)
      })
    } else if (optionWasChoosed) {
      setOptionWasChoosed(false)
    }
  }, [formik.values.username])

  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack
          rounded={'lg'}
          boxShadow={'lg'}
          spacing={8}
          mx={'auto'}
          maxW={'lg'}
          py={12}
          px={6}
          style={{ minWidth: '60vw', minHeight: '30vh' }}
        >
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Add Battle User</Heading>
          </Stack>
          <Box p={8}>
            <Stack spacing={4}>
              <FormControl id='username'>
                <FormLabel>Username</FormLabel>
                <Input
                  type='text'
                  autoComplete='off'
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  variant='filled'
                  placeholder='Search...'
                  id='username'
                  name='username'
                  autoFocus
                  onChange={async (evt) => {
                    formik.handleChange(evt)
                    if (optionChoosed) {
                      setOptionChoosed(null)
                    }
                  }}
                />
                {formik.touched.username && formik.errors.username ? (
                  <Text color='red.500'>{formik.errors.username}</Text>
                ) : null}
                <UnorderedList styleType='none'>
                  {formik.values.username.length > 0 &&
                    options.map((option) => {
                      return (
                        <ListItem key={option.id}>
                          <Button
                            rounded='none'
                            width='100%'
                            onClick={() => {
                              formik.setFieldValue('username', option.username)
                              setOptions([])
                              setOptionChoosed(option.id)
                              setOptionWasChoosed(true)
                            }}
                          >
                            {option.username}
                          </Button>
                        </ListItem>
                      )
                    })}
                </UnorderedList>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isDisabled={!optionChoosed}
                  type='submit'
                  bg={'cyan.400'}
                  color={'white'}
                  mt={5}
                  _hover={{
                    bg: 'cyan.500',
                  }}
                  mx='auto'
                  size='lg'
                >
                  Request to join battle
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  )
}

export default AddBattleUserForm
