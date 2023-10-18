import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Stack,
  UnorderedList,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { useChooseSongMutation } from "../../../../gql/graphql"
import useMutation from "../../../../hooks/useMutation"
import useAutocomplete from "../../hooks/useAutocomplete"

function ChooseSong() {
  const router = useRouter()
  const toast = useToast()

  const [chooseSong] = useChooseSongMutation()
  const chooseSongMutation = useMutation(chooseSong)
  const [t, setT] = useState(null)

  const formik = useFormik({
    initialValues: {
      songName: "",
    },
    onSubmit: async () => {
      if (option?.name && router?.query?.id) {
        await chooseSongMutation(
          {
            variables: {
              battleId: +router?.query?.id as unknown as number,
              songName: option?.name as string,
              songAlbum: (option?.album?.title as string) || "No album found",
              songLink: (option?.url as string) || "No Song Link found",
              songArtist: (option?.artist?.name as string) || "No artist found",
              songImage:
                (option?.album?.image[2]["#text"] as string) ||
                "/images/404.png",
            },
          },
          () => {
            router.replace(`/battles/${router.query.id}/manage`)
          }
        )
      }
    },
  })

  const { options, option, chooseOption } = useAutocomplete<any, any>(
    (setOptions) => {
      if (t) clearTimeout(t)
      setT(
        //@ts-ignore
        setTimeout(
          () => {
            let songNameInUrl = formik.values.songName.replace(/ /g, "%20")
            fetch(
              `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.search&track=${songNameInUrl}&api_key=${process.env.NEXT_PUBLIC_LAST_FM_API_KEY}&format=json`
            )
              .then(async (response) => {
                const data = await response.json()
                let songs = data?.results?.trackmatches?.track
                if (songs) setOptions(songs)
              })
              .catch((_err) => {
                console.log(_err)
                toast({ status: "error", title: "Something went wrong" })
              })
          },

          1000
        )
      )
    },
    formik.values.songName
  )

  async function songChooseButtonOnClick(song: any) {
    try {
      toast.closeAll()
      toast({
        description: "Please wait for a few seconds",
        duration: null,
        isClosable: true,
      })
      const trackResponse = await fetch(
        `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=${song.name}&artist=${song.artist}&api_key=${process.env.NEXT_PUBLIC_LAST_FM_API_KEY}&format=json`
      )
      const data = await trackResponse.json()
      const track = data?.track
      formik.setFieldValue("songName", song.name)

      chooseOption(track)
      toast.closeAll()
      toast({
        description: "Track loaded",
        duration: 2000,
        status: "success",
      })
    } catch (err) {
      console.log(err)
      toast.closeAll()
      toast({
        description: "Something went wrong , please try again",
        status: "error",
      })
    }
  }
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
            <Heading fontSize={"4xl"}>Choose Song</Heading>
          </Stack>
          <Box>
            {option ? (
              <>
                {option?.album?.image ? (
                  <img
                    style={{ width: "12rem" }}
                    alt="song image"
                    src={`${option?.album?.image[2]["#text"]}`}
                  />
                ) : (
                  <img
                    style={{ width: "12rem" }}
                    alt="song image"
                    src="/images/404.png"
                  />
                )}
                <div>
                  song name : {option?.name || "No name found for this song"}
                </div>
                <div>
                  song album :{" "}
                  {option?.album?.title || "No album found for this song"}
                </div>
                <div>
                  song artist :{" "}
                  {option?.artist?.name || "No Artist found for this song"}
                </div>
                <div>
                  song link : {option?.url || "No link found for this song"}
                </div>
              </>
            ) : (
              ""
            )}
          </Box>
          <Box p={8}>
            <Stack spacing={4}>
              <FormControl id="songLink">
                <FormLabel>Song Name</FormLabel>
                <Input
                  type="text"
                  autoComplete="off"
                  onBlur={formik.handleBlur}
                  value={formik.values.songName}
                  variant="filled"
                  placeholder="Search..."
                  id="songName"
                  name="songName"
                  autoFocus
                  onChange={(evt) => {
                    formik.handleChange(evt)
                  }}
                />
                <UnorderedList styleType="none" margin="0">
                  {formik.values.songName.length > 0 &&
                    options?.map((song: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <ListItem>
                            <Box
                              rounded="none"
                              width="100%"
                              bgColor="gray.600"
                              _hover={{ bgColor: "gray.500" }}
                              cursor="pointer"
                              onClick={() => songChooseButtonOnClick(song)}
                              style={{ wordWrap: "break-word" }}
                              fontSize="1.3rem"
                            >
                              {song?.name + " -    " + song?.artist}
                            </Box>
                          </ListItem>
                          <Divider />
                        </Fragment>
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
                  Choose Song
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  )
}
export default ChooseSong
