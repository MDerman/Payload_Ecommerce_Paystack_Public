"use client"
import React, {useCallback, useEffect, useState} from 'react'
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "../../_providers/Auth";

export default function page() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect( () =>
  {
    const onSubmit = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        //const json = await response.json()
        // Automatically log the user in after they successfully reset password
        //await login({ email: email, password: data.password})
        // Redirect them to `/account` with success message in URL
        //router.push('/')
        router.push('/cart?success=Account%20Confirmed%20Successfully!')
      } else {
        setError('There was a problem while resetting your password. Please try again later.')
      }
    };
    onSubmit();
  }, [token, router]);

  return (
    <>
    </>
  )
}
