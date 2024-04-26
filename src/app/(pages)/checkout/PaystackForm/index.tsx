'use client'

import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {Button} from '../../../_components/Button'
import {Input} from '../../../_components/Input'
import {Message} from '../../../_components/Message'
import {useAuth} from '../../../_providers/Auth'

import classes from './index.module.scss'
import {priceFromJSON} from "../../../_components/Price";
import {Order} from "../../../../payload/payload-types";
import {useCart} from "../../../_providers/Cart";
import {PaystackButton, usePaystackPayment} from "react-paystack";
import {PaystackProps} from "react-paystack/dist/types";

type FormData = {
  address: string
  city: string
  province: string
  postalCode: string
}

const PayStackForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {user, setUser} = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const {cart, cartTotal} = useCart()
  const reference = ("Paystack_ref_" + (user?.name + Math.floor(Date.now() / 1000))).replace(/[&#!@*()\s]/g, "");
  const config: PaystackProps = {
    reference: reference,
    email: user?.email,
    firstname: user?.name.replace(/[&#!@*()\s]/g, ""),
    label: "Nesquik Outlet Checkout",
    amount: cartTotal.raw,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY as string,
    currency: "ZAR",
  }
  const initializePayment = usePaystackPayment(config);
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm<FormData>()

  const onClose = () => {
    alert("Payment cancelled.");
  };
  const onSuccess = (data: FormData) => {
    onPaymentCompleted(data).then()
  };

  const onPaymentSubmit = (data: FormData, e) => {
    e.preventDefault()
    initializePayment({config, onSuccess: () => onSuccess(data), onClose});
  };

  const onPaymentCompleted = useCallback(
    async (data: FormData) => {
      setIsLoading(true)
      try {
        const orderReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: cartTotal.raw,
            message: data.address + " " + data.city + " " + data.province + " " + data.postalCode,
            items: (cart?.items || [])?.map(({product, quantity}) => ({
              product: typeof product === 'string' ? product : product.id,
              quantity,
              price:
                typeof product === 'object'
                  ? priceFromJSON(product.priceJSON, 1, true)
                  : undefined,
            })),
          }),
        })

        if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.')

        const {
          error: errorFromRes,
          doc,
        }: {
          message?: string
          error?: string
          doc: Order
        } = await orderReq.json()

        if (errorFromRes) throw new Error(errorFromRes)

        router.push(`/order-confirmation?order_id=${doc.id}`)
      } catch (err) {
        // don't throw an error if the order was not created successfully
        // this is because payment _did_ in fact go through, and we don't want the user to pay twice
        console.error(err.message) // eslint-disable-line no-console
        router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`)
      }
    },
    [router, setIsLoading, cartTotal.raw, cart?.items],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }
    // Once user is loaded, reset form to have default values
    /* if (user) {
       reset({
         address: "",
         city: "",
         province: '',
         postalCode: ''
       })
     }*/
  }, [user, reset])

  return (
    <form onSubmit={handleSubmit(onPaymentSubmit)} className={classes.formcontainer}>
      {error && <Message error={error} success={success} className={classes.message}/>}
      <div className={classes.form}>
        <Fragment>
          <Input
            name="address"
            label="Postal Address"
            required
            register={register}
            error={errors.address}
            type="text"
          />
          <Input
            name="city"
            label="City"
            required
            register={register}
            error={errors.city}
            type="text"
          />
          <Input
            name="province"
            label="Province"
            required
            register={register}
            error={errors.province}
            type="text"
          />
          <Input
            name="postalCode"
            label="Postal Code"
            required
            register={register}
            error={errors.postalCode}
            type="text"
          />
        </Fragment>
      </div>
      <div className={classes.buttons}>
        <Button label="Back to cart" href="/cart" appearance="secondary"/>
        <Button
          label={isLoading ? 'Loading...' : 'Get My Nesquik Now'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
    </form>
  )
}
export default PayStackForm
