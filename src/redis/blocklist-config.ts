import blocklist from './blocklist';
import { promisify } from 'util';
import jwt_decode from 'jwt-decode';

const setAsync = promisify(blocklist.set).bind(blocklist);
const existsAsync = promisify(blocklist.exists).bind(blocklist);
const getAsync = promisify(blocklist.get).bind(blocklist);
const delAsync = promisify(blocklist.del).bind(blocklist);

interface IexpiredDate {
  id: number,
  iat: number,
  exp: number
}

export class BlocklistConfig {
  static async add(token: string) {
    const expiredDate = jwt_decode(token) as IexpiredDate;
    await setAsync(token.trim(), '');
    blocklist.expireat(token, expiredDate.exp);
  }

  static async existsToken(token: string) {
    const result = await existsAsync(token);
    return result === 1;
  }

  static async getToken(token: string) {
    return await getAsync(token);
  }

  static async deleteToken(token: string) {
    return await delAsync(token);
  }
}
