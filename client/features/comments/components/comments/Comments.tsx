import { Box, Center, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import SortButton from "../../../../components/Buttons/SortButton"
import Nprogress from "nprogress"
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
  const [orderBy, setOrderBy] = useState("createdAt")

  const commentHeaderRef = useRef(null)

  const [total, setTotal] = useState(0)
  const [getComments] = useGetCommentsLazyQuery()

  useEffect(() => {
    meQuery()
  }, [])

  useEffect(() => {
    if (battleId || userId) {
      Nprogress.set(0.3)
      Nprogress.start()
      getComments({
        variables: {
          battleId,
          userId,
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy,
        },
      })
        .then(({ data }) => {
          const comments = data?.getComments?.comments
          const total = data?.getComments?.total
          if (comments) setComments(comments as Comment[])
          if (total) setTotal(total)
          Nprogress.done()
        })
        .catch((_) => {
          Nprogress.done()
        })
    }
  }, [battleId, page, orderBy])
  useEffect(() => {}, [comments])
  const handlePageClick = (data: any) => {
    let selected = data.selected + 1
    setPage(selected)
  }

  const onOrderByChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy)
  }

  function setComment(commentToReplaceWith: Comment) {
    if (comments) {
      const commentIndex = comments?.findIndex((comment: Comment) => {
        return comment.id === commentToReplaceWith.id
      })

      if (typeof commentIndex === "number" && commentIndex !== -1) {
        const commentsCopy = [...comments]
        commentsCopy[commentIndex] = commentToReplaceWith
        setComments(commentsCopy)
        return true
      }
    }
    return false
  }

  const pageCount = Math.ceil(total / pageSize)

  return (
    <Box mt="10">
      <Text ref={commentHeaderRef} textAlign="center" fontSize="2rem">
        Comments
      </Text>
      <Center mt={5}>
        <Text fontSize="1.3rem" fontWeight="bold">
          {total} comments
        </Text>
      </Center>
      <Center>
        <Box my={5} width="30%">
          <SortButton
            sortOptions={{
              createdAt: "Latest",
              "-createdAt": "Oldest",
              likeDislikeCount: "Most Liked",
            }}
            onOrderByChange={onOrderByChange}
          />
        </Box>
      </Center>
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
