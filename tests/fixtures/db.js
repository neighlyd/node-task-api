const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const Task = require('../../src/models/task')
const User = require('../../src/models/user')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const userFourId = new ObjectID();

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
}, {
    _id: userFourId,
    name: 'UserFour',
    email: 'four@example.com',
    password: 'alwaysSecure'
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

const setupDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()
    
    await new User(users[0]).save()
    await new User(users[1]).save()
    await new User(users[2]).save()
    await new User(users[3]).save()
    
    await new Task(tasks[0]).save()
    await new Task(tasks[1]).save()
    await new Task(tasks[2]).save()
    await new Task(tasks[3]).save()
}

const populateTasks = async () => {
    await Task.deleteMany()
};

const populateUsers = async () => {
};

module.exports = { tasks, users,setupDatabase };
