import { Box, Center, Heading, SimpleGrid } from "@chakra-ui/react"
import { useRouter } from "next/router"
import SortButton from "../../../../components/Buttons/SortButton"
import Pagination from "../../../../components/Pagination"
import Search from "../../../../components/Search"
import { User as UserType } from "../../../../gql/graphql"
import UserCard from "../UserProfile/UserCard"

type UsersProps = {
  initialTotal: number
  initialUsers: UserType[]
  pageSize: number
}

function Users({ initialTotal, initialUsers, pageSize }: UsersProps) {
  const total = initialTotal || 0

  const router = useRouter()

  const handlePageClick = (data: any) => {
    let selected = data.selected + 1
    router.push({ query: { ...router.query, page: selected } })
  }

  const pageCount = Math.ceil(total / pageSize)

  const onOrderByChange = (newOrderBy: string) => {
    router.push({ query: { ...router.query, page: 1, sort: newOrderBy } })
  }
  const onSearch = (searchString: string | null) => {
    router.push({
      query: searchString
        ? { page: 1, sort: "createdAt", search: searchString }
        : { page: 1, sort: "createdAt" },
    })
  }
  return (
    <>
      <Heading textAlign="center" mt="5" pb="10">
        All Users
      </Heading>
      <Center>
        <Box my={5} width="30%">
          <SortButton
            sortOptions={{ createdAt: "Latest", "-createdAt": "Oldest" }}
            onOrderByChange={onOrderByChange}
          />
        </Box>
      </Center>
      <Center>
        <Box width="50%">
          <Search onSearch={onSearch} placeholder="Search For Battles" />
        </Box>
      </Center>
      <Center>
        <SimpleGrid
          mt={5}
          pt={5}
          columns={{ base: 2, sm: 2, md: 3, xl: 4 }}
          spacing={10}
        >
          {initialUsers?.map((user) => (
            <>
              <UserCard user={user} />
            </>
          ))}
        </SimpleGrid>
      </Center>
      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={Number(router.query?.page) || 1}
      />
    </>
  )
}
export default Users
