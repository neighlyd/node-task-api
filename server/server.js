const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require ('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();

// Set middleware to inject bodyParser to convert JSON to Javascript object
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       // Send the todos back as an object, since that allows us to expand it in the future with additional properties.
       res.send({todos});
   }, (e) => {
       res.status(400).send(e);
   });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    // Validate id using isValid
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }

    Todo.findById(id).then((todo) => {
        // id not found
        if (!todo) {
            return res.sendStatus(404);
        }
        // id found
        res.send({todo});
    }).catch((e) => {
        // Some other error... things be borked somewhere.
        res.sendStatus(400);
    });
});

app.listen(3000, () => {
    console.log(`Started on port 3000`)
});

module.exports = {app};