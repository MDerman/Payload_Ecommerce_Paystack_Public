'use client' //used because we use usePathname()

import React from 'react'
import classes from './index.module.scss'
import {HeaderAndFooterUrlsToHide, inclusions, profileNavItems} from "../../../constants";
import {usePathname} from "next/navigation";
import {Gutter} from "../../Gutter";
import Image from "next/image";
import Link from "next/link";
import {Footer, Media} from "../../../../payload/payload-types";
import {Button} from "../../Button";

const FooterComponent = ({footer}: { footer: Footer }) => {
  const pathname = usePathname();
  //we get the nav items from payloads footer, then if || then it is empty array
  const navItems = footer?.navItems || []
  return (
    <footer className={HeaderAndFooterUrlsToHide.includes(pathname) ? classes.hide : ''}>
      <Gutter>
        <ul className={classes.inclusions}>
          {inclusions.map((inclusion) => (
            <li key={inclusion.title}>
              <Image src={inclusion.icon} alt={inclusion.title}
                     width={36} height={36} className={classes.icon}/>
              <h5 className={classes.title}>{inclusion.title}</h5>
              <p>{inclusion.description}</p>
            </li>
          ))}
        </ul>
      </Gutter>
      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <Link href={"/"}>
              <Image src="/logo.webp" alt="logo" width={170} height={50}/>
            </Link>
            <p>
              {footer.copyright && <span>{footer.copyright}</span>}
            </p>
            <div className={classes.socialLinks}>
              {navItems.map((item) => {
                const icon = item?.link?.icon as Media;
                return (
                  <Button key={item.link.label} el="link" href={item.link.url} newTab = {true} className={classes.socialLinkItem}>
                    {item.link.label}
                    <Image
                    src = {icon?.url}
                    alt={item?.link.label}
                    width={24}
                    height={24}
                    className={classes.socialIcon}
                    />
                  </Button>
                )
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </footer>
  )
}
export default FooterComponent
