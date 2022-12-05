import { FetchResult } from '@apollo/client'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  ButtonProps,
} from '@chakra-ui/react'
import {
  DeleteBattleMutation,
  DeleteUserMutation,
  RemoveBattleRequestMutation,
  RemoveBattleUserMutation,
  RemoveCommentMutation,
} from '../../gql/graphql'

interface DeleteButtonProps {
  modalHeader: string
  modalBody: string
  buttonProps?: ButtonProps
  mutationFunc:
    | (() => Promise<
        FetchResult<
          RemoveCommentMutation,
          Record<string, any>,
          Record<string, any>
        >
      >)
    | (() => Promise<
        FetchResult<
          DeleteBattleMutation,
          Record<string, any>,
          Record<string, any>
        >
      >)
    | (() => Promise<
        FetchResult<
          DeleteUserMutation,
          Record<string, any>,
          Record<string, any>
        >
      >)
    | (() => Promise<
        FetchResult<
          RemoveBattleUserMutation,
          Record<string, any>,
          Record<string, any>
        >
      >)
    | (() => Promise<
        FetchResult<
          RemoveBattleRequestMutation,
          Record<string, any>,
          Record<string, any>
        >
      >)
}

function DeleteButton({
  modalHeader,
  modalBody,
  mutationFunc,
  buttonProps,
}: DeleteButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  async function deleteButtonOnClick() {
    try {
      toast.closeAll()
      toast({
        description: 'Please wait for a few seconds',
        duration: null,
        isClosable: true,
      })
      await mutationFunc()
      onClose()
      toast.closeAll()
      toast({
        title: 'Deleted successfully , Refresh the page to see results',
        duration: 3000,
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
  }
  return (
    <>
      <Button {...buttonProps} colorScheme='red' onClick={onOpen}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' onClick={deleteButtonOnClick}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default DeleteButton
