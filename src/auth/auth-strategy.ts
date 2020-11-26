import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import BearerStrategy from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import { BlocklistConfig } from '../redis/blocklist-config';

const localStrategy = LocalStrategy.Strategy;
const bearerStrategy = BearerStrategy.Strategy;

function checkUser(user: User) {
  if (!user) {
    throw new Error('Usuário incorreto ou inexistente!');
  }
}

async function checkPassword(password: string, hashPassword: string) {
  const passValid = await bcrypt.compare(password, hashPassword);
  if (!passValid) {
    throw new Error('Senha invalida!');
  }
}

async function checkTokenBlocklist(token: string) {
  const tokenBlock = await BlocklistConfig.existsToken(token);
  if (tokenBlock) {
    throw new jwt.JsonWebTokenError('Token invalidado por logout!');
  }
}

passport.use(
  new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, (async (email, password, done) => {
    try {
      const user = await User.getEmail(email);
      checkUser(user);
      await checkPassword(password, user.password);
      done(null, user);
    } catch (error) {
      done(error);
    }
  })
  )
);

interface IToken {
  id: number,
  iat: number,
  exp: number
}

passport.use(
  new bearerStrategy(
    async (token, done) => {
      try {
        await checkTokenBlocklist(token);
        const payload = jwt.verify(token, process.env.KEY_JWT);
        const { id } = payload as IToken;
        const usuario = await User.getId(id);
        done(null, usuario, token);
      } catch (error) {
        done(error);
      }
    }
  )
);