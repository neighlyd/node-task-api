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

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
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

app.delete('/todos/:id', (req, res) => {
   let id = req.params.id;

   // Validate id is correct using isValid
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if(!todo){
            return res.sendStatus(404);
        }
        res.send({todo});
    }).catch((e) => {
        res.sendStatus(400);
    });
});

app.patch('/todos/:id', (req, res) => {
   let id = req.params.id;
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

    Todo.findByIdAndUpdate(id, {$set: body }, {new: true}).then((todo) => {
        if (!todo) {
            return res.sendStatus(404);
        }
        res.send({todo});
    }).catch((e) => {
        res.sendStatus(400);
    });
});

app.post('/users', (req, res) => {
    // use lodash.pick() so we only pass the information we want to the User model, not just any information the user sends us.
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User({email: body.email, password: body.password});

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// app.get('/users', (req, res) => {
//     User.find().then((users) => {
//         // Send the users back as an object, since that allows us to expand it in the future with additional properties.
//         res.send({users});
//     }).catch((e) => {
//         res.status(400).send(e);
//     });
// });

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
        }).catch((e) => {
            res.sendStatus(400);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.sendStatus(200)
    }, () => {
        res.sendStatus(400);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};