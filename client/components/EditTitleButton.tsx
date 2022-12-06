import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useUpdateBattleMutation } from '../gql/graphql'

function EditTitleButton({
  buttonProps,
  battleId,
}: {
  buttonProps?: ButtonProps
  battleId: number
}) {
  const [updateBattle] = useUpdateBattleMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const formik = useFormik({
    initialValues: { title: '' },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(10, 'Title must be atleast 10 characters long')
        .max(255, 'Title cannot exceed 255 characters')
        .required(),
    }),

    onSubmit: async (values, { setFieldError }) => {
      if (true) {
        try {
          toast.closeAll()
          toast({
            description: 'Please wait for a few seconds',
            duration: null,
            isClosable: true,
          })
          await updateBattle({ variables: { battleId, title: values.title } })
          onClose()
          toast.closeAll()
          toast({
            description: 'Edited Title Successfully',
            duration: 3000,
            status: 'success',
          })
        } catch (err) {
          toast.closeAll()
          //@ts-ignore
          let error = err?.graphQLErrors?.at(0).extensions?.errors[0] as {
            path: string
            message: string
          }
          if (error) {
            setFieldError('title', error.message)
          } else {
            onClose()
            toast({
              description: 'Something went wrong',
              duration: 3000,
              status: 'error',
            })
          }
        }
      }
    },
  })
  return (
    <>
      <Button onClick={onOpen} {...buttonProps}>
        Edit Title
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader mt='5'>Edit Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box p={8}>
                <Stack spacing={4}>
                  <FormControl id='title'>
                    <FormLabel>New Title</FormLabel>
                    <Input {...formik.getFieldProps('title')} />
                    {formik.touched.title && formik.errors.title ? (
                      <Text color='red.500'>{formik.errors.title}</Text>
                    ) : null}
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='green' mr={3} type='submit'>
                Update Title
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
export default EditTitleButton
