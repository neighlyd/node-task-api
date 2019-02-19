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

    // db.collection('Todos').insertOne({
    //     text: 'Finish Udemy Node course',
    //     completed: false
    // },
    //     (err, res) => {
    //     if (err) {
    //         return console.log(`Unable to insert todo ${err}`);
    //     }
    //     // ops stores all the docs that were inserted.
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // Insert new doc into Users (name, age, location);
    // db.collection('Users').insertOne({
    //     name: 'Dustin Neighly',
    //     age: 36,
    //     location: 'Seattle'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log(`Unable to insert user ${err}`)
    //     }
    //
    //     console.log(res.ops[0]._id.getTimestamp());
    // });

    client.close();
});