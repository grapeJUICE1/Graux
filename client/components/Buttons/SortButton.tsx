import { Select } from "@chakra-ui/react"

function SortButton({ sortOptions }: { sortOptions: {} }) {
  return (
    <>
      <Select>
        {Object.entries(sortOptions)?.map(([key, value], i) => (
          <option key={i} value={key}>
            {String(value)}
          </option>
        ))}
      </Select>
    </>
  )
}

export default SortButton
