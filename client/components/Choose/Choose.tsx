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
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { useChooseSongMutation } from '../../gql/graphql'
function Choose() {
  const [options, setOptions] = useState<any>(null)
  const [optionChoosed, setOptionChoosed] = useState<any>(null)
  const [optionWasChoosed, setOptionWasChoosed] = useState<boolean>(false)
  const router = useRouter()
  const toast = useToast()

  const [chooseSong] = useChooseSongMutation()
  const formik = useFormik({
    initialValues: {
      songName: '',
    },
    onSubmit: async (_, { setFieldError }) => {
      if (optionChoosed?.name && router?.query?.id) {
        try {
          await chooseSong({
            variables: {
              battleId: +router?.query?.id as unknown as number,
              songName: optionChoosed?.name as string,
              songAlbum: optionChoosed?.album?.title as string,
              songLink: optionChoosed?.url as string,
              songArtist: optionChoosed?.artist?.name as string,
              songImage: optionChoosed?.album?.image[2]['#text'] as string,
            },
          })
          toast({
            description: 'Chose song successfully',
            duration: 2000,
            status: 'success',
          })
          router.replace(`/battles/${router.query.id}/manage`)
        } catch (err) {
          //@ts-ignore
          let errors = err?.graphQLErrors[0].extensions.errors as {
            path: string
            message: string
          }[]
          if (errors) {
            errors.forEach((error: { path: string; message: string }) => {
              //@ts-ignore
              setFieldError('songName', error.message)
            })
          }
        }
      }
    },
  })

  useEffect(() => {
    if (formik.values.songName && !optionWasChoosed) {
      let songNameInUrl = formik.values.songName.replace(/ /g, '%20')

      fetch(
        `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.search&track=${songNameInUrl}&api_key=095ee494d48c0071adda4e2816787daa&format=json`
      ).then(async (response) => {
        const data = await response.json()
        let songs = data?.results?.trackmatches.track
        if (songs) setOptions(songs)
      })
    } else if (optionWasChoosed) {
      setOptionWasChoosed(false)
    }
  }, [formik.values.songName])
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
            <Heading fontSize={'4xl'}>Choose Song</Heading>
          </Stack>
          <Box>
            {optionChoosed ? (
              <>
                {optionChoosed?.album?.image ? (
                  <img
                    style={{ width: '12rem' }}
                    alt='song image'
                    src={`${optionChoosed?.album?.image[2]['#text']}`}
                  />
                ) : (
                  ''
                )}
                <div>song name : {optionChoosed?.name}</div>
                <div>song album : {optionChoosed?.album?.title}</div>
                <div>song artist : {optionChoosed?.artist?.name}</div>
                <div>song link : {optionChoosed?.url}</div>
              </>
            ) : (
              ''
            )}
          </Box>
          <Box p={8}>
            <Stack spacing={4}>
              <FormControl id='songLink'>
                <FormLabel>Song Name</FormLabel>
                <Input
                  type='text'
                  autoComplete='off'
                  onBlur={formik.handleBlur}
                  value={formik.values.songName}
                  variant='filled'
                  placeholder='Search...'
                  id='songName'
                  name='songName'
                  autoFocus
                  onChange={async (evt) => {
                    formik.handleChange(evt)
                    if (optionChoosed) {
                      setOptionChoosed(null)
                    }
                  }}
                />
                <UnorderedList styleType='none' margin='0'>
                  {formik.values.songName.length > 0 &&
                    options?.map((song: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <ListItem>
                            <Box
                              rounded='none'
                              width='100%'
                              bgColor='gray.600'
                              _hover={{ bgColor: 'gray.500' }}
                              cursor='pointer'
                              onClick={async () => {
                                try {
                                  const trackResponse = await fetch(
                                    `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=${song.name}&artist=${song.artist}&api_key=095ee494d48c0071adda4e2816787daa&format=json`
                                  )
                                  const data = await trackResponse.json()
                                  const track = data?.track
                                  formik.setFieldValue('songName', song.name)
                                  setOptions(null)
                                  setOptionChoosed(track)
                                  setOptionWasChoosed(true)
                                } catch (err) {}
                              }}
                              style={{ wordWrap: 'break-word' }}
                              fontSize='1.3rem'
                            >
                              {song.name + ' -    ' + song.artist}
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
export default Choose