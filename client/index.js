import express from "express";
import fs from "fs/promises";

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/pub', express.static(path.join(__dirname, 'client', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/users', async (req, res) => {
    const data = await fs.readFile('./users.json', 'utf8');
    const users = JSON.parse(data).users;
    return res.send(users);
  });

  app.listen(3000, () => {
    console.log(`Open this link in your browser: http://127.0.0.1:3000`);
  });

  app.get('/users/:userId', async (req, res) => {
    const data = await fs.readFile('./users.json', 'utf8');
    const {users} = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);
    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send({state: 'User not found'});
    }
  });

  // http://localhost:3000/users/:userId
  // http://localhost:3000/users/1 results: {"id":1,"name":"Fanny"}
  // this was my first RestApi client