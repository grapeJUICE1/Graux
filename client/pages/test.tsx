import { Text } from '@chakra-ui/react'
import { useTestQuery } from '../gql/graphql'

function Test() {
  const { data, loading, error } = useTestQuery({ fetchPolicy: 'network-only' })

  let renderedJSX

  if (loading) {
    renderedJSX = <Text fontSize='2rem'> Loading </Text>
  } else if (error) {
    renderedJSX = <Text fontSize='2rem'> {error.message} </Text>
  } else if (!data) {
    renderedJSX = <Text fontSize='2rem'> No data </Text>
  } else {
    renderedJSX = <Text fontSize='2rem'> {data.test} </Text>
  }

  return <h1> {renderedJSX} </h1>
}
export default Test
