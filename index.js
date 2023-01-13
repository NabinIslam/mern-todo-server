const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

  app.post('/todos', async (req, res) => {
    const todo = req.body;
    const result = await todosCollection.insertOne(todo);
    res.send(result);
  });

  app.get('/todos', async (req, res) => {
    const todos = await todosCollection.find({}).toArray();
    res.send(todos);
  });

  app.put('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const todo = req.body;
    const option = { upsert: true };
    const updatedTodo = {
      $set: {
        todoName: todo.todoName,
      },
    };
    const result = await todosCollection.updateOne(filter, updatedTodo, option);
    res.send(result);
  });

  app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const result = await todosCollection.deleteOne({ _id: ObjectId(id) });
    res.send(result);
  });
};

run().catch(err => console.error(err));

app.get('/', async (req, res) =>
  res.send('<h1><center>Server is running</center></h1>')
);

app.listen(port, () => console.log(`The server is running on port:${port}`));
