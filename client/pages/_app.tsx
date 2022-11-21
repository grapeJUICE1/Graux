import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Text } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import Layout from '../components/Layout/Layout'
import { useEffect, useState } from 'react'
import { setAccessToken } from '../accessToken'
import theme from '../theme'

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('http://localhost:3000/refresh_token', {
      credentials: 'include',
      method: 'POST',
    }).then(async (response) => {
      const { accessToken } = await response.json()
      setAccessToken(accessToken)
      setLoading(false)
    })
  }, [])
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        {loading ? (
          ''
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </ApolloProvider>
  )
}
