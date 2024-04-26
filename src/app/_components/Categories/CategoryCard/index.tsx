"use client"

import React from 'react'
import classes from './index.module.scss'
import Link from "next/link";
import {Category, Media} from "../../../../payload/payload-types";
import {useFilter} from "../../../_providers/Filter";

type CategoryCardProps = {
  category : Category,
}

const CatergoryCard = ({category}: CategoryCardProps) => {
  const media = category.media as Media;
  const {setCategoryFilters} = useFilter();
  //useFilter uses state and hooks and so must choose use client

  return (
    <Link href="/products" className={classes.card}
      style={{backgroundImage: `url(${media.url})`}}
      onClick={() => setCategoryFilters([category.id])}>
      <p className={classes.title}>{category.title}</p>
    </Link>
  )
}
export default CatergoryCard
