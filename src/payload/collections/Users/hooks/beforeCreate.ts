import type {AfterChangeHook, BeforeChangeHook} from "payload/dist/collections/config/types";
import payload from 'payload'

export const welcomeAfterCreate: BeforeChangeHook = async ({
// @ts-ignore
  doc,
  operation,
}) => {
  if (operation === 'create') {
    payload.sendEmail({
      to: doc.email,
      from: 'sender@example.com',
      subject: 'Welcome To the Nesquik Outlet',
      html: '<b>Hey there!</b><br/>Welcome To the Nesquik Outlet!',
    })
  }
}
