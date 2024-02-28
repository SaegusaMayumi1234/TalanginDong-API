import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import wrap from '../../middlewares/wrap';
import db from '../../storages/mongoDB/index';

export default wrap(async function (req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      code: 'BAD_REQUEST',
      reason: 'A request body must have email, username, and password parameter',
    });
  }
  const user = await db.userSchema.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: 404,
      code: 'NOT_FOUND',
      reason: 'Email or password is Invalid',
    });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(404).json({
      status: 404,
      code: 'NOT_FOUND',
      reason: 'Email or password is Invalid',
    });
  }
  const token = jwt.sign(
    {
      email,
      username: user.username,
    },
    process.env.JWTKEY!,
    { expiresIn: '1h' },
  );
  return res.status(200).json({
    status: 200,
    code: 'SUCCESS',
    data: {
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
});
