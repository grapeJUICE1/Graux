import { Heading } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Pagination from "../../../../components/Pagination"
import { User as UserType } from "../../../../gql/graphql"

type UsersProps = {
  initialTotal: number
  initialUsers: UserType[]
  pageSize: number
}

function Users({ initialTotal, initialUsers, pageSize }: UsersProps) {
  const [total, setTotal] = useState(initialTotal || 0)

  const router = useRouter()

  const handlePageClick = (data: any) => {
    let selected = data.selected + 1
    router.push({ query: { ...router.query, page: selected } })
  }

  const pageCount = Math.ceil(total / pageSize)

  useEffect(() => {
    if (!Number(router.query?.page))
      router.push({ query: { ...router.query, page: 1 } })
  }, [])

  return (
    <>
      <Heading textAlign="center" mt="5"></Heading>

      {initialUsers?.map((user) => <p key={user?.id}>{user?.username}</p>)}
      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={Number(router.query?.page) || 1}
      />
    </>
  )
}
export default Users
