import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react"
import { ApolloProvider } from "@apollo/client"
import NextNProgress from "../components/Nprogress"
import client from "../apollo-client"
import Layout from "../components/Layout/Layout"
import { useEffect, useState } from "react"
import { setAccessToken } from "../accessToken"
import theme from "../theme"

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/refresh_token`, {
      credentials: "include",
      method: "POST",
    })
      .then(async (response) => {
        const data = await response.json()
        setAccessToken(data.accessToken)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err), setLoading(false)
      })
  }, [])
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        {loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <Layout>
            <NextNProgress />
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </ApolloProvider>
  )
}
