import { Button, Input, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ForgottenPassword } from 'ordercloud-javascript-sdk'
import { FC, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { CLIENT_ID } from '../../constants'

interface ILoginForm {
  onSuccess: () => void
}

interface FormInputs {
  email?: string
}

const ForgotPasswordForm: FC<ILoginForm> = ({ onSuccess }) => {
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format'),
    })
  }, [])

  const methods = useForm<FormInputs>({ resolver: yupResolver(validationSchema) })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await ForgottenPassword.SendVerificationCode({
      ClientID: CLIENT_ID,
      Email: data.email,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        id="OC_FORGOT_PASSWORD_FORM"
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Input
          name="email"
          isRequired={true}
          // label="Email"
          // inputProps={{ type: 'text', placeholder: 'Email' }}
          // control={methods.control}
        />
        <Button
          alignSelf="flex-end"
          mt="auto"
          isDisabled={methods.formState.isLoading || !methods.formState.isValid}
          type="submit"
          variant="solid"
          
        >
          Send Link
        </Button>
      </VStack>
    </FormProvider>
  )
}

export default ForgotPasswordForm
