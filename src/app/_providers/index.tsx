'use client'

import React from 'react'

import {AuthProvider} from './Auth'
import {CartProvider} from './Cart'
import {ThemeProvider} from './Theme'
import {CategoryFilterProvider} from "./Filter";

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CategoryFilterProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CategoryFilterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
