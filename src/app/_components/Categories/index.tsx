import React from 'react'
import classes from './index.module.scss'
import Link from 'next/link'
import {Category} from "../../../payload/payload-types";
import {CallToAction} from "../../../payload/blocks/CallToAction";
import CategoryCard from "./CategoryCard";


const Categories = ({categories}: {categories: Category[]}) => {
  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Shop by Categories</h3>
        <Link href="/products">Show All</Link>
      </div>
      <div className={classes.list}>
        {categories.map((category) =>
          <CategoryCard key={category.id} category={category}/>)}
      </div>
    </section>
  )
}
export default Categories
