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
} from "@chakra-ui/react"
import { isArray } from "class-validator"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { addBattleUserSchema } from "../../../../data/validationSchemas"
import {
  useAddBattleUserMutation,
  useGetUsersLazyQuery,
  User,
} from "../../../../gql/graphql"
import useMutation from "../../../../hooks/useMutation"
import useAutocomplete from "../../hooks/useAutocomplete"

function AddBattleUser() {
  const [getUsersQuery] = useGetUsersLazyQuery({})
  const [addBattleUser] = useAddBattleUserMutation()
  const addBattleUserMutation = useMutation(addBattleUser)
  const toast = useToast()
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: addBattleUserSchema,

    onSubmit: async (_, { setFieldError }) => {
      if (!option) {
        toast.closeAll()
        toast({
          status: "warning",
          title:
            "You need to search and then choose the username from the dropdown menu to select a user , just typing the username will not work",
          duration: null,
          isClosable: true,
        })
        return
      }
      await addBattleUserMutation(
        {
          variables: {
            userId: +option,
            battleId: +router?.query?.id! as number,
          },
        },
        () => {
          router.replace(`/battles/${router.query.id}/manage`)
        },
        setFieldError
      )
    },
  })

  const { options, option, chooseOption } = useAutocomplete<User, string>(
    (setOptions) => {
      getUsersQuery({
        variables: { search: formik.values.username },
      }).then(({ data }) => {
        setOptions(data?.getUsers?.users as User[])
      })
    },
    formik.values.username
  )

  return (
    <Flex
      minH={"80vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack
          rounded={"lg"}
          boxShadow={"lg"}
          spacing={8}
          mx={"auto"}
          maxW={"lg"}
          py={12}
          px={6}
          style={{ minWidth: "60vw", minHeight: "30vh" }}
        >
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Add Battle User</Heading>
          </Stack>
          <Box p={8}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  autoComplete="off"
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  variant="filled"
                  placeholder="Search..."
                  id="username"
                  name="username"
                  autoFocus
                  onChange={async (evt) => {
                    formik.handleChange(evt)
                  }}
                />
                {formik.touched.username && formik.errors.username ? (
                  <Text color="red.500">{formik.errors.username}</Text>
                ) : null}
                <UnorderedList styleType="none">
                  {formik.values.username.length > 0 &&
                    Array.isArray(options) &&
                    options?.map((option) => {
                      return (
                        <ListItem key={option.id}>
                          <Button
                            rounded="none"
                            width="100%"
                            onClick={() => {
                              formik.setFieldValue("username", option.username)
                              chooseOption(option.id)
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
                  isDisabled={!option}
                  type="submit"
                  bg={"cyan.400"}
                  color={"white"}
                  mt={5}
                  _hover={{
                    bg: "cyan.500",
                  }}
                  mx="auto"
                  size="lg"
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

export default AddBattleUser
