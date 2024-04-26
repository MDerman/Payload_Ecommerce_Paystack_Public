import type { AccessArgs } from 'payload/config'

import { checkRole } from '../collections/Users/checkRole'
import type { User } from '../payload-types'

type isAdmin = (args: AccessArgs<unknown, User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  // Ensure user is not null before passing it to checkRole
  if (user) {
    return checkRole(['admin'], user);
  } else {
    // Handle the case where user is null, e.g., return false or throw an error
    return false;
  }
}
