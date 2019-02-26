require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {bcrypt} = require('bcryptjs');

const {mongoose} = require ('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();

// set port to ENV var if set or 3000 if not.
const port = process.env.PORT || 3000;

// Set middleware to inject bodyParser to convert JSON to Javascript object
app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });
        const doc = await todo.save();
        res.send(doc)
    } catch (e) {
        res.status(400).send(e);
    };
});

app.get('/todos', authenticate, async (req, res) => {
   try {
       const todos = await Todo.find({_creator: req.user._id});
        // Send the todos back as an object, since that allows us to expand it in the future with additional properties.
        res.send({todos});
   } catch (e) {
       res.status(400).send(e);
   }
});

app.get('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    // Validate id using isValid
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }

    try {
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        // id not found
        if (!todo) {
            return res.sendStatus(404);
        }
        // id found
        res.send({todo});
    } catch (e) {
        // Some other error... things be borked somewhere.
        res.sendStatus(400);
    }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
   const id = req.params.id;

   // Validate id is correct using isValid
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }

    try {
        const todo = await Todo.findOneAndDelete({
            _id: id,
            _creator: req.user.id
        });

        if(!todo){
                return res.sendStatus(404);
            }

        res.send({todo});
    } catch (e) {
        res.sendStatus(400);
    }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
   const id = req.params.id;
   // use lodash to select only the elements that users should be able to modify.
   let body = _.pick(req.body, ['text', 'completed']);

   // Validate id is correct using isValid
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }

    // if todo is completed, set completedAt date.
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    try {
        const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user.id}, {$set: body}, {new: true});

        if (!todo) {
            return res.sendStatus(404);
        }
        res.send({todo});
    }catch (e) {
        res.sendStatus(400);
    }
});

app.post('/users', async (req, res) => {
    try {
        // use lodash.pick() so we only pass the information we want to the User model, not just any information the user sends us.
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User({email: body.email, password: body.password});
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

app.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        // Send the users back as an object, since that allows us to expand it in the future with additional properties.
        res.send({users});
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.sendStatus(400);
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};