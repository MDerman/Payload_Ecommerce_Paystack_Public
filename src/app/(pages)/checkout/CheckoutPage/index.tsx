'use client'

import React, {Fragment, useEffect} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {Settings} from '../../../../payload/payload-types'
import {Button} from '../../../_components/Button'
import {LoadingShimmer} from '../../../_components/LoadingShimmer'
import {useAuth} from '../../../_providers/Auth'
import {useCart} from '../../../_providers/Cart'
import {useTheme} from '../../../_providers/Theme'
import {CheckoutItem} from '../CheckoutItem'
import classes from './index.module.scss'
import PaystackForm from "../PaystackForm";
import {formatRawPrice} from "../../../_components/Price";

export const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: {productsPage},
  } = props

  const {user} = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [clientSecret, setClientSecret] = React.useState()
  const hasMadePaymentIntent = React.useRef(false)
  const {theme} = useTheme()
  const {cart, cartIsEmpty, cartTotal} = useCart()

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])
  /*
    useEffect(() => {
      if (user && cart && hasMadePaymentIntent.current === false) {
        hasMadePaymentIntent.current = true

        const makeIntent = async () => {
          try {
            const paymentReq = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
              {
                method: 'POST',
                credentials: 'include',
              },
            )
            const res = await paymentReq.json()

            if (res.error) {
              setError(res.error)
            } else if (res.client_secret) {
              setError(null)
              setClientSecret(res.client_secret)
            }
          } catch (e) {
            setError('Something went wrong.')
          }
        }
        makeIntent()
      }
    }, [cart, user])*/

  //if (!user || !stripe) return null
  return (
    <Fragment>
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      {!cartIsEmpty && (
        <div className={classes.items}>
          <div className={classes.header}>
            <p>Products</p>
            <div className={classes.headerItemDetails}>
              <p></p>
              <p className={classes.quantity}>Quantity</p>
            </div>
            <p className={classes.subtotal}>Subtotal</p>
          </div>

          <ul>
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object') {
                const {
                  quantity,
                  product,
                  product: {title, meta},
                } = item

                if (!quantity) return null

                const metaImage = meta?.image

                return (
                  <Fragment key={index}>
                    <CheckoutItem
                      product={product}
                      title={title}
                      metaImage={metaImage}
                      quantity={quantity}
                      index={index}
                    />
                  </Fragment>
                )
              }
              return null
            })}
            <div className={classes.orderTotal}>
              <p>Order Total</p>
              <p>{formatRawPrice(cartTotal.raw)}</p>
            </div>
          </ul>
        </div>
      )}
      <PaystackForm/>
        {/*{!clientSecret && !error && (
        <div className={classes.loading}>
          <LoadingShimmer number={4} />
        </div>
      )}*/}
        {error && (
          <div className={classes.error}>
            <p>{`Error: ${error}`}</p>
          </div>
        )}
    </Fragment>
  )
}
