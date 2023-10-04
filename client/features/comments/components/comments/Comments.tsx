import { Box, Center, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Pagination from "../../../../components/Pagination"
import {
  Comment,
  useGetCommentsLazyQuery,
  useMeLazyQuery,
} from "../../../../gql/graphql"

import AddCommentButton from "./AddCommentButton"
import CommentCard from "./CommentCard"

const pageSize = 5

function Comments({
  battleId,
  userId,
}: {
  battleId?: number
  userId?: number
}) {
  const [meQuery, { data }] = useMeLazyQuery()
  const [comments, setComments] = useState<Comment[] | null>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [getComments] = useGetCommentsLazyQuery()

  const router = useRouter()

  useEffect(() => {
    meQuery()
  }, [])

  useEffect(() => {
    if (battleId || userId) {
      getComments({
        variables: {
          battleId,
          userId,
          take: pageSize,
          skip: (page - 1) * pageSize,
        },
      })
        .then(({ data }) => {
          const comments = data?.getComments?.comments
          const total = data?.getComments?.total
          if (comments) setComments(comments as Comment[])
          if (total) setTotal(total)
        })
        .catch()
    }
  }, [battleId])

  useEffect(() => {
    const take = pageSize
    const skip = (page - 1) * pageSize
    getComments({
      variables: {
        battleId,
        userId,
        take,
        skip,
      },
    }).then(({ data }) => {
      const comments = data?.getComments?.comments
      const total = data?.getComments?.total
      if (comments) setComments(comments as Comment[])
      if (total) setTotal(total)
    })
  }, [page])

  function setComment(commentToReplaceWith: Comment) {
    if (comments) {
      const commentIndex = comments?.findIndex((comment: Comment) => {
        return comment.id === commentToReplaceWith.id
      })
      console.log(commentIndex)

      if (typeof commentIndex === "number" && commentIndex !== -1) {
        const commentsCopy = [...comments]
        commentsCopy[commentIndex] = commentToReplaceWith
        setComments(commentsCopy)
        return true
      }
    }
    return false
  }

  const handlePageClick = (data: any) => {
    let selected = data.selected + 1
    setPage(selected)
  }

  const pageCount = Math.ceil(total / pageSize)

  return (
    <Box mt="10">
      <Text textAlign="center" fontSize="2rem">
        Comments
      </Text>
      <Center>
        {battleId && data?.me && (
          <AddCommentButton
            battleId={battleId}
            comments={comments}
            setComments={setComments}
          />
        )}
      </Center>
      {comments &&
        comments?.map((comment: Comment) => {
          return (
            <CommentCard
              comment={comment}
              me={data?.me}
              setComment={setComment}
            />
          )
        })}
      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={page || 1}
      />
    </Box>
  )
}

export default Comments
