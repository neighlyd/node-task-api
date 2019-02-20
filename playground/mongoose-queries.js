const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

// let id = '6c6dc026bb07987d9e4d5a1211';
//
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Mongoose will convert any string ID into a new ObjectID.

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('\n# find()');
//     console.log('Todos', todos);
// });
//
// Todo.findOne({
//     completed: false
// }).then((todo) => {
//     console.log('\n# findOne()');
//     console.log(`Todo: ${todo}`);
// });

// Todo.findById(id).then((todo) => {
//     console.log('\n# findById()');
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log(`Todo: ${todo}`);
// }).catch((e) => console.log(e));

// Challenge - Query Users collection by ID. Query a valid present id, valid non-present id, and an invalid id.

let userID = '5c6ca29f71a6006e2ab033ce';
let noUserID = '6c6ca29f71a6006e2ab033ce';
let invalidUserID = '5c6ca29f71a6006e2ab033ce11';

function findUser (id){
    if (!ObjectID.isValid(id)){
        console.log('\n# Invalid User ID Test:');
        return console.log('ID is not valid');
    }
    User.findById(id).then((user) => {
        if (!user) {
            console.log('\n# Valid non-present User ID Test:')
            console.log('No User Present')
        }
        console.log('\n# Valid present User ID Test:');
        console.log(JSON.stringify(user, undefined, 2))
    }, (e) => {
        console.log(e);
    });
}

findUser(userID);
findUser(noUserID);
findUser(invalidUserID);