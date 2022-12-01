import { useToast } from '@chakra-ui/react'

function useMutation(mutationFn: any) {
  const toast = useToast()

  async function mutation(
    mutationOptions: {},
    onSuccess: () => void,
    setFieldError?: any
  ) {
    try {
      toast.closeAll()
      toast({
        description: 'Please wait for a few seconds',
        duration: null,
      })
      await mutationFn(mutationOptions)
      toast.closeAll()
      toast({
        description: 'Successful',
        duration: 2000,
        status: 'success',
      })
      onSuccess()
    } catch (err) {
      toast.closeAll()
      //@ts-ignore
      if (err?.graphQLErrors?.at(0)?.extensions?.errors) {
        //@ts-ignore
        let errors = err?.graphQLErrors?.at(0)?.extensions.errors as {
          path: string
          message: string
        }[]

        if (errors) {
          if (errors?.at(0)?.path) {
            if (setFieldError) {
              errors.forEach((error: { path: string; message: string }) => {
                //@ts-ignore
                setFieldError(error.path, error.message)
              })
            } else {
              toast({
                description: errors?.at(0)?.message,
                status: 'error',
                duration: 2000,
              })
            }
          }
        } else {
          if (!toast.isActive('errorToast')) {
            toast({
              description: 'Something Went Wrong',
              status: 'error',
              duration: 2000,
            })
          }
        }
      }
    }
  }

  return mutation
}

export default useMutation
