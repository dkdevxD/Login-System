import { createConnection } from 'typeorm';

export const connection = async () => {
  const db = await createConnection();
  console.log(`App connected widh DB ===> ${db.options.database}`);

  process.on('SIGINT', () => {
    db.close().then(() => console.log('Connection widh DB ===> Offline'));
  });
}