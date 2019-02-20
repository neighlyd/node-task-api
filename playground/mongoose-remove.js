const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}) -- would remove all objects in mongoDB.

// Todo.findOneAndDelete({_id: '<idNumber>').then((todo) => {}); -- removes the object and returns it to the user.

// Todo.findByIdAndDelete('<idNumber>').then((todo) => {}); -- same as findOneAndRemove()