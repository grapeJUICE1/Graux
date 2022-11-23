import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react'
import React from 'react'

function ManageBattle() {
  return (
    <Flex>
      <Alert status='warning'>
        <AlertIcon />
        <AlertTitle>
          Refresh the page time to time to see if battle requests were approved
        </AlertTitle>
      </Alert>
    </Flex>
  )
}

export default ManageBattle
