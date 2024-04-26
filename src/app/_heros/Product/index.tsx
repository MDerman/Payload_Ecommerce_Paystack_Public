import React, {Fragment} from 'react'
import Link from 'next/link'

import {Category, Product} from '../../../payload/payload-types'
import {AddToCartButton} from '../../_components/AddToCartButton'
import {Gutter} from '../../_components/Gutter'
import {Media} from '../../_components/Media'
import {Message} from '../../_components/Message'
import {Price} from '../../_components/Price'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({product}) => {
  const {
    id,
    stripeProductID,
    title,
    quantity,
    categories,
    meta: {image: metaImage, description} = {},
  } = product

  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill/>
        )}
      </div>
      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>
        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const {title: categoryTitle} = category as Category

              const titleToUse = categoryTitle || 'Untitled category'

              const isLast = index === categories.length - 1

              return (
                <p className={classes.category} key={index}>
                  {titleToUse}
                  {!isLast && <Fragment>, &nbsp;</Fragment>} <span className={classes.separator}>|</span>
                </p>
              )
            })}
          </div>
          <p className={classes.stock}> Low stock! {quantity} remaining!</p>
          <div className={classes.price}>
            <Price product={product} button={false}/>
          </div>
        </div>
        <div>
          <div className={classes.description}>
            <h6>Description</h6>
            <p>{description}</p>
          </div>
        </div>
        <AddToCartButton product={product} className={classes.addToCartButton}/>
      </div>
    </Gutter>)
}
