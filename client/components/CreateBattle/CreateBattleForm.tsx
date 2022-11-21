import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { useCreateBattleMutation } from '../../gql/graphql'

function CreateBattleForm() {
  let [createBattle] = useCreateBattleMutation()
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(10, 'Title has to be atleast 10 chars long')
        .max(255, "Title can't exceed 255 characters")
        .required(),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await createBattle({
          variables: {
            ...values,
          },
        })
        toast.closeAll()
        toast({
          id: 'successToast',
          description: 'Created Battle Successfully',
          status: 'success',
          duration: 1000,
        })
        console.log(response)
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
            <Heading fontSize={'4xl'}>Create a Battle</Heading>
          </Stack>
          <Box p={8}>
            <Stack spacing={4}>
              <FormControl id='username'>
                <FormLabel>Title</FormLabel>
                <Input type='text' {...formik.getFieldProps('title')} />
                {formik.touched.title && formik.errors.title ? (
                  <Text color='red.500'>{formik.errors.title}</Text>
                ) : null}
              </FormControl>
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
                  mx='auto'
                  size='lg'
                >
                  Create Battle
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  )
}

export default CreateBattleForm
