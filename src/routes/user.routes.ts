import express from "express";
import UserController from '../controllers/user.controller';
import authVerifier from '../helpers/auth-verifier';

export const userRouter = express.Router();

userRouter.post('/', UserController.createUser);
userRouter.get('/', authVerifier.verifier, UserController.getUsers);
