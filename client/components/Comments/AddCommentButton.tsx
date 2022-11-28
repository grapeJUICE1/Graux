import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { Comment, useAddCommentMutation } from '../../gql/graphql'
import * as Yup from 'yup'

function AddCommentButton({
  battleId,
  comments,
  setComments,
}: {
  battleId: number
  comments: Comment[] | null
  setComments: any
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [addComment] = useAddCommentMutation()

  const toast = useToast()

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema: Yup.object({
      body: Yup.string()
        .min(1, 'Comment has to be atleast 1 character long')
        .max(255, 'Comment cannot be greater than 255 characters')
        .required(),
    }),

    onSubmit: async (values) => {
      try {
        toast.closeAll()
        toast({
          description: 'Please wait for a few seconds',
          duration: null,
          isClosable: true,
        })

        const { data } = await addComment({
          variables: { battleId, body: values.body },
        })
        const comment = data?.addComment
        if (comment) {
          if (comments) setComments([comment, ...comments])
          else setComments([comment])
        }
        onClose()
        toast.closeAll()
        toast({
          description: 'voting successfull',
          duration: 1000,
          status: 'success',
        })
      } catch (err) {
        console.log(err)
        onClose()
        toast.closeAll()
        //@ts-ignore
        let error = err?.graphQLErrors[0].extensions.errors[0] as {
          path: string
          message: string
        }
        if (error) {
          toast({
            description: error.message,
            status: 'error',
            duration: 3000,
          })
        }
      }
    },
  })

  return (
    <>
      <Button onClick={onOpen} my='5' colorScheme='cyan'>
        Add Comment
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader mt='5'>Add Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box p={8}>
                <Stack spacing={4}>
                  <FormControl id='comment'>
                    <FormLabel>Comment Body</FormLabel>
                    <Textarea {...formik.getFieldProps('body')} />
                    {formik.touched.body && formik.errors.body ? (
                      <Text color='red.500'>{formik.errors.body}</Text>
                    ) : null}
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='green' mr={3} type='submit'>
                Add Comment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AddCommentButton
