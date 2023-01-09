const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqyancf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  const todosCollection = client.db('mern-todo').collection('todos');

  app.get('/todos', async (req, res) => {
    const todos = await todosCollection.find({}).toArray();
    res.send(todos);
  });

  app.post('/todos', async (req, res) => {
    const todo = req.body;
    const result = await todosCollection.insertOne(todo);
    res.send(result);
  });
};

run().catch(err => console.error(err));

app.get('/', async (req, res) =>
  res.send('<h1><center>Server is running</center></h1>')
);

app.listen(port, () => console.log(`The server is running on port:${port}`));