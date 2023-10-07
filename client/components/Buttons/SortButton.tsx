import { Select } from "@chakra-ui/react"

function SortButton() {
  return (
    <Select placeholder="latest">
      <option value="createdAt">Latest</option>
      <option value="-createdAt">oldest</option>
      <option value="likeDislikeCount">Most Liked</option>
    </Select>
  )
}

export default SortButton
