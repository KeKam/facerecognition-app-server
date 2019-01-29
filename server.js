const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'KeKam',
    password : 'test123',
    database : 'facerecognition'
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'Tom',
      email: 'tom@gmail.com',
      password: 'biscuit',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Tim',
      email: 'tim@gmail.com',
      password: 'apple',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && 
      req.body.password === database.users[0].password) {
    res.json(database.users[0]);
    } else {
      res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
  const { email, name } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register'))
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('Not found');
    }
  })
  .catch(err => res.status(400).json('Error getting user'))
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    } 
  })
  if (!found) {
    res.status(400).json('Not found');
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});