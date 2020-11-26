import { Router } from 'express';
import UserController from '../Controller/user-controller';
import { AuthMiddlewares } from '../auth/auth-middlewares';

export const userRoutes = Router();

userRoutes.post('/login', AuthMiddlewares.local, UserController.login);

userRoutes.get('/logout', AuthMiddlewares.bearer, UserController.logout);

userRoutes.post('/newuser', UserController.addUser);

userRoutes.get('/verificacao_email/:id', UserController.validationUser);

userRoutes.get('/id/:id', AuthMiddlewares.bearer, UserController.getUserById);

userRoutes.get('/email/:email', AuthMiddlewares.bearer, UserController.getUserByEmail);

userRoutes.get('/name/:name', AuthMiddlewares.bearer, UserController.getUserByName);

userRoutes.delete('/delete/:id', AuthMiddlewares.bearer, UserController.delete);