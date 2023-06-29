import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import jsonServer from 'json-server';
import cookieParser from 'cookie-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Configure lowdb to write data to JSON file
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'data.json');

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = { account: [] };
const db = new Low(adapter, defaultData);
await db.read();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cookieParser());

// Add custom routes before JSON Server router
server.post('/api/account/login', (req, res) => {
  const { userNameOrEmailAddress, password } = req.body;
  const user = db.data.account.find(({ userName }) => {
    return userName === userNameOrEmailAddress;
  });

  if (user && user.password === password) {
    res.cookie('username', userNameOrEmailAddress);
    res.send({
      result: 1,
      description: 'success',
    });
  }

  res.send({
    result: 2,
    description: 'InvalidUserNameOrPassword',
  });
});

server.get('/api/account/my-profile', (req, res) => {
  const currentUsername = req.cookies?.username;
  const user = db.data.account.find(({ userName }) => {
    return userName === currentUsername;
  });

  res.send({ ...user });
});

server.listen(5000, () => {
  console.log('JSON Server is running');
});
