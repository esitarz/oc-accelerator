import { Button, Input, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ForgottenPassword } from 'ordercloud-javascript-sdk'
import { FC, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { CLIENT_ID } from '../../constants'

interface IForgotUsernameVerificationForm {
  onSuccess: () => void
}

interface FormInputs {
  verificationCode?: string
}

const ForgotPasswordVerificationForm: FC<IForgotUsernameVerificationForm> = ({ onSuccess }) => {
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      verificationCode: yup.string(),
    })
  }, [])

  const methods = useForm<FormInputs>({ resolver: yupResolver(validationSchema) })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await ForgottenPassword.ResetPasswordByVerificationCode(data.verificationCode!, {
      ClientID: CLIENT_ID,
      Username: '',
      Password: '',
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        id="OC_FORGOT_PASSWORD_VERFICIATION_FORM"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Input
          name="verificationCode"
          // label="Verification Code"
          isRequired
          // inputProps={{ type: 'text', placeholder: 'Verification Code' }}
        />
        <Input
          name="userName"
          // label="Username"
          isRequired
          // inputProps={{ type: 'text', placeholder: 'Username' }}
        />
        <Input
          name="password"
          // label="Password"
          isRequired
          // inputProps={{ type: 'text', placeholder: 'Password' }}
        />
        <Input
          name="confirmPassword"
          // label="Confirm Password"
          isRequired
          // inputProps={{ type: 'text', placeholder: 'Confirm Password' }}
        />
        <Button
          alignSelf="flex-end"
          mt="auto"
          px={6}
          isDisabled={methods.formState.isLoading || !methods.formState.isValid}
          type="submit"
          variant="solid"
          
        >
          Verify
        </Button>
      </VStack>
    </FormProvider>
  )
}

export default ForgotPasswordVerificationForm
