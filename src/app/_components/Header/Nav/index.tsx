'use client'

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType, User } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'
import {Button} from "../../Button";

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  return (
    <nav
      className={[
        classes.nav, user === undefined && classes.hide]
        .filter(Boolean)
        .join(' ')}
    >
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="none" />
      })}
      {user && <Link href="/account">Account</Link>}
      <CartLink />
      {!user &&
        <Button
        el="link"
        href="Login"
        label="Login"
        appearance={"primary"}
        onClick={() => {window.location.href='/login'}}/>
      }
    </nav>
  )
}
