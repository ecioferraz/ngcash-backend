import { User } from '@prisma/client';

interface UserMatch {
  accountId: User['accountId'];
  username: User['username'];
}

export default UserMatch;
