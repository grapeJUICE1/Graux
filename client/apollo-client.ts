import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import jwtDecode from "jwt-decode"
import { getAccessToken, setAccessToken } from "./accessToken"
import { TokenRefreshLink } from "apollo-link-token-refresh"

const httpLink = createHttpLink({
  uri: "https://graux.onrender.com/graphql",
  credentials: "include",
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors?.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      console.log(locations)
    })
  console.log(graphQLErrors)
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => {
  let authorizationHeader: string
  // get the authentication token from local storage if it exists
  const token = getAccessToken()
  // return the headers to the context so httpLink can read them
  if (token) authorizationHeader = `Bearer ${token}`
  else if (headers?.authorization)
    authorizationHeader = `Bearer ${headers.authorization}`
  else authorizationHeader = ""

  return {
    headers: {
      ...headers,
      authorization: authorizationHeader,
    },
  }
})

const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken()
    if (!token) return true

    try {
      //@ts-ignore
      const { exp } = jwtDecode(token)
      if (Date.now() >= +exp * 1000) {
        return false
      } else {
        return true
      }
    } catch (err) {
      return false
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:3000/refresh_token", {
      method: "POST",
      credentials: "include",
    })
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken)
  },
  handleError: (err) => {
    // full control over handling token fetch Error
    console.warn("Your refresh token is invalid. Try to relogin")
    console.error(err)

    // When the browser is offline and an error occurs we don’t want the user to be logged out of course.
    // We also don’t want to delete a JWT token from the `localStorage` in this case of course.
    // if (
    //   !navigator.onLine ||
    //   (err instanceof TypeError && err.message === 'Network request failed')
    // ) {
    //   console.log('Offline -> do nothing 🍵')
    // } else {
    //   console.log('Online -> log out 👋')
    //
    //   // your custom action here
    //   user.logout()
    // }
  },
})

const client = new ApolloClient({
  link: from([refreshLink, authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
