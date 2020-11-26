import { createQueryBuilder, getRepository } from "typeorm";
import { Request, Response } from 'express';
import { User } from "../entity/User";
import jwt from 'jsonwebtoken';
import { validate } from "class-validator";
import { BlocklistConfig } from "../redis/blocklist-config";
import { Email } from '../email/email';

function createTokenJwt(user: User) {
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: '1d' });
  return token;
}

async function emailValidation(id: number | string) {
  await createQueryBuilder()
    .update(User)
    .set({ emailVerify: true })
    .where("id = :id", { id: id })
    .execute();
}

class UserController {

  login = async (request: Request, response: Response) => {
    try {
      const data = request.body;
      const user = await getRepository(User).findOne({ where: { email: data.email } });

      if (user.emailVerify === false) {
        response.status(401).json({ message: 'Seu cadastro ainda não foi confirmado, por favor cheque seu e-mail!' });
      }

      const accessToken = createTokenJwt(user);
      response.set('Authorization', accessToken)
      response.status(200).json({ msg: 'Usuário logado' });
    } catch (error) {
      response.status(401).json({ error: 'Usuário não encontrado!' });
    }
  }

  logout = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization;
      const tokenR = token.replace('Bearer', '');
      await BlocklistConfig.add(tokenR);
      response.status(200).json('Logout efetuado com sucesso!');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  addUser = async (request: Request, response: Response) => {
    try {
      const { name, email, password } = request.body;
      const user = new User(name, email, password);

      const userExists = await getRepository(User).findOne({ where: { email: email } });
      if (userExists) {
        return response.status(409).json({ messageError: 'Este e-mail já está em uso!' });
      }

      validate(user).then(erros => {
        if (erros.length > 0) return response.status(401).json(erros.map(message => message.constraints));
      });

      const newUser = await getRepository(User).save(user);

      Email.sendEmail(user, 'http://localhost:3000/verificacao_email/' + user.id).catch(console.log);

      response.json(newUser);
    } catch (error) {
      console.log(error.message);
      throw new Error('Não foi possível adicionar o usuário!');
    }
  };

  validationUser = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = getRepository(User).findOne({ where: { id: id } });
      await emailValidation(id);
      response.status(200).json({ message: 'Usuário validado com sucesso!' });
    } catch (error) {
      response.status(500).json({ message: 'Erro ao validar token!' });
    }
  }

  getUserById = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = await getRepository(User).findOne({ where: { id: id } });

      if (!user) {
        response.status(400).json({ error: 'Usuário não encontrado ou inexistente!' });
      }

      response.status(200).json(user);
    } catch (error) {
      console.log(error.message);
    }
  }

  getUserByEmail = async (request: Request, response: Response) => {
    try {
      const { email } = request.params;
      const user = await getRepository(User).findOne({ where: { email: email } });

      if (!user) {
        response.status(400).json({ error: 'Usuário não encontrado ou inexistente!' });
      }


      response.status(200).json(user);
    } catch (error) {
      console.log(error.message);
    }
  }

  getUserByName = async (request: Request, response: Response) => {
    try {
      const { name } = request.params;
      const user = await getRepository(User).findOne({ where: { name: name } });

      if (!user) {
        response.status(400).json({ error: 'Usuário não encontrado ou inexistente!' });
      }

      response.status(200).json(user);
    } catch (error) {
      console.log(error.message);
    }
  }

  delete = async (request: Request, response: Response) => {
    try {
      const { id } = request.params
      const user = await getRepository(User).delete(id);

      if (!user) {
        response.status(400).json({ error: 'Usuário não encontrado ou inexistente!' });
      }

      response.status(200).json({ message: 'Usuário deletado!' });
    } catch (error) {
      console.log(error.message);
    }
  }
}
export default new UserController;