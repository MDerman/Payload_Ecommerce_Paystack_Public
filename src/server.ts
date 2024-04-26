import dotenv from 'dotenv'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import express from 'express'
import payload from 'payload'
import { seed } from './payload/seed'
import nodemailer from 'nodemailer'

const app = express()
const PORT = process.env.PORT || 3000

//Email using Sendgrid
const transport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY, 
  },
});
export const email = {
  fromName: 'Support',
  fromAddress: 'Squad@thenesquikoutlet.co.za',
  transport: transport,
}

/*//MOCK EMAILS
const mockTransporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'roslyn.cremin@ethereal.email',
    pass: 'dRFkTUSnBE39a5gGzk'
  }
});
export const mockEmail = {
  fromName: 'Admin',
  fromAddress: 'roslyn.cremin@ethereal.email',
  logMockCredentials: true,
// Use either transportOptions or transport, you will not need both
  transport: transport,
}*/



const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    email,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  if (process.env.PAYLOAD_SEED === 'true') {
    await seed(payload)
    process.exit()
  }

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info('Starting Next.js...')

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
