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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { startBattleSchema } from '../../../../data/validationSchemas'
import { useStartBattleMutation } from '../../../../gql/graphql'
import useMutation from '../../../../hooks/useMutation'

function StartBattleButton({ battleId }: { battleId: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startBattle] = useStartBattleMutation()
  const startBattleMutation = useMutation(startBattle)
  const router = useRouter()

  const formik = useFormik({
    initialValues: { hours: 10 },
    validationSchema: startBattleSchema,
    onSubmit: async (values, { setFieldError }) => {
      await startBattleMutation(
        {
          variables: { battleId, hoursTillActive: values.hours },
        },
        () => {
          router.push(`/battles/${router.query.id}`)
        },
        setFieldError
      )
    },
  })

  return (
    <>
      <Button
        colorScheme='green'
        mt='5'
        textAlign='center'
        mx='3'
        onClick={onOpen}
      >
        Start Battle
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader mt='5'>
              How many hours do you want the battle to be active
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box p={8}>
                <Stack spacing={4}>
                  <FormControl id='songLink'>
                    <FormLabel>Hours</FormLabel>
                    <NumberInput
                      id='hours'
                      name='hours'
                      onChange={(val) => {
                        formik.setFieldValue('hours', +val)
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.hours}
                      defaultValue={1}
                      min={1}
                      max={168}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {formik.touched.hours && formik.errors.hours ? (
                      <Text color='red.500'>{formik.errors.hours}</Text>
                    ) : null}
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='green' mr={3} type='submit'>
                Start Battle
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default StartBattleButton
