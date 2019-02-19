const {MongoClient, ObjectID} = require('mongodb');

/*
    Object destructuring is used to pull information out of objects and assign them to variables, like so:

    let user = {name: 'Dustin', age: 36};
    let {name} = user;
    console.log(name);

    This is what we're doing above with {MongoClient}
 */

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // findOneAndUpdate - Updates a document and returns that object as the response.
    /*
    db.collection('Todos')
        .findOneAndUpdate({
            _id: new ObjectID('5c6c869d1196613c1ed7c36a')
        }, {
            $set: {
                completed: true
            }
        }, {returnOriginal: false})
        .then((res) => {
            console.log(res);
        });
     */

    // Challenge - update the existing User to your name and increment the age by 1.
    /*
    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectID('5c6c8ed81196613c1ed7c524')
        }, {
            $set: {name: 'Dustin'},
            $inc: {age: 1}
        }, {returnOriginal: false})
        .then((res) => {
            console.log(res)
        });
    */

    client.close();
});