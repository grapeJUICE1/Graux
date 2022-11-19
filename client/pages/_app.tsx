import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { setAccessToken } from '../accessToken'

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
      <ChakraProvider>
        <Layout>
          {loading ? <h1> Loading </h1> : <Component {...pageProps} />}
        </Layout>
      </ChakraProvider>
    </ApolloProvider>
  )
}
