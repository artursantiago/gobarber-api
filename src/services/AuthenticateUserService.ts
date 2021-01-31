import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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
  token: string;
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

    const token = sign({}, '5d522d5c8f192c56c5e19bbee2dc8652', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
