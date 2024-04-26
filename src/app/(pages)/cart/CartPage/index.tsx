'use client'

import React, {Fragment} from 'react'
import Link from 'next/link'

import {Page, Settings} from '../../../../payload/payload-types'
import {Button} from '../../../_components/Button'
import {HR} from '../../../_components/HR'
import {LoadingShimmer} from '../../../_components/LoadingShimmer'
import {Media} from '../../../_components/Media'
import {formatRawPrice, Price} from '../../../_components/Price'
import {RemoveFromCartButton} from '../../../_components/RemoveFromCartButton'
import {useAuth} from '../../../_providers/Auth'
import {useCart} from '../../../_providers/Cart'

import classes from './index.module.scss'
import CartItem from "../CartItem";

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const {settings} = props
  const {productsPage} = settings || {}

  const {user} = useAuth()

  const {cart, deleteItemFromCart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, deliveryCharge} = useCart()

  //if any products are 0 quantity - remove from cart TODO
  cart?.items?.map((item, index) => {
    if (typeof item.product === 'object') {
      if (item.product?.quantity && item.product?.quantity ==0) {
        deleteItemFromCart(item.product)
        alert('{item.product.title} was removed from cart as there are no more left!')
      }
    }
  })

  return (
    <Fragment>
      <br/>
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer/>
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                {/*cart list header*/}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p></p>
                    <p>Quantity</p>
                  </div>
                  <p className={classes.headerItemsTotal}>Subtotal</p>
                </div>
                {/*cart item list*/}
                <ul className={classes.itemsList}>
                  {cart?.items?.map((item, index) => {
                    if (typeof item.product === 'object') {
                      const {
                        quantity,
                        product,
                        product: {id, title, meta},
                      } = item

                      const isLast = index === (cart?.items?.length || 0) - 1

                      const metaImage = meta?.image

                      return (
                        <CartItem product={product} title={title} metaImage={metaImage} qty={quantity} addItemToCart={addItemToCart} key={id}/>
                      )
                    }
                    return null
                  })}
                </ul>

              </div>
              <div className={classes.summary}>
                <div className={classes.row}>
                  <div className={classes.cartTotal}>
                    Summary
                  </div>
                </div>
                <div className={classes.row}>
                  <p className={classes.cartTotal}>
                    Delivery Charge
                  </p>
                  <p className={classes.cartTotal}>
                    {formatRawPrice(deliveryCharge)}
                  </p>
                </div>
                <div className={classes.row}>
                  <p className={classes.cartTotal}>
                    Grand Total
                  </p>
                  <p className={classes.cartTotal}>
                    {formatRawPrice(cartTotal.raw)}
                  </p>
                </div>
                <Button
                  className={classes.checkoutButton}
                  href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                  label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
