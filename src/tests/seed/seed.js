const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const Task = require('../../models/task')
const User = require('../../models/user')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const users = [{
    _id: userOneId,
    name: 'Dustin',
    email: 'dustin@example.com',
    password: 'hunter21',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET).toString()
    }, {
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    name: 'Natasha',
    email: 'natasha@example.com',
    password: 'notSecurePassword',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userThreeId,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'hellaSecure',
    admin: true,
    tokens: [{
        token: jwt.sign({_id: userThreeId}, process.env.JWT_SECRET).toString()
    }]
}];

const tasks = [{
    _id: new ObjectID(),
    text: 'First test task',
    owner: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test task',
    completed: true,
    owner: userTwoId
}, {
    _id: new ObjectID(),
    text: 'Third test task',
    owner: userTwoId
}, {
    _id: new ObjectID(),
    text: 'Fourth test task',
    owner: userTwoId
}];

const populateTasks = (done) => {
    // The Udemy course uses db.remove({}), but this is deprecated; so we use db.deleteMany();
    Task.deleteMany({}).then(() => {
        return Task.insertMany(tasks);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        let userThree = new User(users[2]).save();

        // Promise.all([n]) waits until ALL n promises are resolved to trigger callbacks.
        Promise.all([userOne, userTwo, userThree])
    }).then(() => done());
};

module.exports = {tasks, populateTasks, users, populateUsers};
