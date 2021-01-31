import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface UserOptionalPassword extends Omit<User, 'password'> {
  password?: string;
}

interface Reponse {
  user: UserOptionalPassword;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Reponse> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorret email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorret email/password combination.');
    }

    return { user };
  }
}

export default AuthenticateUserService;
