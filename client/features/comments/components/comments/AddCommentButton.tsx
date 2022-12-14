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
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { Comment, useAddCommentMutation } from '../../../../gql/graphql'
import { createCommentSchema } from '../../../../data/validationSchemas'
import useMutation from '../../../../hooks/useMutation'

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
  const addCommentMutation = useMutation(addComment)

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema: createCommentSchema,

    onSubmit: async (values) => {
      await addCommentMutation(
        {
          variables: { battleId, body: values.body },
        },
        (data) => {
          const comment = data?.addComment
          if (comment) {
            if (comments) setComments([comment, ...comments])
            else setComments([comment])
          }
          onClose()
        }
      )
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
