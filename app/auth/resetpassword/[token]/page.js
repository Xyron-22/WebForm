import React from 'react'
import ResetPasswordForm from '@/components/ResetPassword'

const ResetPasswordPage = ({params}) => {
  return (
    <div className="flex flex-col min-h-[86vh] justify-center items-center">
      <ResetPasswordForm params={params}></ResetPasswordForm>
    </div>
)
}

export default ResetPasswordPage