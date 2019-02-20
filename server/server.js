const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
    console.log(`Started on port 3000`)
});

module.exports = {app};