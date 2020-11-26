import dotenv from 'dotenv'
dotenv.config();
import "reflect-metadata";
import './redis/blocklist';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connection } from './connection/db';
import { userRoutes } from './routes/user-routes';
import './auth/auth-strategy';

export const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connection();

app.use(userRoutes);