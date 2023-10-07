import { useToast } from "@chakra-ui/react"
import Nprogress from "nprogress"

function useMutation(mutationFn: any) {
  const toast = useToast()

  async function mutation(
    mutationOptions: {},
    onSuccess: (data: any) => void = () => {},
    setFieldError?: any
  ) {
    try {
      toast.closeAll()
      Nprogress.set(0.3)
      Nprogress.start()
      const { data } = await mutationFn(mutationOptions)
      toast.closeAll()
      toast({
        description: "Successful",
        duration: 2000,
        status: "success",
      })
      Nprogress.done()
      onSuccess(data)
    } catch (err) {
      toast.closeAll()
      Nprogress.done()
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
                description:
                  errors?.at(0)?.message ||
                  //@ts-ignore
                  errors?.message ||
                  "Something went wrong",
                status: "error",
                duration: 2000,
              })
            }
          }
        } else {
          toast({
            description: "Something Went Wrong",
            status: "error",
            duration: 2000,
          })
        }
      } else {
        toast({
          description: "Something Went Wrong",
          status: "error",
          duration: 2000,
        })
      }
    }
  }

  return mutation
}

export default useMutation
