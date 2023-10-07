import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { User as UserType } from "../../gql/graphql"
import { GetServerSidePropsContext } from "next"
import { Users } from "../../features/users"

const pageSize = 10

export default function AllUsersPage({
  initialUsers,
  total,
}: {
  initialUsers: UserType[]
  total: number
}) {
  return (
    <>
      <Users
        initialUsers={initialUsers}
        initialTotal={total}
        pageSize={pageSize}
      />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const skip =
    (query?.page
      ? Number(query?.page)
        ? Number(query?.page) - 1
        : 0
      : 0 || 0) * pageSize

  const take = pageSize

  const search = query?.search || null

  const { data } = await client.query({
    query: gql`
      query GetUsers(
        $take: Int
        $skip: Int
        $orderBy: String
        $search: String
        $avoidClientSideError: Boolean
      ) {
        getUsers(
          take: $take
          skip: $skip
          orderBy: $orderBy
          search: $search
          avoidClientSideError: $avoidClientSideError
        ) {
          total
          users {
            id
            email
            username
            createdAt
          }
        }
      }
    `,
    fetchPolicy: "network-only",
    variables: {
      take: take,
      skip: skip,
      orderBy: "createdAt",
      search: search ? "a" + search : null,
      avoidClientSideError: true,
    },
  })

  console.log(data)
  return {
    props: {
      initialUsers: data?.getUsers?.users || null,
      total: data?.getUsers?.total,
    },
  }
}
