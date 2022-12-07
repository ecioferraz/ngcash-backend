import UserMatch from './UserMatch';

// interface created to deal with password deletion due to needing tsconfig's "strictNullChecks": true, because of zod's type inferring
interface UserWithoutPassword extends UserMatch {
  password?: string;
  accountId: string;
}

export default UserWithoutPassword;
