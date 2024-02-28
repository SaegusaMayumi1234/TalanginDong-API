import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import wrap from '../../middlewares/wrap';
import db from '../../storages/mongoDB/index';

export default wrap(async function (req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      code: 'BAD_REQUEST',
      reason: 'A request body must have email, and password parameter',
    });
  }
  let user = await db.userSchema.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: 409,
      code: 'CONFLICT',
      reason: 'Email already exist',
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    user = new db.userSchema({ email, username: email, password: hash });
    await user.save();
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 409,
        code: 'CONFLICT',
        reason: 'Email already exist',
      });
    } else {
      return res.status(500).json({
        status: 500,
        code: 'UNKNOWN_ERROR',
        reason: 'An unknown error occured while trying to inserting data',
      });
    }
  }
  return res.status(200).json({
    status: 200,
    code: 'SUCCESS',
  });
});
