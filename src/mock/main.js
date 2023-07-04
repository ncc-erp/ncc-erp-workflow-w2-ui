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
const defaultData = { account: [], requests: [], requestTemplates: [] };
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

server.post('/api/app/workflow-instance/list', (req, res) => {
  const {
    Status,
    WorkflowDefinitionId,
    maxResultCount = 10,
    skipCount = 0,
    sorting = 'createdAt desc',
  } = req.body;
  const [sortColumn, sortType] = sorting.split(' ');

  let data = db.data.requests.filter(({ status, workflowDefinitionId }) => {
    const matchStatus = !Status || status === Status;
    const matchWorkflow =
      !WorkflowDefinitionId || WorkflowDefinitionId === workflowDefinitionId;

    return matchStatus && matchWorkflow;
  });

  const result = data
    .sort((a, b) => {
      const aDateInMilis = new Date(a[sortColumn]).getTime();
      const bDateInMilis = new Date(b[sortColumn]).getTime();

      return sortType === 'desc'
        ? bDateInMilis - aDateInMilis
        : aDateInMilis - bDateInMilis;
    })
    .slice(skipCount, skipCount + maxResultCount);

  res.send({
    items: result,
    totalCount: data.length,
  });
});

server.post('/api/app/workflow-definition/list-all', (req, res) => {
  res.send({
    items: db.data.requestTemplates,
    totalCount: db.data.requestTemplates.length,
  });
});

server.listen(5000, () => {
  console.log('JSON Server is running');
});
