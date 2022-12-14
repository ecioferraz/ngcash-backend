import { User } from '@prisma/client';

interface LoginBody {
  username: User['username'];
  password: User['password'];
}

export default LoginBody;
