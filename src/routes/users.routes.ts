import { Router } from 'express';

import CreateUserService from '../services/CreateUserServices';
import User from '../models/User';

interface UserResponse extends Omit<User, 'password'> {
  password?: string;
}

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user: UserResponse = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.status(201).json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;